import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import Animated, {
  FadeIn,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedPressable from '@/components/AnimatedPressable';
import COLORS from '@/styles/colors';
import styles, { HERO_HEIGHT } from '../styles';

const EventHero = ({ event, insets, onBack, scrollY }) => {
  const parallaxStyle = useAnimatedStyle(() => {
    const y = scrollY?.value ?? 0;
    return {
      transform: [
        {
          translateY: interpolate(
            y,
            [0, HERO_HEIGHT],
            [0, HERO_HEIGHT * 0.5],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(
            y,
            [-HERO_HEIGHT, 0],
            [1.6, 1],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.hero}>
      <Animated.View style={[styles.heroImageWrap, parallaxStyle]}>
        <ImageBackground
          source={require('../../../assets/images/noimages/fallback.png')}
          style={styles.heroImageBg}
          imageStyle={styles.heroImage}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.heroScrim}
            pointerEvents="none"
          />
        </ImageBackground>
      </Animated.View>

      <View
        style={[
          styles.heroTopRow,
          { paddingTop: insets.top > 0 ? insets.top + 8 : 44 },
        ]}
      >
        <AnimatedPressable
          entering={FadeIn.delay(150)}
          onPress={onBack}
          hitSlop={16}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </AnimatedPressable>
        <Text style={styles.heroTitle}>Events</Text>
      </View>
    </View>
  );
};

export default React.memo(EventHero);
