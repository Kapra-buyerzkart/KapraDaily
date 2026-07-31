import React, { useEffect, useMemo } from 'react';
import { View, Image, ImageBackground, Dimensions } from 'react-native';
import Animated, {
  FadeIn,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedPressable from '@/components/AnimatedPressable';
import COLORS from '@/styles/colors';
import { getEventGalleryImages } from '@/components/events/imageUtils';
import styles, { HERO_HEIGHT } from '../styles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const FALLBACK_IMAGE = require('../../../assets/images/noimages/fallback.png');

const HeroImage = ({ source }) => (
  <ImageBackground
    source={source}
    defaultSource={FALLBACK_IMAGE}
    fadeDuration={0}
    style={styles.heroImageBg}
    imageStyle={styles.heroImage}
  >
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.8)']}
      style={styles.heroScrim}
      pointerEvents="none"
    />
  </ImageBackground>
);

const HeroDot = ({ index, progress, count }) => {
  const animatedStyle = useAnimatedStyle(() => {
    // Fractional distance from this dot to the current slide, wrapped for loop.
    const raw = Math.abs(progress.value - index);
    const distance = Math.min(raw, count - raw);
    return {
      width: interpolate(distance, [0, 1], [18, 6], Extrapolation.CLAMP),
      opacity: interpolate(distance, [0, 1], [1, 0.4], Extrapolation.CLAMP),
    };
  });

  return <Animated.View style={[styles.heroDot, animatedStyle]} />;
};

const EventHero = ({ event, insets, onBack, scrollY }) => {
  const gallery = useMemo(() => getEventGalleryImages(event), [event]);
  const progress = useSharedValue(0);
  const hasCarousel = gallery.length > 1;

  useEffect(() => {
    gallery.forEach(src => {
      if (src?.uri) Image.prefetch(src.uri);
    });
  }, [gallery]);

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
      {hasCarousel ? (
        <>
          <Carousel
            loop
            autoPlay
            autoPlayInterval={3500}
            width={SCREEN_WIDTH}
            height={HERO_HEIGHT}
            data={gallery}
            scrollAnimationDuration={600}
            onProgressChange={progress}
            renderItem={({ item, index }) => <HeroImage key={index} source={item} />}
          />
          <View style={styles.heroDots} pointerEvents="none">
            {gallery.map((_, i) => (
              <HeroDot
                key={i}
                index={i}
                progress={progress}
                count={gallery.length}
              />
            ))}
          </View>
        </>
      ) : (
        <Animated.View style={[styles.heroImageWrap, parallaxStyle]}>
          <HeroImage source={gallery[0]} />
        </Animated.View>
      )}

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
        {/* <Text style={styles.heroTitle}>Events</Text> */}
      </View>
    </View>
  );
};

export default React.memo(EventHero);
