import React from 'react';
import { View, Image, Animated, Dimensions, StatusBar } from 'react-native';
import { splashStyles as styles } from './styles';
import PulsingDot from './components/PulsingDot';
import GradientBackground from './components/GradientBackground';
import { useTicketAnimations } from './animations';

const { width } = Dimensions.get('window');

const TicketSplashScreen = ({ navigation }) => {
  const {
    logoScale,
    logoOpacity,
    circleScale1,
    circleScale2,
    circleOpacity1,
    circleOpacity2,
    fadeToBlackOpacity,
  } = useTicketAnimations(width, () => {
    navigation.replace('TicketLanding');
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0415" />
      <GradientBackground>
        <Animated.View
          style={[
            styles.bgCircle,
            styles.bgCircle1,
            {
              transform: [{ scale: circleScale1 }],
              opacity: circleOpacity1,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.bgCircle,
            styles.bgCircle2,
            {
              transform: [{ scale: circleScale2 }],
              opacity: circleOpacity2,
            },
          ]}
        />

        {}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        >
          <Image
            source={require('../../assets/images/movieTicket/udendeallanding.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        {}

        {}
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map(i => (
            <PulsingDot key={i} delay={i * 200} />
          ))}
        </View>
      </GradientBackground>
      <Animated.View
        style={[styles.fadeOverlay, { opacity: fadeToBlackOpacity }]}
        pointerEvents="none"
      />
    </View>
  );
};

export default TicketSplashScreen;
