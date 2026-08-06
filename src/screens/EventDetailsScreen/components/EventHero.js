import React, { useEffect, useMemo } from 'react';
import { View, Image, ImageBackground, Dimensions } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import LinearGradient from 'react-native-linear-gradient';
import { getEventGalleryImages } from '@/components/events/imageUtils';
import styles, {
  HERO_HEIGHT,
  HERO_SCRIM_COLORS,
  HERO_SCRIM_LOCATIONS,
  HERO_TOP_SCRIM_COLORS,
} from '../styles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const FALLBACK_IMAGE = require('../../../assets/images/noimages/fallback.png');

const HeroImage = ({ source }) => (
  <ImageBackground
    source={source}
    defaultSource={FALLBACK_IMAGE}
    fadeDuration={0}
    style={styles.heroImageBg}
    imageStyle={styles.heroImage}
  />
);

const HeroScrims = () => (
  <>
    <LinearGradient
      colors={HERO_TOP_SCRIM_COLORS}
      style={styles.heroTopScrim}
      pointerEvents="none"
    />
    <LinearGradient
      colors={HERO_SCRIM_COLORS}
      locations={HERO_SCRIM_LOCATIONS}
      style={styles.heroScrim}
      pointerEvents="none"
    />
  </>
);

const HeroDot = ({ index, progress, count }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const raw = Math.abs(progress.value - index);
    const distance = Math.min(raw, count - raw);
    return {
      width: interpolate(distance, [0, 1], [18, 6], Extrapolation.CLAMP),
      opacity: interpolate(distance, [0, 1], [1, 0.4], Extrapolation.CLAMP),
    };
  });

  return <Animated.View style={[styles.heroDot, animatedStyle]} />;
};

const EventHero = ({ event, scrollY }) => {
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
      opacity: interpolate(
        y,
        [0, HERO_HEIGHT * 0.75],
        [1, 0.25],
        Extrapolation.CLAMP,
      ),
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

  const dotsStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY?.value ?? 0,
      [0, HERO_HEIGHT * 0.25],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <View style={styles.hero}>
      <Animated.View style={[styles.heroImageWrap, parallaxStyle]}>
        {hasCarousel ? (
          <Carousel
            loop
            autoPlay
            autoPlayInterval={3500}
            width={SCREEN_WIDTH}
            height={HERO_HEIGHT}
            data={gallery}
            scrollAnimationDuration={600}
            onProgressChange={progress}
            renderItem={({ item, index }) => (
              <HeroImage key={index} source={item} />
            )}
          />
        ) : (
          <HeroImage source={gallery[0]} />
        )}
      </Animated.View>

      <HeroScrims />

      {/* {hasCarousel && (
        <Animated.View
          style={[styles.heroDots, dotsStyle]}
          pointerEvents="none"
        >
          {gallery.map((_, i) => (
            <HeroDot
              key={i}
              index={i}
              progress={progress}
              count={gallery.length}
            />
          ))}
        </Animated.View>
      )} */}
    </View>
  );
};

export default React.memo(EventHero);
