import React, { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  RefreshControl,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useWishlist } from '../../../context/WishlistContext';
import HomeHeader, {
  HeaderItem,
  HEADER_BG,
} from '../../../components/HomeHeader';
import { HOME_COLORS, RADIUS, SPACE } from './theme';
import { ProductTile, RecCard, Tile } from './content';
import { useHomeData } from './data/useHomeData';
import { resolveCatId, resolveCatName } from './data/blocks';
import HomeSkeleton from '../HomeSkeleton';
import FeaturedRow from './sections/FeaturedRow';
import ShopByCategory from './sections/ShopByCategory';
import BestSelling from './sections/BestSelling';
import {
  BestForYou,
  BrandsSpotlight,
  MoreDeals,
  TopDeals,
} from './sections/PromoSections';
import Recommended from './sections/Recommended';
import RecentlyViewed from './sections/RecentlyViewed';
import MoreToExplore from './sections/MoreToExplore';
import BannerCarousel from './sections/BannerCarousel';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { loading, refreshing, onRefresh, sections } = useHomeData();

  const [headerTabId, setHeaderTabId] = useState('all');
  const [headerHeight, setHeaderHeight] = useState(0);
  const [activeChip, setActiveChip] = useState<string | null>(null);

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler(e => {
    scrollY.value = e.contentOffset.y;
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
      const attrValueId = raw?.attrValueId ?? raw?.AttrValueId;
      if (attrValueId !== undefined && attrValueId !== null) {
        openSearch({
          attrValueId,
          catName: raw?.brandName || raw?.BrandName || 'Brand',
        });
        return;
      }
      openBanner(raw);
    },
    [openSearch, openBanner],
  );

  const openRecommendedCard = useCallback(
    (item: RecCard & Linkable) => {
      if (item.variant === 'banner') {
        openBanner(item.raw);
        return;
      }
      openProduct(item);
    },
    [openBanner, openProduct],
  );

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
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight,
            paddingBottom: SPACE.xxl,
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
        <View style={styles.featuredBannerContainer}>
          <Image
            source={require('../../../assets/images/gifs/onam.gif')}
            style={styles.featuredBannerImage}
            resizeMode="cover"
          />
          <LinearGradient
            pointerEvents="none"
            colors={[HEADER_BG, `${HEADER_BG}00`]}
            style={styles.featuredBannerBlend}
          />
        </View>

        <ImageBackground
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
        </ImageBackground>

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

        <BestSelling items={sections.bestSelling} onPressTile={openCategory} />
        {/* <BestForYou
          onShopNow={() => openSearch()}
          onViewAll={() => openSearch()}
        /> */}

        <BrandsSpotlight
          brands={sections.brands}
          onPressBrandItem={openBrand}
        />
        {/* 
        <TopDeals
          dealTitle={sections.topDeals.title}
          deals={sections.topDeals.items}
          onShopNow={() => openSearch()}
          onPressDeal={openProduct}
        /> */}

        {/* <MoreDeals /> */}

        <BannerCarousel
          items={sections.banners.mid}
          variant="mid"
          onPressBanner={openBanner}
        />

        {sections.recommended.length > 0 ? (
          <Recommended
            items={sections.recommended}
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
          title={sections.header.title}
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
          scrollY={scrollY}
          onHeightChange={setHeaderHeight}
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
    height: hp('21%'),
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
