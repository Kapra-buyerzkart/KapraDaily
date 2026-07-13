import React, { useEffect, useRef } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

const AUTOPLAY_INTERVAL_MS = 4000;
const BANNER_WIDTH = wp(88);
const BANNER_HEIGHT = hp(26);
const BANNER_SPACING = wp(4);
const ITEM_MARGIN = BANNER_SPACING / 2;
const SNAP_INTERVAL = BANNER_WIDTH + BANNER_SPACING;
const CONTENT_PADDING = (wp(100) - BANNER_WIDTH) / 2 - ITEM_MARGIN;

const DOT_ACTIVE_WIDTH = 18;
const DOT_INACTIVE_WIDTH = 6;

const PaginationDot = ({ scrollX, index, count, snap, infinite }) => {
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
};

const Slide = ({ item, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.9}
    style={styles.slide}
    onPress={() => onPress?.(item)}
  >
    <Image
      source={getVoucherImageSource(item)}
      style={styles.image}
      resizeMode="cover"
    />
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.8)']}
      style={styles.scrim}
      pointerEvents="none"
    />
    <View style={styles.captionRow}>
      {!!item?.title && (
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
      )}
      <View style={styles.pricePill}>
        <Text style={styles.priceText}>From ₹{item?.denomination ?? 0}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

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
  }, [isInfinite, banners]);

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

  const getItemLayout = (_, index) => ({
    length: SNAP_INTERVAL,
    offset: CONTENT_PADDING + SNAP_INTERVAL * index,
    index,
  });

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
        keyExtractor={(item, index) => `${item?.voucherId ?? index}-${index}`}
        contentContainerStyle={{ paddingHorizontal: CONTENT_PADDING }}
        renderItem={({ item }) => <Slide item={item} onPress={onItemPress} />}
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
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    marginHorizontal: ITEM_MARGIN,
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
    right: 0,
    bottom: 0,
    height: '55%',
  },
  captionRow: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Gilroy-Bold',
    marginRight: 10,
  },
  pricePill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  priceText: {
    color: '#000000',
    fontSize: 12,
    fontFamily: 'Gilroy-Bold',
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

export default HeroCarousel;
