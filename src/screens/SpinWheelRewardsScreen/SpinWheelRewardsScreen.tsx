import React, { useRef, useState, useEffect } from 'react';
import {
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
import { impactTick, successTick } from '@/utils/haptics';
import { FONTS } from '@/styles/typography';
import {
  isOrderSpinClaimed,
  getOrderSpinReward,
  executeSpinWheelApi,
} from '@/api/spinWheelService';

export type AssuredPrize = {
  id: string;
  label: string;
  sublabel: string;
  badge: string;
  code: string;
  description: string;
  color1: string;
  color2: string;
  textColor: string;
  iconName: string;
};

const ASSURED_PRIZES: AssuredPrize[] = [
  {
    id: 'p1',
    label: 'Free Delivery',
    sublabel: 'ZERO FEE',
    badge: 'POPULAR',
    code: 'FREEDEL',
    description: 'Enjoy 100% Free Express Delivery on your next grocery order.',
    color1: '#059669',
    color2: '#047857',
    textColor: '#FFFFFF',
    iconName: 'truck-fast',
  },
  {
    id: 'p2',
    label: '₹50 Off Pantry',
    sublabel: 'FLAT OFF',
    badge: 'SUPER DEAL',
    code: 'PANTRY50',
    description:
      'Flat ₹50 OFF on orders above ₹299 across all pantry essentials.',
    color1: '#EA580C',
    color2: '#C2410C',
    textColor: '#FFFFFF',
    iconName: 'tag-heart',
  },
  {
    id: 'p3',
    label: '50 UD Coins',
    sublabel: 'WALLET CASH',
    badge: 'INSTANT',
    code: 'UDCOIN50',
    description: '50 UD Coins credited directly to your wallet. 1 Coin = ₹1.',
    color1: '#7C3AED',
    color2: '#6D28D9',
    textColor: '#FFFFFF',
    iconName: 'wallet-giftcard',
  },
  {
    id: 'p4',
    label: '10% Extra Off',
    sublabel: 'FRESH VEG',
    badge: 'SAVINGS',
    code: 'FRESH10',
    description: 'Extra 10% discount on all fresh farm vegetables and fruits.',
    color1: '#D97706',
    color2: '#B45309',
    textColor: '#FFFFFF',
    iconName: 'percent',
  },
  {
    id: 'p5',
    label: 'Surprise Gift',
    sublabel: 'DAILY ITEM',
    badge: 'ASSURED',
    code: 'DAILYGIFT',
    description:
      'Get an authentic bakery or pantry treat added to your delivery!',
    color1: '#0D9488',
    color2: '#0F766E',
    textColor: '#FFFFFF',
    iconName: 'gift',
  },
  {
    id: 'p6',
    label: '₹25 Cashback',
    sublabel: 'DIRECT CASH',
    badge: 'CASH REWARD',
    code: 'CASH25',
    description: 'Instant ₹25 cashback credited after your next checkout.',
    color1: '#E11D48',
    color2: '#BE123C',
    textColor: '#FFFFFF',
    iconName: 'cash-multiple',
  },
  {
    id: 'p7',
    label: '₹100 Mega Save',
    sublabel: 'MEGA WIN',
    badge: 'BUMPER',
    code: 'MEGA100',
    description: 'Flat ₹100 discount on monthly grocery basket above ₹799.',
    color1: '#0284C7',
    color2: '#0369A1',
    textColor: '#FFFFFF',
    iconName: 'ticket-percent',
  },
  {
    id: 'p8',
    label: '2x Points Boost',
    sublabel: 'REWARDS',
    badge: 'BONUS',
    code: 'BOOST2X',
    description:
      'Double your smart reward points on every item in your next cart.',
    color1: '#16A34A',
    color2: '#15803D',
    textColor: '#FFFFFF',
    iconName: 'star-circle',
  },
];

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// iOS-optimized responsive wheel sizing: avoids notch & tab bar vertical clipping
const WHEEL_SIZE = Math.min(Math.round(SCREEN_WIDTH * 0.76), 288);
const RADIUS = WHEEL_SIZE / 2;
const SLICE_ANGLE = 360 / ASSURED_PRIZES.length; // 45 degrees
const SPIN_DURATION_MS = 4200;

// Pre-compute 16 outer perimeter bulb coordinates
const BULBS = Array.from({ length: 16 }).map((_, i) => {
  const angle = (i * 360) / 16;
  const rad = (angle * Math.PI) / 180;
  const dist = RADIUS - 7;
  return {
    x: RADIUS + dist * Math.sin(rad),
    y: RADIUS - dist * Math.cos(rad),
    isGold: i % 2 === 0,
  };
});

// Calculate slice wedge path (from 12 o'clock measured clockwise)
const getSlicePath = (index: number) => {
  const startAngle = index * SLICE_ANGLE;
  const endAngle = (index + 1) * SLICE_ANGLE;
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

interface ConfettiPieceProps {
  key?: React.Key;
  piece: (typeof CONFETTI_PIECES)[0];
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

  const { orderId, orderNumber, source } = route.params || {};
  const isOrderReward = source === 'ORDER_SUCCESS' && !!orderId;

  const rotation = useSharedValue(0);
  const pointerAngle = useSharedValue(0);
  const hubScale = useSharedValue(1);

  // Motion Graphics celebration values
  const trophyScale = useSharedValue(0.5);
  const trophyGlow = useSharedValue(0.4);

  const accumulatedRotation = useRef(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<AssuredPrize | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [spinsCount, setSpinsCount] = useState(isOrderReward ? 1 : 3);

  // Check if this order was already claimed in past session
  useEffect(() => {
    if (isOrderReward && orderId) {
      isOrderSpinClaimed(orderId).then((claimed: boolean) => {
        if (claimed) {
          setSpinsCount(0);
          getOrderSpinReward(orderId).then((data: any) => {
            if (data?.prize) {
              setWonPrize(data.prize);
              setShowModal(true);
            }
          });
        } else {
          setSpinsCount(1);
        }
      });
    }
  }, [orderId, isOrderReward]);

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
    setIsSpinning(false);
    setWonPrize(prize);
    setShowModal(true);
    setSpinsCount(prev => Math.max(prev - 1, 0));
    pointerAngle.value = withSpring(0, { damping: 14, stiffness: 220 });
    successTick();

    // Persist to backend and local storage for this order
    if (isOrderReward && orderId) {
      executeSpinWheelApi({
        orderId,
        source: 'ORDER_SUCCESS',
        winningIndex,
        prize,
      });
    }
  };

  const spin = () => {
    if (isSpinning || spinsCount <= 0) return;

    impactTick();

    // Pick a winning prize slice (all slices are high-value assured gifts!)
    const winningIndex = Math.floor(Math.random() * ASSURED_PRIZES.length);
    const targetPrize = ASSURED_PRIZES[winningIndex];

    // Math:
    // Slice center is at: winningIndex * 45° + 22.5° clockwise from 12 o'clock.
    // Pointer is stationary at 12 o'clock (0°).
    // Target angle in cycle:
    const sliceCenter = winningIndex * SLICE_ANGLE + SLICE_ANGLE / 2;
    const targetAngleInCycle = (360 - (sliceCenter % 360)) % 360;

    const currentRot = accumulatedRotation.current;
    const currentTurns = Math.floor(currentRot / 360);
    const fullSpins = 6;
    let nextTarget = (currentTurns + fullSpins) * 360 + targetAngleInCycle;

    while (nextTarget <= currentRot + 4 * 360) {
      nextTarget += 360;
    }

    accumulatedRotation.current = nextTarget;
    setWonPrize(null);
    setIsSpinning(true);

    // Needle flutter animation as slices pass by
    const flutterCount = Math.floor(SPIN_DURATION_MS / 100);
    pointerAngle.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 50, easing: Easing.linear }),
        withTiming(4, { duration: 50, easing: Easing.linear }),
      ),
      flutterCount,
      true,
    );

    // Smooth physics deceleration curve
    rotation.value = withTiming(
      nextTarget,
      {
        duration: SPIN_DURATION_MS,
        easing: Easing.bezier(0.12, 0.85, 0.22, 1),
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
    navigation.navigate('MainTabs');
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Bulletproof iOS Absolute Background Gradient */}
      <LinearGradient
        colors={['#FFFFFF', '#F0FDF4', '#FEFCE8']}
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
          <Text style={styles.headerTitle}>Spin & Win</Text>
          <Text style={styles.headerSubtitle}>
            {isOrderReward
              ? `Order #${orderNumber || orderId} Reward`
              : 'Daily Assured Rewards'}
          </Text>
        </View>

        <View style={styles.spinsBadge}>
          <MaterialCommunityIcons
            name="star-four-points"
            size={12}
            color="#D97706"
          />
          <Text style={styles.spinsBadgeText}>
            {spinsCount} {spinsCount === 1 ? 'Spin' : 'Spins'}
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
        {/* Assured Guarantee Ribbon Card (iOS Bulletproof Gradient) */}
        <View style={styles.guaranteeCard}>
          <LinearGradient
            colors={['#ECFDF5', '#F0FDF4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.guaranteeInner}>
            <View style={styles.shieldIconWrapper}>
              <MaterialCommunityIcons
                name="shield-check"
                size={20}
                color="#059669"
              />
            </View>
            <View style={styles.guaranteeCopy}>
              <View style={styles.guaranteeHeaderRow}>
                <Text style={styles.guaranteeHeading}>
                  {isOrderReward
                    ? 'Order Bonus: 1 Assured Gift'
                    : '100% Assured Gift Guarantee'}
                </Text>
                <View style={styles.guaranteePill}>
                  <Text style={styles.guaranteePillText}>
                    {isOrderReward ? 'ORDER REWARD' : 'NO EMPTY SPINS'}
                  </Text>
                </View>
              </View>
              <Text style={styles.guaranteeSubtitle}>
                {isOrderReward
                  ? 'Congratulations on your order! Spin now to claim your assured gift.'
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
                  {ASSURED_PRIZES.map(prize => (
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
                  <SvgGradient id="rimEmerald" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#10B981" />
                    <Stop offset="1" stopColor="#047857" />
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
                  fill="url(#rimEmerald)"
                />
                <Circle
                  cx={RADIUS}
                  cy={RADIUS}
                  r={RADIUS - 12}
                  fill="#FFFFFF"
                />

                {/* 8 Segments */}
                {ASSURED_PRIZES.map((prize, index) => {
                  const sliceCenterAngle =
                    index * SLICE_ANGLE + SLICE_ANGLE / 2;
                  return (
                    <G key={prize.id}>
                      <Path
                        d={getSlicePath(index)}
                        fill={`url(#grad-${prize.id})`}
                        stroke="#FFFFFF"
                        strokeWidth={1.5}
                      />

                      {/* Rotated text and sublabel */}
                      <G
                        transform={`rotate(${sliceCenterAngle}, ${RADIUS}, ${RADIUS})`}
                      >
                        <Rect
                          x={RADIUS - 23}
                          y={RADIUS - RADIUS * 0.82}
                          width={46}
                          height={13}
                          rx={6.5}
                          fill="rgba(0, 0, 0, 0.22)"
                        />
                        <SvgText
                          x={RADIUS}
                          y={RADIUS - RADIUS * 0.82 + 9.5}
                          fill="#FFE082"
                          fontSize="7"
                          fontWeight="800"
                          textAnchor="middle"
                          letterSpacing="0.3"
                        >
                          {prize.sublabel}
                        </SvgText>

                        <SvgText
                          x={RADIUS}
                          y={RADIUS - RADIUS * 0.52}
                          fill={prize.textColor}
                          fontSize="10.5"
                          fontWeight="900"
                          textAnchor="middle"
                          letterSpacing="0.2"
                        >
                          {prize.label}
                        </SvgText>
                      </G>
                    </G>
                  );
                })}

                {/* 16 Perimeter Bulb Pins */}
                {BULBS.map((bulb, idx) => (
                  <Circle
                    key={`bulb-${idx}`}
                    cx={bulb.x}
                    cy={bulb.y}
                    r={3}
                    fill={bulb.isGold ? '#FDE68A' : '#A7F3D0'}
                    stroke={bulb.isGold ? '#D97706' : '#047857'}
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
                          : ['#0CA201', '#057A20']
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
                  : ['#0CA201', '#057A20', '#035815']
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

        {/* Assured Gifts Showcase Section */}
        <View style={styles.prizesSection}>
          <View style={styles.sectionHeaderRow}>
            <MaterialCommunityIcons
              name="gift-open-outline"
              size={17}
              color="#059669"
            />
            <Text style={styles.sectionTitle}>Today’s 8 Assured Gifts</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Every single turn gives you one of these valuable coupons:
          </Text>

          <View style={styles.prizesGrid}>
            {ASSURED_PRIZES.map(prize => (
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
                    colors={['#0CA201', '#067A20', '#035815']}
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
                      style={[styles.modalTrophyRing, trophyStyle]}
                    >
                      <MaterialCommunityIcons
                        name="gift-open"
                        size={32}
                        color="#FFE082"
                      />
                    </Animated.View>
                    <Text style={styles.modalCongratsTitle}>
                      {isOrderReward
                        ? 'ORDER GIFT UNLOCKED!'
                        : 'CONGRATULATIONS!'}
                    </Text>
                    <View style={styles.assuredBadgePill}>
                      <MaterialCommunityIcons
                        name="shield-check"
                        size={12}
                        color="#065F46"
                      />
                      <Text style={styles.assuredBadgeText}>
                        {isOrderReward
                          ? 'ASSURED ORDER REWARD'
                          : '100% ASSURED GIFT WON'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Modal Body with Voucher Layout */}
                <View style={styles.modalBody}>
                  {/* Voucher Ticket Box */}
                  <View style={styles.voucherCard}>
                    <View style={styles.voucherHeaderRow}>
                      <View style={styles.voucherBadge}>
                        <Text style={styles.voucherBadgeText}>
                          {wonPrize?.badge || 'ASSURED REWARD'}
                        </Text>
                      </View>
                      <Text style={styles.voucherExpiryText}>
                        Valid for 7 days
                      </Text>
                    </View>

                    <Text style={styles.voucherPrizeTitle}>
                      {wonPrize?.label}
                    </Text>
                    <Text style={styles.voucherPrizeDesc}>
                      {wonPrize?.description}
                    </Text>

                    {/* Coupon Code Strip */}
                    <View style={styles.couponStrip}>
                      <View style={styles.couponCodeCol}>
                        <Text style={styles.couponCodeLabel}>COUPON CODE</Text>
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
                          color="#0B7A3D"
                        />
                        <Text style={styles.copyCodeText}>COPY</Text>
                      </TouchableOpacity>
                    </View>
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
                          colors={['#0CA201', '#057A20']}
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
                          color="#057A20"
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
                          colors={['#0CA201', '#057A20']}
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
            {showModal ? (
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
    color: '#059669',
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
    borderColor: '#A7F3D0',
    backgroundColor: '#ECFDF5',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 12,
    position: 'relative',
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
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#065F46',
  },
  guaranteePill: {
    backgroundColor: '#059669',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  guaranteePillText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  guaranteeSubtitle: {
    fontSize: 10.5,
    color: '#047857',
    marginTop: 2,
    lineHeight: 14,
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
    backgroundColor: 'rgba(12, 162, 1, 0.08)',
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
    backgroundColor: '#0CA201',
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
    backgroundColor: '#0CA201',
    shadowColor: '#0CA201',
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
    backgroundColor: '#0CA201',
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
  assuredBadgeText: {
    color: '#065F46',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  modalBody: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  voucherCard: {
    width: '100%',
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  voucherHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  voucherBadge: {
    backgroundColor: '#059669',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  voucherBadgeText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  voucherExpiryText: {
    fontSize: 9.5,
    color: '#047857',
    fontWeight: '700',
  },
  voucherPrizeTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#065F46',
    marginTop: 2,
  },
  voucherPrizeDesc: {
    fontSize: 11,
    color: '#475569',
    marginTop: 3,
    lineHeight: 15,
  },
  couponStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BBF7D0',
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
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 7,
  },
  copyCodeText: {
    color: '#0B7A3D',
    fontSize: 10.5,
    fontWeight: '900',
  },
  claimButton: {
    width: '100%',
    height: 46,
    borderRadius: 13,
    overflow: 'hidden',
    backgroundColor: '#0CA201',
    shadowColor: '#0CA201',
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
    borderColor: '#057A20',
    backgroundColor: '#F0FDF4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  homeResetBtnText: {
    color: '#057A20',
    fontSize: 13.5,
    fontWeight: '800',
  },
});
