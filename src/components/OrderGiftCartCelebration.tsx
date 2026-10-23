import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  BackHandler,
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
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
  RadialGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FONTS } from '../styles/typography';
import { impactTick, selectionTick, successTick } from '../utils/haptics';
import {
  isOrderSpinClaimed,
  isOnboardingSpinClaimed,
  getOnboardingSpinReward,
  resetOnboardingSpinClaim,
  extractCampaignAndRewards,
  mapBackendRewardToPrize,
  REWARD_PALETTES,
  AssuredPrize,
} from '../api/spinWheelService';
import COLORS from '@/styles/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 240px wheel diameter: optimal responsive fit across all iPhones and Android devices
const DUMMY_WHEEL_SIZE = Math.min(Math.round(SCREEN_WIDTH * 0.68), 240);
const DUMMY_RADIUS = DUMMY_WHEEL_SIZE / 2;

interface OrderGiftCartCelebrationProps {
  mode?: 'order' | 'onboarding';
  isNewRegistration?: boolean;
  orderId?: string | number | null;
  orderNumber?: string | number | null;
  visible?: boolean;
  visibilityData?: any;
  prizes?: AssuredPrize[];
  onComplete: () => void;
  onTrackOrder?: () => void;
  onSkip?: () => void;
}

const OrderGiftCartCelebration: React.FC<OrderGiftCartCelebrationProps> = ({
  mode = 'order',
  isNewRegistration = false,
  orderId,
  orderNumber,
  visible: controlledVisible,
  visibilityData,
  prizes: propPrizes,
  onComplete,
  onTrackOrder,
  onSkip,
}) => {
  const insets = useSafeAreaInsets();
  const isOnboarding = mode === 'onboarding';
  const isControlled = controlledVisible !== undefined;
  const [internalVisible, setInternalVisible] = useState(false);
  const visible = isControlled ? Boolean(controlledVisible) : internalVisible;
  const setVisible = isControlled ? () => {} : setInternalVisible;
  const [stage, setStage] = useState<'cart' | 'wheel' | 'ready'>('cart');
  const [statusTitle, setStatusTitle] = useState(
    isOnboarding ? '🎁 Welcome Gift Arriving!' : '🎁 Order Gift Arriving!',
  );
  const [statusSubtitle, setStatusSubtitle] = useState(
    isOnboarding
      ? 'Welcome to KapraDaily! A special surprise is rolling in...'
      : 'Unpacking your mystery order reward...',
  );
  const hasTriggeredRef = useRef(false);
  const cartArrivedRef = useRef(false);
  const spinCompleteRef = useRef(false);

  // Animation values
  const backdropOpacity = useSharedValue(0);
  const cartTranslateX = useSharedValue(SCREEN_WIDTH + 100);
  const cartScale = useSharedValue(0.9);
  const cartOpacity = useSharedValue(1);
  const wheelSpin = useSharedValue(0);
  const giftLidY = useSharedValue(0);

  const wheelScale = useSharedValue(0);
  const wheelOpacity = useSharedValue(0);
  const dummyWheelRotation = useSharedValue(0);
  const needleWobble = useSharedValue(0);
  const pulseGlow = useSharedValue(1);
  const buttonEntrance = useSharedValue(0);

  // Check eligibility on mount if not controlled, then trigger after ~800ms delay
  useEffect(() => {
    if (isControlled) return;
    let active = true;
    const targetId = orderId || orderNumber;

    const verifyAndStart = async () => {
      if (hasTriggeredRef.current) return;

      if (isOnboarding) {
        try {
          if (isNewRegistration || __DEV__) {
            await resetOnboardingSpinClaim();
          }
          const claimed = await isOnboardingSpinClaimed();
          if (claimed || !active) {
            return;
          }
        } catch {
          // Ignore check errors
        }
      } else if (targetId) {
        try {
          const claimed = await isOrderSpinClaimed(targetId);
          if (claimed || !active) return;
        } catch {
          // Ignore check errors
        }
      }

      const timer = setTimeout(() => {
        if (!active || hasTriggeredRef.current) return;
        hasTriggeredRef.current = true;
        setVisible(true);
      }, 800);

      return () => clearTimeout(timer);
    };

    verifyAndStart();

    return () => {
      active = false;
    };
  }, [orderId, orderNumber, isOnboarding, isNewRegistration, isControlled, setVisible]);

  // When modal becomes visible, wait for native Android window attachment before driving Reanimated animations
  useEffect(() => {
    if (!visible) return;

    const delay = Platform.OS === 'android' ? 100 : 40;
    const animTimer = setTimeout(() => {
      startCelebration();
    }, delay);

    return () => clearTimeout(animTimer);
  }, [visible]);

  // Hardware back press handler on Android
  useEffect(() => {
    if (!visible) return;

    const onHardwareBack = () => {
      handleGoToTracking();
      return true;
    };

    const backSub = BackHandler.addEventListener(
      'hardwareBackPress',
      onHardwareBack,
    );
    return () => backSub.remove();
  }, [visible, onTrackOrder]);

  // Phase 1: Cart drives in from right to center
  const startCelebration = () => {
    backdropOpacity.value = withTiming(1, { duration: 400 });

    pulseGlow.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    // Cart wheels rotate as cart drives in
    wheelSpin.value = withTiming(1080, {
      duration: 1800,
      easing: Easing.out(Easing.cubic),
    });

    cartTranslateX.value = withTiming(
      0,
      {
        duration: 1800,
        easing: Easing.out(Easing.cubic),
      },
      finished => {
        if (finished) {
          runOnJS(handleCartArrived)();
        }
      },
    );

    // Safety fallback for Android: ensure arrival executes even if frame drops cancel Reanimated callback
    setTimeout(() => {
      handleCartArrived();
    }, 2000);
  };

  const handleCartArrived = () => {
    if (cartArrivedRef.current) return;
    cartArrivedRef.current = true;
    impactTick();
    setStatusTitle(
      isOnboarding ? 'Welcome to KapraDaily!' : 'Special Gift Unlocked!',
    );
    setStatusSubtitle(
      isOnboarding
        ? 'Unboxing your exclusive welcome reward...'
        : 'Unboxing your exclusive lucky prize...',
    );

    // Cart settles with spring
    cartScale.value = withSequence(
      withSpring(1.06, { damping: 12, stiffness: 140 }),
      withSpring(1.0, { damping: 16, stiffness: 150 }),
    );

    // Gift lid pops open
    giftLidY.value = withSpring(-24, { damping: 10, stiffness: 150 });

    // Transition from Cart to Wheel after lid opens
    setTimeout(() => {
      transitionCartToWheel();
    }, 700);
  };

  // Phase 2: Cart smoothly dissolves & Dummy Wheel springs into center stage
  const transitionCartToWheel = () => {
    // Fade out cart
    cartOpacity.value = withTiming(0, { duration: 350 });
    cartScale.value = withTiming(0.6, { duration: 350 });

    setStage('wheel');
    setStatusTitle(
      isOnboarding
        ? 'Spinning Welcome Preview...'
        : 'Spinning Preview Wheel...',
    );
    setStatusSubtitle(
      isOnboarding
        ? 'Unlocking your lucky welcome wheel!'
        : 'Calibrating your lucky reward pool!',
    );

    // Bring in the wheel
    wheelOpacity.value = withTiming(1, { duration: 400 });
    wheelScale.value = withSpring(1, { damping: 13, stiffness: 130 });

    // Needle wobbles as wheel spins
    needleWobble.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 110, easing: Easing.linear }),
        withTiming(10, { duration: 110, easing: Easing.linear }),
      ),
      14,
      true,
    );

    // Dummy wheel spin animation (3200ms smooth deceleration)
    dummyWheelRotation.value = withTiming(
      1440,
      {
        duration: 3200,
        easing: Easing.out(Easing.cubic),
      },
      finished => {
        if (finished) {
          runOnJS(handleSpinComplete)();
        }
      },
    );

    // Safety fallback for Android: ensure spin completion fires reliably
    setTimeout(() => {
      handleSpinComplete();
    }, 3400);
  };

  // Phase 3: Wheel settles, choice buttons display
  const handleSpinComplete = () => {
    if (spinCompleteRef.current) return;
    spinCompleteRef.current = true;
    successTick();
    setStage('ready');
    setStatusTitle(
      isOnboarding ? '🎉 Welcome Spin Unlocked!' : '🎉 Lucky Spin Unlocked!',
    );
    setStatusSubtitle(
      isOnboarding
        ? '1 Free Guaranteed Welcome Spin Ready to Claim!'
        : 'Choose an option below to proceed:',
    );

    buttonEntrance.value = withSpring(1, { damping: 14, stiffness: 140 });
  };

  const handleProceedToRealSpinner = () => {
    impactTick();
    setVisible(false);
    onComplete();
  };

  const handleGoToTracking = () => {
    impactTick();
    setVisible(false);
    if (typeof onTrackOrder === 'function') {
      onTrackOrder();
    } else if (typeof onSkip === 'function') {
      onSkip();
    }
  };

  // Animated Styles
  const backdropAnimStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const cartContainerAnimStyle = useAnimatedStyle(() => ({
    opacity: cartOpacity.value,
    transform: [
      { translateX: cartTranslateX.value },
      { scale: cartScale.value },
    ],
  }));

  const cartWheelAnimStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${wheelSpin.value}deg` }],
  }));

  const giftLidAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: giftLidY.value }],
  }));

  const wheelStageAnimStyle = useAnimatedStyle(() => ({
    opacity: wheelOpacity.value,
    transform: [{ scale: wheelScale.value }],
  }));

  const dummyWheelRotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${dummyWheelRotation.value}deg` }],
  }));

  const needleAnimStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${needleWobble.value}deg` }],
  }));

  const glowAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseGlow.value }],
  }));

  const actionGroupAnimStyle = useAnimatedStyle(() => ({
    opacity: stage === 'ready' ? buttonEntrance.value : 0,
    transform: [
      {
        translateY: stage === 'ready' ? withSpring(0) : 20,
      },
    ],
  }));

  const activeSlices = useMemo(() => {
    if (propPrizes && Array.isArray(propPrizes) && propPrizes.length >= 3) {
      return propPrizes.map((p, idx) => {
        const pal = REWARD_PALETTES[idx % REWARD_PALETTES.length];
        return {
          label: p.wheelLabel || p.label || p.rewardName || 'REWARD',
          bg1: p.color1 || pal.color1,
          bg2: p.color2 || pal.color2,
        };
      });
    }

    if (visibilityData) {
      const extracted = extractCampaignAndRewards(visibilityData);
      if (Array.isArray(extracted.rewards) && extracted.rewards.length >= 3) {
        return extracted.rewards.map((item: any, idx: number) => {
          const p = mapBackendRewardToPrize(item, idx);
          const pal = REWARD_PALETTES[idx % REWARD_PALETTES.length];
          return {
            label: p.wheelLabel || p.label || p.rewardName || 'REWARD',
            bg1: p.color1 || pal.color1,
            bg2: p.color2 || pal.color2,
          };
        });
      }
    }

    // Fully rely on backend data; do NOT show any dummy fallback data
    return [];
  }, [propPrizes, visibilityData]);

  // If the rewards are less than 3, do not show the celebration spin wheel flow
  useEffect(() => {
    if (visible && activeSlices.length < 3) {
      console.log(
        `[OrderGiftCartCelebration] Rewards count (${activeSlices.length}) < 3; skipping celebration flow.`,
      );
      if (typeof onSkip === 'function') {
        onSkip();
      } else if (typeof onComplete === 'function') {
        onComplete();
      }
    }
  }, [visible, activeSlices.length, onSkip, onComplete]);

  if (!visible || activeSlices.length < 3) {
    return null;
  }

  // Pre-calculate single wedge path at 12 o'clock centered around (DUMMY_RADIUS, DUMMY_RADIUS)
  const sliceCount = activeSlices.length;
  const sliceAngleDeg = sliceCount > 0 ? 360 / sliceCount : 45;
  const halfAngleRad = ((sliceAngleDeg / 2) * Math.PI) / 180;
  const wedgeRadius = DUMMY_RADIUS - 8;
  const wx1 = DUMMY_RADIUS + wedgeRadius * Math.sin(-halfAngleRad);
  const wy1 = DUMMY_RADIUS - wedgeRadius * Math.cos(-halfAngleRad);
  const wx2 = DUMMY_RADIUS + wedgeRadius * Math.sin(halfAngleRad);
  const wy2 = DUMMY_RADIUS - wedgeRadius * Math.cos(halfAngleRad);
  const singleWedgePath = `M ${DUMMY_RADIUS} ${DUMMY_RADIUS} L ${wx1.toFixed(
    2,
  )} ${wy1.toFixed(2)} A ${wedgeRadius} ${wedgeRadius} 0 0 1 ${wx2.toFixed(
    2,
  )} ${wy2.toFixed(2)} Z`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleGoToTracking}
    >
      <View style={styles.modalRoot}>
        {/* Solid Rich Dark Backdrop (no background order summary bleed-through) */}
        <Animated.View style={[styles.backdrop, backdropAnimStyle]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={handleGoToTracking}
          />
        </Animated.View>

        {/* Seamless Radial Ambient Glow (no harsh circular edges) */}
        <Animated.View
          style={[styles.ambientGlowContainer, glowAnimStyle]}
          pointerEvents="none"
        >
          <Svg width={SCREEN_WIDTH} height={SCREEN_WIDTH} viewBox="0 0 400 400">
            <Defs>
              <RadialGradient id="ambientHalo" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="#F25000" stopOpacity="0.32" />
                <Stop offset="35%" stopColor="#FF7A28" stopOpacity="0.16" />
                <Stop offset="65%" stopColor="#FFA000" stopOpacity="0.05" />
                <Stop offset="100%" stopColor="#0A0C10" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx="200" cy="200" r="200" fill="url(#ambientHalo)" />
          </Svg>
        </Animated.View>

        {/* Top Controls with Safe Area Awareness */}
        <View
          style={[
            styles.topBar,
            {
              top: Math.max(insets.top, Platform.OS === 'ios' ? 44 : 20) + 8,
              paddingHorizontal: 20,
            },
          ]}
        >
          <View style={styles.tagPillContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: COLORS.primary,
                padding: 10,
                borderRadius: 16,
              }}
            >
              <MaterialCommunityIcons
                name="gift-outline"
                size={14}
                color="#FFFFFF"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.tagPillText} numberOfLines={1}>
                {isOnboarding ? 'WELCOME BONUS' : 'ORDER BONUS'}
              </Text>
            </View>
          </View>

          {/* Quick Dismiss Button */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleGoToTracking}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.skipText}>
              {isOnboarding ? 'Skip' : 'Track Order'}
            </Text>
            <Ionicons
              name="close"
              size={15}
              color="#FFFFFF"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>

        {/* Main Center Stage */}
        <View style={styles.stageContainer}>
          {/* STAGE A: CART ARRIVAL (Visible during cart stage only) */}
          {stage === 'cart' && (
            <Animated.View
              style={[styles.cartStageWrapper, cartContainerAnimStyle]}
            >
              <View style={styles.giftBoxContainer}>
                {/* Gift Box Lid */}
                <Animated.View style={[styles.giftLid, giftLidAnimStyle]}>
                  <LinearGradient
                    colors={['#FFD54F', '#FFA000', '#FF6F00']}
                    style={styles.lidGradient}
                  >
                    <View style={styles.lidRibbon} />
                  </LinearGradient>
                </Animated.View>

                {/* Gift Box Body */}
                <LinearGradient
                  colors={['#FF8F00', '#E65100', '#BF360C']}
                  style={styles.boxBody}
                >
                  <View style={styles.boxVerticalRibbon} />
                  <View style={styles.boxHorizontalRibbon} />
                  <Ionicons
                    name="sparkles"
                    size={16}
                    color="#FFE082"
                    style={styles.sparkleIcon}
                  />
                </LinearGradient>
              </View>

              {/* Shopping Cart Body */}
              <View style={styles.cartSvgContainer}>
                <Svg width={140} height={90} viewBox="0 0 140 90">
                  <Defs>
                    <SvgGradient id="cartGrad" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0%" stopColor="#FFFFFF" />
                      <Stop offset="100%" stopColor="#FFE0B2" />
                    </SvgGradient>
                  </Defs>
                  {/* Handle & Rim */}
                  <Path
                    d="M 12 18 L 30 18 L 45 52 L 105 52 L 118 24 L 34 24"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Basket Grids */}
                  <Path
                    d="M 45 32 L 112 32 M 48 42 L 108 42 M 65 24 L 62 52 M 85 24 L 82 52 M 102 24 L 98 52"
                    fill="none"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {/* Chassis */}
                  <Path
                    d="M 45 52 L 50 64 L 102 64"
                    fill="none"
                    stroke="#FFB74D"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </Svg>

                {/* Rear Wheel */}
                <Animated.View
                  style={[styles.cartWheelRear, cartWheelAnimStyle]}
                >
                  <Svg width={22} height={22} viewBox="0 0 22 22">
                    <Circle
                      cx="11"
                      cy="11"
                      r="9"
                      fill="#212121"
                      stroke="#FFB74D"
                      strokeWidth="2"
                    />
                    <Circle cx="11" cy="11" r="4" fill="#FF7043" />
                    <Path
                      d="M 11 2 L 11 20 M 2 11 L 20 11"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  </Svg>
                </Animated.View>

                {/* Front Wheel */}
                <Animated.View
                  style={[styles.cartWheelFront, cartWheelAnimStyle]}
                >
                  <Svg width={22} height={22} viewBox="0 0 22 22">
                    <Circle
                      cx="11"
                      cy="11"
                      r="9"
                      fill="#212121"
                      stroke="#FFB74D"
                      strokeWidth="2"
                    />
                    <Circle cx="11" cy="11" r="4" fill="#FF7043" />
                    <Path
                      d="M 11 2 L 11 20 M 2 11 L 20 11"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  </Svg>
                </Animated.View>
              </View>
            </Animated.View>
          )}

          {/* STAGE B: DUMMY SPINNER WHEEL (Replaces cart, perfectly centered) */}
          {(stage === 'wheel' || stage === 'ready') && (
            <Animated.View
              style={[styles.wheelStageWrapper, wheelStageAnimStyle]}
            >
              {/* Needle Pointer at 12 o'clock */}
              <Animated.View style={[styles.needleAnchor, needleAnimStyle]}>
                <Svg width={32} height={42} viewBox="0 0 36 44">
                  <Defs>
                    <SvgGradient
                      id="needleGoldGrad"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <Stop offset="0%" stopColor="#FFF59D" />
                      <Stop offset="45%" stopColor="#F59E0B" />
                      <Stop offset="100%" stopColor="#B45309" />
                    </SvgGradient>
                  </Defs>
                  <Path
                    d="M18 43 L5 15 C3 9 7 2 18 2 C29 2 33 9 31 15 Z"
                    fill="url(#needleGoldGrad)"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                  <Circle
                    cx={18}
                    cy={15}
                    r={5.5}
                    fill="#E11D48"
                    stroke="#FFE4E6"
                    strokeWidth={1.5}
                  />
                  <Circle cx={16.5} cy={13.5} r={1.5} fill="#FFFFFF" />
                </Svg>
              </Animated.View>

              {/* Rotating Wheel Graphic */}
              <Animated.View
                style={[styles.wheelContainer, dummyWheelRotationStyle]}
              >
                <Svg width={DUMMY_WHEEL_SIZE} height={DUMMY_WHEEL_SIZE}>
                  <Defs>
                    {/* Metallic Gold Outer Rim Gradient */}
                    <SvgGradient id="wheelRimGold" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0%" stopColor="#FFE082" />
                      <Stop offset="30%" stopColor="#FFC107" />
                      <Stop offset="70%" stopColor="#FF9800" />
                      <Stop offset="100%" stopColor="#E65100" />
                    </SvgGradient>

                    {/* Dark Inner Trim Ring */}
                    <SvgGradient id="innerRimDark" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0%" stopColor="#2A1404" />
                      <Stop offset="100%" stopColor="#120600" />
                    </SvgGradient>

                    {/* Metallic Gold Hub Gradient */}
                    <SvgGradient id="hubRimGold" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0%" stopColor="#FFF59D" />
                      <Stop offset="50%" stopColor="#FFB300" />
                      <Stop offset="100%" stopColor="#E65100" />
                    </SvgGradient>

                    {/* Dynamic Slice Gradient Definitions */}
                    {activeSlices.map((slice, i) => (
                      <SvgGradient
                        key={`sliceGrad-${i}`}
                        id={`sliceGrad-${i}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <Stop offset="0%" stopColor={slice.bg1} />
                        <Stop offset="100%" stopColor={slice.bg2} />
                      </SvgGradient>
                    ))}
                  </Defs>

                  {/* Outer Gold Rim */}
                  <Circle
                    cx={DUMMY_RADIUS}
                    cy={DUMMY_RADIUS}
                    r={DUMMY_RADIUS}
                    fill="url(#wheelRimGold)"
                  />

                  {/* Inner Dark Trim Ring */}
                  <Circle
                    cx={DUMMY_RADIUS}
                    cy={DUMMY_RADIUS}
                    r={DUMMY_RADIUS - 3.5}
                    fill="url(#innerRimDark)"
                  />

                  {/* Dynamic Slices - Each slice group is rotated around center */}
                  {activeSlices.map((slice, i) => {
                    const badgeW = Math.min(Math.max(52, slice.label.length * 6.2), 70);
                    return (
                      <G
                        key={`slice-${i}`}
                        transform={`rotate(${
                          i * sliceAngleDeg
                        }, ${DUMMY_RADIUS}, ${DUMMY_RADIUS})`}
                      >
                        <Path
                          d={singleWedgePath}
                          fill={`url(#sliceGrad-${i})`}
                          stroke="#FFFFFF"
                          strokeWidth={1.5}
                        />
                        {/* Translucent Dark Badge backing for high-contrast legibility */}
                        <Rect
                          x={DUMMY_RADIUS - badgeW / 2}
                          y={20}
                          width={badgeW}
                          height={17}
                          rx={8.5}
                          fill="rgba(0, 0, 0, 0.28)"
                        />
                        {/* Crisp Bold Prize Label */}
                        <SvgText
                          x={DUMMY_RADIUS}
                          y={32}
                          fill="#FFFFFF"
                          fontSize={sliceCount > 6 ? '8.5' : '9.5'}
                          fontWeight="900"
                          textAnchor="middle"
                          letterSpacing="0.3"
                        >
                          {slice.label}
                        </SvgText>
                      </G>
                    );
                  })}

                  {/* 24 Perimeter Glowing Bulb Studs */}
                  {Array.from({ length: 24 }).map((_, i) => {
                    const angle = (i * 360) / 24;
                    const rad = (angle * Math.PI) / 180;
                    const dist = DUMMY_RADIUS - 5;
                    const bx = DUMMY_RADIUS + dist * Math.sin(rad);
                    const by = DUMMY_RADIUS - dist * Math.cos(rad);
                    return (
                      <Circle
                        key={`bulb-${i}`}
                        cx={bx}
                        cy={by}
                        r={2.2}
                        fill={i % 2 === 0 ? '#FFE082' : '#FFB74D'}
                        stroke={i % 2 === 0 ? '#B45309' : '#C2410C'}
                        strokeWidth={0.6}
                      />
                    );
                  })}

                  {/* 3-Tier Luxury Center Hub */}
                  {/* Tier 1: Outer Gold Metallic Ring */}
                  <Circle
                    cx={DUMMY_RADIUS}
                    cy={DUMMY_RADIUS}
                    r={DUMMY_RADIUS * 0.22}
                    fill="url(#hubRimGold)"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                  {/* Tier 2: Crisp White Core Disc */}
                  <Circle
                    cx={DUMMY_RADIUS}
                    cy={DUMMY_RADIUS}
                    r={DUMMY_RADIUS * 0.16}
                    fill="#FFFFFF"
                  />
                  {/* Tier 3: Vivid Orange Center Jewel */}
                  <Circle
                    cx={DUMMY_RADIUS}
                    cy={DUMMY_RADIUS}
                    r={DUMMY_RADIUS * 0.1}
                    fill="#F25000"
                  />
                  {/* Central Diamond Dot */}
                  <Circle
                    cx={DUMMY_RADIUS}
                    cy={DUMMY_RADIUS}
                    r={DUMMY_RADIUS * 0.035}
                    fill="#FFF9C4"
                  />
                </Svg>
              </Animated.View>
            </Animated.View>
          )}

          {/* Status Message */}
          <View style={styles.statusBox}>
            <Text style={styles.statusHeading}>{statusTitle}</Text>
            <Text style={styles.statusSub}>{statusSubtitle}</Text>
          </View>

          {/* Action Choice Group: Appears when spin is complete */}
          {stage === 'ready' && (
            <Animated.View style={[styles.actionGroup, actionGroupAnimStyle]}>
              {/* Primary Action: Go to Real Spinner */}
              <TouchableOpacity
                style={styles.primaryActionButton}
                onPress={handleProceedToRealSpinner}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#FF7A28', '#F25000', '#D84315']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryActionGradient}
                >
                  <MaterialCommunityIcons name="gift" size={18} color="#FFF" />
                  <Text style={styles.primaryActionText}>
                    {isOnboarding ? 'Spin Welcome Wheel Now' : 'Spin Wheel Now'}
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>

              {/* Secondary Action: Go to Order Tracking / Start Shopping */}
              <TouchableOpacity
                style={styles.secondaryActionButton}
                onPress={handleGoToTracking}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isOnboarding ? 'cart-outline' : 'location-outline'}
                  size={17}
                  color="#FFFFFF"
                />
                <Text style={styles.secondaryActionText}>
                  {isOnboarding ? 'Start Shopping' : 'Go to Order Tracking'}
                </Text>
              </TouchableOpacity>

              {isOnboarding ? (
                <Text style={styles.disclaimerText}>
                  Your welcome gift is guaranteed! Claim your voucher now.
                </Text>
              ) : null}
            </Animated.View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0A0C10',
  },
  ambientGlowContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 30,
  },
  tagPillContainer: {
    alignSelf: 'flex-start',
    shadowColor: '#F25000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  tagPillGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  tagPillText: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy?.bold || 'System',
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.4,
    includeFontPadding: false,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  skipText: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy?.medium || 'System',
    fontSize: 12,
    fontWeight: '600',
    includeFontPadding: false,
  },
  stageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  cartStageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
    marginBottom: 16,
  },
  giftBoxContainer: {
    position: 'absolute',
    top: 6,
    alignItems: 'center',
    zIndex: 5,
  },
  giftLid: {
    width: 58,
    height: 12,
    borderRadius: 3,
    overflow: 'hidden',
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  lidGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lidRibbon: {
    width: 6,
    height: '100%',
    backgroundColor: '#D84315',
  },
  boxBody: {
    width: 50,
    height: 38,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#FF7043',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  boxVerticalRibbon: {
    position: 'absolute',
    width: 6,
    height: '100%',
    backgroundColor: '#FFE082',
  },
  boxHorizontalRibbon: {
    position: 'absolute',
    height: 6,
    width: '100%',
    backgroundColor: '#FFE082',
  },
  sparkleIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  cartSvgContainer: {
    width: 140,
    height: 90,
    marginTop: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartWheelRear: {
    position: 'absolute',
    left: 44,
    bottom: 8,
  },
  cartWheelFront: {
    position: 'absolute',
    right: 28,
    bottom: 8,
  },
  wheelStageWrapper: {
    width: DUMMY_WHEEL_SIZE,
    height: DUMMY_WHEEL_SIZE + 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  needleAnchor: {
    position: 'absolute',
    top: -4,
    zIndex: 25,
    alignItems: 'center',
  },
  wheelContainer: {
    width: DUMMY_WHEEL_SIZE,
    height: DUMMY_WHEEL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF7A28',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  statusBox: {
    alignItems: 'center',
    marginBottom: 18,
    paddingHorizontal: 20,
  },
  statusHeading: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy?.bold || 'System',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  statusSub: {
    color: '#FFE0B2',
    fontFamily: FONTS.gilroy?.medium || 'System',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
  },
  actionGroup: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    gap: 10,
  },
  primaryActionButton: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    shadowColor: '#F25000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  primaryActionGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy?.bold || 'System',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  secondaryActionButton: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  secondaryActionText: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy?.medium || 'System',
    fontSize: 14,
    fontWeight: '700',
  },
  disclaimerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: FONTS.gilroy?.regular || 'System',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
  },
});

export default OrderGiftCartCelebration;
