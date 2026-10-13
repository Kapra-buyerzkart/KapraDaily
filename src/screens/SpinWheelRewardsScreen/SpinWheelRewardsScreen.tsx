import React, { useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  StatusBar,
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
  Polygon,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

export type Prize = {
  id: string;
  label: string;
  sublabel: string;
  color1: string;
  color2: string;
  textColor: string;
  icon: string;
};

const PRIZES: Prize[] = [
  {
    id: 'p1',
    label: '₹10 Off',
    sublabel: 'COUPON',
    color1: '#FF5722',
    color2: '#E64A19',
    textColor: '#FFFFFF',
    icon: 'ticket-percent-outline',
  },
  {
    id: 'p2',
    label: 'Free Delivery',
    sublabel: 'PASS',
    color1: '#00BFA5',
    color2: '#00897B',
    textColor: '#FFFFFF',
    icon: 'truck-fast-outline',
  },
  {
    id: 'p3',
    label: '₹50 Cashback',
    sublabel: 'WALLET',
    color1: '#FFA000',
    color2: '#FF6F00',
    textColor: '#FFFFFF',
    icon: 'wallet-outline',
  },
  {
    id: 'p4',
    label: 'Better Luck',
    sublabel: 'TRY AGAIN',
    color1: '#455A64',
    color2: '#263238',
    textColor: '#ECEFF1',
    icon: 'heart-outline',
  },
  {
    id: 'p5',
    label: '₹20 Off',
    sublabel: 'VOUCHER',
    color1: '#8E24AA',
    color2: '#6A1B9A',
    textColor: '#FFFFFF',
    icon: 'tag-outline',
  },
  {
    id: 'p6',
    label: '5% Off',
    sublabel: 'SUPER SAVE',
    color1: '#3949AB',
    color2: '#1A237E',
    textColor: '#FFFFFF',
    icon: 'percent-outline',
  },
  {
    id: 'p7',
    label: '₹100 Cashback',
    sublabel: 'MEGA WIN',
    color1: '#00ACC1',
    color2: '#006064',
    textColor: '#FFFFFF',
    icon: 'cash-multiple',
  },
  {
    id: 'p8',
    label: 'Free Item',
    sublabel: 'GIFT BOX',
    color1: '#D81B60',
    color2: '#880E4F',
    textColor: '#FFFFFF',
    icon: 'gift-outline',
  },
];

const WHEEL_SIZE = 310;
const RADIUS = WHEEL_SIZE / 2;
const SLICE_ANGLE = 360 / PRIZES.length; // 45 degrees
const SPIN_DURATION_MS = 4600;

// Pre-compute 16 LED bulb coordinates around the golden rim
const BULBS = Array.from({ length: 16 }).map((_, i) => {
  const angle = (i * 360) / 16;
  const rad = ((angle - 90) * Math.PI) / 180;
  const dist = RADIUS - 6;
  return {
    x: RADIUS + dist * Math.cos(rad),
    y: RADIUS + dist * Math.sin(rad),
    isGold: i % 2 === 0,
  };
});

const pointOnCircle = (angleDeg: number) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: RADIUS + (RADIUS - 12) * Math.cos(rad),
    y: RADIUS + (RADIUS - 12) * Math.sin(rad),
  };
};

const slicePath = (startAngle: number, endAngle: number) => {
  const r = RADIUS - 12;
  const start = pointOnCircle(startAngle);
  const end = pointOnCircle(endAngle);
  return `M${RADIUS},${RADIUS} L${start.x.toFixed(2)},${start.y.toFixed(
    2,
  )} A${r},${r} 0 0 1 ${end.x.toFixed(2)},${end.y.toFixed(2)} Z`;
};

export default function SpinWheelRewardsScreen() {
  const navigation = useNavigation();

  const rotation = useSharedValue(0);
  const pointerAngle = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  const accumulatedRotation = useRef(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [spinsCount, setSpinsCount] = useState(3);

  const handleSpinEnd = (prize: Prize) => {
    setIsSpinning(false);
    setWonPrize(prize);
    setShowModal(true);
    setSpinsCount(prev => Math.max(prev - 1, 0));
    pointerAngle.value = withSpring(0, { damping: 10, stiffness: 200 });
  };

  const spin = () => {
    if (isSpinning) return;

    // Pick random winning slice
    const winningIndex = Math.floor(Math.random() * PRIZES.length);
    const targetPrize = PRIZES[winningIndex];

    // Math:
    // Slice index spans [index * 45, (index + 1) * 45]
    // Center of winning slice is at: winningIndex * 45 + 22.5
    // Pointer is fixed at 12 o'clock (0 degrees).
    // For slice center to end up at 0 deg: (sliceCenter + TotalRotation) % 360 == 0
    // => TotalRotation % 360 == (360 - sliceCenter) % 360
    const sliceCenter = winningIndex * SLICE_ANGLE + SLICE_ANGLE / 2;
    const desiredModulo = (360 - (sliceCenter % 360)) % 360;

    const currentRot = accumulatedRotation.current;
    const currentTurns = Math.floor(currentRot / 360);
    const fullSpins = 6; // 6 dramatic full revolutions
    let nextTarget = (currentTurns + fullSpins) * 360 + desiredModulo;

    // Guard against any negative or backward movement
    while (nextTarget <= currentRot + 4 * 360) {
      nextTarget += 360;
    }

    accumulatedRotation.current = nextTarget;
    setWonPrize(null);
    setIsSpinning(true);

    // Realistic flapper needle flutter during spin
    pointerAngle.value = withRepeat(
      withSequence(
        withTiming(-14, { duration: 55, easing: Easing.linear }),
        withTiming(4, { duration: 55, easing: Easing.linear }),
      ),
      32,
      true,
    );

    // Silky-smooth wind-up and suspense deceleration easing
    rotation.value = withTiming(
      nextTarget,
      {
        duration: SPIN_DURATION_MS,
        easing: Easing.bezier(0.16, 0.85, 0.2, 1),
      },
      finished => {
        if (finished) {
          runOnJS(handleSpinEnd)(targetPrize);
        }
      },
    );
  };

  const wheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const pointerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${pointerAngle.value}deg` }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, { damping: 12, stiffness: 250 });
  };

  return (
    <SafeAreaInsets style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0B18" />

      {/* Top Navigation Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerTitleBlock}>
          <Text style={styles.title}>Spin & Win Rewards</Text>
          <Text style={styles.subtitle}>Spin the wheel & win daily prizes</Text>
        </View>

        <View style={styles.spinsBadge}>
          <MaterialCommunityIcons name="ticket" size={14} color="#FFE082" />
          <Text style={styles.spinsBadgeText}>{spinsCount} Left</Text>
        </View>
      </View>

      {/* Main Wheel Arena Card */}
      <View style={styles.content}>
        <View style={styles.wheelCard}>
          {/* Subtle Backlight Glow */}
          <View style={styles.glowHalo} />

          {/* Wheel Disc Wrapper */}
          <View style={styles.wheelWrapper}>
            {/* Top Golden Pointer Needle */}
            <Animated.View style={[styles.pointerWrapper, pointerStyle]}>
              <Svg width={36} height={44} viewBox="0 0 36 44">
                <Defs>
                  <SvgGradient id="pointerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor="#FFF9C4" />
                    <Stop offset="35%" stopColor="#FFD54F" />
                    <Stop offset="75%" stopColor="#FF8F00" />
                    <Stop offset="100%" stopColor="#C43800" />
                  </SvgGradient>
                </Defs>
                <Polygon
                  points="18,42 4,4 32,4"
                  fill="url(#pointerGrad)"
                  stroke="#FFE082"
                  strokeWidth={1.5}
                />
                <Circle
                  cx={18}
                  cy={12}
                  r={5}
                  fill="#FFF8E1"
                  stroke="#FF8F00"
                  strokeWidth={1.5}
                />
                <Circle cx={18} cy={12} r={2} fill="#E65100" />
              </Svg>
            </Animated.View>

            {/* Rotating SVG Wheel */}
            <Animated.View style={[styles.wheelContainer, wheelStyle]}>
              <Svg
                width={WHEEL_SIZE}
                height={WHEEL_SIZE}
                viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
              >
                <Defs>
                  {/* Metallic Gold Outer Ring Gradient */}
                  <SvgGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#FFE082" />
                    <Stop offset="25%" stopColor="#FFB300" />
                    <Stop offset="50%" stopColor="#FFF8E1" />
                    <Stop offset="75%" stopColor="#FFA000" />
                    <Stop offset="100%" stopColor="#FF8F00" />
                  </SvgGradient>

                  {/* Per Slice Gradients */}
                  {PRIZES.map((prize, idx) => (
                    <SvgGradient
                      key={`slice_grad_${idx}`}
                      id={`slice_grad_${idx}`}
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <Stop offset="0%" stopColor={prize.color1} />
                      <Stop offset="100%" stopColor={prize.color2} />
                    </SvgGradient>
                  ))}
                </Defs>

                {/* Outer Golden Border Rim */}
                <Circle
                  cx={RADIUS}
                  cy={RADIUS}
                  r={RADIUS - 2}
                  fill="#151024"
                  stroke="url(#rimGrad)"
                  strokeWidth={9}
                />

                {/* 8 Slices */}
                {PRIZES.map((prize, index) => {
                  const startAngle = index * SLICE_ANGLE;
                  const midAngle = startAngle + SLICE_ANGLE / 2;
                  return (
                    <G key={prize.id}>
                      <Path
                        d={slicePath(startAngle, startAngle + SLICE_ANGLE)}
                        fill={`url(#slice_grad_${index})`}
                        stroke="rgba(255, 255, 255, 0.35)"
                        strokeWidth={1.5}
                      />
                      {/* Label Text aligned along slice radial */}
                      <SvgText
                        x={RADIUS}
                        y={42}
                        fill={prize.textColor}
                        fontSize={12}
                        fontWeight="900"
                        letterSpacing={0.4}
                        textAnchor="middle"
                        rotation={midAngle}
                        origin={`${RADIUS}, ${RADIUS}`}
                      >
                        {prize.label}
                      </SvgText>
                      {/* Sub-label */}
                      <SvgText
                        x={RADIUS}
                        y={56}
                        fill="rgba(255, 255, 255, 0.75)"
                        fontSize={8}
                        fontWeight="700"
                        letterSpacing={0.8}
                        textAnchor="middle"
                        rotation={midAngle}
                        origin={`${RADIUS}, ${RADIUS}`}
                      >
                        {prize.sublabel}
                      </SvgText>
                    </G>
                  );
                })}

                {/* LED Bulbs Around Perimeter */}
                {BULBS.map((b, idx) => (
                  <Circle
                    key={`bulb_${idx}`}
                    cx={b.x}
                    cy={b.y}
                    r={2.8}
                    fill={b.isGold ? '#FFF9C4' : '#FFE082'}
                    stroke="#8D6E14"
                    strokeWidth={0.6}
                  />
                ))}

                {/* Inner Separator Ring */}
                <Circle
                  cx={RADIUS}
                  cy={RADIUS}
                  r={34}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth={2}
                />
              </Svg>
            </Animated.View>

            {/* Glossy 3D Center Hub */}
            <View style={styles.hubContainer}>
              <View style={styles.hubBezel}>
                <View style={styles.hubCore}>
                  <MaterialCommunityIcons
                    name={isSpinning ? 'sync' : 'star-four-points'}
                    size={16}
                    color="#FFE082"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Big Interactive Spin Button */}
        <Animated.View style={[styles.spinBtnWrapper, buttonAnimatedStyle]}>
          <Pressable
            onPress={spin}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={isSpinning}
            style={[styles.spinButton, isSpinning && styles.spinButtonDisabled]}
          >
            <LinearGradient
              colors={
                isSpinning
                  ? ['#546E7A', '#37474F']
                  : ['#FFB300', '#FF6F00', '#D84315']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.spinGradient}
            >
              <MaterialCommunityIcons
                name={isSpinning ? 'rotate-right' : 'sparkles'}
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.spinButtonText}>
                {isSpinning ? 'LUCK IS SPINNING...' : 'SPIN THE WHEEL'}
              </Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>

        {/* Live Status Footnote */}
        <View style={styles.statusBox}>
          <Text style={styles.statusNotice}>
            🎯 100% Guaranteed prize on every lucky turn!
          </Text>
        </View>
      </View>

      {/* Celebratory Winner Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <LinearGradient
              colors={['#FF6F00', '#E65100', '#880E4F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modalHeader}
            >
              <View style={styles.modalTrophy}>
                <MaterialCommunityIcons
                  name="trophy-award"
                  size={42}
                  color="#FFD54F"
                />
              </View>
              <Text style={styles.modalCongrats}>🎉 CONGRATULATIONS! 🎉</Text>
              <Text style={styles.modalSubCongrats}>YOU WON A PRIZE</Text>
            </LinearGradient>

            <View style={styles.modalBody}>
              <Text style={styles.modalPrizeTitle}>{wonPrize?.label}</Text>
              <Text style={styles.modalPrizeCategory}>
                {wonPrize?.sublabel} REWARD
              </Text>

              <Text style={styles.modalMessage}>
                Your reward is active and ready to use on your next order!
              </Text>

              <TouchableOpacity
                style={styles.claimButton}
                onPress={() => setShowModal(false)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#FF8F00', '#E65100']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.claimGradient}
                >
                  <Text style={styles.claimText}>Claim Reward</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreInsets>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0B18',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleBlock: {
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: '#B39DDB',
    fontSize: 11,
    marginTop: 1,
  },
  spinsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderWidth: 1,
    borderColor: '#FFE082',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  spinsBadgeText: {
    color: '#FFE082',
    fontSize: 11,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  wheelCard: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  glowHalo: {
    position: 'absolute',
    width: WHEEL_SIZE + 36,
    height: WHEEL_SIZE + 36,
    borderRadius: (WHEEL_SIZE + 36) / 2,
    backgroundColor: 'rgba(255, 160, 0, 0.14)',
  },
  wheelWrapper: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelContainer: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
  },
  pointerWrapper: {
    position: 'absolute',
    top: -16,
    zIndex: 20,
    alignItems: 'center',
  },
  hubContainer: {
    position: 'absolute',
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
  },
  hubBezel: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FF6F00',
    borderWidth: 3,
    borderColor: '#FFE082',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  hubCore: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#BF360C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinBtnWrapper: {
    width: '100%',
    maxWidth: 320,
    marginTop: 34,
  },
  spinButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#FF6F00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  spinButtonDisabled: {
    opacity: 0.8,
    shadowOpacity: 0,
    elevation: 0,
  },
  spinGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  spinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  statusBox: {
    marginTop: 18,
    alignItems: 'center',
  },
  statusNotice: {
    color: '#B39DDB',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 16,
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 22,
  },
  modalTrophy: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderWidth: 2,
    borderColor: '#FFE082',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  modalCongrats: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  modalSubCongrats: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFE082',
    letterSpacing: 1.2,
    marginTop: 2,
  },
  modalBody: {
    padding: 20,
    alignItems: 'center',
  },
  modalPrizeTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  modalPrizeCategory: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF6F00',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  modalMessage: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginVertical: 14,
    lineHeight: 18,
  },
  claimButton: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  claimGradient: {
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
