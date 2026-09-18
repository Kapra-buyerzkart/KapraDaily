import React, { useCallback, useMemo } from 'react';
import { RefreshControl, StatusBar, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTabBarClearance } from '../../../../animations/tabBarVisibility';
import { useWishlist } from '../../../context/WishlistContext';
import { ProductTile, Tile, OccasionTile } from './content';
import { useHomeData } from './data/useHomeData';
import { resolveCatId, resolveCatName } from './data/blocks';
import HomeSkeleton from '../HomeSkeleton';
import { useCartPillScrollTracker } from '../../../components/cartPillScroll';

// New Kapra Gold & Diamonds components
import KapraHeader from './components/KapraHeader';
import CategoryCirclesRow from './components/CategoryCirclesRow';
import QuickActionCards from './components/QuickActionCards';
import JewelryProductRail from './components/JewelryProductRail';
import ShopByOccasion from './components/ShopByOccasion';
import {
  HeroBanner,
  EverydayDiamondsBanner,
  HangingJhumkaBanner,
  SideBySidePromos,
} from './components/PromoBanners';
import MarqueeTicker from './components/MarqueeTicker';
import ShowroomCard from './components/ShowroomCard';
import { HOME_COLORS } from './theme';

type Linkable = { raw?: any };

const HomeStatusBar: React.FC = () => {
  const isFocused = useIsFocused();
  if (!isFocused) return null;

  return (
    <StatusBar
      translucent
      backgroundColor="transparent"
      barStyle="dark-content"
    />
  );
};

const HomeRedesignScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { loading, refreshing, onRefresh, sections, homeData } = useHomeData();

  const scrollY = useSharedValue(0);
  const trackCartPill = useCartPillScrollTracker();
  const onScroll = useAnimatedScrollHandler({
    onScroll: e => {
      scrollY.value = e.contentOffset.y;
      trackCartPill(e);
    },
  });

  const wishlisted = useMemo(
    () =>
      [...sections.featured, ...sections.secondStrip, ...sections.thirdStrip]
        .filter(item => isInWishlist((item as any).raw?.productId ?? item.id))
        .map(item => item.id),
    [
      sections.featured,
      sections.secondStrip,
      sections.thirdStrip,
      isInWishlist,
    ],
  );

  /* ──────── Navigation Handlers ──────── */

  const openSearch = useCallback(
    (params?: object) => navigation.navigate('KshopeSearch', params),
    [navigation],
  );

  const openProfile = useCallback(
    () => navigation.navigate('KshopeProfile'),
    [navigation],
  );

  const openWishlist = useCallback(
    () => navigation.navigate('WishlistScreen'),
    [navigation],
  );

  const openAddress = useCallback(
    () => navigation.navigate('KshopeSavedAddress'),
    [navigation],
  );

  const openCategoryTab = useCallback(
    () => navigation.navigate('CategoryScreen'),
    [navigation],
  );

  const openProduct = useCallback(
    (item: ProductTile & Linkable) => {
      const product = item.raw;
      if (!product) return;
      navigation.navigate('KshopeProductDetails', {
        productId: product.productId ?? product.id,
        product,
      });
    },
    [navigation],
  );

  const openCategory = useCallback(
    (item: any) => {
      const cat = item?.raw || item;
      const catId = cat ? resolveCatId(cat) : undefined;
      const catName = resolveCatName(
        cat,
        item.label || item.name || 'Category',
      );
      if (catId === undefined || catId === null || catId === '') {
        openSearch({ query: item.label || catName });
        return;
      }
      openSearch({ catId, catName });
    },
    [openSearch],
  );

  const openOccasion = useCallback(
    (occasion: OccasionTile) => {
      openSearch({ query: occasion.query, catName: occasion.label });
    },
    [openSearch],
  );

  const openBanner = useCallback(
    (banner: any) => {
      if (!banner) {
        openSearch({ query: 'Jewellery' });
        return;
      }
      const linkType = (
        banner?.linkType ||
        banner?.LinkType ||
        ''
      ).toLowerCase();
      const linkValue = banner?.linkValue || banner?.LinkValue;
      if (linkType === 'product') {
        navigation.navigate('KshopeProductDetails', { productId: linkValue });
      } else if (linkType === 'category') {
        openSearch({ catId: linkValue, catName: 'Category' });
      } else {
        openSearch({ query: banner?.title || banner?.Title || 'Collection' });
      }
    },
    [navigation, openSearch],
  );

  const onToggleWishlist = useCallback(
    (item: ProductTile & Linkable) => {
      if (item.raw) {
        toggleWishlist(item.raw);
      }
    },
    [toggleWishlist],
  );

  if (loading) {
    return <HomeSkeleton />;
  }

  const topBanner = sections.banners.top?.[0];
  const midBanner = sections.banners.mid?.[0];
  const featureBanner =
    sections.banners.topSection?.[0] || sections.banners.bottom?.[0];
  const categoriesList =
    homeData?.featuredCategories || homeData?.FeaturedCategories || [];

  return (
    <View style={styles.root}>
      <HomeStatusBar />

      {/* Top Kapra Header */}
      <KapraHeader
        address={sections.header.address}
        onSearchPress={() => openSearch()}
        onWishlistPress={openWishlist}
        onProfilePress={openProfile}
        onAddressPress={openAddress}
      />

      {/* Main Scroll Content */}
      <Animated.ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: getTabBarClearance(insets.bottom),
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={HOME_COLORS.darkEmerald}
            colors={[HOME_COLORS.darkEmerald]}
          />
        }
      >
        {/* 1. Category Circles Row */}
        <CategoryCirclesRow
          categories={categoriesList}
          onSelectCategory={openCategory}
          onViewAllPress={openCategoryTab}
        />

        {/* 2. Hero Promotional Banner: "Crafted for every chapter" */}
        <HeroBanner banner={topBanner} onPress={() => openBanner(topBanner)} />

        {/* 3. Three Quick Action Cards */}
        <QuickActionCards
          onGoldRatePress={() => openSearch({ query: 'Gold Rate' })}
          onGoldCoinsPress={() =>
            openSearch({ query: 'Gold Coins', catName: 'Gold Coins' })
          }
          onFindStorePress={openAddress}
        />

        {/* 4. "Curated for you" Product Rail (from API firstProductBlock) */}
        <JewelryProductRail
          title="Curated for you"
          items={sections.featured}
          wishlisted={wishlisted}
          onPressProduct={openProduct}
          onToggleWishlist={onToggleWishlist}
          onViewAll={() => openSearch({ query: 'Curated' })}
        />

        {/* 5. "EVERYDAY DIAMONDS" Mid Banner */}
        <EverydayDiamondsBanner
          banner={midBanner}
          onPress={() => openBanner(midBanner)}
        />

        {/* 6. "Shop by occasion" 4-Card Grid */}
        <ShopByOccasion
          onSelectOccasion={openOccasion}
          onViewAll={openCategoryTab}
        />

        {/* 7. Full-width Hanging Jhumka Feature Banner */}
        {/* <HangingJhumkaBanner
          banner={featureBanner}
          onPress={() => openBanner(featureBanner)}
        /> */}

        {/* 8. "Trending Now" Product Rail (from API secondProductBlock) */}
        <JewelryProductRail
          title="Trending Now"
          items={sections.secondStrip}
          wishlisted={wishlisted}
          onPressProduct={openProduct}
          onToggleWishlist={onToggleWishlist}
          onViewAll={() => openSearch({ query: 'Trending' })}
        />

        {/* 9. Side-by-Side Promo Tiles: Diamond Dreams & The Gold Edit */}
        {/* <SideBySidePromos
          onPressLeft={() =>
            openSearch({ query: 'Diamond', catName: 'Diamond Dreams' })
          }
          onPressRight={() =>
            openSearch({ query: 'Gold', catName: 'The Gold Edit' })
          }
        /> */}

        {/* 10. "Recently Viewed" Product Rail (from API thirdProductBlock) */}
        {/* <JewelryProductRail
          title="Recently Viewed"
          items={sections.thirdStrip}
          compact
          wishlisted={wishlisted}
          onPressProduct={openProduct}
          onToggleWishlist={onToggleWishlist}
        /> */}

        {/* 11. Marquee Ticker: Continuous Gold Brand Assurances */}
        <MarqueeTicker />

        {/* 12. "Visit Our Showroom" Store Locator Card */}
        {/* <ShowroomCard
          locationName={
            sections.header.address?.split('·')?.[0]?.trim() || 'Kochi'
          }
          onSelectLocation={openAddress}
          onFindStorePress={openAddress}
        /> */}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  content: {
    backgroundColor: '#FFFFFF',
  },
});

export default HomeRedesignScreen;
