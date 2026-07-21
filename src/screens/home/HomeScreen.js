import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  StatusBar,
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
} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import SelectedProducts from '../../components/SelectedProducts';
import LocationModal from '../../components/LocationModal';
import StatusModal from '../../components/StatusModal';
import StoreUnavailable from '../../components/StoreUnavailable';
import HomePopupModal from '../../components/HomePopupModal';
import { openExternalUrl } from '../../utils/safeUrl';
import { shuffle } from '../../utils/shuffle';
import { LoaderContext } from '../../context/loaderContext';
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
import StickyHeader from './components/StickyHeader';
import PlacementBannerCarousel from './components/PlacementBannerCarousel';
import CategoryGrid, { CategoryShimmer } from './components/CategoryGrid';
import ProductBlock, {
  resolveTitleImageSource,
} from './components/ProductBlock';
import CategoryDiscoverySection from './components/CategoryDiscoverySection';
import ShimmerPlaceholder from '../../components/ShimmerPlaceholder';
import sectionCardStyles from './components/sectionCardStyles';
import styles from './HomeScreen.styles';

const HOME_BG = require('../../assets/images/homebg.png');
const COMBO_BG = require('../../assets/images/combobg.png');
const UDENDEAL_SEAL = require('../../assets/images/udendealSeal.png');

const SeasonalFruitsShimmer = () => (
  <View style={styles.fruitsContainer}>
    <View style={styles.fruitsHeaderView}>
      <ShimmerPlaceholder
        style={{
          width: wp('40%'),
          height: hp('2.5%'),
          borderRadius: 5,
          marginLeft: wp('5%'),
        }}
      />
    </View>
    <View style={{ flexDirection: 'row', marginLeft: wp('5%') }}>
      {[1, 2].map((_, i) => (
        <ShimmerPlaceholder
          key={i}
          style={{
            width: wp('74.88%'),
            height: hp('19.35%'),
            borderRadius: wp('4.65%'),
            marginRight: wp('5%'),
          }}
        />
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
      shadowOpacity: interpolate(progress, [0, 1], [0, 0.12]),
      shadowRadius: interpolate(progress, [0, 1], [0, 8]),
      elevation: interpolate(progress, [0, 1], [0, 4]),
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

  const stickyBorderAnimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [60, SCROLL_RANGE],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const handleSearchPressIn = () => {
    searchPressScale.value = withTiming(0.98, { duration: 75 });
  };
  const handleSearchPressOut = () => {
    searchPressScale.value = withSpring(1, { damping: 20, stiffness: 200 });
  };
  // ────────────────────────────────────────────────────────────────────────

  const navigation = useNavigation();
  const { showLoader } = useContext(LoaderContext);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDiscoveryCategory, setSelectedDiscoveryCategory] =
    useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { profile, loadProfileTwo } = useContext(AppContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        showLoader(true);
        await loadProfileTwo();
      } catch (error) {
        console.error('Profile load error:', error);
      } finally {
        showLoader(false);
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
  const { isStoreUnavailable, storeUnavailableData } =
    deriveStoreUnavailableState({
      homepageData: data,
      error: homepageQuery.error,
      generalSettings: generalSettingsQuery.data,
    });

  const popupData = data?.popup || homepageQuery.error?.popup || null;
  const { isHomePopupVisible, handleClose, handlePopupPress } =
    useHomePopup(popupData);

  const categories = data?.categories || [];
  const topBanner = data?.banners?.topBanner || [];
  const midBanner = data?.banners?.midBanner || [];
  const bottomBanner = data?.banners?.bottomBanner || [];
  const topSectionBanner = data?.banners?.topSectionBanner || [];
  const topAnnouncementBanner = data?.banners?.topAnnouncementBanner || [];
  const topSideBySide = data?.banners?.topSideBySide || [];
  const firstProductBlockTitleImage =
    data?.banners?.firstProductBlockTitleImage;
  const secondProductBlockTitleImage =
    data?.banners?.secondProductBlockTitleImage;
  const thirdProductBlockTitleImage =
    data?.banners?.thirdProductBlockTitleImage;
  const categoryDiscoveryBackgroundImage =
    data?.banners?.categoryDiscoveryBackgroundImage;
  const bottomShowcaseBanner = data?.banners?.bottomShowcaseBanner;
  const bottomShowcaseProducts = data?.banners?.bottomShowcaseProducts || [];
  const firstProductBlock = data?.firstProductBlock;
  const secondProductBlock = data?.secondProductBlock;
  const thirdProductBlock = data?.thirdProductBlock;
  const categoryDiscovery = data?.categoryDiscovery;

  const isHomeLoading = refreshing;
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

  const handleSelectDiscoveryCategory = category => {
    setUseEmbeddedDiscoveryProducts(false);
    setSelectedDiscoveryCategory(category);
  };

  useEffect(() => {
    if (discoveryCategories.length > 0 && !selectedDiscoveryCategory) {
      setSelectedDiscoveryCategory(discoveryCategories[0]);
      setUseEmbeddedDiscoveryProducts(embeddedDiscoveryProducts.length > 0);
    }
  }, [categoryDiscovery]);

  const handleBannerPress = banner => {
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
  };

  const [statusModal, setStatusModal] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: '',
  });

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" />
      <HomePopupModal
        visible={isHomePopupVisible}
        onClose={handleClose}
        imageUrl={popupData?.uri}
        onPress={handlePopupPress}
      />
      {modalVisible && (
        <LocationModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelect={item => console.log(item)}
        />
      )}

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
        onPressLocation={() => setModalVisible(true)}
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
          (isHomeLoading && categories.length === 0 ? (
            <CategoryShimmer />
          ) : (
            categories.length > 0 && <CategoryGrid categories={categories} />
          ))}

        {isStoreUnavailable ? (
          <StoreUnavailable
            image={storeUnavailableData?.image}
            text={storeUnavailableData?.text}
            onChangeLocation={() => setModalVisible(true)}
          />
        ) : (
          <>
            <View style={{ paddingTop: hp('4%') }}></View>

            {midBanner?.length > 0 && (
              <View
                style={{ marginVertical: hp('1%'), marginBottom: hp('2%') }}
              >
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
              backgroundImage={HOME_BG}
              discountBadge={50}
              showTitleImage={
                !!(
                  firstProductBlockTitleImage?.uri ||
                  firstProductBlock?.Image ||
                  firstProductBlock?.image
                )
              }
              titleImageSource={resolveTitleImageSource(
                firstProductBlock,
                firstProductBlockTitleImage,
              )}
              title={firstProductBlock?.Title || firstProductBlock?.title}
              items={firstBlockItems}
              contentContainerStyle={{
                paddingLeft: wp('2%'),
                paddingRight: wp('1%'),
                paddingTop: hp('1%'),
              }}
              shouldShowSeeAll={count => count > 3}
              navigation={navigation}
            />

            <ProductBlock
              isLoading={isHomeLoading && secondBlockItems.length === 0}
              shouldShow={shouldShowSecondBlock}
              backgroundImage={HOME_BG}
              showTitleImage={
                secondProductBlock?.image !== null &&
                secondProductBlock?.image !== undefined
              }
              titleImageSource={resolveTitleImageSource(
                secondProductBlock,
                secondProductBlockTitleImage,
              )}
              title={secondProductBlock?.Title || secondProductBlock?.title}
              titleExtraStyle={{ marginTop: hp('2%') }}
              items={secondBlockItems}
              contentContainerStyle={{
                paddingLeft: wp('5%'),
                paddingRight: wp('1%'),
                paddingTop: hp('1%'),
              }}
              shouldShowSeeAll={count => count >= 3}
              seeAllButtonStyle={{ alignSelf: 'center', marginTop: hp('1%') }}
              navigation={navigation}
            />

            {isHomeLoading && fruits.length === 0 ? (
              <SeasonalFruitsShimmer />
            ) : (
              fruits.length > 0 && (
                <View
                  style={{
                    marginVertical: hp('0.5%'),
                    marginBottom: hp('0.2%'),
                  }}
                >
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
              backgroundImage={COMBO_BG}
              showTitleImage={
                !!(
                  thirdProductBlockTitleImage?.uri ||
                  thirdProductBlock?.Image ||
                  thirdProductBlock?.image
                )
              }
              titleImageSource={resolveTitleImageSource(
                thirdProductBlock,
                thirdProductBlockTitleImage,
              )}
              titleImageResizeMode="contain"
              title={thirdProductBlock?.Title || thirdProductBlock?.title}
              items={thirdBlockItems}
              contentContainerStyle={{
                paddingHorizontal: wp('4.6%'),
                paddingTop: hp('1%'),
              }}
              shouldShowSeeAll={count => count > 3}
              trailingSpacer
              navigation={navigation}
            />

            {bottomShowcaseBanner && bottomShowcaseProducts.length > 0 && (
              <>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handleBannerPress(bottomShowcaseBanner)}
                >
                  <ImageBackground
                    source={bottomShowcaseBanner.uri}
                    style={sectionCardStyles.headerBackgroundbg2}
                    imageStyle={sectionCardStyles.headerBackgroundbgImage2}
                  >
                    <View style={sectionCardStyles.headerBackgroundbgContent}>
                      <FlatList
                        horizontal
                        data={bottomShowcaseProducts}
                        keyExtractor={(item, index) =>
                          (item.bannerId || item.id || index).toString()
                        }
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() => handleBannerPress(item)}
                            style={{ marginRight: wp('1%') }}
                          >
                            <Image
                              source={item.uri}
                              style={{
                                width: wp('33%'),
                                height: wp('33%'),
                                borderRadius: wp('4%'),
                                marginTop: hp('14%'),
                              }}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        )}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                          paddingHorizontal: wp('3.6%'),
                          paddingTop: hp('2%'),
                        }}
                      />
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
                <View style={{ height: hp('2%') }} />
              </>
            )}

            <CategoryDiscoverySection
              isHomeLoading={isHomeLoading}
              categoryDiscovery={categoryDiscovery}
              shouldShow={shouldShowCategoryDiscovery}
              categoryDiscoveryBackgroundImage={
                categoryDiscoveryBackgroundImage
              }
              discoveryCategories={discoveryCategories}
              selectedDiscoveryCategory={selectedDiscoveryCategory}
              onSelectCategory={handleSelectDiscoveryCategory}
              isDiscoveryLoading={isDiscoveryLoading}
              discoveryProducts={discoveryProducts}
              navigation={navigation}
            />
          </>
        )}
        <View style={{ height: hp('4%') }} />

        {isStoreUnavailable && isHomeLoading && (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Image
              source={require('../../assets/images/sealUD.png')}
              resizeMode="contain"
              style={{ width: wp('50%'), height: wp('50%') }}
            />
          </View>
        )}

        {!isStoreUnavailable && !!data && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: hp('3%'),
            }}
          >
            <Image
              source={UDENDEAL_SEAL}
              resizeMode="contain"
              style={{ width: wp('45%'), height: wp('45%') }}
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
