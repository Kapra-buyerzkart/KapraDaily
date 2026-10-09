import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from 'react';
import {
  View,
  RefreshControl,
  StatusBar,
  AppState,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  clamp,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import LocationModal from '@/components/LocationModal';
import StoreUnavailable from '@/components/StoreUnavailable';
import HomePopupModal from '@/components/HomePopupModal';
import { openExternalUrl } from '@/utils/safeUrl';
import { shuffle } from '@/utils/shuffle';
import { AppContext } from '@/context/appContext';
import images from '@/assets/images';
import CONFIG from '@/globals/config';

import useResolvedAreaId from '@/queries/useResolvedAreaId';
import useHomepageDataQuery from '@/queries/useHomepageDataQuery';
import useGeneralSettingsQuery from '@/queries/useGeneralSettingsQuery';
import useDashboardQuery from '@/queries/useDashboardQuery';
import useBuyAgainQuery from '@/queries/useBuyAgainQuery';
import useCategoryDiscoveryProductsQuery from '@/queries/useCategoryDiscoveryProductsQuery';
import { deriveStoreUnavailableState } from '@/queries/transformHomepageResponse';
import { resolveHomeColorScheme } from '@/styles/homeTheme';

import useHomePopup from './hooks/useHomePopup';
import HomeHeaderGreen, {
  getExpandedHeaderHeight,
} from './components/modern/HomeHeaderGreen';
import HomeCategoriesSection from './components/modern/HomeCategoriesSection';
import ExploreCategoriesGrid from './components/modern/ExploreCategoriesGrid';
import DealsAndOffersSection from './components/modern/DealsAndOffersSection';
import HomePromoBanner from './components/modern/HomePromoBanner';
import FlashDealsSection from './components/modern/FlashDealsSection';
import TopOffersSection from './components/modern/TopOffersSection';
import RecommendedGridSection from './components/modern/RecommendedGridSection';
import BuyItAgainModernSection from './components/modern/BuyItAgainModernSection';
import FeaturedProductsModernSection from './components/modern/FeaturedProductsModernSection';
import HomeFloatingCart from './components/modern/HomeFloatingCart';
import { CategoryGridSkeleton } from './components/shimmer';
import HomeFooter from './components/modern/HomeFooter';
import useTabBarAnimation from '@/hooks/useTabBarAnimation';
import {
  tabBarVisibility,
  getTabBarClearance,
} from '@/animations/tabBarVisibility';
import { ADD_SIZE } from '@/components/TokenProductCard/constants';

const EMPTY_ARRAY = [];

const HomeScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const navigation = useNavigation();
  const locationModalRef = useRef(null);
  const scrollY = useSharedValue(0);
  const { onScrollWorklet } = useTabBarAnimation();

  const tabBarClearance = useMemo(() => getTabBarClearance(bottom), [bottom]);
  const floatingBottomOffset = bottom + hp('7.5%');

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const y = event.contentOffset.y;
      scrollY.value = y;
      const atEnd =
        event.contentSize &&
        event.contentSize.height > 0 &&
        event.layoutMeasurement.height + event.contentOffset.y >=
          event.contentSize.height - 20;
      onScrollWorklet(y, atEnd);
    },
  });

  const cartAnimatedStyle = useAnimatedStyle(() => {
    const progress = clamp(tabBarVisibility.value, 0, 1);
    return {
      transform: [
        {
          translateY: interpolate(
            progress,
            [0, 1],
            [tabBarClearance, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const expandedHeaderHeight = useMemo(
    () => getExpandedHeaderHeight(top),
    [top],
  );

  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { profile, loadProfileTwo, setStoreUnavailable } =
    useContext(AppContext);

  // 1. Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await loadProfileTwo();
      } catch (error) {
        console.error('Profile load error:', error);
      } finally {
        setIsProfileLoaded(true);
      }
    };
    fetchProfile();
  }, [loadProfileTwo]);

  // If customer is not logged in, route to login
  useEffect(() => {
    if (!isProfileLoaded || !profile) return;
    if (!profile.custId) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen', params: { type: 'login' } }],
      });
    }
  }, [profile, isProfileLoaded, navigation]);

  // 2. Area & Queries
  const { areaId } = useResolvedAreaId(profile?.pincode);
  const homepageQuery = useHomepageDataQuery(areaId);
  const generalSettingsQuery = useGeneralSettingsQuery();
  const dashboardQuery = useDashboardQuery(profile?.custId);

  const refetchDashboard = dashboardQuery.refetch;
  useFocusEffect(
    useCallback(() => {
      if (!profile?.custId) return undefined;
      refetchDashboard();
      const sub = AppState.addEventListener('change', nextState => {
        if (nextState === 'active') refetchDashboard();
      });
      return () => sub.remove();
    }, [profile?.custId, refetchDashboard]),
  );

  const data = homepageQuery.data;
  const colorScheme = useMemo(
    () => data?.colorScheme || resolveHomeColorScheme(null),
    [data?.colorScheme],
  );
  const { isStoreUnavailable, storeUnavailableData } = useMemo(
    () =>
      deriveStoreUnavailableState({
        homepageData: data,
        error: homepageQuery.error,
        generalSettings: generalSettingsQuery.data,
      }),
    [data, homepageQuery.error, generalSettingsQuery.data],
  );

  const buyAgainQuery = useBuyAgainQuery(
    profile?.custId,
    areaId,
    !isStoreUnavailable,
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        dashboardQuery.refetch(),
        homepageQuery.refetch(),
        buyAgainQuery.refetch(),
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [dashboardQuery, homepageQuery, buyAgainQuery]);

  const isHomepageResolved = !!data || !!homepageQuery.error;
  useEffect(() => {
    if (!isHomepageResolved) return;
    setStoreUnavailable(isStoreUnavailable, storeUnavailableData);
  }, [
    isHomepageResolved,
    isStoreUnavailable,
    storeUnavailableData,
    setStoreUnavailable,
  ]);

  const hasLocation = !!profile?.pinAddress;
  const noLocationSelected = isProfileLoaded && !hasLocation;

  // Popups
  const popupData = data?.popup || homepageQuery.error?.popup || null;
  const { isHomePopupVisible, handleClose, handlePopupPress } =
    useHomePopup(popupData);

  // 3. Extract Homepage Data
  const categories = useMemo(() => data?.categories || EMPTY_ARRAY, [data]);

  const topBanners = useMemo(() => {
    if (data?.banners?.topBanner?.length > 0) return data.banners.topBanner;
    if (data?.banners?.slider?.length > 0) return data.banners.slider;
    if (data?.banners?.topAnnouncementBanner?.length > 0)
      return data.banners.topAnnouncementBanner;
    return EMPTY_ARRAY;
  }, [data]);

  const midBanner = data?.banners?.midBanner || EMPTY_ARRAY;
  const midBannerBottom = data?.banners?.midBannerBottom || EMPTY_ARRAY;
  const bottomBanner = data?.banners?.bottomBanner || EMPTY_ARRAY;
  const topSideBySide = data?.banners?.topSideBySide || EMPTY_ARRAY;

  const targetBannerIds = useMemo(
    () => [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48],
    [],
  );

  const targetBanners = useMemo(() => {
    const rawList =
      data?.homepageData?.data?.banners ||
      data?.homepageData?.banners ||
      (Array.isArray(data?.banners) ? data.banners : []) ||
      EMPTY_ARRAY;
    const targetSet = new Set(targetBannerIds.map(String));
    const matched = rawList
      .filter(b =>
        targetSet.has(String(b?.bannerId ?? b?.BannerId ?? b?.id ?? '')),
      )
      .sort((a, b) => {
        const aId = Number(a?.bannerId ?? a?.BannerId ?? a?.id ?? 0);
        const bId = Number(b?.bannerId ?? b?.BannerId ?? b?.id ?? 0);
        return targetBannerIds.indexOf(aId) - targetBannerIds.indexOf(bId);
      });
    console.log('Target Banners (IDs 37-48):', matched);
    return matched;
  }, [data, targetBannerIds]);

  const dealsBanners = useMemo(() => {
    // 1. Placement key: app_home_cardslider_section from transformed banners
    if (
      data?.banners?.cardSliderSection &&
      data.banners.cardSliderSection.length > 0
    ) {
      return data.banners.cardSliderSection;
    }

    // 2. Search raw banners for placementKey === 'app_home_cardslider_section'
    const rawList =
      data?.homepageData?.data?.banners ||
      data?.homepageData?.banners ||
      (Array.isArray(data?.banners) ? data.banners : []) ||
      (Array.isArray(data?.banners?.slider) ? data.banners.slider : []) ||
      EMPTY_ARRAY;

    const matchedCardSlider = rawList.filter(
      b =>
        (b?.placementKey || b?.PlacementKey || b?.placement_key) ===
        'app_home_cardslider_section',
    );
    if (matchedCardSlider.length > 0) {
      return matchedCardSlider;
    }

    // 3. Fallbacks: targetBanners (IDs 37-48), generic slider, midBanner, topBanners
    if (targetBanners && targetBanners.length > 0) return targetBanners;
    if (data?.banners?.slider && data?.banners?.slider.length > 0)
      return data.banners.slider;
    if (midBanner && midBanner.length > 0) return midBanner;
    if (topBanners && topBanners.length > 0) return topBanners;
    return EMPTY_ARRAY;
  }, [data, targetBanners, midBanner, topBanners]);

  const footerBanner = useMemo(() => {
    // 1. Check transformed banners
    if (data?.banners?.homeFooter) {
      return data.banners.homeFooter;
    }
    if (
      data?.banners?.homeFooterBanners &&
      data.banners.homeFooterBanners.length > 0
    ) {
      return data.banners.homeFooterBanners[0];
    }

    // 2. Search raw banners for placementKey === 'app_home_footer'
    const rawList =
      data?.homepageData?.data?.banners ||
      data?.homepageData?.banners ||
      (Array.isArray(data?.banners) ? data.banners : []) ||
      (Array.isArray(data?.banners?.slider) ? data.banners.slider : []) ||
      EMPTY_ARRAY;

    const matchedFooter = rawList.find(
      b =>
        (b?.placementKey || b?.PlacementKey || b?.placement_key) ===
        'app_home_footer',
    );
    if (matchedFooter) {
      const rawImg =
        matchedFooter.imageUrl || matchedFooter.ImageUrl || matchedFooter.image;
      return {
        ...matchedFooter,
        uri:
          matchedFooter.uri ||
          (rawImg
            ? {
                uri: rawImg.startsWith('http')
                  ? rawImg
                  : `${CONFIG.image_base_url}${rawImg}`,
              }
            : undefined),
      };
    }
    return null;
  }, [data]);

  const categoryGifBanner = useMemo(() => {
    // 1. Check transformed banners
    if (data?.banners?.bottomGifSection) {
      return data.banners.bottomGifSection;
    }
    if (
      data?.banners?.bottomGifSectionBanners &&
      data.banners.bottomGifSectionBanners.length > 0
    ) {
      return data.banners.bottomGifSectionBanners[0];
    }

    // 2. Search raw banners for placementKey === 'app_home_bottom_gif_section'
    const rawList =
      data?.homepageData?.data?.banners ||
      data?.homepageData?.banners ||
      (Array.isArray(data?.banners) ? data.banners : []) ||
      (Array.isArray(data?.banners?.slider) ? data.banners.slider : []) ||
      EMPTY_ARRAY;

    const matchedGif = rawList.find(b => {
      const k = b?.placementKey || b?.PlacementKey || b?.placement_key;
      return k === 'app_home_bottom_gif_section';
    });
    if (matchedGif) {
      const rawImg =
        matchedGif.imageUrl || matchedGif.ImageUrl || matchedGif.image;
      return {
        ...matchedGif,
        uri:
          matchedGif.uri ||
          (rawImg
            ? {
                uri: rawImg.startsWith('http')
                  ? rawImg
                  : `${CONFIG.image_base_url}${
                      rawImg.startsWith('/') ? rawImg.slice(1) : rawImg
                    }`,
              }
            : undefined),
      };
    }
    return null;
  }, [data]);

  const topGifBanner = useMemo(() => {
    // 1. Check transformed banners
    if (data?.banners?.topGifSection) {
      return data.banners.topGifSection;
    }
    if (
      data?.banners?.topGifSectionBanners &&
      data.banners.topGifSectionBanners.length > 0
    ) {
      return data.banners.topGifSectionBanners[0];
    }

    // 2. Search raw banners for placementKey === 'app_home_top_gif_section'
    const rawList =
      data?.homepageData?.data?.banners ||
      data?.homepageData?.banners ||
      (Array.isArray(data?.banners) ? data.banners : []) ||
      (Array.isArray(data?.banners?.slider) ? data.banners.slider : []) ||
      EMPTY_ARRAY;

    const matchedGif = rawList.find(b => {
      const k = b?.placementKey || b?.PlacementKey || b?.placement_key;
      return k === 'app_home_top_gif_section';
    });
    if (matchedGif) {
      const rawImg =
        matchedGif.imageUrl || matchedGif.ImageUrl || matchedGif.image;
      return {
        ...matchedGif,
        uri:
          matchedGif.uri ||
          (rawImg
            ? {
                uri: rawImg.startsWith('http')
                  ? rawImg
                  : `${CONFIG.image_base_url}${
                      rawImg.startsWith('/') ? rawImg.slice(1) : rawImg
                    }`,
              }
            : undefined),
      };
    }
    return null;
  }, [data]);

  const bottomGifBannerSection = useMemo(() => {
    // 1. Check transformed banners
    if (data?.banners?.bottomGifBanner) {
      return data.banners.bottomGifBanner;
    }
    if (
      data?.banners?.bottomGifBanners &&
      data.banners.bottomGifBanners.length > 0
    ) {
      return data.banners.bottomGifBanners[0];
    }

    // 2. Search raw banners for placementKey === 'app_home_bottom_gif_banner_section'
    const rawList =
      data?.homepageData?.data?.banners ||
      data?.homepageData?.banners ||
      (Array.isArray(data?.banners) ? data.banners : []) ||
      (Array.isArray(data?.banners?.slider) ? data.banners.slider : []) ||
      EMPTY_ARRAY;

    const matchedGif = rawList.find(b => {
      const k = b?.placementKey || b?.PlacementKey || b?.placement_key;
      return k === 'app_home_bottom_gif_banner_section';
    });
    if (matchedGif) {
      const rawImg =
        matchedGif.imageUrl || matchedGif.ImageUrl || matchedGif.image;
      return {
        ...matchedGif,
        uri:
          matchedGif.uri ||
          (rawImg
            ? {
                uri: rawImg.startsWith('http')
                  ? rawImg
                  : `${CONFIG.image_base_url}${
                      rawImg.startsWith('/') ? rawImg.slice(1) : rawImg
                    }`,
              }
            : undefined),
      };
    }
    return null;
  }, [data]);

  const firstBlockItems = useMemo(
    () =>
      shuffle(
        data?.firstProductBlock?.Items || data?.firstProductBlock?.items || [],
      ),
    [data],
  );
  const secondBlockItems = useMemo(
    () =>
      shuffle(
        data?.secondProductBlock?.Items ||
          data?.secondProductBlock?.items ||
          [],
      ),
    [data],
  );
  const thirdBlockItems = useMemo(
    () =>
      shuffle(
        data?.thirdProductBlock?.Items || data?.thirdProductBlock?.items || [],
      ),
    [data],
  );

  const categoryDiscovery = data?.categoryDiscovery;
  const discoveryCategories = useMemo(
    () => categoryDiscovery?.Categories || categoryDiscovery?.categories || [],
    [categoryDiscovery],
  );

  const categoryProductsQuery = useCategoryDiscoveryProductsQuery(
    discoveryCategories[0]?.catId,
    areaId,
  );
  const discoveryProducts = useMemo(
    () => categoryProductsQuery.data || EMPTY_ARRAY,
    [categoryProductsQuery.data],
  );

  // Mapped Product Pools
  const offerSaleProducts = useMemo(() => {
    if (firstBlockItems.length > 0) return firstBlockItems;
    if (data?.bestOffers?.length > 0) return data.bestOffers;
    if (data?.halfPriceStore?.length > 0) return data.halfPriceStore;
    return EMPTY_ARRAY;
  }, [firstBlockItems, data]);

  const flashDealsProducts = useMemo(() => {
    if (secondBlockItems.length > 0) return secondBlockItems;
    if (data?.halfPriceStore?.length > 0) return data.halfPriceStore;
    if (data?.bestOffers?.length > 0) return data.bestOffers;
    return EMPTY_ARRAY;
  }, [secondBlockItems, data]);

  const recommendedProducts = useMemo(() => {
    if (thirdBlockItems.length > 0) return thirdBlockItems;
    if (data?.featuredProducts?.length > 0) return data.featuredProducts;
    if (discoveryProducts.length > 0) return discoveryProducts;
    return EMPTY_ARRAY;
  }, [thirdBlockItems, data, discoveryProducts]);

  const featuredProducts = useMemo(() => {
    if (data?.featuredProducts?.length > 0) return data.featuredProducts;
    if (firstBlockItems.length > 0) return firstBlockItems;
    return EMPTY_ARRAY;
  }, [data, firstBlockItems]);

  const buyAgainProducts = buyAgainQuery.data || EMPTY_ARRAY;

  // Banner Press Handler
  const handleBannerPress = useCallback(
    banner => {
      if (!banner) return;
      const linkType = (banner.linkType || banner.LinkType || '').toLowerCase();
      const linkValue = banner.linkValue || banner.LinkValue;

      if (linkType === 'product') {
        navigation.navigate('ProductDetailsScreen', { productId: linkValue });
      } else if (linkType === 'category') {
        let actualCatName = '';
        if (categories.length > 0) {
          const foundCat = categories.find(
            c => String(c.catId || c.id) === String(linkValue),
          );
          if (foundCat) actualCatName = foundCat.catName || foundCat.name;
        }
        const bannerTitle = banner.title || banner.Title;
        navigation.navigate('SearchScreen', {
          catId: linkValue,
          catName: actualCatName || bannerTitle || 'Category',
        });
      } else if ((linkType === 'external' || linkType === 'url') && linkValue) {
        openExternalUrl(linkValue);
      }
    },
    [navigation, categories],
  );

  const handleOpenLocationModal = useCallback(() => {
    locationModalRef.current?.open();
  }, []);

  const isHomeLoading =
    refreshing || (!noLocationSelected && homepageQuery.isLoading);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colorScheme.containerBackground },
      ]}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <LocationModal ref={locationModalRef} />
      <HomePopupModal
        visible={isHomePopupVisible}
        onClose={handleClose}
        imageUrl={popupData?.uri}
        onPress={handlePopupPress}
      />

      {/* Scrollable Main Content */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: expandedHeaderHeight },
        ]}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colorScheme.primary}
            colors={[colorScheme.primary]}
            progressViewOffset={expandedHeaderHeight}
          />
        }
      >
        {noLocationSelected ? (
          <StoreUnavailable
            imageSource={images.no_location}
            text="Select your location to see products and offers available near you."
            buttonText="Select Location"
            onChangeLocation={handleOpenLocationModal}
          />
        ) : isStoreUnavailable ? (
          <StoreUnavailable
            image={storeUnavailableData?.image}
            text={storeUnavailableData?.text}
            onChangeLocation={handleOpenLocationModal}
          />
        ) : (
          <>
            {/* 3. Categories with Filter Tabs & 4 Quick Cards */}
            {isHomeLoading && categories.length === 0 ? (
              <CategoryGridSkeleton />
            ) : (
              categories.length > 0 && (
                <HomeCategoriesSection
                  categories={categories}
                  navigation={navigation}
                  colorScheme={colorScheme}
                  banner={topGifBanner}
                  banners={data?.banners}
                  onPressBanner={handleBannerPress}
                />
              )
            )}
            {/* 4. Explore all items by Category (4x2 Grid) */}
            {categories.length > 0 && (
              <ExploreCategoriesGrid
                categories={categories}
                navigation={navigation}
                banner={categoryGifBanner}
                bottomGifBanner={bottomGifBannerSection}
                banners={data?.banners}
                onBannerPress={handleBannerPress}
              />
            )}

            {/* 5. Deals & Offers Animated Slider Section */}
            <DealsAndOffersSection
              banners={dealsBanners}
              onPressBanner={handleBannerPress}
              navigation={navigation}
            />

            {/* 6. ⚡ 50% OFF Flash Deals (2x2 Grid in Peach Container) */}
            {flashDealsProducts.length > 0 && (
              <FlashDealsSection
                items={flashDealsProducts}
                title="50% OFF"
                navigation={navigation}
              />
            )}

            <View style={{ marginTop: -40 }}>
              {/* 7. Mid Promo Banner 2 */}
              {midBannerBottom.length > 0 ? (
                <HomePromoBanner
                  banners={midBannerBottom}
                  onPress={handleBannerPress}
                />
              ) : (
                bottomBanner.length > 0 && (
                  <HomePromoBanner
                    banners={bottomBanner}
                    onPress={handleBannerPress}
                  />
                )
              )}
            </View>

            {/* 8. Top Offers For You (3 Discount Tiles) */}
            <TopOffersSection
              categories={categories}
              sideBySide={topSideBySide}
              navigation={navigation}
            />
            {/* 9. Recommended For You (2x3 Grid with Garden Trim Footer) */}
            {recommendedProducts.length > 0 && (
              <RecommendedGridSection
                items={recommendedProducts}
                title="Recommended For you"
                navigation={navigation}
              />
            )}

            {/* 10. Buy It Again */}
            {buyAgainProducts.length > 0 && (
              <BuyItAgainModernSection
                products={buyAgainProducts}
                navigation={navigation}
              />
            )}
            {/* 11. Featured Products */}
            {featuredProducts.length > 0 && (
              <FeaturedProductsModernSection
                items={featuredProducts}
                title="Featured Products"
                navigation={navigation}
              />
            )}
            {/* 12. Bottom Banner */}

            {bottomBanner.length > 1 && (
              <HomePromoBanner
                banner={bottomBanner[1]}
                onPress={handleBannerPress}
              />
            )}
            {/* 13. Empty Cart / Favorite Produce Basket Incentive */}
            {/* <KapraFavoriteFooter /> */}
            <HomeFooter
              banner={footerBanner}
              banners={data?.banners}
              onPress={handleBannerPress}
            />
          </>
        )}

        {/* Extra clearance for floating cart and bottom tabs */}
        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>

      {/* Sticky Leaf-Green Header (rendered on top of scroll content) */}
      <HomeHeaderGreen
        topInset={top}
        profile={profile}
        dashboardData={dashboardQuery.data}
        navigation={navigation}
        onPressLocation={handleOpenLocationModal}
        onSearchPress={() => navigation.navigate('SearchScreen')}
        onMicPress={() =>
          navigation.navigate('SearchScreen', { openVoice: true })
        }
        onCartPress={() => navigation.navigate('CartScreen')}
        scrollY={scrollY}
        colorScheme={colorScheme}
      />

      {/* Floating Dark Green Bottom Cart Pill */}
      {!isStoreUnavailable && (
        <Animated.View
          style={[
            styles.floatingCartContainer,
            { bottom: floatingBottomOffset },
            cartAnimatedStyle,
          ]}
          pointerEvents="box-none"
        >
          <HomeFloatingCart colorScheme={colorScheme} />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF7300',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: hp('6%'),
    backgroundColor: '#FFFFFF',
  },
  bottomSpacer: {
    height: hp('20%'),
  },
  floatingCartContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 99,
  },
});

export default HomeScreen;
