import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';

import images from '@/assets/images';
import {
  AssuredPrize,
  extractCampaignAndRewards,
  mapBackendRewardToPrize,
  playHomeWheelApi,
  playSpinWin,
  markOrderSpinClaimed,
  markOnboardingSpinClaimed,
  REWARD_PALETTES,
} from '@/api/spinWheelService';
import { impactTick, selectionTick, successTick } from '@/utils/haptics';
import { generateUUID as uuidv4 } from '@/utils/uuid';
import { hp } from '@/utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Responsive wheel dimensions calibrated to match reference photo
const WHEEL_DIAMETER = Math.min(Math.round(SCREEN_WIDTH * 0.74), 280);
const RADIUS = WHEEL_DIAMETER / 2;
const SPIN_DURATION_MS = 6200;

// Warm festive orange & golden luxury slice palette matching the background theme
const SLICE_THEME_COLORS = [
  { bg1: '#FF7D00', bg2: '#D83800' }, // Vivid Festive Orange
  { bg1: '#FFD54F', bg2: '#FFA000' }, // Warm Golden Amber
  { bg1: '#C62828', bg2: '#7F0000' }, // Deep Royal Crimson
  { bg1: '#FFA726', bg2: '#F57C00' }, // Bright Tangerine Flame
  { bg1: '#FF5722', bg2: '#BF360C' }, // Fiery Coral
  { bg1: '#FFE082', bg2: '#FFB300' }, // Radiant Sunburst Gold
  { bg1: '#B71C1C', bg2: '#4A0000' }, // Rich Velvet Garnet
  { bg1: '#FFCA28', bg2: '#E65100' }, // Warm Honey Amber
];

const SNAP_POINTS = ['88%'];

export interface HomeWheelBottomSheetModalRef {
  present: (overrideData?: any) => void;
  dismiss: () => void;
}

export interface HomeWheelBottomSheetModalProps {
  visibilityData?: any;
  orderId?: string | number | null;
  orderNumber?: string | number | null;
  onDismiss?: () => void;
  onSpinSuccess?: (wonPrize: AssuredPrize) => void;
}

/**
 * 3D Golden Coin SVG element with rupee sign and metallic gradient
 */
const GoldCoin: React.FC<{ size?: number; rotation?: number }> = ({
  size = 28,
  rotation = 0,
}) => {
  return (
    <View style={{ transform: [{ rotate: `${rotation}deg` }] }}>
      <Svg width={size} height={size} viewBox="0 0 40 40">
        <Defs>
          <SvgGradient id={`goldRim-${size}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFF9C4" />
            <Stop offset="40%" stopColor="#FFC107" />
            <Stop offset="80%" stopColor="#FF8F00" />
            <Stop offset="100%" stopColor="#BF360C" />
          </SvgGradient>
          <SvgGradient id={`goldInner-${size}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFE082" />
            <Stop offset="100%" stopColor="#FF8F00" />
          </SvgGradient>
        </Defs>
        <Circle cx="20" cy="20" r="19" fill={`url(#goldRim-${size})`} />
        <Circle cx="20" cy="20" r="15" fill={`url(#goldInner-${size})`} />
        <Circle
          cx="20"
          cy="20"
          r="14"
          fill="none"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="1.2"
        />
        {/* Rupee Symbol */}
        <SvgText
          x="20"
          y="26"
          fontSize="17"
          fontWeight="900"
          fill="#5D2600"
          textAnchor="middle"
        >
          ₹
        </SvgText>
        <SvgText
          x="19.5"
          y="25.5"
          fontSize="17"
          fontWeight="900"
          fill="#FFFDE7"
          textAnchor="middle"
        >
          ₹
        </SvgText>
      </Svg>
    </View>
  );
};

/**
 * Radial Sunburst Ray Beams emanating behind the wheel
 */
const SunburstRays: React.FC<{ size?: number }> = ({ size = 360 }) => {
  const center = size / 2;
  const rayCount = 18;
  const rayAngle = 360 / rayCount;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <RadialGradient id="sunburstGrad" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FFE082" stopOpacity="0.45" />
          <Stop offset="50%" stopColor="#FFA000" stopOpacity="0.22" />
          <Stop offset="100%" stopColor="#E65100" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Circle cx={center} cy={center} r={center} fill="url(#sunburstGrad)" />
      {Array.from({ length: rayCount }).map((_, i) => {
        if (i % 2 === 0) return null;
        const angle1 = (i * rayAngle * Math.PI) / 180;
        const angle2 = ((i + 1) * rayAngle * Math.PI) / 180;
        const x1 = center + center * Math.cos(angle1);
        const y1 = center + center * Math.sin(angle1);
        const x2 = center + center * Math.cos(angle2);
        const y2 = center + center * Math.sin(angle2);
        const path = `M ${center} ${center} L ${x1.toFixed(1)} ${y1.toFixed(
          1,
        )} L ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;
        return (
          <Path key={`ray-${i}`} d={path} fill="rgba(255, 255, 255, 0.11)" />
        );
      })}
    </Svg>
  );
};

/**
 * 3D Cylindrical Stepped Podium / Pedestal Base under the wheel
 */
const PodiumBase: React.FC<{ width?: number }> = ({ width = 230 }) => {
  const height = 62;
  return (
    <Svg width={width} height={height} viewBox="0 0 240 64">
      <Defs>
        <SvgGradient id="podiumGoldTop" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor="#FFF9C4" />
          <Stop offset="25%" stopColor="#FFD54F" />
          <Stop offset="50%" stopColor="#FFE082" />
          <Stop offset="75%" stopColor="#FFB300" />
          <Stop offset="100%" stopColor="#B78103" />
        </SvgGradient>
        <SvgGradient id="podiumAmberBody" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor="#5C1600" />
          <Stop offset="25%" stopColor="#9A3412" />
          <Stop offset="50%" stopColor="#C2410C" />
          <Stop offset="75%" stopColor="#9A3412" />
          <Stop offset="100%" stopColor="#431407" />
        </SvgGradient>
        <SvgGradient id="podiumGoldBottom" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor="#FFF59D" />
          <Stop offset="30%" stopColor="#FFC107" />
          <Stop offset="70%" stopColor="#FF8F00" />
          <Stop offset="100%" stopColor="#8D5B00" />
        </SvgGradient>
      </Defs>

      {/* Bottom Step Platform */}
      <Path
        d="M 12 36 L 228 36 L 236 58 C 236 62 4 62 4 58 Z"
        fill="url(#podiumGoldBottom)"
      />
      {/* Middle Cylinder Layer */}
      <Rect
        x="26"
        y="16"
        width="188"
        height="26"
        fill="url(#podiumAmberBody)"
      />

      {/* Top Stepped Ring */}
      <Path d="M 32 8 L 208 8 L 214 22 L 26 22 Z" fill="url(#podiumGoldTop)" />
      {/* Top Bevel Rim */}
      <Path d="M 40 2 L 200 2 L 208 8 L 32 8 Z" fill="#FFE57F" />
    </Svg>
  );
};

/**
 * 3D White & Gold Geometric Medallion Hub replacing the gift box
 */
const WheelCenterEmblem: React.FC<{ size?: number }> = ({ size = 74 }) => {
  const center = size / 2;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <SvgGradient id="emblemGoldRim" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#FFF9C4" />
          <Stop offset="30%" stopColor="#FFD54F" />
          <Stop offset="70%" stopColor="#FF9800" />
          <Stop offset="100%" stopColor="#D97706" />
        </SvgGradient>
        <RadialGradient id="emblemWhiteDial" cx="35%" cy="30%" r="70%">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="65%" stopColor="#F8FAFC" />
          <Stop offset="100%" stopColor="#E2E8F0" />
        </RadialGradient>
        <SvgGradient id="emblemStarGold" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#FFE082" />
          <Stop offset="50%" stopColor="#FFB300" />
          <Stop offset="100%" stopColor="#E65100" />
        </SvgGradient>
      </Defs>

      {/* Outer Stepped 24K Gold Bevel Rim */}
      <Circle
        cx={center}
        cy={center}
        r={center - 1}
        fill="url(#emblemGoldRim)"
      />
      {/* Dark Amber Accent Ridge */}
      <Circle cx={center} cy={center} r={center - 4} fill="#B45309" />
      <Circle cx={center} cy={center} r={center - 5} fill="#FFD54F" />

      {/* Pure Pearl-White Base Disc */}
      <Circle
        cx={center}
        cy={center}
        r={center - 6.5}
        fill="url(#emblemWhiteDial)"
        stroke="#E2E8F0"
        strokeWidth={0.8}
      />

      {/* Concentric Guilloché Bezel Pattern (Dashed Gold Ring) */}
      <Circle
        cx={center}
        cy={center}
        r={center - 10.5}
        fill="none"
        stroke="#F59E0B"
        strokeWidth={1.1}
        strokeDasharray="2, 2.5"
      />

      {/* 12 Concentric Micro-Beads */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 360) / 12;
        const rad = (angle * Math.PI) / 180;
        const dist = center - 14;
        const bx = center + dist * Math.sin(rad);
        const by = center - dist * Math.cos(rad);
        return (
          <Circle key={`emb-dot-${i}`} cx={bx} cy={by} r={1.1} fill="#D97706" />
        );
      })}

      {/* Inner Gold Frame */}
      <Circle
        cx={center}
        cy={center}
        r={center - 17.5}
        fill="#FFFFFF"
        stroke="#FFB300"
        strokeWidth={1.3}
      />

      {/* 8-Pointed Geometric Compass Star Pattern */}
      {/* Primary 4-point Star */}
      <Polygon
        points={`
          ${center},${center - 14}
          ${center + 3.8},${center - 3.8}
          ${center + 14},${center}
          ${center + 3.8},${center + 3.8}
          ${center},${center + 14}
          ${center - 3.8},${center + 3.8}
          ${center - 14},${center}
          ${center - 3.8},${center - 3.8}
        `}
        fill="url(#emblemStarGold)"
        stroke="#FFFFFF"
        strokeWidth={0.6}
      />
      {/* Diagonal 4-point Star */}
      <Polygon
        points={`
          ${center + 7.5},${center - 7.5}
          ${center + 2.8},${center}
          ${center + 7.5},${center + 7.5}
          ${center},${center + 2.8}
          ${center - 7.5},${center + 7.5}
          ${center - 2.8},${center}
          ${center - 7.5},${center - 7.5}
          ${center},${center - 2.8}
        `}
        fill="url(#emblemStarGold)"
        stroke="#FFFFFF"
        strokeWidth={0.6}
        opacity={0.88}
      />

      {/* Core Center Gem Hub */}
      <Circle
        cx={center}
        cy={center}
        r={5.5}
        fill="#FFFFFF"
        stroke="#FF9800"
        strokeWidth={1.2}
      />
      <Circle cx={center} cy={center} r={3.6} fill="#E65100" />
      {/* Glistening Glint Highlight */}
      <Circle cx={center - 1} cy={center - 1} r={1.2} fill="#FFFFFF" />
    </Svg>
  );
};

export const HomeWheelBottomSheetModal = forwardRef<
  HomeWheelBottomSheetModalRef,
  HomeWheelBottomSheetModalProps
>(({ visibilityData, orderId, orderNumber, onDismiss, onSpinSuccess }, ref) => {
  const insets = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [internalVisibilityData, setInternalVisibilityData] = useState<any>(
    visibilityData || null,
  );

  useEffect(() => {
    if (visibilityData) {
      setInternalVisibilityData(visibilityData);
    }
  }, [visibilityData]);

  const activeVisibilityData = internalVisibilityData || visibilityData;

  // Parse backend campaign and rewards strictly (no dummy fallback)
  const campaignInfo = useMemo(() => {
    return extractCampaignAndRewards(activeVisibilityData);
  }, [activeVisibilityData]);

  const rawRewards = campaignInfo.rewards || [];

  // Map backend rewards to AssuredPrize objects
  const prizes = useMemo(() => {
    if (!Array.isArray(rawRewards) || rawRewards.length < 3) {
      return [];
    }
    return rawRewards.map((item: any, idx: number) => {
      const p = mapBackendRewardToPrize(item, idx);
      const themeColor = SLICE_THEME_COLORS[idx % SLICE_THEME_COLORS.length];
      return {
        ...p,
        color1: themeColor.bg1,
        color2: themeColor.bg2,
      };
    });
  }, [rawRewards]);

  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<AssuredPrize | null>(null);
  const [showWinCelebration, setShowWinCelebration] = useState(false);

  // Animation values
  const rotation = useSharedValue(0);
  const accumulatedRotation = useRef(0);
  const pointerAngle = useSharedValue(0);
  const hapticTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const coinBob = useSharedValue(0);

  // Gentle coin floating animation
  useEffect(() => {
    coinBob.value = withRepeat(
      withSequence(
        withTiming(-7, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(7, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
  }, [coinBob]);

  const coinBobStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: coinBob.value }],
  }));

  const coinBobReverseStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -coinBob.value }],
  }));

  const clearHapticTimers = () => {
    hapticTimeouts.current.forEach(t => clearTimeout(t));
    hapticTimeouts.current = [];
  };

  useEffect(() => {
    return () => clearHapticTimers();
  }, []);

  // Imperative handle for present / dismiss
  useImperativeHandle(ref, () => ({
    present: (overrideData?: any) => {
      const dataToInspect = overrideData || activeVisibilityData;
      if (overrideData) {
        setInternalVisibilityData(overrideData);
      }
      const info = extractCampaignAndRewards(dataToInspect);
      const rewardList = Array.isArray(info?.rewards) ? info.rewards : [];
      if (rewardList.length >= 3) {
        setTimeout(() => {
          bottomSheetModalRef.current?.present();
        }, 32);
      } else {
        console.log(
          `[HomeWheelBottomSheetModal] Cannot present: backend rewards count (${rewardList.length}) < 3.`,
        );
        onDismiss?.();
      }
    },
    dismiss: () => {
      bottomSheetModalRef.current?.dismiss();
    },
  }));

  const handleClosePress = () => {
    if (isSpinning) return;
    bottomSheetModalRef.current?.dismiss();
  };

  const handleSheetDismiss = () => {
    setIsSpinning(false);
    clearHapticTimers();
    onDismiss?.();
  };

  // Wheel geometry based on backend slice count
  const sliceCount = prizes.length > 0 ? prizes.length : 8;
  const sliceAngleDeg = 360 / sliceCount;
  const halfAngleRad = ((sliceAngleDeg / 2) * Math.PI) / 180;
  const wedgeRadius = RADIUS - 12;
  const wx1 = RADIUS + wedgeRadius * Math.sin(-halfAngleRad);
  const wy1 = RADIUS - wedgeRadius * Math.cos(-halfAngleRad);
  const wx2 = RADIUS + wedgeRadius * Math.sin(halfAngleRad);
  const wy2 = RADIUS - wedgeRadius * Math.cos(halfAngleRad);
  const singleWedgePath = `M ${RADIUS} ${RADIUS} L ${wx1.toFixed(
    2,
  )} ${wy1.toFixed(2)} A ${wedgeRadius} ${wedgeRadius} 0 0 1 ${wx2.toFixed(
    2,
  )} ${wy2.toFixed(2)} Z`;

  // Dynamic Animated Styles
  const wheelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const pointerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${pointerAngle.value}deg` }],
  }));

  const handleSpinEnd = (prize: AssuredPrize) => {
    clearHapticTimers();
    setIsSpinning(false);
    setWonPrize(prize);
    setShowWinCelebration(true);
    pointerAngle.value = withSpring(0, { damping: 14, stiffness: 220 });
    successTick();

    if (prize) {
      if (orderId) {
        markOrderSpinClaimed(orderId, prize);
      } else {
        markOnboardingSpinClaimed(prize);
      }
      onSpinSuccess?.(prize);
    }
  };

  const handleSpinPress = async () => {
    if (isSpinning || prizes.length < 3) return;

    clearHapticTimers();
    setIsSpinning(true);
    setWonPrize(null);
    impactTick();

    const targetCampaignId =
      campaignInfo.campaignId ||
      activeVisibilityData?.campaignId ||
      activeVisibilityData?.data?.campaignId;
    const dynamicRequestId =
      visibilityData?.requestId || activeVisibilityData?.requestId || uuidv4();

    const targetOrderId =
      orderId !== undefined && orderId !== null
        ? isNaN(Number(orderId))
          ? orderId
          : Number(orderId)
        : undefined;

    let playResponse: any = null;
    if (targetOrderId) {
      try {
        playResponse = await playSpinWin({
          orderId: targetOrderId,
          campaignId: targetCampaignId,
        });
        console.log('[HomeWheelBottomSheetModal] play response:', playResponse);
      } catch (err: any) {
        console.log(
          '[HomeWheelBottomSheetModal] play error:',
          err?.response?.data || err?.message || err,
        );
      }
    } else {
      try {
        playResponse = await playHomeWheelApi({
          campaignId: targetCampaignId,
          requestId: dynamicRequestId,
          anonymousId: null,
        });
        console.log('[HomeWheelBottomSheetModal] play response:', playResponse);
      } catch (err: any) {
        console.log(
          '[HomeWheelBottomSheetModal] play error:',
          err?.response?.data || err?.message || err,
        );
      }
    }

    // Strictly validate response from backend - NO fallback dummy spinning
    if (
      !playResponse ||
      (playResponse.success === false &&
        playResponse.status !== 'OK' &&
        !playResponse.data)
    ) {
      setIsSpinning(false);
      const errMsg =
        playResponse?.message ||
        playResponse?.error ||
        'Unable to complete spin. Please check your network and try again.';
      Toast.show(errMsg, Toast.SHORT);
      return;
    }

    // Resolve winning index strictly from backend reward data
    let winningIndex = -1;
    const respData =
      playResponse?.data !== undefined ? playResponse.data : playResponse;
    const rewardObj = respData
      ? respData.prize ||
        respData.reward ||
        respData.winningReward ||
        respData.rewardSegment ||
        respData.item ||
        (respData.id ||
        respData.rewardId ||
        respData.code ||
        respData.rewardCode ||
        respData.label ||
        respData.rewardName ||
        respData.campaignItemId
          ? respData
          : null)
      : null;

    if (!rewardObj) {
      console.warn(
        '[HomeWheelBottomSheetModal] No reward object returned by backend:',
        respData,
      );
      setIsSpinning(false);
      Toast.show(
        'No reward received from server. Please try again.',
        Toast.SHORT,
      );
      return;
    }

    const rCampaignItemId = String(rewardObj.campaignItemId ?? '').trim();
    const rId = String(
      rewardObj.id ?? rewardObj.rewardId ?? rewardObj.prizeId ?? '',
    ).trim();
    const rCode = String(
      rewardObj.code ??
        rewardObj.rewardCode ??
        rewardObj.couponCode ??
        rewardObj.promoCode ??
        '',
    )
      .trim()
      .toLowerCase();
    const rLabel = String(
      rewardObj.rewardName ?? rewardObj.label ?? rewardObj.title ?? '',
    )
      .trim()
      .toLowerCase();
    const isNoPrizeServer =
      String(rewardObj.rewardType ?? '').toLowerCase() === 'noprize' ||
      rLabel.includes('better luck') ||
      rLabel.includes('no prize');

    if (rCampaignItemId) {
      winningIndex = prizes.findIndex(
        p =>
          p.campaignItemId !== undefined &&
          String(p.campaignItemId).trim() === rCampaignItemId,
      );
    }
    if (winningIndex === -1 && rId) {
      winningIndex = prizes.findIndex(
        p =>
          (p.rewardId !== undefined && String(p.rewardId).trim() === rId) ||
          (p.id !== undefined && String(p.id).trim() === rId) ||
          (p.campaignItemId !== undefined &&
            String(p.campaignItemId).trim() === rId),
      );
    }
    if (winningIndex === -1 && rCode) {
      winningIndex = prizes.findIndex(
        p => p.code && p.code.toLowerCase() === rCode,
      );
    }
    if (winningIndex === -1 && rLabel) {
      winningIndex = prizes.findIndex(
        p => p.label && p.label.toLowerCase() === rLabel,
      );
    }
    if (winningIndex === -1 && isNoPrizeServer) {
      winningIndex = prizes.findIndex(
        p =>
          Boolean(p.isNoPrize) ||
          (p.label && p.label.toLowerCase().includes('better luck')),
      );
    }

    // STRICT: Must match a real backend slice. No fallback dummy random!
    if (winningIndex === -1) {
      console.warn(
        '[HomeWheelBottomSheetModal] Could not match backend prize to any wheel slice:',
        rewardObj,
      );
      setIsSpinning(false);
      Toast.show(
        'Reward slice could not be matched. Please contact support.',
        Toast.SHORT,
      );
      return;
    }

    const selectedPrize = prizes[winningIndex];

    // Compute target rotation
    const sliceCenter = winningIndex * sliceAngleDeg;
    const targetAngleInCycle = (360 - (sliceCenter % 360)) % 360;

    const currentRot = accumulatedRotation.current;
    const currentTurns = Math.floor(currentRot / 360);
    const fullSpins = 5;
    let nextTarget = (currentTurns + fullSpins) * 360 + targetAngleInCycle;
    while (nextTarget <= currentRot + 3 * 360) {
      nextTarget += 360;
    }
    accumulatedRotation.current = nextTarget;

    // Haptic tick feedback during deceleration
    const HAPTIC_DELAYS = [
      { delay: 2800, type: 'light' },
      { delay: 3300, type: 'light' },
      { delay: 3800, type: 'light' },
      { delay: 4300, type: 'light' },
      { delay: 4800, type: 'medium' },
      { delay: 5300, type: 'medium' },
      { delay: 5800, type: 'medium' },
    ];
    HAPTIC_DELAYS.forEach(({ delay, type }) => {
      const timer = setTimeout(() => {
        if (type === 'medium') impactTick();
        else selectionTick();
      }, delay);
      hapticTimeouts.current.push(timer);
    });

    // Pointer needle wobble during spin
    pointerAngle.value = withRepeat(
      withSequence(
        withTiming(-14, { duration: 65, easing: Easing.linear }),
        withTiming(3, { duration: 65, easing: Easing.linear }),
      ),
      Math.floor(SPIN_DURATION_MS / 130),
      true,
    );

    // Wheel spin animation with cubic deceleration
    rotation.value = withTiming(
      nextTarget,
      {
        duration: SPIN_DURATION_MS,
        easing: Easing.bezier(0.16, 0.88, 0.26, 1),
      },
      finished => {
        if (finished) {
          runOnJS(handleSpinEnd)(selectedPrize);
        }
      },
    );
  };

  const handleCopyCode = (code: string) => {
    Clipboard.setString(code);
    Toast.show('Promo code copied!', Toast.SHORT);
    impactTick();
  };

  const handleClaimReward = () => {
    setShowWinCelebration(false);
    bottomSheetModalRef.current?.dismiss();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.68}
        pressBehavior={isSpinning ? 'none' : 'close'}
      />
    ),
    [isSpinning],
  );

  // If backend returns less than 3 rewards, strictly don't render wheel contents or dummy data
  if (prizes.length < 3) {
    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={SNAP_POINTS}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onDismiss={handleSheetDismiss}
        handleComponent={null}
        backgroundStyle={styles.bottomSheetBackground}
      >
        <BottomSheetView style={styles.sheetContainer}>
          <View />
        </BottomSheetView>
      </BottomSheetModal>
    );
  }

  const rawCampaignName = (campaignInfo.campaignName || '').trim();
  const campaignTitle = rawCampaignName
    ? rawCampaignName.toUpperCase()
    : 'SPIN & WIN';
  const campaignSubtitle = (campaignInfo.description || '').trim();

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={SNAP_POINTS}
      enablePanDownToClose={!isSpinning}
      backdropComponent={renderBackdrop}
      onDismiss={handleSheetDismiss}
      handleComponent={null} // Seamless look like the reference photo
      style={styles.modalWrapper}
      backgroundStyle={styles.bottomSheetBackground}
    >
      <BottomSheetView style={styles.sheetContainer}>
        {/* Vibrant Festive Warm Orange & Amber Gradient Backdrop */}
        <LinearGradient
          colors={['#2A0800', '#7E1C00', '#E65100']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[StyleSheet.absoluteFill, styles.gradientBackdrop]}
        />

        {/* Top Close Button ('✕') */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClosePress}
          disabled={isSpinning}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="close" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Header Typography */}
        <View style={styles.headerContainer}>
          <Text style={styles.titleText}>{campaignTitle}</Text>
          <Text style={styles.subtitleText}>{campaignSubtitle}</Text>
          <View style={{ paddingBottom: hp(1.5) }} />
        </View>

        {/* Center Stage: Sunburst Rays, Floating Coins, Wheel, Hero Product */}
        <View style={styles.wheelStage}>
          {/* Ambient Sunburst Rays Background */}
          <View style={styles.sunburstWrapper} pointerEvents="none">
            <SunburstRays size={360} />
          </View>

          {/* 3D Floating Gold Coins */}
          <Animated.View
            style={[styles.floatingCoinTL, coinBobStyle]}
            pointerEvents="none"
          >
            <GoldCoin size={32} rotation={-16} />
          </Animated.View>
          <Animated.View
            style={[styles.floatingCoinML, coinBobReverseStyle]}
            pointerEvents="none"
          >
            <GoldCoin size={26} rotation={22} />
          </Animated.View>
          <Animated.View
            style={[styles.floatingCoinTR, coinBobReverseStyle]}
            pointerEvents="none"
          >
            <GoldCoin size={30} rotation={18} />
          </Animated.View>
          <Animated.View
            style={[styles.floatingCoinMR, coinBobStyle]}
            pointerEvents="none"
          >
            <GoldCoin size={24} rotation={-12} />
          </Animated.View>
          <Animated.View
            style={[styles.floatingCoinBR, coinBobReverseStyle]}
            pointerEvents="none"
          >
            <GoldCoin size={28} rotation={28} />
          </Animated.View>

          {/* Stepped 3D Podium Pedestal Base under the wheel */}
          <View style={styles.podiumWrapper} pointerEvents="none">
            <PodiumBase width={230} />
            {/* Coins on podium base */}
            <View style={styles.podiumCoinLeft}>
              <GoldCoin size={22} rotation={-35} />
            </View>
            <View style={styles.podiumCoinRight}>
              <GoldCoin size={20} rotation={25} />
            </View>
          </View>

          {/* Wheel Assembly */}
          <View style={styles.wheelAssembly}>
            {/* Rotating Wheel graphic */}
            <Animated.View
              style={[
                { width: WHEEL_DIAMETER, height: WHEEL_DIAMETER },
                wheelAnimatedStyle,
              ]}
            >
              <Svg width={WHEEL_DIAMETER} height={WHEEL_DIAMETER}>
                <Defs>
                  {/* Metallic Gold Outer Ring Gradient */}
                  <SvgGradient id="wheelOuterGold" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor="#FFF9C4" />
                    <Stop offset="30%" stopColor="#FFD54F" />
                    <Stop offset="60%" stopColor="#FFB300" />
                    <Stop offset="100%" stopColor="#E65100" />
                  </SvgGradient>

                  {/* Inner Warm Ember Rim */}
                  <SvgGradient id="wheelInnerDark" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor="#3E1000" />
                    <Stop offset="100%" stopColor="#1B0400" />
                  </SvgGradient>

                  {/* Dynamic Slices Gradients */}
                  {prizes.map((p, i) => (
                    <SvgGradient
                      key={`slice-grad-${i}`}
                      id={`slice-grad-${i}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <Stop offset="0%" stopColor={p.color1} />
                      <Stop offset="100%" stopColor={p.color2} />
                    </SvgGradient>
                  ))}
                </Defs>

                {/* Outer Gold Ring */}
                <Circle
                  cx={RADIUS}
                  cy={RADIUS}
                  r={RADIUS}
                  fill="url(#wheelOuterGold)"
                />
                {/* Inner Warm Ember Rim */}
                <Circle
                  cx={RADIUS}
                  cy={RADIUS}
                  r={RADIUS - 5}
                  fill="url(#wheelInnerDark)"
                />

                {/* Wheel Slices */}
                {prizes.map((prize, i) => {
                  const sliceAngle = i * sliceAngleDeg;
                  const labelText = prize.wheelLabel || prize.label;
                  const badgeW = Math.min(
                    Math.max(54, labelText.length * 6.2 + 14),
                    82,
                  );
                  const badgeH = 17;
                  const badgeY = 25;

                  return (
                    <G
                      key={`slice-${i}`}
                      transform={`rotate(${sliceAngle}, ${RADIUS}, ${RADIUS})`}
                    >
                      <Path
                        d={singleWedgePath}
                        fill={`url(#slice-grad-${i})`}
                        stroke="#FFFFFF"
                        strokeWidth={1.4}
                      />
                      {/* Translucent pill label backing matching warm luxury theme */}
                      <Rect
                        x={RADIUS - badgeW / 2}
                        y={badgeY}
                        width={badgeW}
                        height={badgeH}
                        rx={badgeH / 2}
                        fill="rgba(32, 8, 0, 0.85)"
                        stroke="#FFE082"
                        strokeWidth={1}
                      />
                      <SvgText
                        x={RADIUS}
                        y={badgeY + 11.8}
                        fill="#FFFFFF"
                        fontSize={sliceCount > 6 ? '8.5' : '9.5'}
                        fontWeight="900"
                        textAnchor="middle"
                        letterSpacing="0.25"
                      >
                        {labelText}
                      </SvgText>
                    </G>
                  );
                })}

                {/* 24 Perimeter Glowing Bulbs */}
                {Array.from({ length: 24 }).map((_, i) => {
                  const angle = (i * 360) / 24;
                  const rad = (angle * Math.PI) / 180;
                  const dist = RADIUS - 6.5;
                  const bx = RADIUS + dist * Math.sin(rad);
                  const by = RADIUS - dist * Math.cos(rad);
                  const isWhite = i % 2 === 0;
                  return (
                    <G key={`bulb-${i}`}>
                      <Circle
                        cx={bx}
                        cy={by}
                        r={2.8}
                        fill={isWhite ? '#FFFFFF' : '#FFD54F'}
                      />
                      <Circle
                        cx={bx}
                        cy={by}
                        r={1.2}
                        fill={isWhite ? '#FFFDE7' : '#FFECB3'}
                      />
                    </G>
                  );
                })}

                {/* Center Hub Outer Ring */}
                <Circle
                  cx={RADIUS}
                  cy={RADIUS}
                  r={38}
                  fill="url(#wheelOuterGold)"
                />
                <Circle cx={RADIUS} cy={RADIUS} r={35} fill="#3E1000" />
              </Svg>
            </Animated.View>

            {/* Top Needle Pointer at 12 o'clock */}
            <Animated.View
              style={[styles.needleWrapper, pointerAnimatedStyle]}
              pointerEvents="none"
            >
              <Svg width={30} height={38} viewBox="0 0 32 40">
                <Defs>
                  <SvgGradient id="needleGoldGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor="#FFFDE7" />
                    <Stop offset="45%" stopColor="#FFC107" />
                    <Stop offset="100%" stopColor="#D97706" />
                  </SvgGradient>
                </Defs>
                <Polygon
                  points="16,38 4,10 28,10"
                  fill="url(#needleGoldGrad)"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                <Circle
                  cx="16"
                  cy="10"
                  r="7"
                  fill="#FFFDE7"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                <Circle cx="16" cy="10" r="3.5" fill="#F59E0B" />
              </Svg>
            </Animated.View>

            {/* Centerpiece: 3D Pearl-White & Gold Geometric Emblem */}
            <View style={styles.centerpieceContainer} pointerEvents="none">
              <WheelCenterEmblem size={74} />
            </View>
          </View>
        </View>

        {/* CTA "SPIN NOW" Button sitting below the podium */}
        <View
          style={[styles.ctaContainer, { paddingBottom: insets.bottom + 12 }]}
        >
          <TouchableOpacity
            style={styles.spinButtonOuter}
            onPress={handleSpinPress}
            disabled={isSpinning}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={['#FFA726', '#FF6D00', '#DD2C00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.spinButtonGradient}
            >
              {/* Top Gloss Highlight */}
              <View style={styles.spinButtonGlowRim} />
              <Text style={styles.spinButtonText}>
                {isSpinning ? 'SPINNING...' : 'SPIN NOW'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Won Prize Celebration Modal Sheet */}
        {showWinCelebration && wonPrize && (
          <View style={styles.celebrationOverlay}>
            <LinearGradient
              colors={['rgba(26, 6, 0, 0.95)', 'rgba(60, 15, 0, 0.98)']}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.celebrationCard}>
              <View
                style={[
                  styles.trophyIconContainer,
                  wonPrize.isNoPrize && styles.trophyIconContainerNoPrize,
                ]}
              >
                {wonPrize.isNoPrize ? (
                  <MaterialCommunityIcons
                    name="clover"
                    size={44}
                    color="#94A3B8"
                  />
                ) : (
                  <Ionicons name="gift" size={44} color="#FFD700" />
                )}
              </View>
              <Text
                style={[
                  styles.winBadgeText,
                  wonPrize.isNoPrize && styles.noPrizeBadgeText,
                ]}
              >
                {wonPrize.isNoPrize
                  ? 'BETTER LUCK NEXT TIME'
                  : 'CONGRATULATIONS!'}
              </Text>
              <Text style={styles.winTitleText}>
                {wonPrize.label || wonPrize.rewardName}
              </Text>
              {Boolean(wonPrize.description) && (
                <Text style={styles.winDescText}>{wonPrize.description}</Text>
              )}

              {/* Promo Code Pill */}
              {Boolean(wonPrize.code) && !wonPrize.isNoPrize && (
                <TouchableOpacity
                  style={styles.promoCodePill}
                  onPress={() => handleCopyCode(wonPrize.code)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.promoCodeLabel}>CODE:</Text>
                  <Text style={styles.promoCodeValue}>{wonPrize.code}</Text>
                  <MaterialCommunityIcons
                    name="content-copy"
                    size={16}
                    color="#FFD700"
                    style={{ marginLeft: 6 }}
                  />
                </TouchableOpacity>
              )}

              {/* Claim / Continue Button */}
              <TouchableOpacity
                style={styles.claimButton}
                onPress={handleClaimReward}
                activeOpacity={0.88}
              >
                <LinearGradient
                  colors={
                    wonPrize.isNoPrize
                      ? ['#475569', '#334155', '#1E293B']
                      : ['#FF9800', '#F57C00', '#E65100']
                  }
                  style={styles.claimButtonGradient}
                >
                  <Text style={styles.claimButtonText}>
                    {wonPrize.isNoPrize ? 'Continue' : 'Claim Reward'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

HomeWheelBottomSheetModal.displayName = 'HomeWheelBottomSheetModal';

export default HomeWheelBottomSheetModal;

const styles = StyleSheet.create({
  modalWrapper: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  bottomSheetBackground: {
    backgroundColor: '#2A0800',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  sheetContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  gradientBackdrop: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 18,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 48,
  },
  titleText: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitleText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.92)',
    marginTop: 3,
    letterSpacing: 0.2,
  },
  wheelStage: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 8,
    marginBottom: 38,
  },
  sunburstWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  floatingCoinTL: {
    position: 'absolute',
    top: 15,
    left: 20,
    zIndex: 10,
  },
  floatingCoinML: {
    position: 'absolute',
    top: 140,
    left: 12,
    zIndex: 10,
  },
  floatingCoinTR: {
    position: 'absolute',
    top: 12,
    right: 22,
    zIndex: 10,
  },
  floatingCoinMR: {
    position: 'absolute',
    top: 110,
    right: 14,
    zIndex: 10,
  },
  floatingCoinBR: {
    position: 'absolute',
    top: 180,
    right: 20,
    zIndex: 10,
  },
  podiumWrapper: {
    position: 'absolute',
    bottom: -32,
    zIndex: 4,
    alignItems: 'center',
  },
  podiumCoinLeft: {
    position: 'absolute',
    bottom: 8,
    left: 42,
  },
  podiumCoinRight: {
    position: 'absolute',
    bottom: 6,
    right: 48,
  },
  wheelAssembly: {
    width: WHEEL_DIAMETER,
    height: WHEEL_DIAMETER,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 5,
  },
  needleWrapper: {
    position: 'absolute',
    top: -16,
    zIndex: 25,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 8,
  },
  centerpieceContainer: {
    position: 'absolute',
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 10,
  },
  giftBoxImage: {
    width: 92,
    height: 92,
  },
  ctaContainer: {
    width: '100%',
    alignItems: 'center',
    zIndex: 20,
  },
  spinButtonOuter: {
    width: Math.min(SCREEN_WIDTH * 0.65, 240),
    height: 52,
    borderRadius: 26,
    shadowColor: '#FF6D00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 8,
  },
  spinButtonGradient: {
    flex: 1,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFE082', // Warm gold rim matching orange button
  },
  spinButtonGlowRim: {
    position: 'absolute',
    top: 2,
    left: 12,
    right: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  spinButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.1,
  },
  celebrationOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    padding: 24,
  },
  celebrationCard: {
    width: '90%',
    backgroundColor: '#2D0B00',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FBBF24',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 16,
  },
  trophyIconContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255, 215, 0, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#FFD700',
  },
  trophyIconContainerNoPrize: {
    backgroundColor: 'rgba(148, 163, 184, 0.18)',
    borderColor: '#94A3B8',
  },
  winBadgeText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  noPrizeBadgeText: {
    color: '#94A3B8',
  },
  winTitleText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  winDescText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  promoCodePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
    marginBottom: 20,
  },
  promoCodeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    marginRight: 6,
  },
  promoCodeValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1.2,
  },
  claimButton: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  claimButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
