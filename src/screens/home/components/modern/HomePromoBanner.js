import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, FlatList, Dimensions, StyleSheet, AppState } from 'react-native';
import AnimatedPressable from '@/components/AnimatedPressable';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CachedImage from '@/components/CachedImage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * HomePromoBanner
 *
 * A swipeable promotional banner carousel without pagination dots.
 * Supports a single banner or an array of banners.
 */
const HomePromoBanner = ({
  banner,
  banners,
  onPress,
  autoPlay = true,
  autoPlayInterval = 3500,
  style,
  cardStyle,
  aspectRatio = 3.3,
}) => {
  const flatListRef = useRef(null);
  const currentIndexRef = useRef(0);
  const isDraggingRef = useRef(false);
  const appStateRef = useRef(AppState.currentState);

  // Normalize input: accepts `banners` array, `banner` array, or single `banner` object
  const bannerList = useMemo(() => {
    const list = Array.isArray(banners)
      ? banners
      : Array.isArray(banner)
      ? banner
      : banner
      ? [banner]
      : [];
    return list.filter(b => b && (b.uri || b.imageUrl || b.image));
  }, [banner, banners]);

  // Track app state to pause autoplay when backgrounded
  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      appStateRef.current = nextState;
    });
    return () => sub.remove();
  }, []);

  // Autoplay handler
  useEffect(() => {
    if (!autoPlay || bannerList.length <= 1) return undefined;

    const timer = setInterval(() => {
      if (isDraggingRef.current || appStateRef.current !== 'active') return;

      const next = (currentIndexRef.current + 1) % bannerList.length;
      currentIndexRef.current = next;

      flatListRef.current?.scrollToOffset({
        offset: next * SCREEN_WIDTH,
        animated: true,
      });
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, bannerList.length]);

  const onScrollBeginDrag = useCallback(() => {
    isDraggingRef.current = true;
  }, []);

  const onMomentumScrollEnd = useCallback(
    e => {
      isDraggingRef.current = false;
      const x = e.nativeEvent.contentOffset.x;
      const index = Math.round(x / SCREEN_WIDTH);
      currentIndexRef.current = Math.max(
        0,
        Math.min(bannerList.length - 1, index),
      );
    },
    [bannerList.length],
  );

  const keyExtractor = useCallback(
    (item, index) =>
      item?.bannerId?.toString() ||
      item?.id?.toString() ||
      `promo_banner_${index}`,
    [],
  );

  const renderItem = useCallback(
    ({ item }) => {
      const source = item.uri || item.imageUrl || item.image;
      return (
        <View style={styles.slideWrapper}>
          <AnimatedPressable
            onPress={() => onPress && onPress(item)}
            style={[styles.bannerContainer, { aspectRatio }, cardStyle]}
            accessibilityRole="button"
            accessibilityLabel={item.title || 'Promotional banner'}
            activeOpacity={0.92}
          >
            <CachedImage
              source={source}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </AnimatedPressable>
        </View>
      );
    },
    [onPress, aspectRatio, cardStyle],
  );

  if (bannerList.length === 0) return null;

  if (bannerList.length === 1) {
    const single = bannerList[0];
    const source = single.uri || single.imageUrl || single.image;
    return (
      <View style={[styles.outerContainer, style]}>
        <View style={styles.singleBannerWrapper}>
          <AnimatedPressable
            onPress={() => onPress && onPress(single)}
            style={[styles.bannerContainer, { aspectRatio }, cardStyle]}
            accessibilityRole="button"
            accessibilityLabel={single.title || 'Promotional banner'}
            activeOpacity={0.92}
          >
            <CachedImage
              source={source}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </AnimatedPressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.outerContainer, style]}>
      <FlatList
        ref={flatListRef}
        data={bannerList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={onScrollBeginDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        bounces={false}
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    // marginTop: -40,
  },
  singleBannerWrapper: {
    width: '100%',
    paddingHorizontal: wp('3.5%'),
  },
  slideWrapper: {
    width: SCREEN_WIDTH,
    paddingHorizontal: wp('2.5%'),
  },
  bannerContainer: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
});

export default React.memo(HomePromoBanner);
