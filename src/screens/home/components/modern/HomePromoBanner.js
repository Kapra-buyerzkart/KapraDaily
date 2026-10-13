import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  AppState,
  Text,
} from 'react-native';
import AnimatedPressable from '@/components/AnimatedPressable';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '@/styles/typography';
import CachedImage from '@/components/CachedImage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.86;
const SPACING = wp('3.5%');
const ITEM_SIZE = CARD_WIDTH + SPACING;
const SIDE_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2;
const BUTTON_SIZE = wp('10.5%');

/**
 * HomePromoBanner
 *
 * A swipeable promotional banner carousel matching the Exclusive Offers design:
 * - "SOMETHING SPECIAL" uppercase badge header
 * - "Exclusive Offers" bold title
 * - "More ways to save on your everyday favourites" subtitle
 * - Center banner card with ~2.12 aspect ratio and 24px corner radius
 * - Peeking preview of adjacent banners on left & right
 * - Floating dark circular left/right click navigation buttons
 * - Bounded manual scroll (1 -> 2 -> 3 and 3 -> 2 -> 1, no loop carousel)
 */
const HomePromoBanner = ({
  banner,
  banners,
  onPress,
  autoPlay = false,
  autoPlayInterval = 3500,
  style,
  cardStyle,
  aspectRatio = 2.12,
  superTitle = 'SOMETHING SPECIAL',
  title = 'Exclusive Offers',
  subtitle = 'More ways to save on your everyday favourites',
  showHeader = true,
  initialIndex = 0,
}) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
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

  // Keep currentIndex clamped if list length changes
  useEffect(() => {
    if (currentIndex >= bannerList.length && bannerList.length > 0) {
      setCurrentIndex(bannerList.length - 1);
    }
  }, [bannerList.length, currentIndex]);

  // Track app state to pause autoplay when backgrounded (if autoPlay enabled)
  useEffect(() => {
    if (!autoPlay) return undefined;
    const sub = AppState.addEventListener('change', nextState => {
      appStateRef.current = nextState;
    });
    return () => sub.remove();
  }, [autoPlay]);

  // Optional Autoplay handler (defaults to false)
  useEffect(() => {
    if (!autoPlay || bannerList.length <= 1) return undefined;

    const timer = setInterval(() => {
      if (appStateRef.current !== 'active') return;

      setCurrentIndex(prev => {
        const next = (prev + 1) % bannerList.length;
        flatListRef.current?.scrollToOffset({
          offset: next * ITEM_SIZE,
          animated: true,
        });
        return next;
      });
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, bannerList.length]);

  const handleScrollEnd = useCallback(
    e => {
      const x = e.nativeEvent.contentOffset.x;
      const index = Math.round(x / ITEM_SIZE);
      const clamped = Math.max(0, Math.min(bannerList.length - 1, index));
      setCurrentIndex(clamped);
    },
    [bannerList.length],
  );

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => {
      const nextIndex = Math.max(0, prev - 1);
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * ITEM_SIZE,
        animated: true,
      });
      return nextIndex;
    });
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => {
      const nextIndex = Math.min(bannerList.length - 1, prev + 1);
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * ITEM_SIZE,
        animated: true,
      });
      return nextIndex;
    });
  }, [bannerList.length]);

  const getItemLayout = useCallback(
    (_, index) => ({
      length: ITEM_SIZE,
      offset: ITEM_SIZE * index,
      index,
    }),
    [],
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
        {showHeader && Boolean(superTitle || title || subtitle) && (
          <View style={styles.headerContainer}>
            {Boolean(superTitle) && (
              <Text style={styles.superTitle}>{superTitle}</Text>
            )}
            {Boolean(title) && <Text style={styles.mainTitle}>{title}</Text>}
            {Boolean(subtitle) && (
              <Text style={styles.subTitle}>{subtitle}</Text>
            )}
          </View>
        )}
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
      {showHeader && Boolean(superTitle || title || subtitle) && (
        <View style={styles.headerContainer}>
          {Boolean(superTitle) && (
            <Text style={styles.superTitle}>{superTitle}</Text>
          )}
          {Boolean(title) && <Text style={styles.mainTitle}>{title}</Text>}
          {Boolean(subtitle) && <Text style={styles.subTitle}>{subtitle}</Text>}
        </View>
      )}

      <View style={styles.carouselWrapper}>
        <FlatList
          ref={flatListRef}
          data={bannerList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_SIZE}
          snapToAlignment="start"
          decelerationRate="fast"
          bounces={false}
          contentContainerStyle={styles.flatListContent}
          onMomentumScrollEnd={handleScrollEnd}
          onScrollEndDrag={handleScrollEnd}
          getItemLayout={getItemLayout}
        />

        {/* Left Arrow Navigation */}
        {currentIndex > 0 && (
          <AnimatedPressable
            style={[styles.arrowButton, styles.leftArrow]}
            onPress={handlePrev}
            accessibilityRole="button"
            accessibilityLabel="Previous banner"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.8}
          >
            <Feather name="chevron-left" size={wp('5.5%')} color="#FFFFFF" />
          </AnimatedPressable>
        )}

        {/* Right Arrow Navigation */}
        {currentIndex < bannerList.length - 1 && (
          <AnimatedPressable
            style={[styles.arrowButton, styles.rightArrow]}
            onPress={handleNext}
            accessibilityRole="button"
            accessibilityLabel="Next banner"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.8}
          >
            <Feather name="chevron-right" size={wp('5.5%')} color="#FFFFFF" />
          </AnimatedPressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    marginVertical: hp('1.5%'),
  },
  headerContainer: {
    paddingHorizontal: wp('4.5%'),
    marginBottom: hp('1.6%'),
  },
  superTitle: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: 11,
    // paddingHorizontal: wp('4%'),
    paddingBottom: wp('2'),
    letterSpacing: 2,
    color: '#F25000',
  },
  mainTitle: {
    color: '#111827',
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.5%'),
    marginBottom: 4,
  },
  subTitle: {
    color: '#6B7280',
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.6%'),
  },
  carouselWrapper: {
    position: 'relative',
    width: '100%',
  },
  flatListContent: {
    paddingLeft: SIDE_PADDING,
    paddingRight: SIDE_PADDING - SPACING,
  },
  singleBannerWrapper: {
    width: '100%',
    paddingHorizontal: wp('4.5%'),
  },
  slideWrapper: {
    width: CARD_WIDTH,
    marginRight: SPACING,
  },
  bannerContainer: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: 'rgba(40, 40, 40, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    marginTop: -BUTTON_SIZE / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 7,
  },
  leftArrow: {
    left: SIDE_PADDING - BUTTON_SIZE / 2,
  },
  rightArrow: {
    right: SIDE_PADDING - BUTTON_SIZE / 2,
  },
});

export default React.memo(HomePromoBanner);
