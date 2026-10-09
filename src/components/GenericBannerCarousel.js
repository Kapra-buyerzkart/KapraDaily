import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  AppState,
} from 'react-native';
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
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import { useIsFocused } from '@react-navigation/native';

import AnimatedPressable from '@/components/AnimatedPressable';
import CachedImage from '@/components/CachedImage';
import { FONTS } from '@/styles/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * 4 High-converting Default Dummy Banners
 * Covering Groceries, Cleaning Accessories, Personal Care, and Snacks & Drinks
 */
export const DEFAULT_DUMMY_BANNERS = [
  {
    id: 'banner_groceries',
    category: 'Groceries',
    catName: 'Groceries & Kitchen',
    badge: 'UP TO 40% OFF',
    badgeIcon: 'percent',
    badgeColor: '#DCFCE7',
    badgeTextColor: '#166534',
    title: 'Fresh Groceries\n& Farm Veggies',
    subtitle: 'Daily farm-fresh greens, fruits & staples',
    ctaText: 'Shop Groceries',
    gradientColors: ['#0E703C', '#15803D', '#22C55E'],
    accentColor: '#10B981',
    image: require('@/assets/images/deals_groceries.png'),
    linkType: 'category',
    linkValue: 'Groceries',
  },
  {
    id: 'banner_cleaning',
    category: 'Cleaning',
    catName: 'Cleaning & Household',
    badge: 'FLAT 35% OFF',
    badgeIcon: 'shield',
    badgeColor: '#E0F2FE',
    badgeTextColor: '#0369A1',
    title: 'Cleaning Accessories\n& Hygiene Care',
    subtitle: 'Floor cleaners, detergents & home hygiene',
    ctaText: 'Explore Cleaning',
    gradientColors: ['#0369A1', '#0284C7', '#38BDF8'],
    accentColor: '#0EA5E9',
    image: require('@/assets/images/deals_essentials.png'),
    linkType: 'category',
    linkValue: 'Cleaning & Household',
  },
  {
    id: 'banner_personal_care',
    category: 'Personal Care',
    catName: 'Personal Care & Wellness',
    badge: 'BUY 1 GET 1',
    badgeIcon: 'gift',
    badgeColor: '#F3E8FF',
    badgeTextColor: '#6B21A8',
    title: 'Personal Care\n& Beauty Glow',
    subtitle: 'Skin care, soaps, shampoos & wellness',
    ctaText: 'Grab Deals',
    gradientColors: ['#6B21A8', '#8B5CF6', '#A855F7'],
    accentColor: '#8B5CF6',
    image: require('@/assets/images/deals_fruits_veg.png'),
    linkType: 'category',
    linkValue: 'Personal Care',
  },
  {
    id: 'banner_snacks',
    category: 'Snacks & Drinks',
    catName: 'Snacks & Beverages',
    badge: 'MIN. 25% OFF',
    badgeIcon: 'zap',
    badgeColor: '#FFEDD5',
    badgeTextColor: '#9A3412',
    title: 'Crispy Munchies\n& Cold Drinks',
    subtitle: 'Chai-time biscuits, namkeen & party sips',
    ctaText: 'Order Snacks',
    gradientColors: ['#C2410C', '#EA580C', '#FB923C'],
    accentColor: '#F97316',
    image: require('@/assets/images/good_day_biscuits.png'),
    linkType: 'category',
    linkValue: 'Snacks & Beverages',
  },
];

/**
 * Animated Pagination Indicator Dot with smooth morphing width and opacity
 */
const PaginationDot = React.memo(
  ({ index, scrollX, snapInterval, onPress, activeColor = '#FF5500' }) => {
    const animatedDotStyle = useAnimatedStyle(() => {
      const pos = scrollX.value / snapInterval;
      const dist = Math.abs(pos - index);
      const clampedDist = Math.min(dist, 1);

      const width = interpolate(
        clampedDist,
        [0, 1],
        [22, 6],
        Extrapolation.CLAMP,
      );
      const opacity = interpolate(
        clampedDist,
        [0, 1],
        [1, 0.28],
        Extrapolation.CLAMP,
      );

      return {
        width,
        opacity,
      };
    });

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress && onPress(index)}
        hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
      >
        <Animated.View
          style={[
            styles.dot,
            { backgroundColor: activeColor },
            animatedDotStyle,
          ]}
        />
      </TouchableOpacity>
    );
  },
);

/**
 * GenericBannerCarousel
 *
 * A high-performance, swipeable banner carousel with rich promotional card designs,
 * animated pagination indicator, smooth gestures, and autoplay capability.
 */
const GenericBannerCarousel = ({
  banners,
  onBannerPress,
  navigation,
  autoPlay = true,
  autoPlayInterval = 4000,
  showPagination = true,
  cardWidth: customCardWidth,
  cardHeight: customCardHeight,
  style,
  cardStyle,
  contentContainerStyle,
  dotColor = '#FF5500',
}) => {
  const isFocused = useIsFocused();
  const flatListRef = useRef(null);
  const currentIndexRef = useRef(0);
  const isDraggingRef = useRef(false);
  const appStateRef = useRef(AppState.currentState);

  const cardWidth = useMemo(
    () => customCardWidth || Math.round(SCREEN_WIDTH - wp('6%')),
    [customCardWidth],
  );
  const cardSpacing = useMemo(() => wp('2.5%'), []);
  const cardHeight = useMemo(
    () => customCardHeight || Math.round(hp('22.5%')),
    [customCardHeight],
  );
  const snapInterval = useMemo(
    () => cardWidth + cardSpacing,
    [cardWidth, cardSpacing],
  );

  const bannerList = useMemo(() => {
    if (Array.isArray(banners) && banners.length > 0) {
      return banners;
    }
    return DEFAULT_DUMMY_BANNERS;
  }, [banners]);

  const totalCards = bannerList.length;
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollX.value = event.contentOffset.x;
  });

  // Track app state to pause timer when app is backgrounded
  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      appStateRef.current = nextState;
    });
    return () => sub.remove();
  }, []);

  // Autoplay handler
  useEffect(() => {
    if (!autoPlay || totalCards <= 1 || !isFocused) return undefined;

    const timer = setInterval(() => {
      if (isDraggingRef.current || appStateRef.current !== 'active') return;

      const next = (currentIndexRef.current + 1) % totalCards;
      currentIndexRef.current = next;

      flatListRef.current?.scrollToOffset({
        offset: next * snapInterval,
        animated: true,
      });
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, isFocused, totalCards, snapInterval]);

  const onScrollBeginDrag = useCallback(() => {
    isDraggingRef.current = true;
  }, []);

  const onMomentumScrollEnd = useCallback(
    e => {
      isDraggingRef.current = false;
      const x = e.nativeEvent.contentOffset.x;
      const index = Math.round(x / snapInterval);
      currentIndexRef.current = Math.max(0, Math.min(totalCards - 1, index));
    },
    [snapInterval, totalCards],
  );

  const handlePress = useCallback(
    (item, index) => {
      if (onBannerPress) {
        onBannerPress(item, index);
        return;
      }

      if (navigation) {
        const linkType = (item.linkType || item.LinkType || '').toLowerCase();
        const linkValue = item.linkValue || item.LinkValue;

        if (linkType === 'product' && linkValue) {
          navigation.navigate('ProductDetailsScreen', { productId: linkValue });
        } else {
          const catName =
            item.catName || item.category || item.title || 'Category';
          navigation.navigate('SearchScreen', {
            catId: linkValue || undefined,
            catName: catName,
          });
        }
      }
    },
    [onBannerPress, navigation],
  );

  const handleDotPress = useCallback(
    targetIndex => {
      currentIndexRef.current = targetIndex;
      flatListRef.current?.scrollToOffset({
        offset: targetIndex * snapInterval,
        animated: true,
      });
    },
    [snapInterval],
  );

  const keyExtractor = useCallback(
    (item, index) =>
      item?.id?.toString() ||
      item?.bannerId?.toString() ||
      item?.catId?.toString() ||
      `banner_${index}`,
    [],
  );

  const renderBadgeIcon = useCallback((iconName, color) => {
    if (!iconName) return null;
    return (
      <Feather
        name={iconName}
        size={10}
        color={color || '#111827'}
        style={styles.badgeIconStyle}
      />
    );
  }, []);

  const renderItem = useCallback(
    ({ item, index }) => {
      // Check if it's a pure image banner (e.g. from backend CMS with only a URL)
      const hasImageOnly =
        !item.title && (item.uri || item.imageUrl || item.image);

      return (
        <AnimatedPressable
          style={[
            styles.cardContainer,
            { width: cardWidth, height: cardHeight, marginRight: cardSpacing },
            cardStyle,
          ]}
          onPress={() => handlePress(item, index)}
          activeOpacity={0.92}
        >
          {hasImageOnly ? (
            <CachedImage
              source={item.uri || item.imageUrl || item.image}
              style={styles.fullBleedImage}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={item.gradientColors || ['#0E703C', '#15803D', '#22C55E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientCard}
            >
              <View style={styles.gradientCardContent}>
                {/* Decorative background sha
              pes for visual depth */}
                <View style={styles.decorCircleLarge} pointerEvents="none" />
                <View style={styles.decorCircleSmall} pointerEvents="none" />

                {/* Left Column: Offer Content */}
                <View style={styles.leftContent}>
                  {item.badge ? (
                    <View
                      style={[
                        styles.badgePill,
                        item.badgeColor && { backgroundColor: item.badgeColor },
                      ]}
                    >
                      {renderBadgeIcon(item.badgeIcon, item.badgeTextColor)}
                      <Text
                        style={[
                          styles.badgeText,
                          item.badgeTextColor && { color: item.badgeTextColor },
                        ]}
                        numberOfLines={1}
                      >
                        {item.badge}
                      </Text>
                    </View>
                  ) : null}

                  <View style={styles.textWrap}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    {item.subtitle ? (
                      <Text style={styles.cardSubtitle} numberOfLines={2}>
                        {item.subtitle}
                      </Text>
                    ) : null}
                  </View>

                  {/* CTA Button */}
                  <View style={styles.ctaButton}>
                    <Text
                      style={[
                        styles.ctaText,
                        { color: item.gradientColors?.[0] || '#111827' },
                      ]}
                    >
                      {item.ctaText || 'Shop Now'}
                    </Text>
                    <Feather
                      name="arrow-right"
                      size={11}
                      color={item.gradientColors?.[0] || '#111827'}
                      style={styles.ctaArrow}
                    />
                  </View>
                </View>

                {/* Right Column: Hero Graphic */}
                <View style={styles.rightGraphic}>
                  <View style={styles.imageBackGlow} pointerEvents="none" />
                  {item.image ? (
                    <Image
                      source={item.image}
                      style={styles.productImage}
                      resizeMode="contain"
                    />
                  ) : item.uri ? (
                    <CachedImage
                      source={item.uri}
                      style={styles.productImage}
                      resizeMode="contain"
                    />
                  ) : null}
                </View>
              </View>
            </LinearGradient>
          )}
        </AnimatedPressable>
      );
    },
    [
      cardWidth,
      cardHeight,
      cardSpacing,
      cardStyle,
      handlePress,
      renderBadgeIcon,
    ],
  );

  if (bannerList.length === 0) return null;

  return (
    <View style={[styles.wrapper, style]}>
      <Animated.FlatList
        ref={flatListRef}
        data={bannerList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={snapInterval}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        onScrollBeginDrag={onScrollBeginDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        contentContainerStyle={[
          styles.listContent,
          { paddingHorizontal: wp('3%') },
          contentContainerStyle,
        ]}
      />

      {/* Pagination Indicator */}
      {showPagination && totalCards > 1 && (
        <View style={styles.paginationContainer}>
          {bannerList.map((_, i) => (
            <PaginationDot
              key={`dot_${i}`}
              index={i}
              scrollX={scrollX}
              snapInterval={snapInterval}
              onPress={handleDotPress}
              activeColor={dotColor}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginVertical: hp('1.2%'),
  },
  listContent: {
    alignItems: 'center',
    paddingVertical: hp('0.5%'),
  },
  cardContainer: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  fullBleedImage: {
    borderRadius: 22,
  },
  gradientCard: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  decorCircleLarge: {
    position: 'absolute',
    top: -35,
    right: 25,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
  },
  decorCircleSmall: {
    position: 'absolute',
    bottom: -25,
    left: 20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  leftContent: {
    flex: 1.4,
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingRight: wp('2%'),
    zIndex: 2,
  },
  badgePill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 12,
    marginBottom: hp('0.4%'),
  },
  badgeIconStyle: {
    marginRight: 4,
  },
  badgeText: {
    fontFamily: FONTS.gilroy.heavy,
    fontSize: wp('2.6%'),
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  gradientCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: wp('4%'),
  },
  textWrap: {
    marginVertical: hp('0.3%'),
  },
  cardTitle: {
    fontFamily: FONTS.gilroy.heavy,
    fontSize: wp('4.4%'),
    lineHeight: wp('5.4%'),
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardSubtitle: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.8%'),
    color: 'rgba(255, 255, 255, 0.92)',
    marginTop: 3,
    lineHeight: wp('3.8%'),
  },
  ctaButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
    marginTop: hp('0.5%'),
  },
  ctaText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('2.9%'),
  },
  ctaArrow: {
    marginLeft: 4,
  },
  rightGraphic: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    position: 'relative',
    zIndex: 2,
  },
  imageBackGlow: {
    position: 'absolute',
    width: '90%',
    height: '90%',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    transform: [{ scale: 0.9 }],
  },
  productImage: {
    width: '100%',
    height: '100%',
    maxHeight: hp('16%'),
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('0.8%'),
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
});

export default React.memo(GenericBannerCarousel);
