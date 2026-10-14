import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { CART_SPACING } from '@/styles/cartTheme';
import { FONTS } from '@/styles/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Micro sparkle component for motion graphics ambient glints
const Sparkle = ({ style, delay = 0, size = 11 }) => {
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
    <Animated.View style={[styles.sparkleWrap, style, animStyle]} pointerEvents="none">
      <MaterialCommunityIcons name="star-four-points" size={size} color="#FFE082" />
    </Animated.View>
  );
};

const SpinWheelBanner = ({ onPress, spinsCount = 3 }) => {
  // Motion Graphics: Wheel Rotation
  const wheelRotation = useSharedValue(0);

  // Motion Graphics: Glowing Halo Pulse
  const haloScale = useSharedValue(1);
  const haloOpacity = useSharedValue(0.25);

  // Motion Graphics: Card Shimmer Beam Sweep
  const shimmerX = useSharedValue(-150);

  // Motion Graphics: CTA Button Pulse & Arrow Slide
  const ctaScale = useSharedValue(1);
  const arrowX = useSharedValue(0);

  useEffect(() => {
    // Continuous 360-degree rotation of the prize wheel (6.5s smooth loop)
    wheelRotation.value = withRepeat(
      withTiming(360, {
        duration: 6500,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    // Radiant golden halo breathing animation
    haloScale.value = withRepeat(
      withSequence(
        withTiming(1.32, {
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      true,
    );

    haloOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 1300 }),
        withTiming(0.18, { duration: 1300 }),
      ),
      -1,
      true,
    );

    // Shimmer beam sweeps across the banner every 3.6 seconds
    shimmerX.value = withRepeat(
      withSequence(
        withTiming(SCREEN_WIDTH + 80, {
          duration: 1250,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        withTiming(-120, { duration: 0 }),
        withTiming(-120, { duration: 2350 }),
      ),
      -1,
      false,
    );

    // CTA subtle invitation breathing & nudge
    ctaScale.value = withRepeat(
      withSequence(
        withTiming(1.05, {
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      true,
    );

    arrowX.value = withRepeat(
      withSequence(
        withTiming(3, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [arrowX, ctaScale, haloOpacity, haloScale, shimmerX, wheelRotation]);

  const wheelAnimStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${wheelRotation.value}deg` }],
  }));

  const haloAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: haloScale.value }],
    opacity: haloOpacity.value,
  }));

  const shimmerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }, { rotate: '25deg' }],
  }));

  const ctaAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ctaScale.value }],
  }));

  const arrowAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: arrowX.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel="Daily Spin and Win Assured Gift"
    >
      <View style={styles.cardContainer}>
        {/* iOS & Android Rich LinearGradient Background */}
        <LinearGradient
          colors={['#0CA201', '#067A20', '#035815']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Decorative background ambient circles */}
        <View style={styles.ambientCircle1} />
        <View style={styles.ambientCircle2} />

        {/* Motion Graphics: Diagonal Shimmer Light Sweep */}
        <Animated.View
          style={[styles.shimmerContainer, shimmerAnimStyle]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={[
              'transparent',
              'rgba(255, 255, 255, 0.12)',
              'rgba(255, 224, 130, 0.32)',
              'rgba(255, 255, 255, 0.12)',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shimmerGradient}
          />
        </Animated.View>

        {/* Ambient Twinkling Golden Sparkles */}
        <Sparkle style={styles.sparkle1} delay={0} size={11} />
        <Sparkle style={styles.sparkle2} delay={700} size={9} />
        <Sparkle style={styles.sparkle3} delay={1400} size={10} />

        {/* Content row */}
        <View style={styles.cardInner}>
          {/* Left Motion Graphics: Disc with Pulsing Radiant Halo & Rotating Wheel */}
          <View style={styles.iconDiscContainer}>
            <Animated.View style={[styles.iconHalo, haloAnimStyle]} />
            <View style={styles.iconDisc}>
              <Animated.View style={wheelAnimStyle}>
                <MaterialCommunityIcons
                  name="ferris-wheel"
                  size={wp('7.4%')}
                  color="#FFE082"
                />
              </Animated.View>
            </View>
          </View>

          {/* Center Copy */}
          <View style={styles.content}>
            <View style={styles.badgeRow}>
              <View style={styles.guaranteeBadge}>
                <MaterialCommunityIcons
                  name="shield-check"
                  size={11}
                  color="#065F46"
                />
                <Text style={styles.guaranteeText}>100% ASSURED GIFT</Text>
              </View>
              <View style={styles.spinsBadge}>
                <Text style={styles.spinsBadgeText}>
                  {spinsCount} {spinsCount === 1 ? 'SPIN' : 'SPINS'} LEFT
                </Text>
              </View>
            </View>

            <Text style={styles.title} numberOfLines={1}>
              Lucky Spin & Win
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              Win Free Delivery, ₹100 Off & Cashbacks
            </Text>
          </View>

          {/* Right Motion Graphics: Pulsing CTA Button with Sliding Arrow */}
          <Animated.View style={[styles.ctaButton, ctaAnimStyle]}>
            <Text style={styles.ctaText}>SPIN</Text>
            <Animated.View style={arrowAnimStyle}>
              <Ionicons name="arrow-forward" size={12} color="#0B7A3D" />
            </Animated.View>
          </Animated.View>
        </View>
      </View>
    </Pressable>
  );
};

export default React.memo(SpinWheelBanner);

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: CART_SPACING.lg,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#0CA201',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.26,
    shadowRadius: 10,
    elevation: 6,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.95,
  },
  cardContainer: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0CA201',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    zIndex: 2,
  },
  ambientCircle1: {
    position: 'absolute',
    top: -24,
    right: -24,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 1,
  },
  ambientCircle2: {
    position: 'absolute',
    bottom: -30,
    left: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 224, 130, 0.08)',
    zIndex: 1,
  },
  shimmerContainer: {
    position: 'absolute',
    top: -60,
    bottom: -60,
    width: 65,
    zIndex: 3,
  },
  shimmerGradient: {
    flex: 1,
    width: '100%',
  },
  sparkleWrap: {
    position: 'absolute',
    zIndex: 3,
  },
  sparkle1: {
    top: 7,
    left: 56,
  },
  sparkle2: {
    top: 9,
    right: 88,
  },
  sparkle3: {
    bottom: 8,
    right: 125,
  },
  iconDiscContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconHalo: {
    position: 'absolute',
    width: wp('12.5%'),
    height: wp('12.5%'),
    borderRadius: wp('6.25%'),
    backgroundColor: '#FFE082',
  },
  iconDisc: {
    width: wp('11%'),
    height: wp('11%'),
    borderRadius: wp('5.5%'),
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    borderWidth: 1.5,
    borderColor: '#FFE082',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFE082',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  guaranteeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  guaranteeText: {
    color: '#92400E',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  spinsBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  spinsBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  title: {
    color: '#FFFFFF',
    fontSize: wp('4.1%'),
    fontFamily: FONTS.gilroy?.bold || 'System',
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  subtitle: {
    color: '#DCFCE7',
    fontSize: wp('2.9%'),
    fontFamily: FONTS.gilroy?.medium || 'System',
    marginTop: 2,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 14,
    marginLeft: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  ctaText: {
    color: '#0B7A3D',
    fontSize: 11.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});

