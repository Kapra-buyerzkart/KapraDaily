import React, { useCallback, useEffect, useRef } from 'react';
import { View, Image, ImageBackground, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useAnimatedScrollHandler,
  useSharedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { wp, hp } from '../../utils/responsive';
import { getVoucherImageSource } from './imageUtils';
import AnimatedPressable from '@/components/AnimatedPressable';
import icons from '../../assets/icons';

const AUTOPLAY_INTERVAL_MS = 4000;
// Each slide fills the full screen width so exactly ONE banner is visible at a
// time — no sliver of the neighbouring slide peeking in. The rounded card sits
// centered inside that full-width cell, keeping the card look without the peek.
const PAGE_WIDTH = wp(100);
const CARD_WIDTH = wp(88);
const BANNER_HEIGHT = hp(26);
const SNAP_INTERVAL = PAGE_WIDTH;

const DOT_ACTIVE_WIDTH = 18;
const DOT_INACTIVE_WIDTH = 6;

const getItemLayout = (_, index) => ({
  length: SNAP_INTERVAL,
  offset: SNAP_INTERVAL * index,
  index,
});

const keyExtractor = (item, index) => `${item?.voucherId ?? index}-${index}`;

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// "2025-08-24T..." -> "24 Aug 2025". Returns '' for missing/invalid dates.
const formatEventDate = value => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

const PaginationDot = React.memo(
  ({ scrollX, index, count, snap, infinite }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const pos = scrollX.value / snap;
      const realPos = infinite ? (((pos - 1) % count) + count) % count : pos;
      let dist = Math.abs(realPos - index);
      if (infinite) dist = Math.min(dist, count - dist);
      dist = Math.min(dist, 1);
      return {
        width: interpolate(
          dist,
          [0, 1],
          [DOT_ACTIVE_WIDTH, DOT_INACTIVE_WIDTH],
          Extrapolation.CLAMP,
        ),
        opacity: interpolate(dist, [0, 1], [1, 0.35], Extrapolation.CLAMP),
      };
    });
    return <Animated.View style={[styles.dot, animatedStyle]} />;
  },
);

const Slide = React.memo(({ item, onPress }) => {
  const isEvent = !!item?.isEvent;
  const dateLabel = formatEventDate(item?.eventStartDate);
  const metaParts = [dateLabel, item?.venue].filter(Boolean);

  return (
    <View style={styles.slide}>
      <AnimatedPressable style={styles.card} onPress={() => onPress?.(item)}>
        <Image
          source={getVoucherImageSource(item)}
          style={styles.image}
          resizeMode="cover"
        />
        {isEvent && (
          <>
            <LinearGradient
              colors={['rgba(0,0,0,0.88)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.scrim}
            />
            <View style={styles.content}>
              <Text style={styles.eyebrow}>FEATURED EVENT</Text>
              {!!item?.title && (
                <Text style={styles.title} numberOfLines={2}>
                  {item.title}
                </Text>
              )}

              {!!item?.subtitle && (
                <Text style={styles.subtitle} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              )}
              {metaParts.length > 0 && (
                <Text style={styles.meta} numberOfLines={1}>
                  {metaParts.join('  •  ')}
                </Text>
              )}
              <ImageBackground
                source={icons.selectionPillTwo}
                style={styles.bookButton}
                imageStyle={styles.bookButtonImage}
                resizeMode="stretch"
              >
                <Text style={styles.bookButtonText}>Book Now</Text>
              </ImageBackground>
            </View>
          </>
        )}
      </AnimatedPressable>
    </View>
  );
});

const HeroCarousel = ({ data, onItemPress }) => {
  const flatListRef = useRef(null);
  const currentIndexRef = useRef(1);
  const isDraggingRef = useRef(false);
  const scrollX = useSharedValue(0);

  const banners = data ?? [];
  const isInfinite = banners.length > 1;

  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollX.value = event.contentOffset.x;
  });

  useEffect(() => {
    if (!isInfinite) return undefined;

    currentIndexRef.current = 1;
    scrollX.value = SNAP_INTERVAL;
    const resetTimer = setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: 1, animated: false });
    }, 0);

    const autoplayTimer = setInterval(() => {
      if (isDraggingRef.current) return;
      const next = currentIndexRef.current + 1;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      currentIndexRef.current = next;
    }, AUTOPLAY_INTERVAL_MS);

    return () => {
      clearTimeout(resetTimer);
      clearInterval(autoplayTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInfinite, banners.length]);

  const renderSlide = useCallback(
    ({ item }) => <Slide item={item} onPress={onItemPress} />,
    [onItemPress],
  );

  if (banners.length === 0) return null;

  if (banners.length === 1) {
    return (
      <View style={[styles.wrapper, styles.singleWrapper]}>
        <Slide item={banners[0]} onPress={onItemPress} />
      </View>
    );
  }

  const extendedBanners = isInfinite
    ? [banners[banners.length - 1], ...banners, banners[0]]
    : banners;

  const onScrollBeginDrag = () => {
    isDraggingRef.current = true;
  };

  const onMomentumScrollEnd = e => {
    isDraggingRef.current = false;
    if (!isInfinite) return;

    const slideIndex = Math.round(
      e.nativeEvent.contentOffset.x / SNAP_INTERVAL,
    );
    currentIndexRef.current = slideIndex;

    if (slideIndex === 0) {
      currentIndexRef.current = banners.length;
      flatListRef.current?.scrollToIndex({
        index: banners.length,
        animated: false,
      });
    } else if (slideIndex === extendedBanners.length - 1) {
      currentIndexRef.current = 1;
      flatListRef.current?.scrollToIndex({ index: 1, animated: false });
    }
  };

  return (
    <View style={styles.wrapper}>
      <Animated.FlatList
        ref={flatListRef}
        data={extendedBanners}
        horizontal
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        onScrollBeginDrag={onScrollBeginDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={getItemLayout}
        initialScrollIndex={1}
        scrollEventThrottle={16}
        keyExtractor={keyExtractor}
        renderItem={renderSlide}
      />
      <View style={styles.pagination}>
        {banners.map((_, i) => (
          <PaginationDot
            key={i}
            scrollX={scrollX}
            index={i}
            count={banners.length}
            snap={SNAP_INTERVAL}
            infinite={isInfinite}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 8,
  },
  singleWrapper: {
    alignItems: 'center',
  },
  slide: {
    width: PAGE_WIDTH,
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#161616',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  scrim: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '80%',
  },
  content: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '80%',
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  eyebrow: {
    color: '#C9A9FF',
    fontSize: 11,
    fontFamily: 'Gilroy-Bold',
    letterSpacing: 1.5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 26,
    fontFamily: 'Gilroy-Heavy',
    textTransform: 'uppercase',
    marginTop: 8,
  },
  titleAccent: {
    width: 90,
    height: 3,
    borderRadius: 2,
    marginTop: 8,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Gilroy-SemiBold',
    marginTop: 10,
  },
  meta: {
    color: '#D8D8D8',
    fontSize: 12,
    fontFamily: 'Gilroy-Medium',
    marginTop: 8,
  },
  bookButton: {
    width: 132,
    height: 46,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonImage: {
    borderRadius: 12,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Gilroy-Bold',
    letterSpacing: 0.3,
  },
  pagination: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 10,
  },
  dot: {
    height: 6,
    backgroundColor: '#9A5CFF',
    borderRadius: 30,
    marginHorizontal: 3,
  },
});

export default React.memo(HeroCarousel);
