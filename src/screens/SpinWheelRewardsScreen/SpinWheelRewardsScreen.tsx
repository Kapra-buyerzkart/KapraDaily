import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient as SvgGradient,
  Path,
  Polygon,
  RadialGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  useNavigation,
  useRoute,
  CommonActions,
} from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { selectionTick, impactTick, successTick } from '@/utils/haptics';
import { FONTS } from '@/styles/typography';
import {
  isOrderSpinClaimed,
  getOrderSpinReward,
  markOrderSpinClaimed,
  isOnboardingSpinClaimed,
  getOnboardingSpinReward,
  markOnboardingSpinClaimed,
  DUMMY_ONBOARDING_CAMPAIGN,
  checkSpinWinEligibility,
  playSpinWin,
  mapBackendRewardToPrize,
  extractCampaignAndRewards,
  selectWeightedRewardIndex,
  AssuredPrize,
} from '@/api/spinWheelService';

export type { AssuredPrize };

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// Elevated responsive wheel sizing: optimal grand presence and tap comfort
const WHEEL_SIZE = Math.min(Math.round(SCREEN_WIDTH * 0.82), 316);
const RADIUS = WHEEL_SIZE / 2;
// Overall spin duration (7.6s) calibrated for a smooth, readable speed and suspenseful deceleration
const SPIN_DURATION_MS = 7600;

// Dynamic symmetric wedge path generator centered at 12 o'clock (-angle/2 to +angle/2)
const getCenteredWedgePath = (angle: number) => {
  const halfAngleRad = ((angle / 2) * Math.PI) / 180;
  const wedgeRadius = RADIUS - 14.5;
  const startX = RADIUS + wedgeRadius * Math.sin(-halfAngleRad);
  const startY = RADIUS - wedgeRadius * Math.cos(-halfAngleRad);
  const endX = RADIUS + wedgeRadius * Math.sin(halfAngleRad);
  const endY = RADIUS - wedgeRadius * Math.cos(halfAngleRad);

  return `M${RADIUS},${RADIUS} L${startX.toFixed(2)},${startY.toFixed(
    2,
  )} A${wedgeRadius},${wedgeRadius} 0 0 1 ${endX.toFixed(2)},${endY.toFixed(
    2,
  )} Z`;
};

// Micro sparkle component for motion graphics ambient glints
const Sparkle: React.FC<{
  style?: any;
  delay?: number;
  size?: number;
  color?: string;
}> = ({ style, delay = 0, size = 11, color = '#FFE082' }) => {
  const scale = useSharedValue(0.4);
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: delay }),
        withTiming(1.2, {
          duration: 900,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        withTiming(0.4, {
          duration: 900,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        withTiming(0.4, { duration: 1200 }),
      ),
      -1,
      false,
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: delay }),
        withTiming(1, { duration: 900 }),
        withTiming(0.15, { duration: 900 }),
        withTiming(0.15, { duration: 1200 }),
      ),
      -1,
      false,
    );
  }, [delay, opacity, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[styles.sparkleWrap, style, animStyle]}
      pointerEvents="none"
    >
      <MaterialCommunityIcons
        name="star-four-points"
        size={size}
        color={color}
      />
    </Animated.View>
  );
};

// Helper: parse slice typography and emblem type cleanly
const getSliceVisuals = (prize: AssuredPrize) => {
  const isNoPrize =
    Boolean(prize.isNoPrize) ||
    String(prize.rewardType || '').toLowerCase() === 'noprize' ||
    String(prize.rewardName || prize.label || '')
      .toLowerCase()
      .includes('better luck') ||
    String(prize.rewardName || prize.label || '')
      .toLowerCase()
      .includes('no prize');

  const rType = String(prize.rewardType || prize.type || '').toLowerCase();
  const rawText = String(
    prize.displayText || prize.label || prize.rewardName || '',
  ).trim();

  let iconType: 'coin' | 'gift' | 'coupon' | 'truck' | 'clover' = 'gift';
  if (isNoPrize) {
    iconType = 'clover';
  } else if (
    rType === 'bcoin' ||
    rawText.toLowerCase().includes('coin') ||
    rawText.toLowerCase().includes('token')
  ) {
    iconType = 'coin';
  } else if (
    rType === 'freedelivery' ||
    rawText.toLowerCase().includes('delivery')
  ) {
    iconType = 'truck';
  } else if (
    rType === 'coupon' ||
    rawText.toLowerCase().includes('coupon') ||
    rawText.toLowerCase().includes('%') ||
    rawText.toLowerCase().includes('off')
  ) {
    iconType = 'coupon';
  } else if (
    rType === 'giftcard' ||
    rType === 'partnervoucher' ||
    rawText.toLowerCase().includes('gift') ||
    rawText.toLowerCase().includes('voucher')
  ) {
    iconType = 'gift';
  }

  if (isNoPrize) {
    return {
      iconType,
      hero: 'TRY AGAIN',
      sub: 'Next Order',
      badge: 'NO PRIZE',
    };
  }

  if (prize.titleLine1 && prize.titleLine2) {
    return {
      iconType,
      hero: prize.titleLine1.toUpperCase(),
      sub: prize.titleLine2.toUpperCase(),
      badge: (prize.badge || 'GIFT').toUpperCase(),
    };
  }

  const words = rawText.split(' ');
  if (words.length >= 2) {
    return {
      iconType,
      hero: words[0].toUpperCase(),
      sub: words.slice(1).join(' ').toUpperCase(),
      badge: (prize.badge || 'REWARD').toUpperCase(),
    };
  }

  return {
    iconType,
    hero: rawText.toUpperCase(),
    sub: (prize.badge || '').toUpperCase(),
    badge: (prize.badge || 'GIFT').toUpperCase(),
  };
};

const renderSliceIcon = (
  iconType: string,
  cx: number,
  cy: number,
  r: number,
) => {
  switch (iconType) {
    case 'coin':
      return (
        <G>
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            fill="rgba(0, 0, 0, 0.42)"
            stroke="rgba(255, 235, 59, 0.65)"
            strokeWidth={1}
          />
          <Circle
            cx={cx}
            cy={cy}
            r={r * 0.72}
            fill="#FFD54F"
            stroke="#B45309"
            strokeWidth={0.8}
          />
          <Circle
            cx={cx}
            cy={cy}
            r={r * 0.52}
            fill="#F59E0B"
            stroke="#D97706"
            strokeWidth={0.5}
          />
          <SvgText
            x={cx}
            y={cy + r * 0.26}
            fill="#78350F"
            fontSize={r * 0.72}
            fontWeight="900"
            textAnchor="middle"
          >
            ₹
          </SvgText>
        </G>
      );
    case 'gift':
      return (
        <G>
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            fill="rgba(0, 0, 0, 0.42)"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth={1}
          />
          <Rect
            x={cx - r * 0.55}
            y={cy - r * 0.42}
            width={r * 1.1}
            height={r * 0.84}
            rx={2}
            fill="#EC4899"
            stroke="#BE185D"
            strokeWidth={0.7}
          />
          <Line
            x1={cx}
            y1={cy - r * 0.42}
            x2={cx}
            y2={cy + r * 0.42}
            stroke="#FFF8E7"
            strokeWidth={1.2}
          />
          <Line
            x1={cx - r * 0.55}
            y1={cy}
            x2={cx + r * 0.55}
            y2={cy}
            stroke="#FFF8E7"
            strokeWidth={1.2}
          />
          <Circle
            cx={cx}
            cy={cy - r * 0.42}
            r={1.8}
            fill="#FDE047"
            stroke="#CA8A04"
            strokeWidth={0.5}
          />
        </G>
      );
    case 'coupon':
      return (
        <G>
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            fill="rgba(0, 0, 0, 0.42)"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth={1}
          />
          <Rect
            x={cx - r * 0.6}
            y={cy - r * 0.42}
            width={r * 1.2}
            height={r * 0.84}
            rx={2.5}
            fill="#06B6D4"
            stroke="#0891B2"
            strokeWidth={0.7}
          />
          <SvgText
            x={cx}
            y={cy + r * 0.25}
            fill="#FFFFFF"
            fontSize={r * 0.72}
            fontWeight="900"
            textAnchor="middle"
          >
            %
          </SvgText>
        </G>
      );
    case 'truck':
      return (
        <G>
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            fill="rgba(0, 0, 0, 0.42)"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth={1}
          />
          <Rect
            x={cx - r * 0.6}
            y={cy - r * 0.3}
            width={r * 0.9}
            height={r * 0.55}
            rx={1.5}
            fill="#10B981"
            stroke="#047857"
            strokeWidth={0.6}
          />
          <Circle
            cx={cx - r * 0.3}
            cy={cy + r * 0.28}
            r={r * 0.18}
            fill="#064E3B"
            stroke="#A7F3D0"
            strokeWidth={0.5}
          />
          <Circle
            cx={cx + r * 0.3}
            cy={cy + r * 0.28}
            r={r * 0.18}
            fill="#064E3B"
            stroke="#A7F3D0"
            strokeWidth={0.5}
          />
        </G>
      );
    case 'clover':
    default:
      return (
        <G>
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            fill="rgba(0, 0, 0, 0.42)"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth={1}
          />
          <Circle
            cx={cx - r * 0.22}
            cy={cy - r * 0.22}
            r={r * 0.25}
            fill="#94A3B8"
          />
          <Circle
            cx={cx + r * 0.22}
            cy={cy - r * 0.22}
            r={r * 0.25}
            fill="#94A3B8"
          />
          <Circle
            cx={cx - r * 0.22}
            cy={cy + r * 0.22}
            r={r * 0.25}
            fill="#94A3B8"
          />
          <Circle
            cx={cx + r * 0.22}
            cy={cy + r * 0.22}
            r={r * 0.25}
            fill="#94A3B8"
          />
          <Circle cx={cx} cy={cy} r={r * 0.14} fill="#F8FAFC" />
        </G>
      );
  }
};

// 64 Confetti & Glitter Motion Graphics Particles for Full-Screen Winner Celebration
const CONFETTI_COUNT = 64;
const CONFETTI_PIECES = Array.from({ length: CONFETTI_COUNT }).map((_, i) => {
  // Evenly distribute across the entire screen width with organic jitter
  const slotWidth = SCREEN_WIDTH / CONFETTI_COUNT;
  const x = Math.max(
    4,
    Math.min(
      SCREEN_WIDTH - 14,
      Math.round(i * slotWidth + ((i * 37) % slotWidth) - slotWidth / 4),
    ),
  );
  const isCircle = i % 5 === 0;
  const isRibbon = i % 3 === 0;
  const baseSize = 6 + (i % 6);
  const width = isRibbon ? Math.round(baseSize * 0.75) : baseSize;
  const height = isRibbon ? Math.round(baseSize * 1.8) : baseSize;
  const sway = 16 + ((i * 19) % 32);

  return {
    id: i,
    x,
    delay: (i * 35) % 1100, // staggered rain over 1.1s
    duration: 2400 + ((i * 149) % 1300), // 2.4s to 3.7s fall time
    width,
    height,
    isCircle,
    color: [
      '#10B981', // Emerald
      '#F59E0B', // Amber
      '#3B82F6', // Blue
      '#EC4899', // Pink
      '#8B5CF6', // Purple
      '#EF4444', // Red
      '#14B8A6', // Teal
      '#FBBF24', // Warm Gold
      '#FFD700', // Metallic Gold
      '#06B6D4', // Cyan
      '#A855F7', // Violet
    ][i % 11],
    rotateZStart: (i * 45) % 360,
    sway,
    swayDir: i % 2 === 0 ? 1 : -1,
  };
});

type ConfettiItem = {
  id: number;
  x: number;
  delay: number;
  duration: number;
  width: number;
  height: number;
  isCircle: boolean;
  color: string;
  rotateZStart: number;
  sway: number;
  swayDir: number;
};

interface ConfettiPieceProps {
  key?: React.Key;
  piece: ConfettiItem;
  active: boolean;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ piece, active }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (active) {
      progress.value = withRepeat(
        withSequence(
          withTiming(0, { duration: piece.delay }),
          withTiming(1, {
            duration: piece.duration,
            easing: Easing.bezier(0.25, 0.7, 0.35, 1),
          }),
        ),
        -1,
        false,
      );
    } else {
      progress.value = 0;
    }
  }, [active, piece.delay, piece.duration, progress]);

  const animStyle = useAnimatedStyle(() => {
    // Falls all the way through the full screen height
    const translateY = progress.value * (SCREEN_HEIGHT + 120);
    // Dynamic fluttering horizontal sway
    const translateX =
      Math.sin(progress.value * Math.PI * 3.5) * piece.sway * piece.swayDir;
    // Multi-axis 3D tumbling rotation
    const rotateZ = `${piece.rotateZStart + progress.value * 640}deg`;
    const rotateX = `${progress.value * 720}deg`;
    // Fade out near the bottom edge
    const opacity =
      progress.value < 0.88 ? 1 : Math.max(0, (1 - progress.value) * 8.3);

    return {
      position: 'absolute',
      left: piece.x,
      top: -30,
      width: piece.width,
      height: piece.height,
      backgroundColor: piece.color,
      borderRadius: piece.isCircle ? piece.width / 2 : 2,
      opacity,
      transform: [{ translateY }, { translateX }, { rotateZ }, { rotateX }],
    };
  });

  return <Animated.View style={animStyle} pointerEvents="none" />;
};

export default function SpinWheelRewardsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const {
    orderId,
    orderNumber,
    source,
    theme,
    prizes: customPrizes,
  } = route.params || {};
  const isOrderReward = source === 'ORDER_SUCCESS' && !!orderId;
  const is48hr = theme === '48hr' || source === 'KSHOPE_PROFILE';
  const isOnboarding = source === 'ONBOARDING' || theme === 'welcome';

  const [prizes, setPrizes] = useState<AssuredPrize[]>(() => {
    if (
      customPrizes &&
      Array.isArray(customPrizes) &&
      customPrizes.length >= 2
    ) {
      return customPrizes;
    }
    return [];
  });

  const showcaseGifts = useMemo(
    () =>
      prizes.filter(p => {
        if (p.isNoPrize) return false;
        const name = (p.label || p.rewardName || '').toLowerCase();
        const sub = (p.sublabel || p.displayText || '').toLowerCase();
        const type = (p.rewardType || '').toLowerCase();
        return (
          type !== 'noprize' &&
          !name.includes('better luck') &&
          !name.includes('no prize') &&
          !sub.includes('better luck') &&
          !sub.includes('next time')
        );
      }),
    [prizes],
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [emptyMessage, setEmptyMessage] = useState<string | null>(null);
  const [campaignId, setCampaignId] = useState<number | undefined>(undefined);
  const [campaignName, setCampaignName] = useState<string>('');

  const itemCount = prizes.length;
  const sliceAngle = itemCount > 0 ? 360 / itemCount : 45;

  const titleFontSize =
    itemCount <= 4
      ? 13.5
      : itemCount === 5
      ? 12
      : itemCount === 6
      ? 10.5
      : itemCount === 7
      ? 9.5
      : itemCount === 8
      ? 8.8
      : 7.8;
  const sublabelFontSize =
    itemCount <= 4 ? 8.5 : itemCount === 5 ? 8 : itemCount <= 7 ? 6.5 : 5.8;
  const badgeWidth =
    itemCount <= 4
      ? 60
      : itemCount === 5
      ? 52
      : itemCount === 6
      ? 48
      : itemCount === 7
      ? 44
      : 38;
  const badgeHeight = itemCount <= 4 ? 16 : itemCount === 5 ? 14.5 : 12;
  const badgeY = RADIUS - RADIUS * (itemCount <= 4 ? 0.81 : 0.82);
  const titleY =
    RADIUS - RADIUS * (itemCount <= 4 ? 0.49 : itemCount === 5 ? 0.5 : 0.52);

  const bulbCount = 28;
  const bulbs = useMemo(() => {
    if (itemCount === 0) return [];
    return Array.from({ length: bulbCount }).map((_, i) => {
      const angle = (i * 360) / bulbCount;
      const rad = (angle * Math.PI) / 180;
      const dist = RADIUS - 7.5;
      return {
        x: RADIUS + dist * Math.sin(rad),
        y: RADIUS - dist * Math.cos(rad),
        isGold: i % 2 === 0,
      };
    });
  }, [bulbCount, itemCount]);

  const sunburstRays = useMemo(() => {
    const rayLength = 195;
    const count = 16;
    return Array.from({ length: count }).map((_, i) => {
      const centerAngle = (i * 360) / count;
      const halfWidth = 5.2;
      const a1 = ((centerAngle - halfWidth) * Math.PI) / 180;
      const a2 = ((centerAngle + halfWidth) * Math.PI) / 180;
      const x1 = 200 + rayLength * Math.sin(a1);
      const y1 = 200 - rayLength * Math.cos(a1);
      const x2 = 200 + rayLength * Math.sin(a2);
      const y2 = 200 - rayLength * Math.cos(a2);
      return {
        points: `200,200 ${x1},${y1} ${x2},${y2}`,
        key: `sunburst-ray-${i}`,
      };
    });
  }, []);

  const singleWedgePath = useMemo(
    () => getCenteredWedgePath(sliceAngle),
    [sliceAngle],
  );

  const rotation = useSharedValue(0);
  const pointerAngle = useSharedValue(0);
  const hubScale = useSharedValue(1);
  const sunburstRotation = useSharedValue(0);
  const ambientHaloScale = useSharedValue(1);

  useEffect(() => {
    sunburstRotation.value = withRepeat(
      withTiming(360, { duration: 26000, easing: Easing.linear }),
      -1,
      false,
    );
    ambientHaloScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    hubScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [ambientHaloScale, hubScale, sunburstRotation]);

  const trophyScale = useSharedValue(0.5);
  const trophyGlow = useSharedValue(0.4);

  const accumulatedRotation = useRef(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<AssuredPrize | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [spinsCount, setSpinsCount] = useState(
    isOrderReward || isOnboarding ? 1 : 3,
  );

  const hapticTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const spinEndedRef = useRef<boolean>(false);
  const spinFallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const clearHapticTimeouts = () => {
    hapticTimeouts.current.forEach(t => clearTimeout(t));
    hapticTimeouts.current = [];
    if (spinFallbackTimerRef.current) {
      clearTimeout(spinFallbackTimerRef.current);
      spinFallbackTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearHapticTimeouts();
    };
  }, []);

  const isMountedRef = useRef<boolean>(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchEligibility = useCallback(async () => {
    setIsLoading(true);
    setEmptyMessage(null);

    if (isOnboarding) {
      const dummyPrizes = DUMMY_ONBOARDING_CAMPAIGN.rewards.map(
        (item: any, idx: number) => mapBackendRewardToPrize(item, idx),
      );
      setPrizes(dummyPrizes);
      setCampaignName('Welcome Bonus');
      setEmptyMessage(null);

      const claimed = await isOnboardingSpinClaimed();
      if (claimed && isMountedRef.current) {
        setSpinsCount(0);
        const reward = await getOnboardingSpinReward();
        if (reward?.prize && isMountedRef.current) {
          setWonPrize(reward.prize);
          setShowModal(true);

          const pItem = reward.prize;
          const matchIdx = dummyPrizes.findIndex(
            p =>
              (pItem.campaignItemId &&
                p.campaignItemId === pItem.campaignItemId) ||
              (pItem.id && p.id === pItem.id) ||
              (pItem.code && p.code === pItem.code) ||
              (p.label &&
                pItem.label &&
                p.label.toLowerCase() === pItem.label.toLowerCase()),
          );
          if (matchIdx !== -1) {
            const sAngle = 360 / dummyPrizes.length;
            const sliceCenter = matchIdx * sAngle;
            const targetAngle = (360 - (sliceCenter % 360)) % 360;
            rotation.value = targetAngle;
            accumulatedRotation.current = targetAngle;
          }
        }
      } else {
        setSpinsCount(1);
      }

      if (isMountedRef.current) {
        setIsLoading(false);
      }
      return;
    }

    const targetId = orderId || orderNumber;

    if (targetId) {
      const claimed = await isOrderSpinClaimed(targetId);
      if (claimed && isMountedRef.current) {
        setSpinsCount(0);
        const reward = await getOrderSpinReward(targetId);
        if (reward?.prize && isMountedRef.current) {
          setWonPrize(reward.prize);
          setShowModal(true);
        }
      }
    }

    try {
      const response: any = await checkSpinWinEligibility(targetId);
      if (!isMountedRef.current) return;

      const campaignInfo = extractCampaignAndRewards(response);

      if (
        Array.isArray(campaignInfo.rewards) &&
        campaignInfo.rewards.length > 0
      ) {
        const mapped = campaignInfo.rewards.map((item: any, idx: number) =>
          mapBackendRewardToPrize(item, idx),
        );
        setPrizes(mapped);
        setEmptyMessage(null);
        setCampaignId(campaignInfo.campaignId);
        if (campaignInfo.campaignName) {
          setCampaignName(campaignInfo.campaignName);
        }

        // If previously claimed prize exists, align the wheel pointer to it
        if (targetId) {
          getOrderSpinReward(targetId).then(reward => {
            if (reward?.prize && isMountedRef.current) {
              const pItem = reward.prize;
              const matchIdx = mapped.findIndex(
                p =>
                  (pItem.campaignItemId &&
                    p.campaignItemId === pItem.campaignItemId) ||
                  (pItem.id && p.id === pItem.id) ||
                  (pItem.code && p.code === pItem.code) ||
                  (pItem.isNoPrize && p.isNoPrize) ||
                  (p.label &&
                    pItem.label &&
                    p.label.toLowerCase() === pItem.label.toLowerCase()),
              );
              if (matchIdx !== -1) {
                const sAngle = 360 / mapped.length;
                const sliceCenter = matchIdx * sAngle;
                const targetAngle = (360 - (sliceCenter % 360)) % 360;
                rotation.value = targetAngle;
                accumulatedRotation.current = targetAngle;
              }
            }
          });
        }

        const data = response?.data !== undefined ? response.data : response;
        const spins =
          typeof data?.spinsAvailable === 'number'
            ? data.spinsAvailable
            : typeof data?.spinsCount === 'number'
            ? data.spinsCount
            : 1;
        setSpinsCount(spins);
      } else {
        setPrizes([]);
        setSpinsCount(0);
        const data = response?.data !== undefined ? response.data : response;
        const msg =
          data?.message ||
          data?.error ||
          response?.message ||
          (isOrderReward
            ? `No spin & win rewards available for order #${
                orderNumber || orderId
              }.`
            : 'No spin rewards available right now.');
        setEmptyMessage(msg);
      }
    } catch (err: any) {
      if (!isMountedRef.current) return;
      const errResp = err?.response?.data;
      const msg =
        errResp?.data?.error ||
        errResp?.message ||
        err?.message ||
        'Something went wrong. Please try again.';
      setPrizes([]);
      setSpinsCount(0);
      setEmptyMessage(msg);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [orderId, isOrderReward, orderNumber, isOnboarding]);

  useEffect(() => {
    fetchEligibility();
  }, [fetchEligibility]);

  // Gentle idle pulsing on center hub
  useEffect(() => {
    hubScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [hubScale]);

  // Winner modal entrance motion
  useEffect(() => {
    if (showModal) {
      trophyScale.value = withSpring(1, { damping: 10, stiffness: 180 });
      trophyGlow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
    } else {
      trophyScale.value = 0.5;
    }
  }, [showModal, trophyScale, trophyGlow]);

  const handleSpinEnd = (prize: AssuredPrize, winningIndex: number) => {
    clearHapticTimeouts();
    setIsSpinning(false);
    setWonPrize(prize);
    setShowModal(true);
    setSpinsCount(prev => Math.max(prev - 1, 0));
    pointerAngle.value = withSpring(0, { damping: 14, stiffness: 220 });
    successTick();

    const targetOrderId =
      orderId !== undefined && orderId !== null
        ? isNaN(Number(orderId))
          ? orderId
          : Number(orderId)
        : undefined;

    if (isOnboarding && prize) {
      markOnboardingSpinClaimed(prize);
    } else if (targetOrderId && prize) {
      markOrderSpinClaimed(targetOrderId, prize);
    }
  };

  const safeSpinEnd = (prize: AssuredPrize, winningIndex: number) => {
    if (spinEndedRef.current) return;
    spinEndedRef.current = true;
    if (spinFallbackTimerRef.current) {
      clearTimeout(spinFallbackTimerRef.current);
      spinFallbackTimerRef.current = null;
    }
    handleSpinEnd(prize, winningIndex);
  };

  const spin = async () => {
    if (isSpinning || spinsCount <= 0 || prizes.length === 0) return;

    clearHapticTimeouts();
    spinEndedRef.current = false;
    impactTick();
    setWonPrize(null);
    setIsSpinning(true);

    if (isOnboarding) {
      const winningIndex = selectWeightedRewardIndex(prizes);
      const targetPrize = prizes[winningIndex] || prizes[0];

      const sliceCenter = winningIndex * sliceAngle;
      const targetAngleInCycle = (360 - (sliceCenter % 360)) % 360;

      const currentRot = accumulatedRotation.current;
      const currentTurns = Math.floor(currentRot / 360);
      const fullSpins = 5;
      let nextTarget = (currentTurns + fullSpins) * 360 + targetAngleInCycle;

      while (nextTarget <= currentRot + 3 * 360) {
        nextTarget += 360;
      }

      accumulatedRotation.current = nextTarget;

      const SLOWDOWN_HAPTIC_CLICKS: {
        delay: number;
        type: 'light' | 'medium';
      }[] = [
        { delay: 3400, type: 'light' },
        { delay: 3820, type: 'light' },
        { delay: 4260, type: 'light' },
        { delay: 4720, type: 'light' },
        { delay: 5200, type: 'light' },
        { delay: 5700, type: 'light' },
        { delay: 6220, type: 'medium' },
        { delay: 6760, type: 'medium' },
        { delay: 7280, type: 'medium' },
      ];

      SLOWDOWN_HAPTIC_CLICKS.forEach(({ delay, type }) => {
        const timer = setTimeout(() => {
          if (type === 'medium') {
            impactTick();
          } else {
            selectionTick();
          }
        }, delay);
        hapticTimeouts.current.push(timer);
      });

      // Pointer animation: lightweight repeating oscillation without overloading Android bridge
      pointerAngle.value = withRepeat(
        withSequence(
          withTiming(-12, { duration: 60, easing: Easing.linear }),
          withTiming(2, { duration: 60, easing: Easing.linear }),
        ),
        Math.floor(SPIN_DURATION_MS / 120),
        true,
      );

      rotation.value = withTiming(
        nextTarget,
        {
          duration: SPIN_DURATION_MS,
          easing: Easing.bezier(0.16, 0.88, 0.26, 1),
        },
        () => {
          'worklet';
          runOnJS(safeSpinEnd)(targetPrize, winningIndex);
        },
      );

      // Bulletproof Android fallback timer
      spinFallbackTimerRef.current = setTimeout(() => {
        safeSpinEnd(targetPrize, winningIndex);
      }, SPIN_DURATION_MS + 250);
      return;
    }

    const targetOrderId =
      orderId !== undefined && orderId !== null
        ? isNaN(Number(orderId))
          ? orderId
          : Number(orderId)
        : undefined;
    const targetCampaignId =
      campaignId !== undefined && campaignId !== null
        ? Number(campaignId)
        : undefined;

    let playResponse: any = null;
    try {
      playResponse = await playSpinWin({
        orderId: targetOrderId,
        campaignId: targetCampaignId,
      });
      console.log('rewards/spin-win/play response:', playResponse);
    } catch (err: any) {
      const errResponse =
        err?.response?.data || err?.data || err?.message || err;
      console.log('rewards/spin-win/play response error:', errResponse);
    }

    let winningIndex = -1;
    let targetPrize: AssuredPrize | null = null;
    const responseData =
      playResponse?.data !== undefined ? playResponse.data : playResponse;

    const rewardObj = responseData
      ? responseData.prize ||
        responseData.reward ||
        responseData.winningReward ||
        responseData.rewardSegment ||
        responseData.item ||
        (responseData.id ||
        responseData.code ||
        responseData.label ||
        responseData.title ||
        responseData.rewardName ||
        responseData.campaignItemId
          ? responseData
          : null)
      : null;

    if (rewardObj) {
      const rCampaignItemId = String(rewardObj.campaignItemId ?? '').trim();
      const rId = String(
        rewardObj.id ??
          rewardObj.rewardId ??
          rewardObj.prizeId ??
          responseData?.rewardId ??
          responseData?.prizeId ??
          '',
      ).trim();
      const rCode = String(
        rewardObj.code ??
          rewardObj.couponCode ??
          rewardObj.promoCode ??
          responseData?.code ??
          '',
      )
        .trim()
        .toLowerCase();
      const rTitle = String(
        rewardObj.rewardName ??
          rewardObj.label ??
          rewardObj.title ??
          rewardObj.name ??
          '',
      )
        .trim()
        .toLowerCase();
      const rDisplay = String(
        rewardObj.displayText ?? rewardObj.sublabel ?? rewardObj.discount ?? '',
      )
        .trim()
        .toLowerCase();
      const isBackendNoPrize =
        Boolean(rewardObj.isNoPrize) ||
        String(rewardObj.rewardType || rewardObj.type || '').toLowerCase() ===
          'noprize' ||
        rTitle.includes('better luck') ||
        rTitle.includes('no prize') ||
        rDisplay.includes('better luck') ||
        rDisplay.includes('no prize');

      // 1. Try matching by exact campaignItemId
      if (winningIndex === -1 && rCampaignItemId) {
        winningIndex = prizes.findIndex(
          p =>
            p.campaignItemId !== undefined &&
            p.campaignItemId !== null &&
            String(p.campaignItemId).trim() === rCampaignItemId,
        );
      }

      // 2. Try matching by rewardId or id
      if (winningIndex === -1 && rId) {
        winningIndex = prizes.findIndex(
          p =>
            (p.rewardId && String(p.rewardId).trim() === rId) ||
            (p.id && String(p.id).trim() === rId),
        );
      }

      // 3. Try matching by isNoPrize ("Better Luck Next Time")
      if (winningIndex === -1 && isBackendNoPrize) {
        winningIndex = prizes.findIndex(
          p =>
            Boolean(p.isNoPrize) ||
            String(p.rewardType || '').toLowerCase() === 'noprize' ||
            String(p.rewardName || p.label || '')
              .toLowerCase()
              .includes('better luck') ||
            String(p.rewardName || p.label || '')
              .toLowerCase()
              .includes('no prize'),
        );
      }

      // 4. Try matching by coupon/promo code
      if (winningIndex === -1 && rCode) {
        winningIndex = prizes.findIndex(
          p => p.code && String(p.code).trim().toLowerCase() === rCode,
        );
      }

      // 5. Try matching by rewardName / label / title
      if (winningIndex === -1 && rTitle) {
        winningIndex = prizes.findIndex(
          p =>
            (p.rewardName &&
              String(p.rewardName).trim().toLowerCase() === rTitle) ||
            (p.label && String(p.label).trim().toLowerCase() === rTitle),
        );
      }

      // 6. Try matching by displayText / sublabel
      if (winningIndex === -1 && rDisplay) {
        winningIndex = prizes.findIndex(
          p =>
            (p.displayText &&
              String(p.displayText).trim().toLowerCase() === rDisplay) ||
            (p.sublabel &&
              String(p.sublabel).trim().toLowerCase() === rDisplay),
        );
      }
    }

    // If rewardObj matching didn't yield an index, check backend explicit winningIndex / index
    if (winningIndex === -1 && responseData) {
      if (
        typeof responseData.winningIndex === 'number' &&
        responseData.winningIndex >= 0 &&
        responseData.winningIndex < prizes.length
      ) {
        winningIndex = responseData.winningIndex;
      } else if (
        typeof responseData.index === 'number' &&
        responseData.index >= 0 &&
        responseData.index < prizes.length
      ) {
        winningIndex = responseData.index;
      }
    }

    if (winningIndex === -1) {
      winningIndex = selectWeightedRewardIndex(prizes);
    }

    if (rewardObj) {
      const backendPrize = mapBackendRewardToPrize(rewardObj, winningIndex);
      targetPrize = {
        ...prizes[winningIndex],
        ...backendPrize,
      };

      // Guarantee visual parity: if the slice currently at winningIndex differs from targetPrize,
      // update prizes[winningIndex] so the wheel slice directly under the needle strictly matches the prize
      const currentSlice = prizes[winningIndex];
      if (
        currentSlice &&
        (currentSlice.label !== targetPrize.label ||
          Boolean(currentSlice.isNoPrize) !== Boolean(targetPrize.isNoPrize) ||
          currentSlice.titleLine1 !== targetPrize.titleLine1 ||
          currentSlice.titleLine2 !== targetPrize.titleLine2)
      ) {
        setPrizes(prev => {
          const next = [...prev];
          next[winningIndex] = {
            ...next[winningIndex],
            ...targetPrize,
          };
          return next;
        });
      }
    } else {
      targetPrize = prizes[winningIndex];
    }

    const sliceCenter = winningIndex * sliceAngle;
    const targetAngleInCycle = (360 - (sliceCenter % 360)) % 360;

    const currentRot = accumulatedRotation.current;
    const currentTurns = Math.floor(currentRot / 360);
    const fullSpins = 5;
    let nextTarget = (currentTurns + fullSpins) * 360 + targetAngleInCycle;

    while (nextTarget <= currentRot + 3 * 360) {
      nextTarget += 360;
    }

    accumulatedRotation.current = nextTarget;

    const SLOWDOWN_HAPTIC_CLICKS: {
      delay: number;
      type: 'light' | 'medium';
    }[] = [
      { delay: 3400, type: 'light' },
      { delay: 3820, type: 'light' },
      { delay: 4260, type: 'light' },
      { delay: 4720, type: 'light' },
      { delay: 5200, type: 'light' },
      { delay: 5700, type: 'light' },
      { delay: 6220, type: 'medium' },
      { delay: 6760, type: 'medium' },
      { delay: 7280, type: 'medium' },
    ];

    SLOWDOWN_HAPTIC_CLICKS.forEach(({ delay, type }) => {
      const timer = setTimeout(() => {
        if (type === 'medium') {
          impactTick();
        } else {
          selectionTick();
        }
      }, delay);
      hapticTimeouts.current.push(timer);
    });

    // Pointer animation: lightweight repeating oscillation without overloading Android bridge
    pointerAngle.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 60, easing: Easing.linear }),
        withTiming(2, { duration: 60, easing: Easing.linear }),
      ),
      Math.floor(SPIN_DURATION_MS / 120),
      true,
    );

    rotation.value = withTiming(
      nextTarget,
      {
        duration: SPIN_DURATION_MS,
        easing: Easing.bezier(0.16, 0.88, 0.26, 1),
      },
      () => {
        'worklet';
        runOnJS(safeSpinEnd)(targetPrize, winningIndex);
      },
    );

    // Bulletproof Android fallback timer
    spinFallbackTimerRef.current = setTimeout(() => {
      safeSpinEnd(targetPrize, winningIndex);
    }, SPIN_DURATION_MS + 250);
  };

  const handleBackToHome = () => {
    setShowModal(false);
    if (is48hr) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'KshopeHome' }],
        }),
      );
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        }),
      );
    }
  };

  const handleExploreServices = () => {
    setShowModal(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'AuthSuccessScreen' }],
      }),
    );
  };

  const handleGoToOrderTracking = () => {
    setShowModal(false);
    const targetOrderId = orderId || orderNumber;

    if (is48hr || source === 'KSHOPE_PROFILE') {
      if (targetOrderId) {
        navigation.dispatch(
          CommonActions.reset({
            index: 2,
            routes: [
              { name: 'KshopeHome' },
              { name: 'KshopeMyOrders' },
              {
                name: 'KshopeMyOrderDetails',
                params: { orderId: targetOrderId },
              },
            ],
          }),
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: 'KshopeHome' }, { name: 'KshopeMyOrders' }],
          }),
        );
      }
    } else {
      if (targetOrderId) {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              { name: 'MainTabs' },
              {
                name: 'OrderTrackingScreen',
                params: { orderId: targetOrderId },
              },
            ],
          }),
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'MainTabs',
                params: {
                  screen: 'Home',
                  params: { screen: 'MyOrdersScreen' },
                },
              },
            ],
          }),
        );
      }
    }
  };

  const handleBack = () => {
    // Once spin is done and reward is given, never go back; go to Home only
    if (
      wonPrize ||
      spinsCount <= 0 ||
      (isOrderReward && wonPrize) ||
      (isOnboarding && wonPrize)
    ) {
      handleBackToHome();
    } else {
      navigation.goBack();
    }
  };

  // Android hardware back button handler
  useEffect(() => {
    const onBackPress = () => {
      if (
        wonPrize ||
        spinsCount <= 0 ||
        (isOrderReward && wonPrize) ||
        (isOnboarding && wonPrize)
      ) {
        handleBackToHome();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
    return () => subscription.remove();
  }, [wonPrize, spinsCount, isOrderReward, is48hr, isOnboarding]);

  const wheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const pointerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${pointerAngle.value}deg` }],
  }));

  const hubAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isSpinning ? 0.96 : hubScale.value }],
  }));

  const sunburstAnimStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sunburstRotation.value}deg` }],
  }));

  const ambientHaloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ambientHaloScale.value }],
  }));

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trophyScale.value }],
  }));

  const isNoPrize =
    Boolean(wonPrize?.isNoPrize) ||
    String(wonPrize?.rewardType || '').toLowerCase() === 'noprize' ||
    String(wonPrize?.rewardName || wonPrize?.label || '')
      .toLowerCase()
      .includes('no prize') ||
    String(wonPrize?.rewardName || wonPrize?.label || '')
      .toLowerCase()
      .includes('better luck');

  const [showPoppers, setShowPoppers] = useState(false);
  const poppersOpacity = useSharedValue(0);
  const poppersTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (showModal && !isNoPrize) {
      setShowPoppers(true);
      poppersOpacity.value = 1;

      if (poppersTimerRef.current) {
        clearTimeout(poppersTimerRef.current);
      }

      poppersTimerRef.current = setTimeout(() => {
        poppersOpacity.value = withTiming(0, { duration: 400 }, finished => {
          if (finished) {
            runOnJS(setShowPoppers)(false);
          }
        });
      }, 2000);
    } else {
      if (poppersTimerRef.current) {
        clearTimeout(poppersTimerRef.current);
        poppersTimerRef.current = null;
      }
      poppersOpacity.value = 0;
      setShowPoppers(false);
    }

    return () => {
      if (poppersTimerRef.current) {
        clearTimeout(poppersTimerRef.current);
        poppersTimerRef.current = null;
      }
    };
  }, [showModal, isNoPrize, poppersOpacity]);

  const poppersAnimatedStyle = useAnimatedStyle(() => ({
    opacity: poppersOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0C10" />

      {/* Luxury Dark Pitch Black Accent Gradient */}
      <LinearGradient
        colors={['#0A0C10', '#12151C', '#07080A']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Top Header with SafeArea Inset */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + (Platform.OS === 'ios' ? 4 : 8) },
        ]}
      >
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerTitleBlock}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {campaignName || 'Spin & Win'}
          </Text>

          <View style={{ paddingTop: 10 }} />
          <Text style={styles.headerSubtitle}>
            {isOnboarding
              ? 'New User Welcome Bonus'
              : isOrderReward
              ? `Order #${orderNumber || orderId} Reward`
              : is48hr
              ? '48hrs Deals Lucky Rewards'
              : 'Daily Lucky Rewards'}
          </Text>
        </View>

        <View
          style={[
            styles.spinsBadge,
            !isLoading && prizes.length === 0 && styles.spinsBadgeEmpty,
          ]}
        >
          {!isLoading && prizes.length === 0 ? (
            <MaterialCommunityIcons
              name="close-circle-outline"
              size={12}
              color="#94A3B8"
            />
          ) : (
            <MaterialCommunityIcons
              name="star-four-points"
              size={12}
              color="#FBBF24"
            />
          )}
          <Text
            style={[
              styles.spinsBadgeText,
              !isLoading && prizes.length === 0 && styles.spinsBadgeTextEmpty,
            ]}
          >
            {!isLoading && prizes.length === 0
              ? '0 Spins'
              : `${spinsCount} ${spinsCount === 1 ? 'Spin' : 'Spins'}`}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F25000" />
            <Text style={styles.loadingText}>
              Checking reward eligibility...
            </Text>
          </View>
        ) : prizes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.emptyIconCircle,
                is48hr && styles.emptyIconCircle48hr,
              ]}
            >
              <MaterialCommunityIcons
                name="gift-off-outline"
                size={44}
                color="#F25000"
              />
            </View>
            <Text style={styles.emptyTitle}>
              {emptyMessage ? 'Something Went Wrong' : 'No Rewards Available'}
            </Text>
            <Text style={styles.emptyDescription}>
              {emptyMessage ||
                'There are no spin & win rewards available at this time.'}
            </Text>
            <View style={styles.emptyButtonRow}>
              <TouchableOpacity
                style={styles.emptyRetryButton}
                onPress={() => fetchEligibility()}
                activeOpacity={0.85}
              >
                <Ionicons name="refresh" size={16} color="#F25000" />
                <Text style={styles.emptyRetryText}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.emptyActionButton}
                onPress={handleBack}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#FF6200', '#F25000']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.emptyActionContent}>
                  <Ionicons
                    name={isOrderReward ? 'receipt-outline' : 'arrow-back'}
                    size={16}
                    color="#FFFFFF"
                  />
                  <Text style={styles.emptyActionText} numberOfLines={1}>
                    {isOnboarding
                      ? 'Explore Services'
                      : isOrderReward
                      ? 'Back to Order'
                      : 'Go Back'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <LinearGradient
              colors={[
                'rgba(255, 255, 255, 0.06)',
                'rgba(255, 255, 255, 0.02)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.guaranteeCard, is48hr && styles.guaranteeCard48hr]}
            >
              <View style={styles.guaranteeInner}>
                <View
                  style={[
                    styles.shieldIconWrapper,
                    is48hr && styles.shieldIconWrapper48hr,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={is48hr ? 'lightning-bolt' : 'shield-check'}
                    size={20}
                    color="#FF7A28"
                  />
                </View>
                <View style={styles.guaranteeCopy}>
                  <View style={styles.guaranteeHeaderRow}>
                    <Text
                      style={[
                        styles.guaranteeHeading,
                        is48hr && styles.guaranteeHeading48hr,
                      ]}
                    >
                      {isOnboarding
                        ? 'Welcome Bonus: 1 Free Gift'
                        : isOrderReward
                        ? 'Order Bonus: 1 Lucky Gift'
                        : is48hr
                        ? '48hrs Deals Lucky Prize'
                        : 'Lucky Gift Chance'}
                    </Text>
                    <View
                      style={[
                        styles.guaranteePill,
                        is48hr && styles.guaranteePill48hr,
                      ]}
                    >
                      <Text
                        style={[
                          styles.guaranteePillText,
                          is48hr && styles.guaranteePillText48hr,
                        ]}
                      >
                        {isOnboarding
                          ? 'WELCOME GIFT'
                          : isOrderReward
                          ? 'ORDER REWARD'
                          : is48hr
                          ? '48HR DEAL'
                          : 'LUCKY SPINS'}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.guaranteeSubtitle,
                      is48hr && styles.guaranteeSubtitle48hr,
                    ]}
                  >
                    {isOnboarding
                      ? 'Welcome to KapraDaily! Spin now to unlock your new user reward.'
                      : isOrderReward
                      ? 'Congratulations on your order! Spin now to claim your lucky gift.'
                      : is48hr
                      ? 'Exclusive flash rewards and coupons with your lucky spin!'
                      : 'Spin to win exciting coupons, cashbacks, or free delivery!'}
                  </Text>
                </View>
              </View>
            </LinearGradient>

            {/* The Wheel Stage */}
            <View style={styles.wheelStage}>
              {/* Outer Ambient Wheel Atmosphere (Rotating Sunburst + Breathing Radial Halo + Floating Sparkles) */}
              <View style={styles.ambientHaloWrapper} pointerEvents="none">
                {/* 1. Rotating 16-Ray Sunburst Ambient Pattern */}
                <Animated.View
                  style={[styles.sunburstWrapper, sunburstAnimStyle]}
                >
                  <Svg width={400} height={400} viewBox="0 0 400 400">
                    <G fill="rgba(255, 224, 130, 0.08)">
                      {sunburstRays.map(ray => (
                        <Polygon key={ray.key} points={ray.points} />
                      ))}
                    </G>
                  </Svg>
                </Animated.View>

                {/* 2. Breathing Radial Fiery/Amber Halo Corona */}
                <Animated.View style={[styles.ambientCorona, ambientHaloStyle]}>
                  <Svg width={400} height={400} viewBox="0 0 400 400">
                    <Defs>
                      <RadialGradient id="screenHalo" cx="50%" cy="50%" r="50%">
                        <Stop
                          offset="0%"
                          stopColor="#FF6D00"
                          stopOpacity="0.38"
                        />
                        <Stop
                          offset="45%"
                          stopColor="#FFA000"
                          stopOpacity="0.18"
                        />
                        <Stop
                          offset="75%"
                          stopColor="#FFD54F"
                          stopOpacity="0.06"
                        />
                        <Stop
                          offset="100%"
                          stopColor="#0A0C10"
                          stopOpacity="0"
                        />
                      </RadialGradient>
                    </Defs>
                    <Circle cx="200" cy="200" r="195" fill="url(#screenHalo)" />
                  </Svg>
                </Animated.View>

                {/* 3. Ambient Diamond Sparkles */}
                <Sparkle
                  style={styles.sparkleTL}
                  delay={0}
                  size={12}
                  color="#FFE082"
                />
                <Sparkle
                  style={styles.sparkleTR}
                  delay={800}
                  size={10}
                  color="#FFFFFF"
                />
                <Sparkle
                  style={styles.sparkleBL}
                  delay={1600}
                  size={11}
                  color="#FFD54F"
                />
                <Sparkle
                  style={styles.sparkleBR}
                  delay={1200}
                  size={9}
                  color="#FFE082"
                />
              </View>

              {/* Sculpted 3D Golden Pointer Flapper Needle (Fixed at 12 o'clock pointing down) */}
              <Animated.View style={[styles.pointerWrapper, pointerStyle]}>
                <Svg width={38} height={48} viewBox="0 0 38 48">
                  <Defs>
                    <SvgGradient id="needleLight" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0%" stopColor="#FFFDE7" />
                      <Stop offset="50%" stopColor="#FFD54F" />
                      <Stop offset="100%" stopColor="#FFA000" />
                    </SvgGradient>
                    <SvgGradient id="needleDark" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0%" stopColor="#F59E0B" />
                      <Stop offset="50%" stopColor="#D97706" />
                      <Stop offset="100%" stopColor="#78350F" />
                    </SvgGradient>
                    <RadialGradient id="rubyJewel" cx="40%" cy="35%" r="65%">
                      <Stop offset="0%" stopColor="#FDA4AF" />
                      <Stop offset="45%" stopColor="#E11D48" />
                      <Stop offset="80%" stopColor="#9F1239" />
                      <Stop offset="100%" stopColor="#4C0519" />
                    </RadialGradient>
                  </Defs>
                  {/* Drop shadow backing contour */}
                  <Path
                    d="M19 47 L4 17 C2 10 9 2 19 2 C29 2 36 10 34 17 Z"
                    fill="#1A0A02"
                    opacity={0.45}
                  />
                  {/* Left facet (light gold highlight) */}
                  <Path
                    d="M19 46 L5 17 C3.5 11 10 3 19 3 Z"
                    fill="url(#needleLight)"
                    stroke="#FFE58F"
                    strokeWidth={0.8}
                  />
                  {/* Right facet (rich bronze gold) */}
                  <Path
                    d="M19 46 L33 17 C34.5 11 28 3 19 3 Z"
                    fill="url(#needleDark)"
                    stroke="#78350F"
                    strokeWidth={0.8}
                  />
                  {/* Center 3D spine ridge highlight */}
                  <Line
                    x1={19}
                    y1={4}
                    x2={19}
                    y2={45}
                    stroke="#FFFFFF"
                    strokeWidth={1.5}
                    opacity={0.9}
                  />
                  {/* Crown outer gold bezel */}
                  <Circle
                    cx={19}
                    cy={16}
                    r={8}
                    fill="url(#needleLight)"
                    stroke="#78350F"
                    strokeWidth={1.2}
                  />
                  {/* Crown ruby jewel */}
                  <Circle
                    cx={19}
                    cy={16}
                    r={5.8}
                    fill="url(#rubyJewel)"
                    stroke="#FFE4E6"
                    strokeWidth={0.8}
                  />
                  {/* Specular sparkle */}
                  <Circle cx={17.2} cy={14.2} r={1.6} fill="#FFFFFF" />
                </Svg>
              </Animated.View>

              {/* Rotating Wheel Container */}
              <View style={styles.wheelWrapper}>
                <Animated.View style={[styles.wheelContainer, wheelStyle]}>
                  <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
                    <Defs>
                      {/* Metallic Brushed Gold Outer Rim Gradient */}
                      <SvgGradient
                        id="wheelRimGold"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <Stop offset="0%" stopColor="#FFF9C4" />
                        <Stop offset="25%" stopColor="#FFD54F" />
                        <Stop offset="50%" stopColor="#FF9800" />
                        <Stop offset="75%" stopColor="#E65100" />
                        <Stop offset="100%" stopColor="#78350F" />
                      </SvgGradient>

                      {/* Dark Inner Track Gradient */}
                      <SvgGradient
                        id="innerRimDark"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <Stop offset="0%" stopColor="#2A1404" />
                        <Stop offset="50%" stopColor="#180700" />
                        <Stop offset="100%" stopColor="#0F0300" />
                      </SvgGradient>

                      {/* Metallic Gold Hub Gradient */}
                      <SvgGradient id="hubRimGold" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0%" stopColor="#FFF9C4" />
                        <Stop offset="40%" stopColor="#FFCA28" />
                        <Stop offset="75%" stopColor="#FF8F00" />
                        <Stop offset="100%" stopColor="#BF360C" />
                      </SvgGradient>

                      {/* Radial Wedge Specular Overlay */}
                      <RadialGradient id="wedgeSheen" cx="50%" cy="50%" r="50%">
                        <Stop
                          offset="0%"
                          stopColor="#FFFFFF"
                          stopOpacity="0.24"
                        />
                        <Stop
                          offset="60%"
                          stopColor="#FFFFFF"
                          stopOpacity="0.08"
                        />
                        <Stop
                          offset="100%"
                          stopColor="#000000"
                          stopOpacity="0.32"
                        />
                      </RadialGradient>

                      {/* Dynamic Slice Gradient Definitions with rich dual tones */}
                      {prizes.map((prize, i) => (
                        <SvgGradient
                          key={`sliceGrad-${prize.id || i}`}
                          id={`sliceGrad-${prize.id || i}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <Stop offset="0%" stopColor={prize.color1} />
                          <Stop
                            offset="70%"
                            stopColor={prize.color2 || prize.color1}
                          />
                          <Stop
                            offset="100%"
                            stopColor={prize.color2 || prize.color1}
                          />
                        </SvgGradient>
                      ))}
                    </Defs>

                    {/* 1. Outer Dark Shadow Backing */}
                    <Circle cx={RADIUS} cy={RADIUS} r={RADIUS} fill="#140601" />

                    {/* 2. Heavy Brushed Gold Outer Rim Bezel (15px thick) */}
                    <Circle
                      cx={RADIUS}
                      cy={RADIUS}
                      r={RADIUS - 1}
                      fill="url(#wheelRimGold)"
                    />

                    {/* 3. Outer Concentric Precision Groove */}
                    <Circle
                      cx={RADIUS}
                      cy={RADIUS}
                      r={RADIUS - 3.5}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.45)"
                      strokeWidth={0.9}
                    />

                    {/* 4. Deep Dark Amber Inset Track for Bulbs */}
                    <Circle
                      cx={RADIUS}
                      cy={RADIUS}
                      r={RADIUS - 7.5}
                      fill="none"
                      stroke="url(#innerRimDark)"
                      strokeWidth={6.5}
                    />

                    {/* 5. Inner Gold Border Ring */}
                    <Circle
                      cx={RADIUS}
                      cy={RADIUS}
                      r={RADIUS - 14}
                      fill="none"
                      stroke="#FFE082"
                      strokeWidth={1.2}
                    />

                    {/* Slices: symmetric centered wedges with icons, dual typography and handcrafted spokes */}
                    {prizes.map((prize, index) => {
                      const visuals = getSliceVisuals(prize);
                      const iconY =
                        RADIUS *
                        (itemCount <= 4 ? 0.255 : itemCount <= 6 ? 0.23 : 0.21);
                      const iconR =
                        itemCount <= 4 ? 12 : itemCount <= 6 ? 10.5 : 9;
                      const heroY =
                        iconY +
                        iconR +
                        (itemCount <= 4 ? 13 : itemCount <= 6 ? 11 : 9.5);
                      const heroSize =
                        itemCount <= 4 ? 13 : itemCount <= 6 ? 11 : 9.5;
                      const subY =
                        heroY +
                        (itemCount <= 4 ? 13 : itemCount <= 6 ? 11 : 9.5);
                      const subSize =
                        itemCount <= 4 ? 9 : itemCount <= 6 ? 8 : 7;
                      const badgeY = subY + (itemCount <= 4 ? 6.5 : 5);
                      const badgeW = Math.min(
                        Math.round(WHEEL_SIZE * (itemCount <= 4 ? 0.21 : 0.17)),
                        54,
                      );
                      const badgeH = itemCount <= 4 ? 14 : 12;
                      const badgeFont = itemCount <= 4 ? 7.5 : 6.6;

                      const halfAngleRad = ((sliceAngle / 2) * Math.PI) / 180;
                      const hubR = RADIUS * 0.27;
                      const rimR = RADIUS - 14.5;
                      const hubSpokeX = RADIUS + hubR * Math.sin(halfAngleRad);
                      const hubSpokeY = RADIUS - hubR * Math.cos(halfAngleRad);
                      const rimSpokeX = RADIUS + rimR * Math.sin(halfAngleRad);
                      const rimSpokeY = RADIUS - rimR * Math.cos(halfAngleRad);

                      return (
                        <G
                          key={`slice-${prize.id || index}`}
                          transform={`rotate(${
                            index * sliceAngle
                          }, ${RADIUS}, ${RADIUS})`}
                        >
                          {/* 1. Base Wedge Path */}
                          <Path
                            d={singleWedgePath}
                            fill={`url(#sliceGrad-${prize.id || index})`}
                          />

                          {/* 2. Convex Radial Lighting & Inner Depth Sheen */}
                          <Path
                            d={singleWedgePath}
                            fill="url(#wedgeSheen)"
                            opacity={0.65}
                          />

                          {/* 3. Wedge Icon Badge */}
                          {renderSliceIcon(
                            visuals.iconType,
                            RADIUS,
                            iconY,
                            iconR,
                          )}

                          {/* 4. Hero Bold Value */}
                          <SvgText
                            x={RADIUS}
                            y={heroY}
                            fill="#FFFFFF"
                            fontSize={heroSize}
                            fontWeight="900"
                            textAnchor="middle"
                            letterSpacing="0.4"
                          >
                            {visuals.hero}
                          </SvgText>

                          {/* 5. Subtitle Line */}
                          {visuals.sub ? (
                            <SvgText
                              x={RADIUS}
                              y={subY}
                              fill="#FFE082"
                              fontSize={subSize}
                              fontWeight="800"
                              textAnchor="middle"
                              letterSpacing="0.3"
                            >
                              {visuals.sub}
                            </SvgText>
                          ) : null}

                          {/* 6. High-Contrast Category Pill (when space allows) */}
                          {itemCount <= 5 && visuals.badge ? (
                            <G>
                              <Rect
                                x={RADIUS - badgeW / 2}
                                y={badgeY}
                                width={badgeW}
                                height={badgeH}
                                rx={badgeH / 2}
                                fill="rgba(0, 0, 0, 0.45)"
                                stroke="rgba(255, 224, 130, 0.55)"
                                strokeWidth={0.8}
                              />
                              <SvgText
                                x={RADIUS}
                                y={badgeY + badgeH * 0.72}
                                fill="#FFE082"
                                fontSize={badgeFont}
                                fontWeight="900"
                                textAnchor="middle"
                                letterSpacing="0.4"
                              >
                                {visuals.badge}
                              </SvgText>
                            </G>
                          ) : null}

                          {/* 7. 3D Metallic Divider Spoke with Shadow, Highlight & Rivet */}
                          <Line
                            x1={hubSpokeX}
                            y1={hubSpokeY}
                            x2={rimSpokeX}
                            y2={rimSpokeY}
                            stroke="rgba(0,0,0,0.5)"
                            strokeWidth={2.4}
                          />
                          <Line
                            x1={hubSpokeX}
                            y1={hubSpokeY}
                            x2={rimSpokeX}
                            y2={rimSpokeY}
                            stroke="#FFF9C4"
                            strokeWidth={1.2}
                          />
                          <Circle
                            cx={rimSpokeX}
                            cy={rimSpokeY}
                            r={2.4}
                            fill="#FFD54F"
                            stroke="#78350F"
                            strokeWidth={0.8}
                          />
                        </G>
                      );
                    })}

                    {/* 28 Glowing Casino Cabochon Bulbs */}
                    {bulbs.map((bulb, idx) => (
                      <G key={`bulb-${idx}`}>
                        {/* Outer halo glow */}
                        <Circle
                          cx={bulb.x}
                          cy={bulb.y}
                          r={4.2}
                          fill={
                            bulb.isGold
                              ? 'rgba(255, 224, 130, 0.35)'
                              : 'rgba(255, 23, 68, 0.35)'
                          }
                        />
                        {/* Bezel */}
                        <Circle
                          cx={bulb.x}
                          cy={bulb.y}
                          r={2.8}
                          fill={bulb.isGold ? '#FFE082' : '#FF1744'}
                          stroke={bulb.isGold ? '#78350F' : '#881337'}
                          strokeWidth={0.7}
                        />
                        {/* Inner lens */}
                        <Circle
                          cx={bulb.x}
                          cy={bulb.y}
                          r={1.8}
                          fill={bulb.isGold ? '#FFFDE7' : '#FF80AB'}
                        />
                        {/* Specular glint */}
                        <Circle
                          cx={bulb.x - 0.7}
                          cy={bulb.y - 0.7}
                          r={0.7}
                          fill="#FFFFFF"
                        />
                      </G>
                    ))}

                    {/* 3-Tier Luxury Golden Hub Base in Rotating SVG */}
                    <Circle
                      cx={RADIUS}
                      cy={RADIUS}
                      r={RADIUS * 0.29}
                      fill="#0F0401"
                    />
                    <Circle
                      cx={RADIUS}
                      cy={RADIUS}
                      r={RADIUS * 0.27}
                      fill="url(#hubRimGold)"
                      stroke="#FFE58F"
                      strokeWidth={1.5}
                    />
                    <Circle
                      cx={RADIUS}
                      cy={RADIUS}
                      r={RADIUS * 0.24}
                      fill="#1A0701"
                      stroke="#D97706"
                      strokeWidth={1}
                    />
                    <Circle
                      cx={RADIUS}
                      cy={RADIUS}
                      r={RADIUS * 0.22}
                      fill="#0F0401"
                    />
                  </Svg>
                </Animated.View>

                {/* Center Elevated Hub "SPIN" Button (3D Golden Bezel Dome) */}
                <Animated.View
                  style={[styles.centerHubContainer, hubAnimatedStyle]}
                >
                  <TouchableOpacity
                    onPress={spin}
                    disabled={isSpinning || spinsCount <= 0}
                    activeOpacity={0.88}
                    style={styles.hubTouchable}
                    accessibilityRole="button"
                    accessibilityLabel="Spin the wheel"
                  >
                    <View style={styles.hubBezel}>
                      <LinearGradient
                        colors={['#FFF9C4', '#FFD54F', '#FFA000', '#C2410C']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFillObject}
                      />
                      <View style={styles.hubInnerRim}>
                        <View style={styles.hubCore}>
                          <LinearGradient
                            colors={
                              spinsCount <= 0
                                ? ['#475569', '#334155', '#1E293B']
                                : ['#FF5722', '#F25000', '#D32F2F', '#880E4F']
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={StyleSheet.absoluteFillObject}
                          />
                          {/* Glass Dome Sheen */}
                          <LinearGradient
                            colors={[
                              'rgba(255, 255, 255, 0.45)',
                              'rgba(255, 255, 255, 0.05)',
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={styles.hubSheen}
                            pointerEvents="none"
                          />
                          <View style={styles.hubCoreContent}>
                            <MaterialCommunityIcons
                              name={isSpinning ? 'sync' : 'star-four-points'}
                              size={16}
                              color="#FFE082"
                            />
                            <Text style={styles.hubSpinnerText}>
                              {isSpinning ? '...' : 'SPIN'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>

            {/* Primary Action Button (iOS Bulletproof Absolute Gradient) */}
            <View style={styles.ctaWrapper}>
              <TouchableOpacity
                onPress={spin}
                disabled={isSpinning || spinsCount <= 0}
                activeOpacity={0.88}
                style={[
                  styles.spinCtaButton,
                  (isSpinning || spinsCount <= 0) && styles.spinCtaDisabled,
                ]}
              >
                <LinearGradient
                  colors={
                    spinsCount <= 0
                      ? ['#94A3B8', '#64748B']
                      : ['#FF6200', '#F25000', '#D83E00']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.spinCtaContent}>
                  <MaterialCommunityIcons
                    name={isSpinning ? 'rotate-right' : 'gift-outline'}
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text style={styles.spinCtaText}>
                    {isSpinning
                      ? 'FINDING YOUR LUCKY GIFT...'
                      : spinsCount <= 0
                      ? 'NO SPINS LEFT TODAY'
                      : 'SPIN THE LUCKY WHEEL'}
                  </Text>
                </View>
              </TouchableOpacity>

              <Text style={styles.turnsNotice}>
                🎯 Lucky rewards credited straight to your account
              </Text>
            </View>

            {/* Won Prize Result Card (shown once data is fetched from rewards/spin-win/play) */}
            {wonPrize ? (
              <View
                style={[
                  styles.wonCardScreenWrapper,
                  wonPrize.isNoPrize
                    ? styles.wonCardNoPrize
                    : styles.wonCardPrize,
                ]}
              >
                <LinearGradient
                  colors={
                    wonPrize.isNoPrize
                      ? [
                          'rgba(255, 255, 255, 0.05)',
                          'rgba(255, 255, 255, 0.02)',
                        ]
                      : ['rgba(255, 122, 40, 0.14)', 'rgba(255, 122, 40, 0.04)']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.wonCardInner}>
                  <View style={styles.wonCardTopRow}>
                    <View
                      style={[
                        styles.wonCardIconBox,
                        {
                          backgroundColor: `${wonPrize.color1 || '#F25000'}22`,
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={wonPrize.iconName || 'gift'}
                        size={24}
                        color={wonPrize.color1 || '#F25000'}
                      />
                    </View>
                    <View style={styles.wonCardContentCol}>
                      <View style={styles.wonCardBadgeRow}>
                        <View
                          style={[
                            styles.wonCardBadgePill,
                            { backgroundColor: wonPrize.color1 || '#F25000' },
                          ]}
                        >
                          <Text style={styles.wonCardBadgeText}>
                            {wonPrize.badge ||
                              (wonPrize.isNoPrize
                                ? 'TRY AGAIN'
                                : 'UNLOCKED REWARD')}
                          </Text>
                        </View>
                        {wonPrize.validityDays ? (
                          <Text style={styles.wonCardValidityText}>
                            Valid {wonPrize.validityDays} days
                          </Text>
                        ) : null}
                      </View>
                      <Text style={styles.wonCardPrizeName} numberOfLines={1}>
                        {wonPrize.rewardName || wonPrize.label}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.wonCardDesc} numberOfLines={2}>
                    {wonPrize.description}
                  </Text>

                  {!wonPrize.isNoPrize && (
                    <TouchableOpacity
                      onPress={handleGoToOrderTracking}
                      style={styles.wonCardTrackingBtn}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name="location-outline"
                        size={14}
                        color="#F25000"
                      />
                      <Text style={styles.wonCardTrackingText}>
                        Track Order
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ) : null}

            {showcaseGifts.length > 0 && (
              <View style={styles.prizesSection}>
                <View style={styles.sectionHeaderRow}>
                  <MaterialCommunityIcons
                    name={is48hr ? 'lightning-bolt' : 'gift-open-outline'}
                    size={17}
                    color="#F25000"
                  />
                  <Text style={styles.sectionTitle}>
                    Today’s {showcaseGifts.length} Lucky Gifts
                  </Text>
                </View>
                <Text style={styles.sectionSubtitle}>
                  Spin the wheel to win one of these exciting rewards:
                </Text>

                <View style={styles.prizesGrid}>
                  {showcaseGifts.map(prize => (
                    <View key={prize.id} style={styles.prizeMiniCard}>
                      <View
                        style={[
                          styles.miniCardIconCircle,
                          { backgroundColor: `${prize.color1}22` },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={prize.iconName}
                          size={18}
                          color={prize.color1}
                        />
                      </View>
                      <View style={styles.miniCardInfo}>
                        <Text style={styles.miniCardTitle} numberOfLines={2}>
                          {prize.label}
                        </Text>
                        <Text style={styles.miniCardBadge} numberOfLines={1}>
                          {prize.sublabel}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Celebratory Winner Modal (iOS Bulletproof Design with 60FPS Confetti Motion) */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={handleBackToHome}
      >
        <TouchableWithoutFeedback onPress={handleBackToHome}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                {/* Modal Header with Absolute Gradient */}
                <View style={styles.modalHeaderWrapper}>
                  <LinearGradient
                    colors={
                      isNoPrize
                        ? ['#475569', '#334155', '#1E293B']
                        : ['#FF6200', '#F25000', '#B72C00']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFillObject}
                  />
                  <TouchableOpacity
                    onPress={handleBackToHome}
                    style={styles.modalCloseBtn}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="close" size={17} color="#FFFFFF" />
                  </TouchableOpacity>

                  <View style={styles.modalHeaderContent}>
                    {/* Animated Trophy Ring Motion Graphic */}
                    <Animated.View
                      style={[
                        styles.modalTrophyRing,
                        isNoPrize && styles.modalTrophyRingNoPrize,
                        trophyStyle,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={isNoPrize ? 'clover' : 'gift-open'}
                        size={32}
                        color={isNoPrize ? '#E2E8F0' : '#FFE082'}
                      />
                    </Animated.View>
                    <Text style={styles.modalCongratsTitle}>
                      {isNoPrize
                        ? 'BETTER LUCK NEXT TIME!'
                        : isOnboarding
                        ? 'WELCOME GIFT UNLOCKED!'
                        : isOrderReward
                        ? 'ORDER GIFT UNLOCKED!'
                        : 'CONGRATULATIONS!'}
                    </Text>
                    <View
                      style={[
                        styles.assuredBadgePill,
                        isNoPrize && styles.assuredBadgePillNoPrize,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={isNoPrize ? 'refresh-circle' : 'shield-check'}
                        size={12}
                        color={isNoPrize ? '#475569' : '#C2410C'}
                      />
                      <Text
                        style={[
                          styles.assuredBadgeText,
                          isNoPrize && styles.assuredBadgeTextNoPrize,
                        ]}
                      >
                        {isNoPrize
                          ? 'HARD LUCK THIS TURN'
                          : isOnboarding
                          ? 'NEW USER WELCOME GIFT'
                          : isOrderReward
                          ? 'LUCKY ORDER REWARD'
                          : 'LUCKY GIFT WON'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Modal Body with Voucher Layout */}
                <View style={styles.modalBody}>
                  {/* Voucher Ticket Box */}
                  <View
                    style={[
                      styles.voucherCard,
                      isNoPrize && styles.voucherCardNoPrize,
                    ]}
                  >
                    <View style={styles.voucherHeaderRow}>
                      <View
                        style={[
                          styles.voucherBadge,
                          isNoPrize && styles.voucherBadgeNoPrize,
                        ]}
                      >
                        <Text style={styles.voucherBadgeText}>
                          {wonPrize?.badge || 'LUCKY REWARD'}
                        </Text>
                      </View>
                      {!isNoPrize ? (
                        <Text style={styles.voucherExpiryText}>
                          Valid for 7 days
                        </Text>
                      ) : null}
                    </View>

                    <Text
                      style={[
                        styles.voucherPrizeTitle,
                        isNoPrize && styles.voucherPrizeTitleNoPrize,
                      ]}
                    >
                      {wonPrize?.rewardName || wonPrize?.label || 'Lucky Gift'}
                    </Text>

                    {wonPrize?.value && !isNoPrize ? (
                      <View style={styles.voucherValueBadge}>
                        <MaterialCommunityIcons
                          name="tag-outline"
                          size={12}
                          color="#C2410C"
                        />
                        <Text style={styles.voucherValueText}>
                          Value: {String(wonPrize.value)}
                        </Text>
                      </View>
                    ) : null}

                    <Text style={styles.voucherPrizeDesc}>
                      {wonPrize?.description ||
                        (isNoPrize
                          ? "Don't worry! Keep shopping and earn more lucky spins on your next orders."
                          : '')}
                    </Text>

                    {isNoPrize ? (
                      <View style={styles.noPrizeModalTip}>
                        <MaterialCommunityIcons
                          name="refresh"
                          size={15}
                          color="#475569"
                        />
                        <Text style={styles.noPrizeModalTipText}>
                          Every eligible order earns you another lucky spin!
                        </Text>
                      </View>
                    ) : null}

                    {wonPrize?.redemptionInstructions &&
                    !isNoPrize &&
                    wonPrize?.redemptionInstructions !==
                      wonPrize?.description ? (
                      <View style={styles.redemptionBox}>
                        <Text style={styles.redemptionTitle}>
                          Redemption Instructions
                        </Text>
                        <Text style={styles.redemptionText}>
                          {wonPrize.redemptionInstructions}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Action Buttons: options to Track Order (order), or Start Shopping (onboarding), etc. */}
                  <View style={styles.orderActionsCol}>
                    {isOnboarding ? (
                      <>
                        <TouchableOpacity
                          onPress={handleBackToHome}
                          style={styles.claimButton}
                          activeOpacity={0.85}
                        >
                          <LinearGradient
                            colors={['#FF6200', '#F25000']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={StyleSheet.absoluteFillObject}
                          />
                          <View style={styles.claimButtonContent}>
                            <Ionicons
                              name="bag-handle-outline"
                              size={17}
                              color="#FFFFFF"
                            />
                            <Text style={styles.claimButtonText}>
                              Start Shopping
                            </Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={handleExploreServices}
                          style={styles.homeResetBtn}
                          activeOpacity={0.85}
                        >
                          <View style={styles.claimButtonContent}>
                            <Ionicons
                              name="grid-outline"
                              size={16}
                              color="#F25000"
                            />
                            <Text style={styles.homeResetBtnText}>
                              Explore Services
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        {!isNoPrize && (
                          <TouchableOpacity
                            onPress={handleGoToOrderTracking}
                            style={styles.claimButton}
                            activeOpacity={0.85}
                          >
                            <LinearGradient
                              colors={['#FF6200', '#F25000']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={StyleSheet.absoluteFillObject}
                            />
                            <View style={styles.claimButtonContent}>
                              <Ionicons
                                name="location-outline"
                                size={17}
                                color="#FFFFFF"
                              />
                              <Text style={styles.claimButtonText}>
                                Track Order
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}

                        <TouchableOpacity
                          onPress={handleBackToHome}
                          style={
                            !isNoPrize
                              ? styles.homeResetBtn
                              : styles.claimButton
                          }
                          activeOpacity={0.85}
                        >
                          {isNoPrize ? (
                            <LinearGradient
                              colors={['#FF6200', '#F25000']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={StyleSheet.absoluteFillObject}
                            />
                          ) : null}
                          <View style={styles.claimButtonContent}>
                            <Ionicons
                              name="home-outline"
                              size={16}
                              color={!isNoPrize ? '#F25000' : '#FFFFFF'}
                            />
                            <Text
                              style={
                                !isNoPrize
                                  ? styles.homeResetBtnText
                                  : styles.claimButtonText
                              }
                            >
                              Go to Home
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </>
                    )}

                    {!isOrderReward && !isOnboarding && spinsCount > 0 ? (
                      <TouchableOpacity
                        onPress={() => {
                          setShowModal(false);
                          setTimeout(() => spin(), 350);
                        }}
                        style={styles.spinAgainBtn}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.spinAgainText}>
                          Spin Again ({spinsCount}{' '}
                          {spinsCount === 1 ? 'spin' : 'spins'} left)
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>

            {/* Motion Graphics Full-Screen Confetti Shower */}
            {showPoppers && !isNoPrize ? (
              <Animated.View
                style={[styles.confettiOverlay, poppersAnimatedStyle]}
                pointerEvents="none"
              >
                {CONFETTI_PIECES.map(p => (
                  <ConfettiPiece key={p.id} piece={p} active={showPoppers} />
                ))}
              </Animated.View>
            ) : null}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0C10',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#0A0C10',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleBlock: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONTS.gilroy?.bold || 'System',
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    color: '#FF7A28',
    fontSize: 11,
    fontFamily: FONTS.gilroy?.medium || 'System',
    marginTop: 5,
  },
  spinsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
  },
  spinsBadgeText: {
    color: '#FBBF24',
    fontSize: 10.5,
    fontWeight: '800',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  guaranteeCard: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 122, 40, 0.28)',
    marginBottom: 12,
  },
  guaranteeCard48hr: {
    borderColor: 'rgba(255, 122, 40, 0.4)',
  },
  guaranteeInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  shieldIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(242, 80, 0, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(242, 80, 0, 0.32)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldIconWrapper48hr: {
    backgroundColor: 'rgba(242, 80, 0, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(242, 80, 0, 0.38)',
  },
  guaranteeCopy: {
    flex: 1,
  },
  guaranteeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  guaranteeHeading: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  guaranteeHeading48hr: {
    color: '#FFFFFF',
  },
  guaranteePill: {
    backgroundColor: '#F25000',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  guaranteePill48hr: {
    backgroundColor: '#FF7A28',
  },
  guaranteePillText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  guaranteePillText48hr: {
    color: '#FFFFFF',
  },
  guaranteeSubtitle: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 14,
  },
  guaranteeSubtitle48hr: {
    color: '#94A3B8',
  },
  wheelStage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    position: 'relative',
  },
  ambientHaloWrapper: {
    position: 'absolute',
    width: 400,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  sunburstWrapper: {
    position: 'absolute',
    width: 400,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  ambientCorona: {
    position: 'absolute',
    width: 400,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  sparkleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleTL: {
    position: 'absolute',
    top: 35,
    left: 45,
    zIndex: 2,
  },
  sparkleTR: {
    position: 'absolute',
    top: 35,
    right: 45,
    zIndex: 2,
  },
  sparkleBL: {
    position: 'absolute',
    bottom: 35,
    left: 45,
    zIndex: 2,
  },
  sparkleBR: {
    position: 'absolute',
    bottom: 35,
    right: 45,
    zIndex: 2,
  },
  outerWheelHalo: {
    position: 'absolute',
    width: WHEEL_SIZE + 24,
    height: WHEEL_SIZE + 24,
    borderRadius: (WHEEL_SIZE + 24) / 2,
    backgroundColor: 'rgba(242, 80, 0, 0.08)',
  },
  wheelWrapper: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#F25000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 18,
    elevation: 12,
  },
  wheelContainer: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
  },
  pointerWrapper: {
    position: 'absolute',
    top: -22,
    zIndex: 30,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 5,
    elevation: 14,
  },
  centerHubContainer: {
    position: 'absolute',
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 25,
  },
  hubTouchable: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubBezel: {
    width: 74,
    height: 74,
    borderRadius: 37,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF9C4',
    shadowColor: '#FF6F00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 12,
  },
  hubInnerRim: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: '#FFE082',
    backgroundColor: '#1E0A00',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  hubCore: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 29,
    borderTopLeftRadius: 29,
    borderTopRightRadius: 29,
    zIndex: 1,
  },
  hubCoreContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  hubSpinnerText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  ctaWrapper: {
    width: '100%',
    maxWidth: 340,
    marginTop: 12,
    alignItems: 'center',
  },
  spinCtaButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#F25000',
    shadowColor: '#F25000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 8,
    elevation: 6,
    position: 'relative',
  },
  spinCtaDisabled: {
    opacity: 0.85,
    shadowOpacity: 0,
    elevation: 0,
    backgroundColor: '#94A3B8',
  },
  spinCtaContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    zIndex: 2,
  },
  spinCtaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: FONTS.gilroy?.bold || 'System',
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  turnsNotice: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  prizesSection: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14,
    marginTop: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sectionSubtitle: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 10,
  },
  prizesGrid: {
    gap: 8,
  },
  prizeMiniCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  miniCardIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCardInfo: {
    flex: 1,
  },
  miniCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 16,
  },
  miniCardBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '92%',
    maxWidth: 335,
    backgroundColor: '#12151C',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 16,
  },
  modalHeaderWrapper: {
    width: '100%',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#F25000',
  },
  modalHeaderContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  modalTrophyRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 2,
    borderColor: '#FFE082',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  modalTrophyRingNoPrize: {
    borderColor: '#94A3B8',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalCongratsTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  assuredBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
    marginTop: 5,
  },
  assuredBadgePillNoPrize: {
    backgroundColor: '#F1F5F9',
  },
  assuredBadgeText: {
    color: '#9A3412',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  assuredBadgeTextNoPrize: {
    color: '#475569',
  },
  modalBody: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#12151C',
  },
  voucherCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(242, 80, 0, 0.35)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  voucherCardNoPrize: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  voucherHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  voucherBadge: {
    backgroundColor: '#F25000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  voucherBadgeNoPrize: {
    backgroundColor: '#64748B',
  },
  voucherBadgeText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  voucherExpiryText: {
    fontSize: 9.5,
    color: '#FF7A28',
    fontWeight: '700',
  },
  voucherPrizeTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  voucherPrizeTitleNoPrize: {
    color: '#FFFFFF',
  },
  noPrizeModalTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
  },
  noPrizeModalTipText: {
    flex: 1,
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 15,
  },
  voucherValueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(242, 80, 0, 0.22)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  voucherValueText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FF7A28',
  },
  voucherPrizeDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    lineHeight: 15,
  },
  redemptionBox: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  redemptionTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FBBF24',
    marginBottom: 2,
  },
  redemptionText: {
    fontSize: 10,
    color: '#CBD5E1',
    lineHeight: 14,
  },
  couponStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(242, 80, 0, 0.35)',
    borderRadius: 9,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  couponCodeCol: {
    flex: 1,
  },
  couponCodeLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.3,
  },
  couponCodeText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.7,
    marginTop: 1,
  },
  copyCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(242, 80, 0, 0.22)',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 7,
  },
  copyCodeText: {
    color: '#FF7A28',
    fontSize: 10.5,
    fontWeight: '900',
  },
  claimButton: {
    width: '100%',
    height: 46,
    borderRadius: 13,
    overflow: 'hidden',
    backgroundColor: '#F25000',
    shadowColor: '#F25000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 7,
    elevation: 4,
    position: 'relative',
  },
  claimButtonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    zIndex: 2,
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  spinAgainBtn: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  spinAgainText: {
    color: '#94A3B8',
    fontSize: 11.5,
    fontWeight: '700',
  },
  confettiOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    overflow: 'hidden',
    zIndex: 999,
    elevation: 999,
  },
  orderActionsCol: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  homeResetBtn: {
    width: '100%',
    height: 42,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  homeResetBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 12,
  },
  loadingText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#94A3B8',
    fontFamily: FONTS.gilroy?.medium || 'System',
  },
  emptyContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIconCircle48hr: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: FONTS.gilroy?.bold || 'System',
  },
  emptyDescription: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 12,
    fontFamily: FONTS.gilroy?.regular || 'System',
  },
  emptyActionButton: {
    minWidth: 170,
    height: 46,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: '#F25000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  emptyActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  emptyActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    fontFamily: FONTS.gilroy?.bold || 'System',
    textAlign: 'center',
    includeFontPadding: false,
  },
  emptyButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyRetryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 46,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  emptyRetryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    fontFamily: FONTS.gilroy?.bold || 'System',
  },
  spinsBadgeEmpty: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  spinsBadgeTextEmpty: {
    color: '#94A3B8',
  },
  wonCardScreenWrapper: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    marginTop: 14,
    marginBottom: 6,
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  wonCardPrize: {
    borderColor: 'rgba(242, 80, 0, 0.45)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  wonCardNoPrize: {
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  wonCardInner: {
    padding: 14,
    width: '100%',
  },
  wonCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  wonCardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  wonCardContentCol: {
    flex: 1,
  },
  wonCardBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  wonCardBadgePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  wonCardBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    fontFamily: FONTS.gilroy?.bold || 'System',
    includeFontPadding: false,
  },
  wonCardValidityText: {
    fontSize: 10,
    color: '#FF7A28',
    fontWeight: '700',
  },
  wonCardPrizeName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy?.bold || 'System',
  },
  wonCardDesc: {
    fontSize: 11.5,
    color: '#94A3B8',
    lineHeight: 16,
    marginBottom: 10,
    fontFamily: FONTS.gilroy?.regular || 'System',
  },
  wonCardCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(242, 80, 0, 0.35)',
    borderStyle: 'dashed',
  },
  wonCardCodeBox: {
    flex: 1,
  },
  wonCardCodeLabel: {
    fontSize: 8.5,
    color: '#94A3B8',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  wonCardCodeVal: {
    fontSize: 14,
    color: '#FF7A28',
    fontWeight: '900',
    fontFamily: FONTS.gilroy?.bold || 'System',
    letterSpacing: 0.8,
  },
  wonCardCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(242, 80, 0, 0.2)',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(242, 80, 0, 0.35)',
  },
  wonCardCopyBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF7A28',
    fontFamily: FONTS.gilroy?.bold || 'System',
  },
  wonCardTrackingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(242, 80, 0, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(242, 80, 0, 0.35)',
  },
  wonCardTrackingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FF7A28',
    fontFamily: FONTS.gilroy?.bold || 'System',
  },
});
