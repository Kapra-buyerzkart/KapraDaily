import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Image, ImageBackground, Dimensions } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import LinearGradient from 'react-native-linear-gradient';
import Shimmer from '@/components/events/Shimmer';
import {
  getEventGalleryImages,
  getEventImageSource,
} from '@/components/events/imageUtils';
import styles, {
  HERO_HEIGHT,
  HERO_SCRIM_COLORS,
  HERO_SCRIM_LOCATIONS,
  HERO_TOP_SCRIM_COLORS,
} from '../styles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GALLERY_FADE_DURATION = 260;
// A prefetch that never settles must not strand the hero on the placeholder.
const WARM_TIMEOUT = 4000;

const HeroImage = ({ source }) => (
  <ImageBackground
    source={source}
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

const HeroPlaceholder = () => <Shimmer style={styles.heroPlaceholder} />;

const galleryKeyOf = sources =>
  sources.map(source => source?.uri ?? source).join('|');

// Warm the first slide before it is mounted, so it paints on its first frame
// instead of showing an empty box. The rest can keep downloading in background.
const warmGallery = sources => {
  const [first, ...rest] = sources;
  rest.forEach(source => {
    if (source?.uri) Image.prefetch(source.uri).catch(() => {});
  });
  return first?.uri
    ? Image.prefetch(first.uri).catch(() => false)
    : Promise.resolve(false);
};

const EventHero = ({ event, loading, scrollY }) => {
  // The screen opens on the list payload, which carries no gallery of its own.
  // The card image is deliberately not borrowed to fill the gap: it is a
  // different crop, so it would visibly swap itself out the moment the real
  // gallery lands. The hero holds a placeholder instead. Once the details are
  // in and there is still no gallery, the card image is all there is.
  const nextGallery = useMemo(() => {
    const images = getEventGalleryImages(event);
    if (images.length) return images;
    return loading ? [] : [getEventImageSource(event)];
  }, [event, loading]);
  const progress = useSharedValue(0);

  // `event` is re-created on every detail fetch / pull-to-refresh, so pin the
  // gallery to its image list: identical images must never re-mount the hero.
  const galleryKey = galleryKeyOf(nextGallery);
  const galleryRef = useRef(nextGallery);
  const galleryKeyRef = useRef(galleryKey);
  if (galleryKeyRef.current !== galleryKey) {
    galleryKeyRef.current = galleryKey;
    galleryRef.current = nextGallery;
  }
  const gallery = galleryRef.current;

  // Only promoted once its images are decoded, so it mounts already painted.
  const [readyGallery, setReadyGallery] = useState(null);

  useEffect(() => {
    if (gallery.length === 0) return undefined;

    let cancelled = false;
    const promote = () => {
      if (!cancelled) setReadyGallery(gallery);
    };

    const timer = setTimeout(promote, WARM_TIMEOUT);
    warmGallery(gallery).then(() => {
      clearTimeout(timer);
      promote();
    });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [gallery]);

  // Kept mounted underneath until the fade is over, so no frame of the hero is
  // ever bare while the carousel is still translucent.
  const [placeholderVisible, setPlaceholderVisible] = useState(true);

  const galleryOpacity = useSharedValue(0);
  useEffect(() => {
    if (!readyGallery) return;
    galleryOpacity.value = withTiming(
      1,
      { duration: GALLERY_FADE_DURATION },
      finished => {
        if (finished) runOnJS(setPlaceholderVisible)(false);
      },
    );
  }, [readyGallery, galleryOpacity]);

  const galleryStyle = useAnimatedStyle(() => ({
    opacity: galleryOpacity.value,
  }));

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
        {placeholderVisible && <HeroPlaceholder />}

        {readyGallery && (
          <Animated.View style={[styles.heroImageWrap, galleryStyle]}>
            {readyGallery.length > 1 ? (
              <Carousel
                loop
                autoPlay
                autoPlayInterval={3500}
                width={SCREEN_WIDTH}
                height={HERO_HEIGHT}
                data={readyGallery}
                scrollAnimationDuration={600}
                onProgressChange={progress}
                renderItem={({ item, index }) => (
                  <HeroImage key={index} source={item} />
                )}
              />
            ) : (
              <HeroImage source={readyGallery[0]} />
            )}
          </Animated.View>
        )}
      </Animated.View>

      <HeroScrims />

      {/* {readyGallery && readyGallery.length > 1 && (
        <Animated.View
          style={[styles.heroDots, dotsStyle]}
          pointerEvents="none"
        >
          {readyGallery.map((_, i) => (
            <HeroDot
              key={i}
              index={i}
              progress={progress}
              count={readyGallery.length}
            />
          ))}
        </Animated.View>
      )} */}
    </View>
  );
};

export default React.memo(EventHero);
