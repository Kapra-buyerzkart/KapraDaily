import { View, Image, RefreshControl } from 'react-native';
import Animated from 'react-native-reanimated';
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

import SelectedProducts from '../../components/SelectedProducts';
import LocationModal from '../../components/LocationModal';
import StoreUnavailable from '../../components/StoreUnavailable';
import HomePopupModal from '../../components/HomePopupModal';
import { openExternalUrl } from '../../utils/safeUrl';
import { shuffle } from '../../utils/shuffle';
import { AppContext } from '../../context/appContext';

import useResolvedAreaId from '../../queries/useResolvedAreaId';
import useHomepageDataQuery from '../../queries/useHomepageDataQuery';
import useGeneralSettingsQuery from '../../queries/useGeneralSettingsQuery';
import useDashboardQuery from '../../queries/useDashboardQuery';
import useBuyAgainQuery from '../../queries/useBuyAgainQuery';
import useCategoryDiscoveryProductsQuery from '../../queries/useCategoryDiscoveryProductsQuery';
import { deriveStoreUnavailableState } from '../../queries/transformHomepageResponse';

import useHomePopup from './hooks/useHomePopup';
import useStickyTopBanner, { EMPTY_BANNERS } from './hooks/useStickyTopBanner';
import useHomeAnimations, {
  estimateHeaderMetrics,
} from './hooks/useHomeAnimations';
import HomeStatusBar from './components/HomeStatusBar';
import StickyHeader from './components/StickyHeader';
import PlacementBannerCarousel from './components/PlacementBannerCarousel';
import CategoryGrid, { CategoryShimmer } from './components/CategoryGrid';
import ProductBlock from './components/ProductBlock';
import CategoryDiscoverySection from './components/CategoryDiscoverySection';
import BuyAgainSection from './components/buyAgain/BuyAgainSection';
import TopShowcase from './components/TopShowcase';
import BottomShowcase from './components/BottomShowcase';
import SeasonalBannerShimmer from './components/SeasonalBannerShimmer';
import OrbitLoaderPreview from './components/OrbitLoaderPreview'; // TEMP
import styles from './HomeScreen.styles';
import { ACCENT } from '@/styles/homeTheme';
import images from '@/assets/images';

const UDENDEAL_SEAL = require('../../assets/images/udendealSeal.png');

const RAIL_CONTENT_STYLE = {
  paddingLeft: wp('3.2%'),
  paddingRight: wp('2%'),
};
const BLOCK2_SEE_ALL_STYLE = { alignSelf: 'center', marginTop: hp('1%') };
const BLOCK1_EYEBROW = 'Fresh picks';
const BLOCK2_EYEBROW = 'Trending now';
const BLOCK3_EYEBROW = 'Before you go';
const seeAllOverThree = count => count > 3;
const seeAllAtLeastThree = count => count >= 3;

const HomeScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const PROFILE_AVATAR_SIZE = Math.min(wp('14%'), 56);

  const [headerMetrics, setHeaderMetrics] = useState(() =>
    estimateHeaderMetrics(top, true),
  );
  const handleHeaderMetrics = useCallback(patch => {
    setHeaderMetrics(prev => {
      const next = { ...prev, ...patch };
      return next.height === prev.height && next.searchY === prev.searchY
        ? prev
        : next;
    });
  }, []);

  const {
    scrollY,
    collapseDistance,
    scrollHandler,
    floatingBottomOffset,
    cartAnimatedStyle,
    headerCollapseStyle,
    etaAnimStyle,
    searchWrapperAnimStyle,
    bannerSheetStyle,
    bannerParallaxStyle,
    fallbackHeaderBgStyle,
    stickyBorderAnimStyle,
    handleSearchPressIn,
    handleSearchPressOut,
  } = useHomeAnimations({ top, bottom, headerMetrics });

  const navigation = useNavigation();
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const locationModalRef = useRef(null);
  const [selectedDiscoveryCategory, setSelectedDiscoveryCategory] =
    useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { profile, loadProfileTwo, setStoreUnavailable } =
    useContext(AppContext);

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
  }, []);

  useEffect(() => {
    if (!isProfileLoaded) return;
    if (!profile) return;
    if (!profile.custId) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen', params: { type: 'login' } }],
      });
    }
  }, [profile, isProfileLoaded]);

  const { areaId } = useResolvedAreaId(profile?.pincode);
  const homepageQuery = useHomepageDataQuery(areaId);
  const generalSettingsQuery = useGeneralSettingsQuery();
  const dashboardQuery = useDashboardQuery(profile?.custId);
  const dashboardData = dashboardQuery.data;

  useEffect(() => {
    if (profile?.pincode) {
      setSelectedDiscoveryCategory(null);
      setUseEmbeddedDiscoveryProducts(false);
    }
  }, [profile?.pincode]);

  const data = homepageQuery.data;
  const { isStoreUnavailable, storeUnavailableData } = useMemo(
    () =>
      deriveStoreUnavailableState({
        homepageData: data,
        error: homepageQuery.error,
        generalSettings: generalSettingsQuery.data,
      }),
    [data, homepageQuery.error, generalSettingsQuery.data],
  );

  // Assembled from order history, so it only runs once the store is actually
  // serving this area — a closed store has nothing to re-buy from.
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
  }, [dashboardQuery.refetch, homepageQuery.refetch, buyAgainQuery.refetch]);

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
  const isLocationPending = !isProfileLoaded && !hasLocation;

  const popupData = data?.popup || homepageQuery.error?.popup || null;
  const { isHomePopupVisible, handleClose, handlePopupPress } =
    useHomePopup(popupData);

  const categories = useMemo(() => data?.categories || EMPTY_BANNERS, [data]);
  const topBanner = data?.banners?.topBanner || EMPTY_BANNERS;
  const midBanner = data?.banners?.midBanner || EMPTY_BANNERS;
  const bottomBanner = data?.banners?.bottomBanner || EMPTY_BANNERS;
  const topSectionBanner = useStickyTopBanner(
    data?.banners?.topSectionBanner,
    !!data,
  );
  const topAnnouncementBanner =
    data?.banners?.topAnnouncementBanner || EMPTY_BANNERS;
  const topSideBySide = data?.banners?.topSideBySide || EMPTY_BANNERS;
  const bottomShowcaseBanner = data?.banners?.bottomShowcaseBanner;
  const bottomShowcaseProducts =
    data?.banners?.bottomShowcaseProducts || EMPTY_BANNERS;
  const firstProductBlock = data?.firstProductBlock;
  const secondProductBlock = data?.secondProductBlock;
  const thirdProductBlock = data?.thirdProductBlock;
  const categoryDiscovery = data?.categoryDiscovery;

  const isHomeLoading =
    refreshing || (!noLocationSelected && homepageQuery.isLoading);
  const isHeaderDataPending =
    !data && !noLocationSelected && !homepageQuery.error;
  const fruits = bottomBanner;

  const firstBlockItems = useMemo(
    () => shuffle(firstProductBlock?.Items || firstProductBlock?.items || []),
    [firstProductBlock],
  );
  const secondBlockItems = useMemo(
    () => shuffle(secondProductBlock?.Items || secondProductBlock?.items || []),
    [secondProductBlock],
  );
  const thirdBlockItems = useMemo(
    () => shuffle(thirdProductBlock?.Items || thirdProductBlock?.items || []),
    [thirdProductBlock],
  );

  const shouldShowFirstBlock =
    !!firstProductBlock && firstBlockItems.length > 0;
  const shouldShowSecondBlock =
    !!secondProductBlock && secondBlockItems.length > 0;
  const shouldShowThirdBlock =
    !!thirdProductBlock && thirdBlockItems.length > 0;

  const discoveryCategories = useMemo(
    () => categoryDiscovery?.Categories || categoryDiscovery?.categories || [],
    [categoryDiscovery],
  );
  const embeddedDiscoveryProducts = useMemo(
    () => categoryDiscovery?.Products || categoryDiscovery?.products || [],
    [categoryDiscovery],
  );
  const shouldShowCategoryDiscovery =
    !!categoryDiscovery && discoveryCategories.length > 0;

  const [useEmbeddedDiscoveryProducts, setUseEmbeddedDiscoveryProducts] =
    useState(false);

  const categoryProductsQuery = useCategoryDiscoveryProductsQuery(
    useEmbeddedDiscoveryProducts ? null : selectedDiscoveryCategory?.catId,
    areaId,
  );
  const discoveryProducts = useEmbeddedDiscoveryProducts
    ? embeddedDiscoveryProducts
    : categoryProductsQuery.data || [];
  const isDiscoveryLoading =
    !useEmbeddedDiscoveryProducts && categoryProductsQuery.isLoading;

  const handleSelectDiscoveryCategory = useCallback(category => {
    setUseEmbeddedDiscoveryProducts(false);
    setSelectedDiscoveryCategory(category);
  }, []);

  useEffect(() => {
    if (discoveryCategories.length === 0) return;
    const stillListed = discoveryCategories.some(
      c => c.catId === selectedDiscoveryCategory?.catId,
    );
    if (stillListed) return;
    setSelectedDiscoveryCategory(discoveryCategories[0]);
    setUseEmbeddedDiscoveryProducts(embeddedDiscoveryProducts.length > 0);
  }, [
    discoveryCategories,
    embeddedDiscoveryProducts,
    selectedDiscoveryCategory,
  ]);

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
        navigation.navigate('SearchScreen', {
          catId: linkValue,
          catName: actualCatName || 'Category',
        });
      } else if ((linkType === 'external' || linkType === 'url') && linkValue) {
        openExternalUrl(linkValue);
      }
    },
    [navigation, categories],
  );

  const handleOpenLocationModal = useCallback(
    () => locationModalRef.current?.open(),
    [],
  );

  const scrollContentStyle = useMemo(
    () => [
      styles.scrollContent,
      {
        paddingTop: headerMetrics.height,
        paddingBottom: floatingBottomOffset,
      },
    ],
    [headerMetrics.height, floatingBottomOffset],
  );

  return (
    <View style={styles.mainContainer}>
      <HomeStatusBar scrollY={scrollY} threshold={collapseDistance * 0.6} />
      <HomePopupModal
        visible={isHomePopupVisible}
        onClose={handleClose}
        imageUrl={popupData?.uri}
        onPress={handlePopupPress}
      />
      <LocationModal ref={locationModalRef} />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={1}
        style={styles.scroll}
        contentContainerStyle={scrollContentStyle}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={headerMetrics.height}
            tintColor={ACCENT.primary}
            colors={[ACCENT.primary]}
          />
        }
      >
        {!isStoreUnavailable && !noLocationSelected && (
          <TopShowcase
            backgroundUri={topBanner[0]?.uri}
            announcementUri={topAnnouncementBanner[0]?.uri}
            sideBySide={topSideBySide}
            onBannerPress={handleBannerPress}
          />
        )}

        {/* TEMP: OrbitLoader visual test — remove with its component file */}
        {/* <OrbitLoaderPreview /> */}

        {!isStoreUnavailable &&
          !noLocationSelected &&
          (isHomeLoading && categories.length === 0 ? (
            <CategoryShimmer />
          ) : (
            categories.length > 0 && <CategoryGrid categories={categories} />
          ))}

        {noLocationSelected ? (
          <StoreUnavailable
            imageSource={images.no_location}
            text={`Select your location to see products and offers available near you.`}
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
            {midBanner?.length > 0 && (
              <View style={styles.carouselBleed}>
                <PlacementBannerCarousel
                  banners={midBanner}
                  onBannerPress={handleBannerPress}
                  style={styles.carouselHeight}
                  showDots={true}
                  fullWidth={true}
                  infinite
                />
              </View>
            )}

            <BuyAgainSection
              products={buyAgainQuery.data}
              navigation={navigation}
            />

            <CategoryDiscoverySection
              isHomeLoading={isHomeLoading}
              categoryDiscovery={categoryDiscovery}
              shouldShow={shouldShowCategoryDiscovery}
              discoveryCategories={discoveryCategories}
              selectedDiscoveryCategory={selectedDiscoveryCategory}
              onSelectCategory={handleSelectDiscoveryCategory}
              isDiscoveryLoading={isDiscoveryLoading}
              discoveryProducts={discoveryProducts}
              navigation={navigation}
            />

            <ProductBlock
              isLoading={isHomeLoading && firstBlockItems.length === 0}
              shouldShow={shouldShowFirstBlock}
              eyebrow={BLOCK1_EYEBROW}
              title={firstProductBlock?.Title || firstProductBlock?.title}
              items={firstBlockItems}
              contentContainerStyle={RAIL_CONTENT_STYLE}
              shouldShowSeeAll={seeAllOverThree}
              navigation={navigation}
            />

            <ProductBlock
              isLoading={isHomeLoading && secondBlockItems.length === 0}
              shouldShow={shouldShowSecondBlock}
              eyebrow={BLOCK2_EYEBROW}
              title={secondProductBlock?.Title || secondProductBlock?.title}
              items={secondBlockItems}
              contentContainerStyle={RAIL_CONTENT_STYLE}
              shouldShowSeeAll={seeAllAtLeastThree}
              seeAllButtonStyle={BLOCK2_SEE_ALL_STYLE}
              navigation={navigation}
            />

            {isHomeLoading && fruits.length === 0 ? (
              <SeasonalBannerShimmer />
            ) : (
              fruits.length > 0 && (
                <View style={styles.carouselBleed}>
                  <PlacementBannerCarousel
                    banners={fruits}
                    onBannerPress={handleBannerPress}
                    style={styles.carouselHeight}
                    showDots={false}
                    fullWidth={false}
                  />
                </View>
              )
            )}

            <ProductBlock
              isLoading={isHomeLoading && thirdBlockItems.length === 0}
              shouldShow={shouldShowThirdBlock}
              eyebrow={BLOCK3_EYEBROW}
              title={thirdProductBlock?.Title || thirdProductBlock?.title}
              items={thirdBlockItems}
              contentContainerStyle={RAIL_CONTENT_STYLE}
              shouldShowSeeAll={seeAllOverThree}
              trailingSpacer
              navigation={navigation}
            />

            <BottomShowcase
              banner={bottomShowcaseBanner}
              products={bottomShowcaseProducts}
              onBannerPress={handleBannerPress}
            />
          </>
        )}
        <View style={styles.sectionGapLarge} />

        {isStoreUnavailable && isHomeLoading && (
          <View style={styles.sealWrap}>
            <Image
              source={require('../../assets/images/sealUD.png')}
              resizeMode="contain"
              style={styles.sealImage}
            />
          </View>
        )}

        {!isStoreUnavailable && !!data && (
          <View style={styles.sealWrap}>
            <Image
              source={UDENDEAL_SEAL}
              resizeMode="contain"
              style={styles.sealImage}
            />
          </View>
        )}
      </Animated.ScrollView>

      {}
      <View style={styles.headerOverlay} pointerEvents="box-none">
        <StickyHeader
          top={top}
          topSectionBanner={topSectionBanner}
          bannerPending={isHeaderDataPending}
          onBannerPress={handleBannerPress}
          bannerSheetStyle={bannerSheetStyle}
          bannerParallaxStyle={bannerParallaxStyle}
          headerCollapseStyle={headerCollapseStyle}
          etaAnimStyle={etaAnimStyle}
          searchWrapperAnimStyle={searchWrapperAnimStyle}
          fallbackHeaderBgStyle={fallbackHeaderBgStyle}
          stickyBorderAnimStyle={stickyBorderAnimStyle}
          onHeaderMetrics={handleHeaderMetrics}
          profile={profile}
          dashboardData={dashboardData}
          navigation={navigation}
          isStoreUnavailable={isStoreUnavailable}
          isLocationPending={isLocationPending}
          profileAvatarSize={PROFILE_AVATAR_SIZE}
          onSearchPressIn={handleSearchPressIn}
          onSearchPressOut={handleSearchPressOut}
          onPressLocation={handleOpenLocationModal}
        />
      </View>

      <Animated.View
        style={[
          styles.floatingContainer,
          { bottom: floatingBottomOffset },
          cartAnimatedStyle,
        ]}
      >
        {!isStoreUnavailable && !!data && <SelectedProducts />}
      </Animated.View>
    </View>
  );
};

export default HomeScreen;
