import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import { FONTS } from '../styles/typography';

interface SplashScreenProps {
  isReady?: boolean;
  onFinish?: () => void;
  minDuration?: number;
}

const BRAND_LOGO = require('../assets/icons/kapragnd.png');

export const SplashScreen: React.FC<SplashScreenProps> = ({
  isReady = true,
  onFinish,
  minDuration = 2200,
}) => {
  // Animation values
  const logoScale = useRef(new Animated.Value(0.88)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglintTranslateY = useRef(new Animated.Value(8)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  // Pulse dots animation values
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  // Track readiness
  const isReadyRef = useRef(isReady);
  isReadyRef.current = isReady;

  const minTimePassedRef = useRef(false);
  const finishedRef = useRef(false);

  const attemptExit = () => {
    if (
      minTimePassedRef.current &&
      isReadyRef.current &&
      !finishedRef.current
    ) {
      finishedRef.current = true;
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        onFinish?.();
      });
    }
  };

  useEffect(() => {
    // 1. Entrance animation sequence
    Animated.parallel([
      // Logo scale & fade
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
      // Tagline entrance (staggered)
      Animated.sequence([
        Animated.delay(350),
        Animated.parallel([
          Animated.timing(taglineOpacity, {
            toValue: 1,
            duration: 650,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(taglintTranslateY, {
            toValue: 0,
            duration: 650,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]),
      // Footer entrance
      Animated.sequence([
        Animated.delay(650),
        Animated.timing(footerOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 2. Pulse dots looping animation
    const animateDot = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.delay(500 - delay > 0 ? 500 - delay : 100),
        ]),
      );
    };

    const dotAnimation = Animated.parallel([
      animateDot(dot1, 0),
      animateDot(dot2, 180),
      animateDot(dot3, 360),
    ]);
    dotAnimation.start();

    // 3. Minimum duration timer
    const minTimer = setTimeout(() => {
      minTimePassedRef.current = true;
      attemptExit();
    }, minDuration);

    return () => {
      clearTimeout(minTimer);
      dotAnimation.stop();
    };
  }, []);

  // Check if ready state changed after min timer
  useEffect(() => {
    isReadyRef.current = isReady;
    if (isReady) {
      attemptExit();
    }
  }, [isReady]);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0C382E" />

      {/* Top spacer for balanced vertical alignment */}
      <View style={styles.topSpacer} />

      {/* Centered Brand Content */}
      <View style={styles.centerWrapper}>
        {/* Brand Logo in crisp white */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={BRAND_LOGO}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Luxury Divider with central diamond ornament */}
        <Animated.View
          style={[
            styles.taglineWrapper,
            {
              opacity: taglineOpacity,
              transform: [{ translateY: taglintTranslateY }],
            },
          ]}
        >
          <View style={styles.dividerRow}>
            <View style={styles.accentLine} />
            <Text style={styles.diamondSymbol}>◈</Text>
            <View style={styles.accentLine} />
          </View>

          <Text style={styles.taglineText}>PURVEYORS OF FINE JEWELLERY</Text>
        </Animated.View>
      </View>

      {/* Bottom Loading / Hallmark Area */}
      <Animated.View
        style={[styles.bottomContainer, { opacity: footerOpacity }]}
      >
        {/* Minimalist pulse dots */}
        <View style={styles.dotsRow}>
          <Animated.View style={[styles.dot, { opacity: dot1 }]} />
          <Animated.View style={[styles.dot, { opacity: dot2 }]} />
          <Animated.View style={[styles.dot, { opacity: dot3 }]} />
        </View>

        <Text style={styles.hallmarkText}>CERTIFIED GOLD & DIAMONDS</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C382E',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  topSpacer: {
    height: 40,
  },
  centerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 240,
    height: 100,
    tintColor: '#FFFFFF',
  },
  taglineWrapper: {
    alignItems: 'center',
    marginTop: 18,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 170,
    marginBottom: 10,
  },
  accentLine: {
    flex: 1,
    height: 0.8,
    backgroundColor: '#C5A869',
    opacity: 0.5,
  },
  diamondSymbol: {
    fontSize: 10,
    color: '#C5A869',
    marginHorizontal: 8,
    opacity: 0.85,
  },
  taglineText: {
    fontSize: 10,
    fontFamily: FONTS.lexend.medium,
    color: '#C5A869',
    letterSpacing: 3.5,
    textTransform: 'uppercase',
  },
  bottomContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#C5A869',
    marginHorizontal: 4,
  },
  hallmarkText: {
    fontSize: 9.5,
    fontFamily: FONTS.lexend.regular,
    color: 'rgba(255, 255, 255, 0.65)',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});

export default SplashScreen;
