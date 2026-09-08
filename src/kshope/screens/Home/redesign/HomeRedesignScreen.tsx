import React, { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  RefreshControl,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getTabBarClearance } from '../../../../animations/tabBarVisibility';
import { useWishlist } from '../../../context/WishlistContext';
import HomeHeader, {
  HeaderItem,
  HEADER_BG,
} from '../../../components/HomeHeader';
import { HOME_COLORS, RADIUS, SPACE } from './theme';
import { ProductTile, RecCard, Tile } from './content';
import { bannerImage, useHomeData } from './data/useHomeData';
import { resolveCatId, resolveCatName } from './data/blocks';
import HomeSkeleton from '../HomeSkeleton';
import { useCartPillScrollTracker } from '../../../components/cartPillScroll';
import FeaturedRow from './sections/FeaturedRow';
import ShopByCategory from './sections/ShopByCategory';
import BestSelling from './sections/BestSelling';
import { BrandsSpotlight } from './sections/PromoSections';
import Recommended from './sections/Recommended';
import MoreToExplore from './sections/MoreToExplore';
import BannerCarousel from './sections/BannerCarousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const bannerColor = (banner: any) => {
  const value = String(banner?.linkValue ?? banner?.LinkValue ?? '').trim();
  const hex = value.startsWith('#') ? value : `#${value}`;
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(hex)
    ? hex
    : undefined;
};

type Linkable = { raw?: any };

const HomeStatusBar: React.FC = () => {
  const isFocused = useIsFocused();

  if (!isFocused) {
    return null;
  }

  return (
    <StatusBar
      translucent
      backgroundColor="transparent"
      barStyle="light-content"
    />
  );
};

const HomeRedesignScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { loading, refreshing, onRefresh, sections } = useHomeData();

  const [headerTabId, setHeaderTabId] = useState('all');
  const [headerHeight, setHeaderHeight] = useState(0);
  const [activeChip, setActiveChip] = useState<string | null>(null);

  const scrollY = useSharedValue(0);
  const trackCartPill = useCartPillScrollTracker();
  const onScroll = useAnimatedScrollHandler({
    onScroll: e => {
      scrollY.value = e.contentOffset.y;
      trackCartPill(e.contentOffset.y);
    },
  });

  const selectedChip = activeChip ?? sections.categoryChips[0]?.id ?? '';
  const headerItems = sections.headerItemsFor(headerTabId);
  const categoryCards = sections.categoryCardsFor(selectedChip);

  const wishlisted = useMemo(
    () =>
      sections.featured
        .filter(item => isInWishlist((item as any).raw?.productId ?? item.id))
        .map(item => item.id),
    [sections.featured, isInWishlist],
  );

  const openSearch = useCallback(
    (params?: object) => navigation.navigate('KshopeSearch', params),
    [navigation],
  );

  const openProfile = useCallback(
    () => navigation.navigate('KshopeProfile'),
    [navigation],
  );

  const openProduct = useCallback(
    (item: (ProductTile | RecCard) & Linkable) => {
      const product = item.raw;
      if (!product) {
        return;
      }
      navigation.navigate('KshopeProductDetails', {
        productId: product.productId ?? product.id,
        product,
      });
    },
    [navigation],
  );

  const openCategory = useCallback(
    (item: Tile & Linkable) => {
      const cat = item.raw;
      const catId = cat ? resolveCatId(cat) : undefined;
      if (catId === undefined || catId === null || catId === '') {
        openSearch({ query: item.label });
        return;
      }
      openSearch({ catId, catName: resolveCatName(cat, item.label) });
    },
    [openSearch],
  );

  const openBestSelling = useCallback(
    (item: Tile & Linkable) => {
      const raw: any = item.raw;
      const productId = raw?.productId ?? raw?.ProductId;
      if (productId !== undefined && productId !== null && productId !== '') {
        navigation.navigate('KshopeProductDetails', { productId });
        return;
      }
      openCategory(item);
    },
    [navigation, openCategory],
  );

  const openBanner = useCallback(
    (banner: any) => {
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
      }
    },
    [navigation, openSearch],
  );

  const openBrand = useCallback(
    (brand: any) => {
      const raw = brand?.raw;
      const brandName = String(
        raw?.brandName ||
          raw?.BrandName ||
          raw?.bannerName ||
          raw?.BannerName ||
          raw?.name ||
          raw?.Name ||
          raw?.title ||
          raw?.Title ||
          '',
      ).trim();

      if (brandName) {
        openSearch({ query: brandName, catName: brandName });
        return;
      }

      const linkType = (raw?.linkType || raw?.LinkType || '').toLowerCase();
      const linkValue = raw?.linkValue ?? raw?.LinkValue;
      if (linkType === 'product' && linkValue) {
        navigation.navigate('KshopeProductDetails', { productId: linkValue });
        return;
      }
      if (linkType === 'category' && linkValue) {
        openSearch({ catId: linkValue, catName: 'Category' });
        return;
      }

      const attrValueId = raw?.attrValueId ?? raw?.AttrValueId;
      if (
        attrValueId !== undefined &&
        attrValueId !== null &&
        attrValueId !== ''
      ) {
        openSearch({ attrValueId, catName: 'Brand' });
        return;
      }

      openSearch({});
    },
    [navigation, openSearch],
  );

  const openRecommendedCard = useCallback(
    (item: RecCard & Linkable) => {
      if (item.variant === 'banner') {
        const raw: any = item.raw;
        const linkType = String(
          raw?.linkType || raw?.LinkType || '',
        ).toLowerCase();
        const linkValue = raw?.linkValue ?? raw?.LinkValue;
        if (linkType === 'product' && linkValue) {
          openSearch({ id: linkValue });
          return;
        }
        openBanner(raw);
        return;
      }
      openProduct(item);
    },
    [openBanner, openProduct, openSearch],
  );

  const topBanner = sections.banners.top?.[0];
  const headerBg = bannerColor(topBanner) ?? HEADER_BG;
  const featuredBlend = headerBg;

  const openRecommendedAll = useCallback(() => {
    const block = sections.recommendedTitleBlock;
    navigation.navigate('KshopeProductCategoryDetail', {
      catId: block ? String(resolveCatId(block) ?? '') : '',
      title: block?.title || block?.Title || 'Recommended',
    });
  }, [navigation, sections.recommendedTitleBlock]);

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

  return (
    <View style={styles.root}>
      <HomeStatusBar />
      <Animated.ScrollView
        style={headerHeight ? styles.scrollReady : styles.scrollMeasuring}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={1}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight,
            paddingBottom: getTabBarClearance(insets.bottom),
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={HOME_COLORS.orange}
            colors={[HOME_COLORS.orange]}
            progressViewOffset={headerHeight}
          />
        }
      >
        <TouchableOpacity
          activeOpacity={topBanner ? 0.9 : 1}
          disabled={!topBanner}
          onPress={() => topBanner && openBanner(topBanner)}
          style={styles.featuredBannerContainer}
        >
          <Image
            source={
              topBanner
                ? bannerImage(topBanner)
                : require('../../../assets/images/gifs/onam.gif')
            }
            style={styles.featuredBannerImage}
            resizeMode="contain"
          />
          <LinearGradient
            pointerEvents="none"
            colors={[featuredBlend, `${featuredBlend}00`]}
            style={styles.featuredBannerBlend}
          />
        </TouchableOpacity>

        {/* <ImageBackground
          source={require('../../../assets/images/gifs/offer_flowers.gif')}
          style={styles.offerBannerImage}
          imageStyle={styles.offerBannerBackdrop}
          resizeMode="cover"
        >
          <Image
            source={require('../../../assets/images/home/offer_onam.png')}
            style={styles.offerBannerForeground}
            resizeMode="contain"
          />
        </ImageBackground> */}

        <FeaturedRow
          items={sections.featured}
          wishlisted={wishlisted}
          onToggleWishlist={onToggleWishlist}
          onPressProduct={openProduct}
        />

        <ShopByCategory
          chips={sections.categoryChips}
          cards={categoryCards}
          activeChip={selectedChip}
          onChipPress={setActiveChip}
          onCardPress={openCategory}
        />

        <BestSelling
          items={sections.bestSelling}
          onPressTile={openBestSelling}
        />
        {/* <BestForYou
          onShopNow={() => openSearch()}
          onViewAll={() => openSearch()}
        /> */}

        <BrandsSpotlight
          brands={sections.brands}
          onPressBrandItem={openBrand}
        />

        {/* <MoreDeals /> */}

        <BannerCarousel
          items={sections.banners.mid}
          variant="mid"
          onPressBanner={openBanner}
        />

        {sections.recommended.length > 0 ? (
          <Recommended
            items={sections.recommended}
            footerImage={sections.recommendedFooterImage}
            onPressCard={openRecommendedCard}
            onSeeAll={openRecommendedAll}
          />
        ) : null}

        {/* <RecentlyViewed
          items={sections.recentlyViewed}
          onSeeAll={() => openSearch()}
          onPressBanner={() => openSearch()}
        /> */}

        <BannerCarousel
          items={sections.banners.bottom}
          variant="bottom"
          onPressBanner={openBanner}
        />

        <BannerCarousel
          items={sections.banners.midBottom}
          variant="midBottom"
          onPressBanner={openBanner}
        />

        <MoreToExplore
          rowOne={sections.exploreRowOne}
          rowTwo={sections.exploreRowTwo}
          onPressTile={openCategory}
        />
      </Animated.ScrollView>

      <View style={styles.headerOverlay}>
        <HomeHeader
          address={sections.header.address}
          tabs={sections.headerTabs}
          selectedTabId={headerTabId}
          items={headerItems}
          onSelectTab={setHeaderTabId}
          onItemPress={(item: HeaderItem) =>
            openCategory({
              id: item.id,
              label: item.name,
              image: item.image,
              raw: item.raw,
            })
          }
          onSearchPress={() => openSearch()}
          onAvatarPress={openProfile}
          onNotificationsPress={() => navigation.navigate('KshopeProfile')}
          onWishlistPress={() => navigation.navigate('WishlistScreen')}
          onProfilePress={openProfile}
          onAddressPress={() => navigation.navigate('KshopeSavedAddress')}
          scrollY={scrollY}
          onHeightChange={setHeaderHeight}
          backgroundColor={headerBg}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: HOME_COLORS.white,
  },
  content: {
    backgroundColor: HOME_COLORS.white,
  },
  scrollMeasuring: {
    opacity: 0,
  },
  scrollReady: {
    opacity: 1,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  featuredBannerContainer: {
    width: SCREEN_WIDTH,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  featuredBannerImage: {
    width: SCREEN_WIDTH,
    height: hp('17.5%'),
    top: -8,
    // borderBottomLeftRadius: RADIUS.lg,
    // borderBottomRightRadius: RADIUS.lg,
  },
  featuredBannerBlend: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: hp('5%'),
  },
  offerBannerImage: {
    width: SCREEN_WIDTH,
    aspectRatio: 344 / 80,
    alignSelf: 'stretch',
    marginTop: SPACE.lg,
    overflow: 'hidden',
  },
  offerBannerBackdrop: {
    width: '100%',
  },
  offerBannerForeground: {
    width: '70%',
    resizeMode: 'contain',
    alignSelf: 'center',
    height: '100%',
  },
});

export default HomeRedesignScreen;
