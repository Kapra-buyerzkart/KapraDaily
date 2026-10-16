import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import {
  ActivityIndicator,
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
  LinearGradient as SvgGradient,
  Path,
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
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';
import { selectionTick, impactTick, successTick } from '@/utils/haptics';
import { FONTS } from '@/styles/typography';
import {
  isOrderSpinClaimed,
  getOrderSpinReward,
  markOrderSpinClaimed,
  checkSpinWinEligibility,
  playSpinWin,
  mapBackendRewardToPrize,
  extractCampaignAndRewards,
  selectWeightedRewardIndex,
  AssuredPrize,
} from '@/api/spinWheelService';

export type { AssuredPrize };

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// iOS-optimized responsive wheel sizing: avoids notch & tab bar vertical clipping
const WHEEL_SIZE = Math.min(Math.round(SCREEN_WIDTH * 0.76), 288);
const RADIUS = WHEEL_SIZE / 2;
// Overall spin duration (7.6s) calibrated for a smooth, readable speed and suspenseful deceleration
const SPIN_DURATION_MS = 7600;

// Dynamic slice wedge path generator (from 12 o'clock measured clockwise)
const getSlicePath = (index: number, angle: number) => {
  const startAngle = index * angle;
  const endAngle = (index + 1) * angle;
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;

  const startX = RADIUS + (RADIUS - 13) * Math.sin(startRad);
  const startY = RADIUS - (RADIUS - 13) * Math.cos(startRad);
  const endX = RADIUS + (RADIUS - 13) * Math.sin(endRad);
  const endY = RADIUS - (RADIUS - 13) * Math.cos(endRad);

  return `M${RADIUS},${RADIUS} L${startX.toFixed(2)},${startY.toFixed(2)} A${
    RADIUS - 13
  },${RADIUS - 13} 0 0 1 ${endX.toFixed(2)},${endY.toFixed(2)} Z`;
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
  startX: number;
  startY: number;
  size: number;
  aspect: number;
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

  const bulbCount =
    itemCount === 7
      ? 21
      : itemCount === 5
      ? 20
      : itemCount === 6
      ? 18
      : itemCount === 8
      ? 24
      : itemCount > 0
      ? itemCount * 3
      : 16;
  const bulbs = useMemo(() => {
    if (itemCount === 0) return [];
    return Array.from({ length: bulbCount }).map((_, i) => {
      const angle = (i * 360) / bulbCount;
      const rad = (angle * Math.PI) / 180;
      const dist = RADIUS - 7;
      return {
        x: RADIUS + dist * Math.sin(rad),
        y: RADIUS - dist * Math.cos(rad),
        isGold: i % 2 === 0,
      };
    });
  }, [bulbCount, itemCount]);

  const rotation = useSharedValue(0);
  const pointerAngle = useSharedValue(0);
  const hubScale = useSharedValue(1);

  const trophyScale = useSharedValue(0.5);
  const trophyGlow = useSharedValue(0.4);

  const accumulatedRotation = useRef(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<AssuredPrize | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [spinsCount, setSpinsCount] = useState(isOrderReward ? 1 : 3);

  const hapticTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearHapticTimeouts = () => {
    hapticTimeouts.current.forEach(t => clearTimeout(t));
    hapticTimeouts.current = [];
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
  }, [orderId, isOrderReward, orderNumber]);

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

    if (targetOrderId && prize) {
      markOrderSpinClaimed(targetOrderId, prize);
    }
  };

  const spin = async () => {
    if (isSpinning || spinsCount <= 0 || prizes.length === 0) return;

    clearHapticTimeouts();
    impactTick();
    setWonPrize(null);
    setIsSpinning(true);

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

    if (responseData) {
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

      const rewardObj =
        responseData.prize ||
        responseData.reward ||
        responseData.winningReward ||
        responseData.rewardSegment ||
        responseData.item ||
        (responseData.id ||
        responseData.code ||
        responseData.label ||
        responseData.title ||
        responseData.rewardName
          ? responseData
          : null);

      if (rewardObj) {
        const rCampaignItemId = String(rewardObj.campaignItemId ?? '').trim();
        const rId = String(
          rewardObj.id ??
            rewardObj.rewardId ??
            rewardObj.prizeId ??
            responseData.rewardId ??
            responseData.prizeId ??
            '',
        ).trim();
        const rCode = String(
          rewardObj.code ??
            rewardObj.couponCode ??
            rewardObj.promoCode ??
            responseData.code ??
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
          rewardObj.displayText ??
            rewardObj.sublabel ??
            rewardObj.discount ??
            '',
        )
          .trim()
          .toLowerCase();

        if (winningIndex === -1) {
          winningIndex = prizes.findIndex(p => {
            if (
              rCampaignItemId &&
              String(p.campaignItemId).trim() === rCampaignItemId
            )
              return true;
            if (
              rId &&
              (String(p.id).trim() === rId || String(p.rewardId).trim() === rId)
            )
              return true;
            if (
              rCode &&
              p.code &&
              String(p.code).trim().toLowerCase() === rCode
            )
              return true;
            if (
              rTitle &&
              ((p.rewardName &&
                String(p.rewardName).trim().toLowerCase() === rTitle) ||
                (p.label && String(p.label).trim().toLowerCase() === rTitle))
            )
              return true;
            if (
              rDisplay &&
              ((p.displayText &&
                String(p.displayText).trim().toLowerCase() === rDisplay) ||
                (p.sublabel &&
                  String(p.sublabel).trim().toLowerCase() === rDisplay))
            )
              return true;
            return false;
          });
        }

        if (winningIndex !== -1) {
          targetPrize = {
            ...prizes[winningIndex],
            ...mapBackendRewardToPrize(rewardObj, winningIndex),
          };
        } else {
          winningIndex = selectWeightedRewardIndex(prizes);
          targetPrize = mapBackendRewardToPrize(rewardObj, winningIndex);
        }
      }
    }

    if (winningIndex === -1 || !targetPrize) {
      winningIndex = selectWeightedRewardIndex(prizes);
      targetPrize = prizes[winningIndex];
    }

    const sliceCenter = winningIndex * sliceAngle + sliceAngle / 2;
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

    const fastTicks = Math.floor(3400 / 90);
    const slowTicks = Math.floor(4100 / 220);
    pointerAngle.value = withSequence(
      withRepeat(
        withSequence(
          withTiming(-12, { duration: 45, easing: Easing.linear }),
          withTiming(2, { duration: 45, easing: Easing.linear }),
        ),
        fastTicks,
        true,
      ),
      withRepeat(
        withSequence(
          withTiming(-7, { duration: 110, easing: Easing.out(Easing.quad) }),
          withTiming(2, { duration: 110, easing: Easing.in(Easing.quad) }),
        ),
        slowTicks,
        true,
      ),
      withSpring(0, { damping: 14, stiffness: 220 }),
    );

    rotation.value = withTiming(
      nextTarget,
      {
        duration: SPIN_DURATION_MS,
        easing: Easing.bezier(0.16, 0.88, 0.26, 1),
      },
      finished => {
        if (finished) {
          runOnJS(handleSpinEnd)(targetPrize, winningIndex);
        }
      },
    );
  };

  const copyCouponCode = (code: string) => {
    Clipboard.setString(code);
    impactTick();
    Toast.show(`Coupon code "${code}" copied!`, Toast.SHORT);
  };

  const handleClaimAndShop = () => {
    setShowModal(false);
    if (is48hr) {
      navigation.navigate('KshopeHome');
    } else {
      navigation.navigate('MainTabs');
    }
  };

  const handleTrackOrder = () => {
    setShowModal(false);
    if (orderId) {
      navigation.navigate('OrderTrackingScreen', { orderId });
    } else {
      navigation.navigate('MainTabs');
    }
  };

  const handleBackToHome = () => {
    setShowModal(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      }),
    );
  };

  const wheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const pointerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${pointerAngle.value}deg` }],
  }));

  const hubAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isSpinning ? 0.96 : hubScale.value }],
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Bulletproof iOS Absolute Background Gradient */}
      <LinearGradient
        colors={['#FFFFFF', '#FFF7ED', '#FFF3E0']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Ambient background glows */}
      <View style={styles.ambientGlowTop} />
      <View style={styles.ambientGlowCenter} />

      {/* Top Header with SafeArea Inset */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + (Platform.OS === 'ios' ? 4 : 8) },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.headerTitleBlock}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {campaignName || 'Spin & Win'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isOrderReward
              ? `Order #${orderNumber || orderId} Reward`
              : is48hr
              ? '48hrs Deals Assured Rewards'
              : 'Daily Assured Rewards'}
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
              color="#D97706"
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
                onPress={() => navigation.goBack()}
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
                    {isOrderReward ? 'Back to Order' : 'Go Back'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View
              style={[styles.guaranteeCard, is48hr && styles.guaranteeCard48hr]}
            >
              <LinearGradient
                colors={['#FFF7ED', '#FFEDD5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFillObject}
              />
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
                    color="#F25000"
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
                      {isOrderReward
                        ? 'Order Bonus: 1 Assured Gift'
                        : is48hr
                        ? '48hrs Deals 100% Assured Prize'
                        : '100% Assured Gift Guarantee'}
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
                        {isOrderReward
                          ? 'ORDER REWARD'
                          : is48hr
                          ? '48HR DEAL'
                          : 'NO EMPTY SPINS'}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.guaranteeSubtitle,
                      is48hr && styles.guaranteeSubtitle48hr,
                    ]}
                  >
                    {isOrderReward
                      ? 'Congratulations on your order! Spin now to claim your assured gift.'
                      : is48hr
                      ? 'Exclusive flash rewards and coupons unlocked with every single spin!'
                      : 'Every spin guarantees a real coupon, cashback, or free delivery!'}
                  </Text>
                </View>
              </View>
            </View>

            {/* The Wheel Stage */}
            <View style={styles.wheelStage}>
              {/* Outer Ambient Wheel Halo */}
              <View style={styles.outerWheelHalo} />

              {/* Pointer Flapper Needle (Fixed at 12 o'clock pointing down) */}
              <Animated.View style={[styles.pointerWrapper, pointerStyle]}>
                <Svg width={32} height={40} viewBox="0 0 36 44">
                  <Defs>
                    <SvgGradient id="needleGold" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0" stopColor="#F59E0B" />
                      <Stop offset="0.6" stopColor="#D97706" />
                      <Stop offset="1" stopColor="#B45309" />
                    </SvgGradient>
                  </Defs>
                  <Path
                    d="M18 42 L6 14 C4 9 8 2 18 2 C28 2 32 9 30 14 Z"
                    fill="url(#needleGold)"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                  <Circle
                    cx={18}
                    cy={14}
                    r={5}
                    fill="#EF4444"
                    stroke="#FFE4E6"
                    strokeWidth={1.5}
                  />
                </Svg>
              </Animated.View>

              {/* Rotating Wheel Container */}
              <View style={styles.wheelWrapper}>
                <Animated.View style={[styles.wheelContainer, wheelStyle]}>
                  <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
                    <Defs>
                      {prizes.map(prize => (
                        <SvgGradient
                          key={`grad-${prize.id}`}
                          id={`grad-${prize.id}`}
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <Stop offset="0" stopColor={prize.color1} />
                          <Stop offset="1" stopColor={prize.color2} />
                        </SvgGradient>
                      ))}

                      <SvgGradient id="rimGold" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor="#FBBF24" />
                        <Stop offset="0.5" stopColor="#F59E0B" />
                        <Stop offset="1" stopColor="#D97706" />
                      </SvgGradient>
                      <SvgGradient id="rimOrange" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor="#FF7A28" />
                        <Stop offset="0.5" stopColor="#F25000" />
                        <Stop offset="1" stopColor="#C2410C" />
                      </SvgGradient>
                    </Defs>

                    {/* Outer Ring Border */}
                    <Circle
                      cx={RADIUS}
                      cy={RADIUS}
                      r={RADIUS - 2}
                      fill="url(#rimGold)"
                    />
                    <Circle
                      cx={RADIUS}
                      cy={RADIUS}
                      r={RADIUS - 6}
                      fill="url(#rimOrange)"
                    />
                    <Circle
                      cx={RADIUS}
                      cy={RADIUS}
                      r={RADIUS - 12}
                      fill="#FFFFFF"
                    />

                    {/* Slices: responsive width and typography */}
                    {prizes.map((prize, index) => {
                      const sliceCenterAngle =
                        index * sliceAngle + sliceAngle / 2;
                      return (
                        <G key={prize.id}>
                          <Path
                            d={getSlicePath(index, sliceAngle)}
                            fill={`url(#grad-${prize.id})`}
                            stroke="#FFFFFF"
                            strokeWidth={itemCount <= 4 ? 2 : 1.5}
                          />

                          {/* Rotated text and sublabel */}
                          <G
                            transform={`rotate(${sliceCenterAngle}, ${RADIUS}, ${RADIUS})`}
                          >
                            <Rect
                              x={RADIUS - badgeWidth / 2}
                              y={badgeY}
                              width={badgeWidth}
                              height={badgeHeight}
                              rx={badgeHeight / 2}
                              fill="rgba(0, 0, 0, 0.22)"
                            />
                            <SvgText
                              x={RADIUS}
                              y={badgeY + badgeHeight * 0.72}
                              fill="#FFE082"
                              fontSize={sublabelFontSize}
                              fontWeight="800"
                              textAnchor="middle"
                              letterSpacing="0.3"
                            >
                              {prize.sublabel}
                            </SvgText>

                            {prize.titleLine2 ? (
                              <>
                                <SvgText
                                  x={RADIUS}
                                  y={titleY - 4.5}
                                  fill={prize.textColor}
                                  fontSize={titleFontSize}
                                  fontWeight="900"
                                  textAnchor="middle"
                                  letterSpacing="0.2"
                                >
                                  {prize.titleLine1}
                                </SvgText>
                                <SvgText
                                  x={RADIUS}
                                  y={titleY + titleFontSize - 1.5}
                                  fill={prize.textColor}
                                  fontSize={titleFontSize}
                                  fontWeight="900"
                                  textAnchor="middle"
                                  letterSpacing="0.2"
                                >
                                  {prize.titleLine2}
                                </SvgText>
                              </>
                            ) : (
                              <SvgText
                                x={RADIUS}
                                y={titleY}
                                fill={prize.textColor}
                                fontSize={titleFontSize}
                                fontWeight="900"
                                textAnchor="middle"
                                letterSpacing="0.2"
                              >
                                {prize.titleLine1 ||
                                  prize.wheelLabel ||
                                  prize.label}
                              </SvgText>
                            )}
                          </G>
                        </G>
                      );
                    })}

                    {/* Perimeter Bulb Pins */}
                    {bulbs.map((bulb, idx) => (
                      <Circle
                        key={`bulb-${idx}`}
                        cx={bulb.x}
                        cy={bulb.y}
                        r={3}
                        fill={bulb.isGold ? '#FDE68A' : '#FFD8A8'}
                        stroke={bulb.isGold ? '#D97706' : '#EA580C'}
                        strokeWidth={0.8}
                      />
                    ))}
                  </Svg>
                </Animated.View>

                {/* Center Elevated Hub "SPIN" Button (iOS Bulletproof) */}
                <Animated.View
                  style={[styles.centerHubContainer, hubAnimatedStyle]}
                >
                  <TouchableOpacity
                    onPress={spin}
                    disabled={isSpinning || spinsCount <= 0}
                    activeOpacity={0.85}
                    style={styles.hubTouchable}
                    accessibilityRole="button"
                    accessibilityLabel="Spin the wheel"
                  >
                    <View style={styles.hubBezel}>
                      <LinearGradient
                        colors={['#FFFBEB', '#FDE68A', '#F59E0B']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFillObject}
                      />
                      <View style={styles.hubCore}>
                        <LinearGradient
                          colors={
                            spinsCount <= 0
                              ? ['#94A3B8', '#64748B']
                              : ['#FF6200', '#F25000']
                          }
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={StyleSheet.absoluteFillObject}
                        />
                        <View style={styles.hubCoreContent}>
                          <MaterialCommunityIcons
                            name={isSpinning ? 'sync' : 'auto-fix'}
                            size={14}
                            color="#FFE082"
                          />
                          <Text style={styles.hubSpinnerText}>
                            {isSpinning ? '...' : 'SPIN'}
                          </Text>
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
                      ? 'FINDING YOUR ASSURED GIFT...'
                      : spinsCount <= 0
                      ? 'NO SPINS LEFT TODAY'
                      : 'SPIN THE LUCKY WHEEL'}
                  </Text>
                </View>
              </TouchableOpacity>

              <Text style={styles.turnsNotice}>
                🎯 100% Guaranteed reward credited straight to your account
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
                      ? ['#F8FAFC', '#F1F5F9', '#E2E8F0']
                      : ['#FFF8F5', '#FFF1EB', '#FFE4D6']
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

                  {!wonPrize.isNoPrize && wonPrize.code ? (
                    <View style={styles.wonCardCodeRow}>
                      <View style={styles.wonCardCodeBox}>
                        <Text style={styles.wonCardCodeLabel}>COUPON CODE</Text>
                        <Text style={styles.wonCardCodeVal}>
                          {wonPrize.code}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => copyCouponCode(wonPrize.code)}
                        style={styles.wonCardCopyBtn}
                        activeOpacity={0.75}
                      >
                        <Ionicons
                          name="copy-outline"
                          size={13}
                          color="#F25000"
                        />
                        <Text style={styles.wonCardCopyBtnText}>COPY CODE</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              </View>
            ) : null}

            {/* Assured Gifts Showcase Section */}
            <View style={styles.prizesSection}>
              <View style={styles.sectionHeaderRow}>
                <MaterialCommunityIcons
                  name={is48hr ? 'lightning-bolt' : 'gift-open-outline'}
                  size={17}
                  color="#F25000"
                />
                <Text style={styles.sectionTitle}>
                  Today’s {prizes.length} Assured Gifts
                </Text>
              </View>
              <Text style={styles.sectionSubtitle}>
                Every single turn gives you one of these valuable coupons:
              </Text>

              <View style={styles.prizesGrid}>
                {prizes.map(prize => (
                  <View key={prize.id} style={styles.prizeMiniCard}>
                    <View
                      style={[
                        styles.miniCardIconCircle,
                        { backgroundColor: `${prize.color1}18` },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={prize.iconName}
                        size={15}
                        color={prize.color1}
                      />
                    </View>
                    <View style={styles.miniCardInfo}>
                      <Text style={styles.miniCardTitle} numberOfLines={1}>
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
          </>
        )}
      </ScrollView>

      {/* Celebratory Winner Modal (iOS Bulletproof Design with 60FPS Confetti Motion) */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
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
                    onPress={() => setShowModal(false)}
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
                          : isOrderReward
                          ? 'ASSURED ORDER REWARD'
                          : '100% ASSURED GIFT WON'}
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
                          {isNoPrize
                            ? 'NO PRIZE'
                            : wonPrize?.badge || 'ASSURED REWARD'}
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
                      {wonPrize?.rewardName ||
                        wonPrize?.label ||
                        'Better Luck Next Time'}
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

                    {/* Coupon Code Strip */}
                    {!isNoPrize && wonPrize?.code ? (
                      <View style={styles.couponStrip}>
                        <View style={styles.couponCodeCol}>
                          <Text style={styles.couponCodeLabel}>
                            COUPON CODE
                          </Text>
                          <Text style={styles.couponCodeText}>
                            {wonPrize?.code}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() =>
                            wonPrize && copyCouponCode(wonPrize.code)
                          }
                          style={styles.copyCodeButton}
                          activeOpacity={0.75}
                        >
                          <Ionicons
                            name="copy-outline"
                            size={13}
                            color="#F25000"
                          />
                          <Text style={styles.copyCodeText}>COPY</Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>

                  {/* Action Buttons */}
                  {isOrderReward ? (
                    <View style={styles.orderActionsCol}>
                      <TouchableOpacity
                        onPress={handleTrackOrder}
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
                            size={16}
                            color="#FFFFFF"
                          />
                          <Text style={styles.claimButtonText}>
                            Track Order
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={handleBackToHome}
                        style={styles.homeResetBtn}
                        activeOpacity={0.75}
                      >
                        <Ionicons
                          name="home-outline"
                          size={15}
                          color="#F25000"
                        />
                        <Text style={styles.homeResetBtnText}>
                          Back to Home
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <TouchableOpacity
                        onPress={handleClaimAndShop}
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
                          <Text style={styles.claimButtonText}>
                            Claim & Shop Now
                          </Text>
                          <Ionicons
                            name="arrow-forward"
                            size={15}
                            color="#FFFFFF"
                          />
                        </View>
                      </TouchableOpacity>

                      {spinsCount > 0 ? (
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
                    </>
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>

            {/* Motion Graphics Full-Screen Confetti Shower */}
            {showModal && !isNoPrize ? (
              <View style={styles.confettiOverlay} pointerEvents="none">
                {CONFETTI_PIECES.map(p => (
                  <ConfettiPiece key={p.id} piece={p} active={showModal} />
                ))}
              </View>
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
    backgroundColor: '#FFFFFF',
  },
  ambientGlowTop: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(12, 162, 1, 0.08)',
  },
  ambientGlowCenter: {
    position: 'absolute',
    top: SCREEN_WIDTH * 0.65,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleBlock: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontFamily: FONTS.gilroy?.bold || 'System',
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    color: '#F25000',
    fontSize: 11,
    fontFamily: FONTS.gilroy?.medium || 'System',
    marginTop: 1,
  },
  spinsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
  },
  spinsBadgeText: {
    color: '#92400E',
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
    borderColor: '#FED7AA',
    backgroundColor: '#FFF7ED',
    shadowColor: '#F25000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 12,
    position: 'relative',
  },
  guaranteeCard48hr: {
    borderColor: '#FFD79E',
    backgroundColor: '#FFF7ED',
    shadowColor: '#F25000',
  },
  guaranteeInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 13,
    gap: 11,
    zIndex: 2,
  },
  shieldIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldIconWrapper48hr: {
    backgroundColor: '#FFEDD5',
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
    color: '#9A3412',
  },
  guaranteeHeading48hr: {
    color: '#C2410C',
  },
  guaranteePill: {
    backgroundColor: '#F25000',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  guaranteePill48hr: {
    backgroundColor: '#FFD79E',
  },
  guaranteePillText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  guaranteePillText48hr: {
    color: '#9A3412',
  },
  guaranteeSubtitle: {
    fontSize: 10.5,
    color: '#C2410C',
    marginTop: 2,
    lineHeight: 14,
  },
  guaranteeSubtitle48hr: {
    color: '#9A3412',
  },
  wheelStage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    position: 'relative',
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
  },
  wheelContainer: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
  },
  pointerWrapper: {
    position: 'absolute',
    top: -15,
    zIndex: 30,
    alignItems: 'center',
  },
  centerHubContainer: {
    position: 'absolute',
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 25,
  },
  hubTouchable: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubBezel: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
  },
  hubCore: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F25000',
  },
  hubCoreContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  hubSpinnerText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginTop: 1,
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
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  prizesSection: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginTop: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
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
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 10,
  },
  prizesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  prizeMiniCard: {
    width: (SCREEN_WIDTH - 32 - 28 - 8) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#F8FAFC',
    borderRadius: 11,
    padding: 7,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  miniCardIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCardInfo: {
    flex: 1,
  },
  miniCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E293B',
  },
  miniCardBadge: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 1,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
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
    backgroundColor: '#FFFFFF',
  },
  voucherCard: {
    width: '100%',
    backgroundColor: '#FFF7ED',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  voucherCardNoPrize: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
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
    color: '#C2410C',
    fontWeight: '700',
  },
  voucherPrizeTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#9A3412',
    marginTop: 2,
  },
  voucherPrizeTitleNoPrize: {
    color: '#1E293B',
  },
  noPrizeModalTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
  },
  noPrizeModalTipText: {
    flex: 1,
    fontSize: 11,
    color: '#475569',
    lineHeight: 15,
  },
  voucherValueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  voucherValueText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#C2410C',
  },
  voucherPrizeDesc: {
    fontSize: 11,
    color: '#475569',
    marginTop: 4,
    lineHeight: 15,
  },
  redemptionBox: {
    width: '100%',
    backgroundColor: '#FEFCE8',
    borderWidth: 1,
    borderColor: '#FEF08A',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  redemptionTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#854D0E',
    marginBottom: 2,
  },
  redemptionText: {
    fontSize: 10,
    color: '#713F12',
    lineHeight: 14,
  },
  couponStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FED7AA',
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
    color: '#64748B',
    letterSpacing: 0.3,
  },
  couponCodeText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.7,
    marginTop: 1,
  },
  copyCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 7,
  },
  copyCodeText: {
    color: '#F25000',
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
    color: '#64748B',
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
    borderColor: '#F25000',
    backgroundColor: '#FFF7ED',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  homeResetBtnText: {
    color: '#F25000',
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
    color: '#64748B',
    fontFamily: FONTS.gilroy?.medium || 'System',
  },
  emptyContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIconCircle48hr: {
    backgroundColor: '#FFF7ED',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: FONTS.gilroy?.bold || 'System',
  },
  emptyDescription: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#64748B',
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
    borderColor: '#F25000',
    backgroundColor: '#FFF7ED',
  },
  emptyRetryText: {
    color: '#F25000',
    fontSize: 14,
    fontWeight: '800',
    fontFamily: FONTS.gilroy?.bold || 'System',
  },
  spinsBadgeEmpty: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  spinsBadgeTextEmpty: {
    color: '#64748B',
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
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  wonCardPrize: {
    borderColor: '#FFD3BE',
    backgroundColor: '#FFF8F5',
  },
  wonCardNoPrize: {
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
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
    color: '#C2410C',
    fontWeight: '700',
  },
  wonCardPrizeName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1E293B',
    fontFamily: FONTS.gilroy?.bold || 'System',
  },
  wonCardDesc: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 10,
    fontFamily: FONTS.gilroy?.regular || 'System',
  },
  wonCardCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#FED7AA',
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
    color: '#F25000',
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
    backgroundColor: '#FFF7ED',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#F25000',
  },
  wonCardCopyBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F25000',
    fontFamily: FONTS.gilroy?.bold || 'System',
  },
});
