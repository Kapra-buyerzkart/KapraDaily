import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, AppState } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useAnimatedScrollHandler,
  useSharedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CachedImage from '../../../components/CachedImage';

const DOT_ACTIVE_WIDTH = wp('2.25%');
const DOT_INACTIVE_WIDTH = wp('1.32%');
const PaginationDot = React.memo(function PaginationDot({
  scrollX,
  index,
  count,
  snap,
  infinite,
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const pos = scrollX.value / snap;
    const realPos = infinite ? (((pos - 1) % count) + count) % count : pos;
    let dist = Math.abs(realPos - index);
    if (infinite) {
      dist = Math.min(dist, count - dist);
    }
    dist = Math.min(dist, 1);
    return {
      width: interpolate(
        dist,
        [0, 1],
        [DOT_ACTIVE_WIDTH, DOT_INACTIVE_WIDTH],
        Extrapolation.CLAMP,
      ),
      opacity: interpolate(dist, [0, 1], [1, 0.3], Extrapolation.CLAMP),
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
});

const AUTOPLAY_INTERVAL_MS = 4000;

const PlacementBannerCarousel = ({
  banners,
  onBannerPress,
  style,
  fullWidth = false,
  showDots = true,
  infinite = false,
}) => {
  const flatListRef = useRef(null);
  const currentIndexRef = useRef(1);
  const isDraggingRef = useRef(false);
  const scrollX = useSharedValue(0);
  const isFocused = useIsFocused();
  const appStateRef = useRef(AppState.currentState);

  const isInfinite = infinite && !!banners && banners.length > 1;

  const geometry = useMemo(() => {
    const bannerWidth = fullWidth ? wp('100%') : wp('85%');
    const bannerSpacing = fullWidth ? 0 : wp('4%');
    const itemMargin = bannerSpacing / 2;
    const contentPadding = fullWidth
      ? 0
      : (wp('100%') - bannerWidth) / 2 - itemMargin;

    return {
      SNAP_INTERVAL: bannerWidth + bannerSpacing,
      cellStyle: [
        !fullWidth && styles.carouselShadowWrapper,
        {
          width: bannerWidth,
          marginHorizontal: itemMargin,
          height: '100%',
        },
      ],
      touchableStyle: {
        width: '100%',
        height: '100%',
        borderRadius: fullWidth ? 0 : wp('4%'),
        overflow: 'hidden',
      },
      listContentStyle: fullWidth
        ? undefined
        : { paddingHorizontal: contentPadding, paddingVertical: hp('1%') },
      singleStyle: [
        !fullWidth && styles.carouselShadowWrapper,
        { width: bannerWidth, alignSelf: 'center' },
      ],
    };
  }, [fullWidth]);
  const { SNAP_INTERVAL } = geometry;

  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollX.value = event.contentOffset.x;
  });

  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      appStateRef.current = nextState;
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!isInfinite) return undefined;

    currentIndexRef.current = 1;
    scrollX.value = SNAP_INTERVAL;
    const resetTimer = setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: 1, animated: false });
    }, 0);

    return () => clearTimeout(resetTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInfinite, banners?.length]);

  useEffect(() => {
    if (!isInfinite || !isFocused) return undefined;

    const lastIndex = banners.length + 1;

    const autoplayTimer = setInterval(() => {
      if (isDraggingRef.current || appStateRef.current !== 'active') return;

      const next = currentIndexRef.current + 1;
      if (next > lastIndex) {
        flatListRef.current?.scrollToIndex({ index: 1, animated: false });
        currentIndexRef.current = 1;
        return;
      }

      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      currentIndexRef.current = next;
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(autoplayTimer);
  }, [isInfinite, isFocused, banners?.length]);

  const extendedBanners = useMemo(() => {
    const list = banners || [];
    return isInfinite ? [list[list.length - 1], ...list, list[0]] : list;
  }, [banners, isInfinite]);

  const getItemLayout = useCallback(
    (_, index) => ({
      length: SNAP_INTERVAL,
      offset: SNAP_INTERVAL * index,
      index,
    }),
    [SNAP_INTERVAL],
  );

  const onScrollBeginDrag = useCallback(() => {
    isDraggingRef.current = true;
  }, []);

  const onMomentumScrollEnd = useCallback(
    e => {
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
    },
    [isInfinite, SNAP_INTERVAL, banners, extendedBanners.length],
  );

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  const renderItem = useCallback(
    ({ item }) => (
      <View style={geometry.cellStyle}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => onBannerPress(item)}
          style={geometry.touchableStyle}
        >
          <CachedImage
            source={item.uri}
            style={styles.topHomeBannerImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    ),
    [geometry, onBannerPress],
  );

  const listStyle = useMemo(
    () => [style, !fullWidth && { overflow: 'visible' }],
    [style, fullWidth],
  );

  if (!banners || banners.length === 0) return null;

  if (banners.length === 1) {
    return (
      <View style={[geometry.singleStyle, style]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => onBannerPress(banners[0])}
          style={
            fullWidth ? styles.topHomeBannerViewFull : styles.topHomeBannerView
          }
        >
          <CachedImage
            source={banners[0].uri}
            style={styles.topHomeBannerImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={listStyle}>
      <Animated.FlatList
        ref={flatListRef}
        data={extendedBanners}
        horizontal
        pagingEnabled={fullWidth}
        snapToInterval={fullWidth ? undefined : SNAP_INTERVAL}
        snapToAlignment={fullWidth ? undefined : 'start'}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        onScrollBeginDrag={isInfinite ? onScrollBeginDrag : undefined}
        onMomentumScrollEnd={isInfinite ? onMomentumScrollEnd : undefined}
        getItemLayout={isInfinite ? getItemLayout : undefined}
        initialScrollIndex={isInfinite ? 1 : undefined}
        scrollEventThrottle={1}
        keyExtractor={keyExtractor}
        contentContainerStyle={geometry.listContentStyle}
        renderItem={renderItem}
      />
      {/* {showDots && (
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
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  topHomeBannerView: {
    width: '100%',
    height: hp('20%'),
    alignSelf: 'center',
    borderRadius: wp('4%'),
    overflow: 'hidden',
  },
  carouselShadowWrapper: {
    shadowColor: '#ff4d00ff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 4.5,
    elevation: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: wp('4%'),
  },
  topHomeBannerViewFull: {
    width: wp('100%'),
    height: hp('67%'),
  },
  topHomeBannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: hp('1%'),
  },
  dot: {
    height: wp('1.0%'),
    backgroundColor: '#F25000',
    borderRadius: 30,
    marginHorizontal: wp('0.17%'),
  },
});

export default React.memo(PlacementBannerCarousel);
