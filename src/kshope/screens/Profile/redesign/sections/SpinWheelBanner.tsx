import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  G,
  Path,
  Polygon,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from 'react-native-svg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { UI_GUTTER, UI_SPACING } from '../../../../theme/tokens';
import { Fonts } from '../../../../theme/fonts';
import { impactTick } from '@/utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Miniature lucky wheel diameter
const WHEEL_SIZE = Math.round(wp('12.5%'));
const RADIUS = WHEEL_SIZE / 2;

// 8 Vibrant Deal Colors for the mini lucky wheel
const WHEEL_SLICE_COLORS = [
  '#FF5722', // Fiery Coral
  '#FFB300', // Sunburst Gold
  '#7C3AED', // Royal Amethyst
  '#0D9488', // Deep Teal
  '#E11D48', // Ruby Rose
  '#0284C7', // Electric Azure
  '#10B981', // Vivid Emerald
  '#EA580C', // Hot Tangerine
];

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

export interface KshopeSpinWheelBannerProps {
  onPress: () => void;
  spinsCount?: number;
  title?: string;
  subtitle?: string;
  badgeText?: string;
  badgeIcon?: string;
  style?: any;
}

const SpinWheelBanner: React.FC<KshopeSpinWheelBannerProps> = ({
  onPress,
  spinsCount = 3,
  title = 'Lucky Deal Spin & Win',
  subtitle = 'Win Extra Discounts, UD Coins & Free Delivery',
  badgeText = '48HR DEAL GIFT',
  badgeIcon = 'lightning-bolt',
  style,
}) => {
  // Motion Graphics: Wheel Rotation
  const wheelRotation = useSharedValue(0);

  // Motion Graphics: Glowing Radiant Halo Pulse
  const haloScale = useSharedValue(1);
  const haloOpacity = useSharedValue(0.28);

  // Motion Graphics: Card Shimmer Beam Sweep
  const shimmerX = useSharedValue(-150);

  // Motion Graphics: CTA Button Pulse & Arrow Slide
  const ctaScale = useSharedValue(1);
  const arrowX = useSharedValue(0);

  // Motion Graphics: Sunburst slow ambient rotation
  const burstRotation = useSharedValue(0);

  useEffect(() => {
    // Continuous 360-degree rotation of the prize wheel (8.0s smooth, calm loop)
    wheelRotation.value = withRepeat(
      withTiming(360, {
        duration: 8000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    // Subtle ambient rotation for the sunburst pattern
    burstRotation.value = withRepeat(
      withTiming(360, {
        duration: 22000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    // Radiant fiery amber halo breathing animation
    haloScale.value = withRepeat(
      withSequence(
        withTiming(1.35, {
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
        withTiming(0.55, { duration: 1300 }),
        withTiming(0.2, { duration: 1300 }),
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
  }, [arrowX, burstRotation, ctaScale, haloOpacity, haloScale, shimmerX, wheelRotation]);

  const wheelAnimStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${wheelRotation.value}deg` }],
  }));

  const burstAnimStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${burstRotation.value}deg` }],
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

  const handlePress = () => {
    impactTick();
    onPress();
  };

  // Pre-calculate 8 Slices for the Miniature Prize Wheel
  const wheelSlices = useMemo(() => {
    const sliceAngle = 360 / 8;
    return WHEEL_SLICE_COLORS.map((color, i) => {
      const startAngle = (i * sliceAngle * Math.PI) / 180;
      const endAngle = ((i + 1) * sliceAngle * Math.PI) / 180;
      const x1 = RADIUS + RADIUS * Math.sin(startAngle);
      const y1 = RADIUS - RADIUS * Math.cos(startAngle);
      const x2 = RADIUS + RADIUS * Math.sin(endAngle);
      const y2 = RADIUS - RADIUS * Math.cos(endAngle);
      const d = `M ${RADIUS} ${RADIUS} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 0 1 ${x2} ${y2} Z`;
      return { d, color, key: `slice-${i}` };
    });
  }, []);

  // Perimeter bulb pins around mini wheel
  const perimeterBulbs = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      const angle = ((i * 45 + 22.5) * Math.PI) / 180;
      const dist = RADIUS - 3.5;
      return {
        cx: RADIUS + dist * Math.sin(angle),
        cy: RADIUS - dist * Math.cos(angle),
        isGold: i % 2 === 0,
        key: `bulb-${i}`,
      };
    });
  }, []);

  // 12 Sunburst Rays Pattern behind the wheel
  const sunburstRays = useMemo(() => {
    const rayLength = 95;
    const count = 12;
    return Array.from({ length: count }).map((_, i) => {
      const centerAngle = (i * 360) / count;
      const halfWidth = 7.5;
      const a1 = ((centerAngle - halfWidth) * Math.PI) / 180;
      const a2 = ((centerAngle + halfWidth) * Math.PI) / 180;
      const x1 = 50 + rayLength * Math.sin(a1);
      const y1 = 50 - rayLength * Math.cos(a1);
      const x2 = 50 + rayLength * Math.sin(a2);
      const y2 = 50 - rayLength * Math.cos(a2);
      return {
        points: `50,50 ${x1},${y1} ${x2},${y2}`,
        key: `ray-${i}`,
      };
    });
  }, []);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.wrapper, style, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${title} Lucky Gift`}
    >
      <View style={styles.cardContainer}>
        {/* 48hrs Deals Fiery Sunset/Crimson LinearGradient Background */}
        <LinearGradient
          colors={['#FF4D00', '#F25000', '#D33800', '#941B00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Pattern 1: Dynamic 48hr Speed Stripes (Angled 45° Slashes across card) */}
        <View style={styles.speedStripesOverlay} pointerEvents="none">
          <View style={[styles.speedStripe, styles.speedStripe1]} />
          <View style={[styles.speedStripe, styles.speedStripe2]} />
          <View style={[styles.speedStripe, styles.speedStripe3]} />
          <View style={[styles.speedStripe, styles.speedStripe4]} />
        </View>

        {/* Pattern 2: Concentric Shockwave Rings centered behind the wheel */}
        <View style={styles.concentricRingsOverlay} pointerEvents="none">
          <View style={styles.ring1} />
          <View style={styles.ring2} />
          <View style={styles.ring3} />
        </View>

        {/* Pattern 3: Ambient Radial Glow Orbs */}
        <View style={styles.ambientOrb1} pointerEvents="none" />
        <View style={styles.ambientOrb2} pointerEvents="none" />

        {/* Pattern 4: Top Accent Metallic Light Line */}
        <LinearGradient
          colors={['transparent', '#FFE082', '#FF9800', '#FF5722', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topAccentBar}
          pointerEvents="none"
        />

        {/* Motion Graphics: Diagonal Shimmer Light Sweep */}
        <Animated.View
          style={[styles.shimmerContainer, shimmerAnimStyle]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={[
              'transparent',
              'rgba(255, 255, 255, 0.12)',
              'rgba(255, 224, 130, 0.35)',
              'rgba(255, 255, 255, 0.12)',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shimmerGradient}
          />
        </Animated.View>

        {/* Ambient Twinkling Golden & Diamond Sparkles */}
        <Sparkle style={styles.sparkle1} delay={0} size={11} color="#FFE082" />
        <Sparkle style={styles.sparkle2} delay={700} size={9} color="#FFFFFF" />
        <Sparkle style={styles.sparkle3} delay={1400} size={10} color="#FFD54F" />

        {/* Card Content Row */}
        <View style={styles.cardInner}>
          {/* Left: Motion Mini Prize Wheel Disc with Sunburst & Radiant Halo */}
          <View style={styles.iconDiscContainer}>
            {/* Pattern 5: Sunburst Prize Rays centered behind the disc */}
            <Animated.View style={[styles.sunburstWrapper, burstAnimStyle]} pointerEvents="none">
              <Svg width={100} height={100} viewBox="0 0 100 100">
                <G fill="rgba(255, 236, 179, 0.14)">
                  {sunburstRays.map(ray => (
                    <Polygon key={ray.key} points={ray.points} />
                  ))}
                </G>
              </Svg>
            </Animated.View>

            {/* Glowing Fiery Halo Pulse */}
            <Animated.View style={[styles.iconHalo, haloAnimStyle]} pointerEvents="none" />

            {/* The Outer Golden Disc Bezel */}
            <View style={styles.iconDisc}>
              {/* Continuous Rotating 8-Slice Mini Wheel */}
              <Animated.View style={[styles.wheelWrapper, wheelAnimStyle]}>
                <Svg
                  width={WHEEL_SIZE}
                  height={WHEEL_SIZE}
                  viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
                >
                  <Defs>
                    <SvgGradient id="hubGrad" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0%" stopColor="#FFFFFF" />
                      <Stop offset="100%" stopColor="#FFF3E0" />
                    </SvgGradient>
                  </Defs>

                  {/* 8 Colored Wheel Slices */}
                  <G>
                    {wheelSlices.map(slice => (
                      <Path
                        key={slice.key}
                        d={slice.d}
                        fill={slice.color}
                        stroke="#FFFFFF"
                        strokeWidth={0.8}
                      />
                    ))}
                  </G>

                  {/* Outer Golden Rim */}
                  <Circle
                    cx={RADIUS}
                    cy={RADIUS}
                    r={RADIUS - 1}
                    fill="none"
                    stroke="#FFE082"
                    strokeWidth={2}
                  />

                  {/* Perimeter Bulb Pins */}
                  {perimeterBulbs.map(bulb => (
                    <Circle
                      key={bulb.key}
                      cx={bulb.cx}
                      cy={bulb.cy}
                      r={1.2}
                      fill={bulb.isGold ? '#FFF8E1' : '#FFD54F'}
                    />
                  ))}

                  {/* Center Golden Hub Disc */}
                  <Circle
                    cx={RADIUS}
                    cy={RADIUS}
                    r={RADIUS * 0.32}
                    fill="url(#hubGrad)"
                    stroke="#FF9800"
                    strokeWidth={1.6}
                  />
                  <Circle
                    cx={RADIUS}
                    cy={RADIUS}
                    r={RADIUS * 0.16}
                    fill="#FF5722"
                  />
                </Svg>
              </Animated.View>

              {/* Stationary Golden Needle Pointer at 12 o'clock */}
              <View style={styles.miniPointer} pointerEvents="none">
                <MaterialCommunityIcons
                  name="triangle-down"
                  size={15}
                  color="#FFD54F"
                />
              </View>
            </View>
          </View>

          {/* Center Copy */}
          <View style={styles.content}>
            <View style={styles.badgeRow}>
              <View style={styles.guaranteeBadge}>
                <MaterialCommunityIcons
                  name={badgeIcon}
                  size={11}
                  color="#D84315"
                />
                <Text style={styles.guaranteeText}>{badgeText}</Text>
              </View>
              <View style={styles.spinsBadge}>
                <Text style={styles.spinsBadgeText}>
                  {`${spinsCount} ${spinsCount === 1 ? 'SPIN' : 'SPINS'} LEFT`}
                </Text>
              </View>
            </View>

            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          </View>

          {/* Right Motion Graphics: Pulsing CTA Button with Sliding Arrow */}
          <Animated.View style={[styles.ctaButton, ctaAnimStyle]}>
            <Text style={styles.ctaText}>SPIN</Text>
            <Animated.View style={arrowAnimStyle}>
              <Ionicons name="arrow-forward" size={12} color="#D84315" />
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
    marginHorizontal: UI_GUTTER,
    marginTop: UI_SPACING.md,
    marginBottom: UI_SPACING.xs,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#F25000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
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
    backgroundColor: '#F25000',
  },
  topAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    zIndex: 4,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    zIndex: 2,
  },

  // Pattern 1: Speed Stripes (45° Slashes)
  speedStripesOverlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 1,
  },
  speedStripe: {
    position: 'absolute',
    width: 22,
    height: 180,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    transform: [{ rotate: '35deg' }],
  },
  speedStripe1: {
    top: -40,
    right: wp('10%'),
  },
  speedStripe2: {
    top: -50,
    right: wp('22%'),
    width: 14,
    backgroundColor: 'rgba(255, 224, 130, 0.06)',
  },
  speedStripe3: {
    top: -30,
    right: wp('36%'),
    width: 28,
  },
  speedStripe4: {
    top: -60,
    right: wp('52%'),
    width: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },

  // Pattern 2: Concentric Shockwave Rings
  concentricRingsOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 8,
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  ring1: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 224, 130, 0.18)',
    borderStyle: 'dashed',
  },
  ring2: {
    position: 'absolute',
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    borderStyle: 'dashed',
  },
  ring3: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 1,
    borderColor: 'rgba(255, 224, 130, 0.08)',
  },

  // Pattern 3: Ambient Radial Glow Orbs
  ambientOrb1: {
    position: 'absolute',
    top: -24,
    right: -24,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 1,
  },
  ambientOrb2: {
    position: 'absolute',
    bottom: -30,
    left: 60,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 179, 0, 0.12)',
    zIndex: 1,
  },

  // Shimmer Sweep
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

  // Sparkles
  sparkleWrap: {
    position: 'absolute',
    zIndex: 3,
  },
  sparkle1: {
    top: 7,
    left: 58,
  },
  sparkle2: {
    top: 9,
    right: 88,
  },
  sparkle3: {
    bottom: 8,
    right: 125,
  },

  // Mini Lucky Wheel Disc & Halo
  iconDiscContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sunburstWrapper: {
    position: 'absolute',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  iconHalo: {
    position: 'absolute',
    width: wp('14%'),
    height: wp('14%'),
    borderRadius: wp('7%'),
    backgroundColor: '#FFA726',
    zIndex: 1,
  },
  iconDisc: {
    width: WHEEL_SIZE + 6,
    height: WHEEL_SIZE + 6,
    borderRadius: (WHEEL_SIZE + 6) / 2,
    backgroundColor: 'rgba(28, 9, 2, 0.42)',
    borderWidth: 1.5,
    borderColor: '#FFE082',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6F00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 2,
    position: 'relative',
  },
  wheelWrapper: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniPointer: {
    position: 'absolute',
    top: -4,
    zIndex: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 2,
    elevation: 3,
  },

  // Content Column
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
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 183, 77, 0.6)',
  },
  guaranteeText: {
    color: '#BF360C',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4,
    fontFamily: Fonts.gilroyBold || 'System',
  },
  spinsBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  spinsBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
    fontFamily: Fonts.gilroyBold || 'System',
  },
  title: {
    color: '#FFFFFF',
    fontSize: wp('4.1%'),
    fontFamily: Fonts.gilroyBold || 'System',
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  subtitle: {
    color: '#FFE2D6',
    fontSize: wp('2.9%'),
    fontFamily: Fonts.gilroyMedium || 'System',
    marginTop: 2,
  },

  // Right CTA Button
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
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 3,
  },
  ctaText: {
    color: '#D84315',
    fontSize: 11.5,
    fontWeight: '900',
    letterSpacing: 0.5,
    fontFamily: Fonts.gilroyBold || 'System',
  },
});
