import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  Extrapolation,
  clamp,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
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
import StatusModal from '../../components/StatusModal';
import StoreUnavailable from '../../components/StoreUnavailable';
import HomePopupModal from '../../components/HomePopupModal';
import { openExternalUrl } from '../../utils/safeUrl';
import { shuffle } from '../../utils/shuffle';
import { AppContext } from '../../context/appContext';
import useTabBarAnimation from '../../hooks/useTabBarAnimation';
import {
  tabBarVisibility,
  getTabBarClearance,
} from '../../animations/tabBarVisibility';

import useResolvedAreaId from '../../queries/useResolvedAreaId';
import useHomepageDataQuery from '../../queries/useHomepageDataQuery';
import useGeneralSettingsQuery from '../../queries/useGeneralSettingsQuery';
import useDashboardQuery from '../../queries/useDashboardQuery';
import useCategoryDiscoveryProductsQuery from '../../queries/useCategoryDiscoveryProductsQuery';
import { deriveStoreUnavailableState } from '../../queries/transformHomepageResponse';

import useHomePopup from './hooks/useHomePopup';
import HomeStatusBar from './components/HomeStatusBar';
import StickyHeader from './components/StickyHeader';
import PlacementBannerCarousel from './components/PlacementBannerCarousel';
import CategoryGrid, { CategoryShimmer } from './components/CategoryGrid';
import ProductBlock from './components/ProductBlock';
import CategoryDiscoverySection from './components/CategoryDiscoverySection';
import ShimmerPlaceholder from '../../components/ShimmerPlaceholder';
import styles from './HomeScreen.styles';
import images from '@/assets/images';

const UDENDEAL_SEAL = require('../../assets/images/udendealSeal.png');

// Hoisted out of the render path: these are props on the (memoised)
// ProductBlock, so rebuilding them inline meant ProductBlock's memo could
// never hit and all three product rails re-rendered on every home render.
// All three rails now share one content inset. They previously each declared a
// different paddingLeft (2% / 5% / 4.6%), so the first card in each rail started
// at a different x — the single most visible source of "unfinished" on the old
// screen, since the rails stack directly on top of each other.
const RAIL_CONTENT_STYLE = {
  paddingLeft: wp('3.2%'),
  paddingRight: wp('2%'),
};
const BLOCK2_SEE_ALL_STYLE = { alignSelf: 'center', marginTop: hp('1%') };
const seeAllOverThree = count => count > 3;
const seeAllAtLeastThree = count => count >= 3;

const SeasonalFruitsShimmer = () => (
  <View style={styles.fruitsContainer}>
    <View style={styles.fruitsHeaderView}>
      <ShimmerPlaceholder style={styles.shimmerTitle} />
    </View>
    <View style={styles.shimmerBannerRow}>
      {[1, 2].map((_, i) => (
        <ShimmerPlaceholder key={i} style={styles.shimmerBanner} />
      ))}
    </View>
  </View>
);

const HomeScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const PROFILE_AVATAR_SIZE = Math.min(wp('14%'), 56);

  // ── Sticky search header animation ──────────────────────────────────────
  const SCROLL_RANGE = 180;
  const scrollY = useSharedValue(0);
  const headerInfoMaxH = useSharedValue(0);
  const searchPressScale = useSharedValue(1);

  const tabBarClearance = getTabBarClearance(bottom);
  const floatingBottomOffset = hp('0.2%') + tabBarClearance;

  const { onScrollWorklet } = useTabBarAnimation();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const y = event.contentOffset.y;
      scrollY.value = y;
      onScrollWorklet(y);
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

  const collapsibleHeaderStyle = useAnimatedStyle(() => {
    if (headerInfoMaxH.value <= 0) return {};
    return {
      height: interpolate(
        scrollY.value,
        [0, SCROLL_RANGE],
        [headerInfoMaxH.value, 0],
        Extrapolation.CLAMP,
      ),
      overflow: 'hidden',
    };
  });

  const etaAnimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, SCROLL_RANGE * 0.65],
      [1, 0],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, SCROLL_RANGE * 0.65],
          [0, -40],
          Extrapolation.CLAMP,
        ),
      },
      {
        scale: interpolate(
          scrollY.value,
          [0, SCROLL_RANGE * 0.65],
          [1, 0.9],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const coinAnimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [1, 0.8],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, SCROLL_RANGE],
          [0, -20],
          Extrapolation.CLAMP,
        ),
      },
      {
        scale: interpolate(
          scrollY.value,
          [0, SCROLL_RANGE],
          [1, 0.9],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const profileAnimStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, SCROLL_RANGE],
          [0, -20],
          Extrapolation.CLAMP,
        ),
      },
      {
        scale: interpolate(
          scrollY.value,
          [0, SCROLL_RANGE],
          [1, 0.9],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const SEARCH_MARGIN_START = hp('2%');
  const SEARCH_MARGIN_END = hp('0.8%');
  const SEARCH_HEIGHT_START = hp('5.4%');
  const SEARCH_HEIGHT_END = hp('4.8%');
  const SEARCH_RADIUS_START = wp('5.5%');
  const SEARCH_RADIUS_END = wp('4.5%');

  const searchWrapperAnimStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return {
      marginTop: interpolate(
        scrollY.value,
        [0, SCROLL_RANGE],
        [SEARCH_MARGIN_START, SEARCH_MARGIN_END],
        Extrapolation.CLAMP,
      ),
      height: interpolate(
        progress,
        [0, 1],
        [SEARCH_HEIGHT_START, SEARCH_HEIGHT_END],
      ),
      borderRadius: interpolate(
        progress,
        [0, 1],
        [SEARCH_RADIUS_START, SEARCH_RADIUS_END],
      ),
      // shadowOpacity: interpolate(progress, [0, 1], [0, 0.12]),
      // shadowRadius: interpolate(progress, [0, 1], [0, 8]),
      // elevation: interpolate(progress, [0, 1], [0, 4]),
      transform: [{ scale: searchPressScale.value }],
    };
  });

  const glassOverlayAnimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const fallbackHeaderBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      scrollY.value,
      [0, SCROLL_RANGE],
      ['#F25000', '#FFFFFF'],
    ),
  }));

  // Status-bar icon flipping lives in <HomeStatusBar/> (a leaf component) so a
  // threshold crossing mid-scroll re-renders one StatusBar instead of this
  // entire screen.
  const stickyBorderAnimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [60, SCROLL_RANGE],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  // Stable identities — both are handed to the (now memoised) StickyHeader.
  const handleSearchPressIn = useCallback(() => {
    searchPressScale.value = withTiming(0.98, { duration: 75 });
  }, [searchPressScale]);
  const handleSearchPressOut = useCallback(() => {
    searchPressScale.value = withSpring(1, { damping: 20, stiffness: 200 });
  }, [searchPressScale]);
  // ────────────────────────────────────────────────────────────────────────

  const navigation = useNavigation();
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  // Visibility is driven imperatively through the sheet's ref (open/close),
  // not React state — so tapping the location doesn't re-render Home or
  // remount the sheet, it just triggers the present animation.
  const locationModalRef = useRef(null);
  const [selectedDiscoveryCategory, setSelectedDiscoveryCategory] =
    useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { profile, loadProfileTwo } = useContext(AppContext);

  // Reconciles the locally-stored profile (guestId, pincode) on mount. This no
  // longer raises the global blocking loader: by the time HomeScreen mounts,
  // RootNavigator has already resolved `profile`, so the overlay was covering a
  // screen that was ready to paint and delaying first meaningful content by the
  // duration of two Keychain reads.
  //
  // The loadProfileTwo() call itself is kept: it is what mints a guestId and
  // normalises pincodeAreaId for guest sessions, and dropping it would change
  // who the login-redirect below fires for.
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([dashboardQuery.refetch(), homepageQuery.refetch()]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [dashboardQuery.refetch, homepageQuery.refetch]);
  useEffect(() => {
    if (profile?.pincode) {
      setSelectedDiscoveryCategory(null);
      setUseEmbeddedDiscoveryProducts(false);
    }
  }, [profile?.pincode]);

  const data = homepageQuery.data;
  // Memoised: this rebuilt its result object on every render (including every
  // scroll-driven one), so `storeUnavailableData` was a fresh reference each
  // time and defeated memoisation in everything it was passed to.
  const { isStoreUnavailable, storeUnavailableData } = useMemo(
    () =>
      deriveStoreUnavailableState({
        homepageData: data,
        error: homepageQuery.error,
        generalSettings: generalSettingsQuery.data,
      }),
    [data, homepageQuery.error, generalSettingsQuery.data],
  );

  // No location chosen yet — mirrors the header's "Select Location" signal
  // (StickyHeader gates on the same `profile?.pinAddress`), so header and body
  // stay in sync and clear together the moment editPincode sets an address.
  const noLocationSelected = !profile?.pinAddress;

  const popupData = data?.popup || homepageQuery.error?.popup || null;
  const { isHomePopupVisible, handleClose, handlePopupPress } =
    useHomePopup(popupData);

  // Memoised so it is not a brand-new array each render: it is a dependency of
  // handleBannerPress, and an unstable identity there would have given that
  // callback a new identity every render anyway.
  const categories = useMemo(() => data?.categories || [], [data]);
  const topBanner = data?.banners?.topBanner || [];
  const midBanner = data?.banners?.midBanner || [];
  const bottomBanner = data?.banners?.bottomBanner || [];
  const topSectionBanner = data?.banners?.topSectionBanner || [];
  const topAnnouncementBanner = data?.banners?.topAnnouncementBanner || [];
  const topSideBySide = data?.banners?.topSideBySide || [];
  const bottomShowcaseBanner = data?.banners?.bottomShowcaseBanner;
  const bottomShowcaseProducts = data?.banners?.bottomShowcaseProducts || [];
  const firstProductBlock = data?.firstProductBlock;
  const secondProductBlock = data?.secondProductBlock;
  const thirdProductBlock = data?.thirdProductBlock;
  const categoryDiscovery = data?.categoryDiscovery;

  // True during pull-to-refresh, and also while the homepage query is fetching
  // a freshly-selected area for which we have no cached data yet — so the body
  // shows its shimmers (instead of a blank screen) right after the user picks a
  // location, giving feedback that the new area's data is on its way.
  const isHomeLoading =
    refreshing || (!noLocationSelected && homepageQuery.isLoading);
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
    if (discoveryCategories.length > 0 && !selectedDiscoveryCategory) {
      setSelectedDiscoveryCategory(discoveryCategories[0]);
      setUseEmbeddedDiscoveryProducts(embeddedDiscoveryProducts.length > 0);
    }
  }, [categoryDiscovery]);

  // Passed to StickyHeader, both PlacementBannerCarousels, the bottom showcase
  // list and CategoryDiscoverySection. As a bare function it got a new identity
  // on every render, so none of those could ever skip re-rendering.
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

  const [statusModal, setStatusModal] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: '',
  });

  return (
    <View style={styles.mainContainer}>
      <HomeStatusBar scrollY={scrollY} threshold={SCROLL_RANGE * 0.5} />
      <HomePopupModal
        visible={isHomePopupVisible}
        onClose={handleClose}
        imageUrl={popupData?.uri}
        onPress={handlePopupPress}
      />
      <LocationModal ref={locationModalRef} />

      <StickyHeader
        top={top}
        topSectionBanner={topSectionBanner}
        onBannerPress={handleBannerPress}
        glassOverlayAnimStyle={glassOverlayAnimStyle}
        collapsibleHeaderStyle={collapsibleHeaderStyle}
        etaAnimStyle={etaAnimStyle}
        coinAnimStyle={coinAnimStyle}
        profileAnimStyle={profileAnimStyle}
        searchWrapperAnimStyle={searchWrapperAnimStyle}
        fallbackHeaderBgStyle={fallbackHeaderBgStyle}
        stickyBorderAnimStyle={stickyBorderAnimStyle}
        headerInfoMaxH={headerInfoMaxH}
        profile={profile}
        dashboardData={dashboardData}
        navigation={navigation}
        isStoreUnavailable={isStoreUnavailable}
        profileAvatarSize={PROFILE_AVATAR_SIZE}
        onSearchPressIn={handleSearchPressIn}
        onSearchPressOut={handleSearchPressOut}
        onPressLocation={handleOpenLocationModal}
      />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: floatingBottomOffset,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {topBanner.length > 0 && (
          <ImageBackground
            source={topBanner[0]?.uri}
            style={styles.topShowcaseContainer}
            imageStyle={{ width: '100%', height: '100%', resizeMode: 'cover' }}
          >
            {topAnnouncementBanner.length > 0 && (
              <Image
                source={topAnnouncementBanner[0].uri}
                style={styles.topShowcaseMain}
                resizeMode="cover"
              />
            )}

            {topSideBySide.length > 0 && (
              <View style={styles.topShowcaseRow}>
                {topSideBySide.slice(0, 5).map((banner, index) => (
                  <TouchableOpacity
                    key={banner.bannerId || index}
                    style={styles.topShowcaseCard}
                    activeOpacity={0.85}
                    onPress={() => handleBannerPress(banner)}
                  >
                    <Image
                      source={banner.uri}
                      style={styles.topShowcaseCardImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ImageBackground>
        )}

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
                  style={{ height: hp('22%') }}
                  showDots={true}
                  fullWidth={true}
                  infinite
                />
              </View>
            )}

            <ProductBlock
              isLoading={isHomeLoading && firstBlockItems.length === 0}
              shouldShow={shouldShowFirstBlock}
              title={firstProductBlock?.Title || firstProductBlock?.title}
              items={firstBlockItems}
              contentContainerStyle={RAIL_CONTENT_STYLE}
              shouldShowSeeAll={seeAllOverThree}
              navigation={navigation}
            />

            <ProductBlock
              isLoading={isHomeLoading && secondBlockItems.length === 0}
              shouldShow={shouldShowSecondBlock}
              title={secondProductBlock?.Title || secondProductBlock?.title}
              items={secondBlockItems}
              contentContainerStyle={RAIL_CONTENT_STYLE}
              shouldShowSeeAll={seeAllAtLeastThree}
              seeAllButtonStyle={BLOCK2_SEE_ALL_STYLE}
              navigation={navigation}
            />

            {isHomeLoading && fruits.length === 0 ? (
              <SeasonalFruitsShimmer />
            ) : (
              fruits.length > 0 && (
                <View style={styles.carouselBleed}>
                  <PlacementBannerCarousel
                    banners={fruits}
                    onBannerPress={handleBannerPress}
                    style={{ height: hp('22%') }}
                    showDots={false}
                    fullWidth={false}
                  />
                </View>
              )
            )}

            <ProductBlock
              isLoading={isHomeLoading && thirdBlockItems.length === 0}
              shouldShow={shouldShowThirdBlock}
              title={thirdProductBlock?.Title || thirdProductBlock?.title}
              items={thirdBlockItems}
              contentContainerStyle={RAIL_CONTENT_STYLE}
              shouldShowSeeAll={seeAllOverThree}
              trailingSpacer
              navigation={navigation}
            />

            {bottomShowcaseBanner && bottomShowcaseProducts.length > 0 && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleBannerPress(bottomShowcaseBanner)}
              >
                <ImageBackground
                  source={bottomShowcaseBanner.uri}
                  style={styles.showcaseCard}
                  imageStyle={styles.showcaseCardImage}
                >
                  <FlatList
                    horizontal
                    data={bottomShowcaseProducts}
                    keyExtractor={(item, index) =>
                      (item.bannerId || item.id || index).toString()
                    }
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => handleBannerPress(item)}
                        style={styles.showcaseItem}
                      >
                        <Image
                          source={item.uri}
                          style={styles.showcaseItemImage}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    )}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.showcaseListContent}
                  />
                </ImageBackground>
              </TouchableOpacity>
            )}

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

      <Animated.View
        style={[
          styles.floatingContainer,
          { bottom: floatingBottomOffset },
          cartAnimatedStyle,
        ]}
      >
        {!isStoreUnavailable && !!data && <SelectedProducts />}
      </Animated.View>

      <StatusModal
        visible={statusModal.visible}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={() => setStatusModal({ ...statusModal, visible: false })}
      />
    </View>
  );
};

export default HomeScreen;
