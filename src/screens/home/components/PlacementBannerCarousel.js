import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  AppState,
} from 'react-native';
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

const DOT_ACTIVE_WIDTH = wp('2.25%');
const DOT_INACTIVE_WIDTH = wp('1.32%');
const PaginationDot = ({ scrollX, index, count, snap, infinite }) => {
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
};

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

  const BANNER_WIDTH = fullWidth ? wp('100%') : wp('85%');
  const BANNER_SPACING = fullWidth ? 0 : wp('4%');
  const ITEM_MARGIN = BANNER_SPACING / 2;
  const SNAP_INTERVAL = BANNER_WIDTH + BANNER_SPACING;
  // Side inset so the active card sits centered with an equal peek on both sides.
  const CONTENT_PADDING = fullWidth
    ? 0
    : (wp('100%') - BANNER_WIDTH) / 2 - ITEM_MARGIN;
  // Distance from the content edge to the first item's left edge (padding + its own margin).
  const ITEM_OFFSET = fullWidth ? 0 : CONTENT_PADDING + ITEM_MARGIN;

  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollX.value = event.contentOffset.x;
  });

  // Track foreground/background so a tick that fires while the app is buried
  // (its scroll animation would never run, and never report back) is skipped
  // instead of walking the index forward blindly.
  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      appStateRef.current = nextState;
    });
    return () => sub.remove();
  }, []);

  // Start on the first real banner (index 0 is the leading clone). Keyed on
  // the banner count rather than the array identity, so a parent that rebuilds
  // the array each render does not keep resetting the carousel.
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

  // Autoplay only runs while this screen is focused: a blurred screen is frozen
  // (see freezeOnBlur), so its scroll animations never complete and never fire
  // onMomentumScrollEnd — which is what used to leave the index desynced.
  useEffect(() => {
    if (!isInfinite || !isFocused) return undefined;

    // Index 0 is the leading clone, 1..banners.length are real, and
    // banners.length + 1 is the trailing clone.
    const lastIndex = banners.length + 1;

    const autoplayTimer = setInterval(() => {
      if (isDraggingRef.current || appStateRef.current !== 'active') return;

      const next = currentIndexRef.current + 1;
      if (next > lastIndex) {
        // The wrap-around never landed (interrupted animation, or a momentum
        // callback we never got). Recover by snapping back to the first real
        // banner rather than scrolling past the end of the list.
        flatListRef.current?.scrollToIndex({ index: 1, animated: false });
        currentIndexRef.current = 1;
        return;
      }

      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      currentIndexRef.current = next;
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(autoplayTimer);
  }, [isInfinite, isFocused, banners?.length]);

  if (!banners || banners.length === 0) return null;

  const extendedBanners = isInfinite
    ? [banners[banners.length - 1], ...banners, banners[0]]
    : banners;

  const getItemLayout = (_, index) => ({
    length: SNAP_INTERVAL,
    offset: ITEM_OFFSET + SNAP_INTERVAL * index,
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

    // Jump (without animation) from a cloned edge back to the real banner.
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

  if (banners.length === 1) {
    return (
      <View
        style={[
          !fullWidth && styles.carouselShadowWrapper,
          { width: BANNER_WIDTH, alignSelf: 'center' },
          style,
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => onBannerPress(banners[0])}
          style={
            fullWidth ? styles.topHomeBannerViewFull : styles.topHomeBannerView
          }
        >
          <Image source={banners[0].uri} style={styles.topHomeBannerImage} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[style, !fullWidth && { overflow: 'visible' }]}>
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
        scrollEventThrottle={16}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={
          fullWidth
            ? undefined
            : { paddingHorizontal: CONTENT_PADDING, paddingVertical: hp('1%') }
        }
        renderItem={({ item }) => (
          <View
            style={[
              !fullWidth && styles.carouselShadowWrapper,
              {
                width: BANNER_WIDTH,
                marginHorizontal: ITEM_MARGIN,
                height: '100%',
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onBannerPress(item)}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: fullWidth ? 0 : wp('4%'),
                overflow: 'hidden',
              }}
            >
              <Image
                source={item.uri}
                style={styles.topHomeBannerImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        )}
      />
      {showDots && (
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
      )}
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 4.5,
    elevation: 6,
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

export default PlacementBannerCarousel;
