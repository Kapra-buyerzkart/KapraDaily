import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  ViewStyle,
} from 'react-native';
import Svg, {
  Path,
  Polygon,
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from 'react-native-svg';

interface LuxuryLoaderProps {
  size?: number;
  fullscreen?: boolean;
  style?: ViewStyle;
  text?: string;
  subtext?: string;
}

export const LuxuryLoader: React.FC<LuxuryLoaderProps> = ({
  size = 88,
  fullscreen = true,
  style,
}) => {
  // Animation values
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.9)).current;
  const sparkleOpacity = useRef(new Animated.Value(0)).current;
  const sparkleScale = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // 1. Continuous smooth rotation for outer gold ring
    const spinAnim = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // 2. Center diamond breathing pulse
    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 1.08,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 0.94,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.82,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    // 3. Specular twinkle flash
    const sparkleAnim = Animated.loop(
      Animated.sequence([
        Animated.delay(600),
        Animated.parallel([
          Animated.timing(sparkleOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleScale, {
            toValue: 1.25,
            duration: 400,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(sparkleOpacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleScale, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(1400),
      ])
    );

    spinAnim.start();
    pulseAnim.start();
    sparkleAnim.start();

    return () => {
      spinAnim.stop();
      pulseAnim.stop();
      sparkleAnim.stop();
    };
  }, [spinValue, pulseScale, pulseOpacity, sparkleOpacity, sparkleScale]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animationContent = (
    <View style={[styles.animationContainer, { width: size, height: size }, style]}>
      {/* Rotating Gold Orbit Ring */}
      <Animated.View style={[styles.spinnerRing, { width: size, height: size, transform: [{ rotate: spin }] }]}>
        <Svg width={size} height={size} viewBox="0 0 88 88">
          <Defs>
            <SvgGradient id="goldArc" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FFF2D1" />
              <Stop offset="50%" stopColor="#C5A869" />
              <Stop offset="100%" stopColor="#8C6826" stopOpacity="0.15" />
            </SvgGradient>
          </Defs>
          {/* Subtle background track */}
          <Circle
            cx={44}
            cy={44}
            r={38}
            stroke="#C5A869"
            strokeWidth={1.5}
            strokeOpacity={0.25}
            fill="none"
          />
          {/* Active gold sweep arc */}
          <Circle
            cx={44}
            cy={44}
            r={38}
            stroke="url(#goldArc)"
            strokeWidth={2.8}
            strokeDasharray="115, 140"
            strokeLinecap="round"
            fill="none"
          />
          {/* Orbiting diamond spark bead */}
          <Circle cx={44} cy={6} r={3.2} fill="#FFF9E6" />
        </Svg>
      </Animated.View>

      {/* Center Faceted Diamond with breathing pulse */}
      <Animated.View
        style={[
          styles.diamondCenter,
          {
            transform: [{ scale: pulseScale }],
            opacity: pulseOpacity,
          },
        ]}
      >
        <Svg width={44} height={44} viewBox="0 0 36 36">
          <Defs>
            <SvgGradient id="gemTable" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FFFDF7" />
              <Stop offset="100%" stopColor="#F2D7A5" />
            </SvgGradient>
            <SvgGradient id="gemCrown" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#F4DEB3" />
              <Stop offset="100%" stopColor="#C5A869" />
            </SvgGradient>
            <SvgGradient id="gemPavilion" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#D4AF37" />
              <Stop offset="100%" stopColor="#8C6826" />
            </SvgGradient>
          </Defs>

          {/* Left Crown Facet */}
          <Polygon
            points="4,14 10,7 13,14"
            fill="url(#gemCrown)"
            stroke="#FFF9E6"
            strokeWidth={0.5}
          />
          {/* Table Facet */}
          <Polygon
            points="10,7 26,7 23,14 13,14"
            fill="url(#gemTable)"
            stroke="#FFF9E6"
            strokeWidth={0.5}
          />
          {/* Right Crown Facet */}
          <Polygon
            points="26,7 32,14 23,14"
            fill="url(#gemCrown)"
            stroke="#FFF9E6"
            strokeWidth={0.5}
          />

          {/* Left Pavilion Wing */}
          <Polygon
            points="4,14 13,14 18,30"
            fill="#9A752B"
            stroke="#FFF9E6"
            strokeWidth={0.5}
          />
          {/* Center Pavilion Keystone */}
          <Polygon
            points="13,14 23,14 18,30"
            fill="url(#gemPavilion)"
            stroke="#FFF9E6"
            strokeWidth={0.6}
          />
          {/* Right Pavilion Wing */}
          <Polygon
            points="23,14 32,14 18,30"
            fill="#836220"
            stroke="#FFF9E6"
            strokeWidth={0.5}
          />

          {/* Girdle Hairline */}
          <Path d="M4,14 L32,14" stroke="#FFFFFF" strokeWidth={0.6} strokeOpacity={0.8} />
        </Svg>

        {/* Twinkle Specular Star */}
        <Animated.View
          style={[
            styles.sparkleStar,
            {
              opacity: sparkleOpacity,
              transform: [{ scale: sparkleScale }],
            },
          ]}
        >
          <Svg width={16} height={16} viewBox="0 0 14 14">
            <Path
              d="M7,0 C7,3.5 10.5,7 14,7 C10.5,7 7,10.5 7,14 C7,10.5 3.5,7 0,7 C3.5,7 7,3.5 7,0 Z"
              fill="#FFFDF5"
            />
          </Svg>
        </Animated.View>
      </Animated.View>
    </View>
  );

  if (!fullscreen) {
    return animationContent;
  }

  return <View style={styles.fullScreenOverlay}>{animationContent}</View>;
};

const styles = StyleSheet.create({
  fullScreenOverlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerRing: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamondCenter: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleStar: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
  },
});

export default LuxuryLoader;
