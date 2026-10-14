import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, G, Path } from 'react-native-svg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';
import { useIsFocused } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { FONTS } from '../styles/typography';
import { impactTick, successTick } from '../utils/haptics';
import { isOrderSpinClaimed, getOrderSpinReward } from '../api/spinWheelService';

const MINI_WHEEL_SIZE = wp('15%');
const MINI_RADIUS = MINI_WHEEL_SIZE / 2;

// 8 Segments for the miniature wheel graphic
const MINI_COLORS = [
  '#059669',
  '#EA580C',
  '#7C3AED',
  '#D97706',
  '#0D9488',
  '#E11D48',
  '#0284C7',
  '#16A34A',
];

const OrderSpinBanner = ({ orderId, orderNumber, onPressSpin }) => {
  const isFocused = useIsFocused();
  const [isClaimed, setIsClaimed] = useState(false);
  const [claimedReward, setClaimedReward] = useState(null);

  // Motion Graphics Animation Values
  const wheelRotation = useSharedValue(0);
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.45);
  const starRotation = useSharedValue(0);
  const arrowNudge = useSharedValue(0);
  const cardScale = useSharedValue(0.95);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    // Check claim status when orderId changes or screen regains focus
    checkClaimStatus();
  }, [orderId, isFocused]);

  useEffect(() => {
    // 1. Entrance spring animation
    cardScale.value = withSpring(1, { damping: 15, stiffness: 120 });
    cardOpacity.value = withTiming(1, { duration: 400 });

    // 2. Hypnotic continuous rotation of mini wheel (Motion Graphic)
    wheelRotation.value = withRepeat(
      withTiming(360, {
        duration: 7000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    // 3. Ambient breathing glow behind card
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.45, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    // 4. Playful star twinkle wobble
    starRotation.value = withRepeat(
      withSequence(
        withTiming(15, { duration: 600, easing: Easing.inOut(Easing.quad) }),
        withTiming(-15, { duration: 600, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );

    // 5. Arrow button nudge inviting interaction
    arrowNudge.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 500, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 500, easing: Easing.in(Easing.quad) }),
      ),
      -1,
      true,
    );
  }, []);

  const checkClaimStatus = async () => {
    if (!orderId) return;
    const claimed = await isOrderSpinClaimed(orderId);
    setIsClaimed(claimed);
    if (claimed) {
      const reward = await getOrderSpinReward(orderId);
      setClaimedReward(reward?.prize || null);
    }
  };

  const handleCopyCode = code => {
    if (!code) return;
    Clipboard.setString(code);
    successTick();
    Toast.show(`Coupon "${code}" copied to clipboard!`, Toast.SHORT);
  };

  const handlePressCard = () => {
    if (isClaimed) return;
    impactTick();
    onPressSpin();
  };

  // Reanimated Animated Styles
  const wheelAnimStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${wheelRotation.value}deg` }],
  }));

  const glowAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  const starAnimStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${starRotation.value}deg` }],
  }));

  const arrowAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: arrowNudge.value }],
  }));

  const containerAnimStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  // Render Slices for Mini Wheel Graphic
  const renderMiniWheelSlices = () => {
    const sliceAngle = 360 / 8;
    return MINI_COLORS.map((color, i) => {
      const startAngle = (i * sliceAngle * Math.PI) / 180;
      const endAngle = ((i + 1) * sliceAngle * Math.PI) / 180;
      const x1 = MINI_RADIUS + MINI_RADIUS * Math.sin(startAngle);
      const y1 = MINI_RADIUS - MINI_RADIUS * Math.cos(startAngle);
      const x2 = MINI_RADIUS + MINI_RADIUS * Math.sin(endAngle);
      const y2 = MINI_RADIUS - MINI_RADIUS * Math.cos(endAngle);
      const d = `M ${MINI_RADIUS} ${MINI_RADIUS} L ${x1} ${y1} A ${MINI_RADIUS} ${MINI_RADIUS} 0 0 1 ${x2} ${y2} Z`;
      return <Path key={`slice-${i}`} d={d} fill={color} />;
    });
  };

  if (isClaimed && claimedReward) {
    // Claimed State Ribbon
    return (
      <Animated.View style={[styles.wrapper, containerAnimStyle]}>
        <View style={styles.claimedCard}>
          <LinearGradient
            colors={['#ECFDF5', '#F0FDF4', '#DCFCE7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.claimedInner}>
            <View style={styles.claimedIconBubble}>
              <MaterialCommunityIcons
                name="gift-open"
                size={22}
                color="#059669"
              />
            </View>
            <View style={styles.claimedInfo}>
              <View style={styles.claimedTagRow}>
                <Text style={styles.claimedTag}>ORDER GIFT CLAIMED</Text>
              </View>
              <Text style={styles.claimedPrizeName}>
                {claimedReward.label || 'Assured Reward'}
              </Text>
              <Text style={styles.claimedCodeDesc}>
                {claimedReward.description || 'Valid on your next checkout'}
              </Text>
            </View>

            {claimedReward.code ? (
              <TouchableOpacity
                onPress={() => handleCopyCode(claimedReward.code)}
                style={styles.copyPill}
                activeOpacity={0.75}
              >
                <Text style={styles.copyPillText}>{claimedReward.code}</Text>
                <Ionicons name="copy-outline" size={13} color="#059669" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </Animated.View>
    );
  }

  // Active / Unclaimed State with Full Motion Graphics
  return (
    <Animated.View style={[styles.wrapper, containerAnimStyle]}>
      {/* 1. Ambient Motion Glow behind Card */}
      <Animated.View style={[styles.ambientGlow, glowAnimStyle]} />

      <TouchableOpacity
        onPress={handlePressCard}
        activeOpacity={0.92}
        style={styles.cardContainer}
      >
        {/* Dynamic Metallic Gradient Background */}
        <LinearGradient
          colors={['#0F172A', '#1E293B', '#064E3B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Decorative Top Accent Light Line */}
        <LinearGradient
          colors={['transparent', '#10B981', '#F59E0B', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topAccentBar}
        />

        <View style={styles.cardContent}>
          {/* Left: Motion Mini Rotating Spin Wheel */}
          <View style={styles.miniWheelContainer}>
            <Animated.View style={[styles.miniWheelWrapper, wheelAnimStyle]}>
              <Svg
                width={MINI_WHEEL_SIZE}
                height={MINI_WHEEL_SIZE}
                viewBox={`0 0 ${MINI_WHEEL_SIZE} ${MINI_WHEEL_SIZE}`}
              >
                <G>{renderMiniWheelSlices()}</G>
                {/* Center Hub */}
                <Circle
                  cx={MINI_RADIUS}
                  cy={MINI_RADIUS}
                  r={MINI_RADIUS * 0.3}
                  fill="#FFFFFF"
                  stroke="#F59E0B"
                  strokeWidth={2}
                />
              </Svg>
            </Animated.View>

            {/* Stationary Top Needle Pointer */}
            <View style={styles.miniPointer}>
              <MaterialCommunityIcons
                name="triangle-down"
                size={16}
                color="#FBBF24"
              />
            </View>
          </View>

          {/* Center: Exciting Typography & Badge */}
          <View style={styles.textColumn}>
            <View style={styles.badgeRow}>
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.badgeGradient}
              >
                <Animated.View style={starAnimStyle}>
                  <MaterialCommunityIcons
                    name="star-four-points"
                    size={11}
                    color="#FFFFFF"
                  />
                </Animated.View>
                <Text style={styles.badgeText}>1 ASSURED SPIN</Text>
              </LinearGradient>
              <Text style={styles.orderTag}>Order Reward</Text>
            </View>

            <Text style={styles.titleText}>Spin & Win Assured Gift!</Text>
            <Text style={styles.subtitleText}>
              Free delivery, pantry cash & coupons unlocked for this order.
            </Text>
          </View>

          {/* Right: Motion Nudge Action Arrow Button */}
          <View style={styles.actionColumn}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.actionCircle}
            >
              <Animated.View style={arrowAnimStyle}>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </Animated.View>
            </LinearGradient>
            <Text style={styles.actionPrompt}>SPIN</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default OrderSpinBanner;

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: hp('1.8%'),
    position: 'relative',
  },
  ambientGlow: {
    position: 'absolute',
    top: -4,
    left: 4,
    right: 4,
    bottom: -4,
    backgroundColor: '#059669',
    borderRadius: 20,
    opacity: 0.35,
    ...Platform.select({
      ios: {
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardContainer: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    backgroundColor: '#0F172A',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  topAccentBar: {
    height: 2.5,
    width: '100%',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.6%'),
    paddingHorizontal: wp('3.5%'),
  },
  miniWheelContainer: {
    width: MINI_WHEEL_SIZE,
    height: MINI_WHEEL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: wp('3%'),
  },
  miniWheelWrapper: {
    width: MINI_WHEEL_SIZE,
    height: MINI_WHEEL_SIZE,
    borderRadius: MINI_RADIUS,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  miniPointer: {
    position: 'absolute',
    top: -7,
    alignSelf: 'center',
    zIndex: 10,
  },
  textColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('0.4%'),
  },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6,
  },
  badgeText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('2.6%'),
    color: '#FFFFFF',
    marginLeft: 3,
    letterSpacing: 0.4,
  },
  orderTag: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('2.6%'),
    color: '#34D399',
    letterSpacing: 0.3,
  },
  titleText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.8%'),
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  subtitleText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('2.9%'),
    color: '#CBD5E1',
    marginTop: 2,
    lineHeight: 15,
  },
  actionColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp('2%'),
  },
  actionCircle: {
    width: wp('9.5%'),
    height: wp('9.5%'),
    borderRadius: wp('4.75%'),
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  actionPrompt: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('2.4%'),
    color: '#34D399',
    marginTop: 3,
    letterSpacing: 0.6,
  },

  // Claimed State Styles
  claimedCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    overflow: 'hidden',
    backgroundColor: '#F0FDF4',
  },
  claimedInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.4%'),
    paddingHorizontal: wp('3.5%'),
  },
  claimedIconBubble: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3%'),
  },
  claimedInfo: {
    flex: 1,
  },
  claimedTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  claimedTag: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('2.5%'),
    color: '#059669',
    letterSpacing: 0.4,
  },
  claimedPrizeName: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.6%'),
    color: '#064E3B',
    marginTop: 1,
  },
  claimedCodeDesc: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('2.8%'),
    color: '#047857',
  },
  copyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#059669',
    marginLeft: 6,
  },
  copyPillText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('2.8%'),
    color: '#059669',
    marginRight: 4,
  },
});
