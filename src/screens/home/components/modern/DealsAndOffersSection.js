import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import AnimatedPressable from '@/components/AnimatedPressable';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '@/styles/typography';
import CONFIG from '@/globals/config';
import CachedImage from '@/components/CachedImage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.78;
const SPACING = wp('3.5%');
const ITEM_SIZE = CARD_WIDTH + SPACING;

export const DUMMY_OFFERS = [
  {
    id: '1',
    bgColor: '#3FA9F5',
    title: 'Daily Essentials\ndelivered fast!',
    subtitle: 'Get 10% off on daily needs',
    image: require('@/assets/images/deals_essentials.png'),
    discountText: '10%\noff',
    dateRange: 'Aug 1 - Aug 15',
    quota: '0 of 100 QR',
    isDummy: true,
  },
  {
    id: '2',
    bgColor: '#E66D00',
    title: 'Freshness\nat your door!',
    subtitle: 'Get 15% off on\nfresh fruits & vegetables',
    image: require('@/assets/images/deals_fruits_veg.png'),
    discountText: '15%\noff',
    dateRange: 'Aug 4 - Aug 31',
    quota: '0 of 250 QR',
    isDummy: true,
  },
  {
    id: '3',
    bgColor: '#5D2E8E',
    title: 'Mega Savings\non groceries',
    subtitle: 'Get 20% off on all items',
    image: require('@/assets/images/deals_groceries.png'),
    discountText: '20%\noff',
    dateRange: 'Sep 1 - Sep 30',
    quota: '10 of 500 QR',
    isDummy: true,
  },
];

const BG_PALETTE = [
  '#3FA9F5',
  '#E66D00',
  '#5D2E8E',
  '#0D9488',
  '#EA580C',
  '#7C3AED',
  '#2563EB',
];

export const resolveBannerImageSource = banner => {
  if (!banner) return null;

  if (banner.uri) {
    if (typeof banner.uri === 'object' && banner.uri.uri) {
      const uriStr = String(banner.uri.uri).trim();
      if (uriStr.startsWith('http') || uriStr.startsWith('data:')) {
        return banner.uri;
      }
      const base = (CONFIG.image_base_url || '').replace(/\/$/, '');
      const suffix = uriStr.startsWith('/') ? uriStr : `/${uriStr}`;
      return { uri: `${base}${suffix}` };
    }
    if (typeof banner.uri === 'string') {
      const uriStr = banner.uri.trim();
      if (uriStr.startsWith('http') || uriStr.startsWith('data:')) {
        return { uri: uriStr };
      }
      const base = (CONFIG.image_base_url || '').replace(/\/$/, '');
      const suffix = uriStr.startsWith('/') ? uriStr : `/${uriStr}`;
      return { uri: `${base}${suffix}` };
    }
  }

  if (banner.banner) {
    const fromNested = resolveBannerImageSource(banner.banner);
    if (fromNested) return fromNested;
  }

  const rawPath =
    banner.imageUrl ||
    banner.ImageUrl ||
    banner.bannerImageUrl ||
    banner.BannerImageUrl ||
    banner.bannerImage ||
    banner.BannerImage ||
    banner.image ||
    banner.Image ||
    banner.backgroundImage ||
    banner.BackgroundImage ||
    banner.bgImage ||
    banner.BgImage ||
    banner.imagePath ||
    banner.ImagePath ||
    banner.featuredImage;

  if (!rawPath) return null;
  if (typeof rawPath === 'object' && rawPath.uri) return rawPath;
  if (typeof rawPath === 'number') return rawPath;

  if (typeof rawPath === 'string') {
    const trimmed = rawPath.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('http') || trimmed.startsWith('data:')) {
      return { uri: trimmed };
    }
    const base = (CONFIG.image_base_url || '').replace(/\/$/, '');
    const suffix = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return { uri: `${base}${suffix}` };
  }

  return null;
};

const mapBannerToOffer = (banner, index) => {
  if (!banner) return null;
  const imageSource = resolveBannerImageSource(banner);
  const rawTitle =
    banner.title || banner.Title || banner.name || banner.bannerName || '';
  const title = /^app_/i.test(String(rawTitle).trim()) ? '' : rawTitle;

  const rawSubtitle =
    banner.subTitle ||
    banner.SubTitle ||
    banner.subtitle ||
    banner.description ||
    '';
  const subtitle = /^app_/i.test(String(rawSubtitle).trim()) ? '' : rawSubtitle;

  const discountText =
    banner.discountText ||
    banner.discount ||
    (banner.discountPercent ? `${banner.discountPercent}%\noff` : null) ||
    (banner.badgeText ? banner.badgeText : null);
  const dateRange = banner.dateRange || banner.validity || null;
  const quota =
    banner.quota ||
    banner.offerCode ||
    (banner.linkType ? 'Tap to view' : null);

  let bgColor = banner.bgColor || banner.backgroundColor;
  if (!bgColor && banner.linkValue && typeof banner.linkValue === 'string') {
    const clean = banner.linkValue.trim();
    if (/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(clean)) {
      bgColor = clean.startsWith('#') ? clean : `#${clean}`;
    }
  }
  if (!bgColor) {
    bgColor = BG_PALETTE[index % BG_PALETTE.length];
  }

  return {
    id: String(
      banner.bannerId ||
        banner.BannerId ||
        banner.id ||
        banner.voucherId ||
        `banner_${index}`,
    ),
    title,
    subtitle,
    image: imageSource,
    bgColor,
    discountText,
    dateRange,
    quota,
    raw: banner,
    isDummy: false,
  };
};

const OfferCard = ({ item, index, scrollX, onPress }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * ITEM_SIZE,
      index * ITEM_SIZE,
      (index + 1) * ITEM_SIZE,
    ];

    const rotate = interpolate(
      scrollX.value,
      inputRange,
      [-6, 0, 6], // Subtle 6-degree tilt matching design
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.94, 1, 0.94],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ rotate: `${rotate}deg` }, { scale }],
    };
  });

  const hasBackgroundImage = !item.isDummy && !!item.image;
  const hasBadgeOrPill = !!(item.discountText || item.dateRange || item.quota);
  const isPureImageBanner = hasBackgroundImage && !hasBadgeOrPill;

  return (
    <AnimatedPressable
      activeOpacity={0.92}
      onPress={() => onPress && onPress(item.raw || item)}
      style={[
        styles.cardContainer,
        { backgroundColor: item.bgColor },
        animatedStyle,
      ]}
      accessibilityRole="button"
      accessibilityLabel={item.title || 'Special Deal'}
    >
      {/* Background Image: fetched banner image renders full-bleed as the card's background */}
      {hasBackgroundImage ? (
        <CachedImage
          source={item.image}
          style={styles.cardBackgroundImage}
          resizeMode="cover"
        />
      ) : null}

      {/* If it's a pure image banner with no text/pills, don't show overlay content */}
      {!isPureImageBanner && (
        <View style={styles.cardContent}>
          {item.isDummy && item.title ? (
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
          ) : null}
          {item.isDummy && item.subtitle ? (
            <Text style={styles.cardSubtitle} numberOfLines={2}>
              {item.subtitle}
            </Text>
          ) : null}

          {/* Product Illustration cutout (for dummy fallback offers only) */}
          {item.isDummy && item.image ? (
            <View style={styles.cardImageContainer} pointerEvents="none">
              <CachedImage
                source={item.image}
                style={styles.cardImage}
                resizeMode="contain"
              />
            </View>
          ) : null}

          {/* Discount Badge */}
          {item.discountText ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>{item.discountText}</Text>
            </View>
          ) : null}

          {/* Bottom Pill */}
          {item.dateRange || item.quota ? (
            <View style={styles.bottomPill}>
              {item.dateRange ? (
                <View style={styles.dateSection}>
                  <Feather name="calendar" size={wp('4%')} color="#FFFFFF" />
                  <Text style={styles.dateText}>{item.dateRange}</Text>
                </View>
              ) : null}
              {item.dateRange && item.quota ? (
                <View style={styles.pillDivider} />
              ) : null}
              {item.quota ? (
                <Text style={styles.quotaText}>{item.quota}</Text>
              ) : null}
            </View>
          ) : item.isDummy ? (
            <View style={styles.bottomPill}>
              <Text style={styles.quotaText}>Shop Now</Text>
              <Feather name="arrow-right" size={wp('4%')} color="#FFFFFF" />
            </View>
          ) : null}
        </View>
      )}
    </AnimatedPressable>
  );
};

const DealsAndOffersSection = ({
  banners,
  offers,
  onPressBanner,
  navigation,
  title = 'Deals & Offers',
  superTitle = 'SOMETHING SPECIAL',
  subtitle = 'Fresh deals, exclusive savings & more',
}) => {
  const flatListRef = useRef(null);
  const scrollX = useSharedValue(0);

  const offerList = useMemo(() => {
    const sourceList =
      Array.isArray(banners) && banners.length > 0
        ? banners
        : Array.isArray(offers) && offers.length > 0
        ? offers
        : [];
    if (sourceList.length > 0) {
      // Prioritize items with placementKey === 'app_home_cardslider_section' at the top
      const topItems = [];
      const restItems = [];
      sourceList.forEach(item => {
        const key =
          item?.placementKey || item?.PlacementKey || item?.placement_key;
        if (key === 'app_home_cardslider_section') {
          topItems.push(item);
        } else {
          restItems.push(item);
        }
      });
      const prioritized =
        topItems.length > 0 ? [...topItems, ...restItems] : sourceList;
      return prioritized.map(mapBannerToOffer).filter(Boolean);
    }
    return DUMMY_OFFERS;
  }, [banners, offers]);

  const [currentIndex, setCurrentIndex] = useState(() =>
    offerList.length > 1 ? 1 : 0,
  );

  useEffect(() => {
    setCurrentIndex(offerList.length > 1 ? 1 : 0);
  }, [offerList.length]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleScrollEnd = useCallback(
    event => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / ITEM_SIZE);
      setCurrentIndex(Math.max(0, Math.min(offerList.length - 1, index)));
    },
    [offerList.length],
  );

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      const nextIndex = currentIndex - 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < offerList.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex, offerList.length]);

  const handlePress = useCallback(
    item => {
      const raw = item?.raw || item;
      if (onPressBanner) {
        onPressBanner(raw);
        return;
      }
      if (!navigation || !raw) return;
      const linkType = (raw.linkType || raw.LinkType || '').toLowerCase();
      const linkValue = raw.linkValue || raw.LinkValue;
      if (linkType === 'product' && linkValue) {
        navigation.navigate('ProductDetailsScreen', { productId: linkValue });
      } else if (linkType === 'category' && linkValue) {
        navigation.navigate('SearchScreen', {
          catId: linkValue,
          catName: raw.title || 'Category',
        });
      }
    },
    [onPressBanner, navigation],
  );

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <OfferCard
          item={item}
          index={index}
          scrollX={scrollX}
          onPress={handlePress}
        />
      );
    },
    [scrollX, handlePress],
  );

  if (offerList.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.superTitle}>{superTitle}</Text>
        <Text style={styles.mainTitle}>{title}</Text>
        <Text style={styles.subTitle}>{subtitle}</Text>
      </View>

      {/* Carousel with Animated Tilt & Arrow Navigation */}
      <View style={styles.carouselWrapper}>
        <Animated.FlatList
          ref={flatListRef}
          data={offerList}
          keyExtractor={(item, index) => item.id || `offer_${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_SIZE}
          decelerationRate="fast"
          contentContainerStyle={styles.flatListContent}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleScrollEnd}
          onScrollEndDrag={handleScrollEnd}
          renderItem={renderItem}
          initialScrollIndex={offerList.length > 1 ? 1 : 0}
          getItemLayout={(data, index) => ({
            length: ITEM_SIZE,
            offset: ITEM_SIZE * index,
            index,
          })}
        />

        {/* Left Arrow Navigation */}
        {currentIndex > 0 && (
          <AnimatedPressable
            style={[styles.arrowButton, styles.leftArrow]}
            onPress={handlePrev}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Feather name="chevron-left" size={wp('5.5%')} color="#FFFFFF" />
          </AnimatedPressable>
        )}

        {/* Right Arrow Navigation */}
        {currentIndex < offerList.length - 1 && (
          <AnimatedPressable
            style={[styles.arrowButton, styles.rightArrow]}
            onPress={handleNext}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Feather name="chevron-right" size={wp('5.5%')} color="#FFFFFF" />
          </AnimatedPressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp('2%'),
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    paddingHorizontal: wp('5%'),
    marginBottom: hp('2%'),
  },
  superTitle: {
    color: '#FF6B00',
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3%'),
    letterSpacing: 1.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  mainTitle: {
    color: '#111827',
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('5%'),
    marginBottom: 2,
  },
  subTitle: {
    color: '#6B7280',
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.5%'),
  },
  carouselWrapper: {
    position: 'relative',
  },
  flatListContent: {
    paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
    paddingVertical: hp('2%'),
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: wp('92%'),
    borderRadius: 24,
    marginRight: SPACING,
    overflow: 'hidden',
  },
  cardBackgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  fullCardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  cardContent: {
    flex: 1,
    padding: wp('6%'),
    position: 'relative',
    zIndex: 2,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.heavy,
    fontSize: wp('7.5%'),
    lineHeight: wp('8.5%'),
    marginBottom: hp('1%'),
    zIndex: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cardSubtitle: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4%'),
    lineHeight: wp('5.2%'),
    width: '65%',
    zIndex: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardImageContainer: {
    position: 'absolute',
    bottom: wp('6%'),
    right: -wp('3%'),
    width: wp('56%'),
    height: wp('56%'),
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 2,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    right: wp('4%'),
    top: wp('38%'),
    width: wp('22%'),
    height: wp('22%'),
    borderRadius: wp('11%'),
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  discountBadgeText: {
    color: '#111827',
    fontFamily: FONTS.gilroy.heavy,
    fontSize: wp('5.5%'),
    textAlign: 'center',
    lineHeight: wp('6%'),
  },
  bottomPill: {
    position: 'absolute',
    bottom: wp('5%'),
    left: wp('5%'),
    right: wp('5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 16,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    zIndex: 4,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.5%'),
    marginLeft: wp('2%'),
  },
  pillDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: wp('3%'),
  },
  quotaText: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.5%'),
  },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    width: wp('10.5%'),
    height: wp('10.5%'),
    borderRadius: wp('5.25%'),
    backgroundColor: 'rgba(30, 30, 30, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    marginTop: -wp('5.25%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  leftArrow: {
    left: wp('3.5%'),
  },
  rightArrow: {
    right: wp('3.5%'),
  },
});

export default React.memo(DealsAndOffersSection);
