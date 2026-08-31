import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  FlatList,
  Dimensions,
  RefreshControl,
  StatusBar,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import { useWishlist } from '../../context/WishlistContext';
import { getHomepageData } from '../../api/services/homeService';
import CONFIG from '../../globals/config';
import ExploreItem from '../../components/ExploreItem';
import ClickForMoreButton from '../../components/ClickForMoreButton';
import HomeHeader, { HeaderItem, HEADER_BG } from '../../components/HomeHeader';
import HomeSkeleton from './HomeSkeleton';
import { RECOMMENDED } from './redesign/content';
import FloatingCartButton from '../../components/FloatingCartButton';
import { getKshopeAreaId } from '../../globals/storage';
import { Fonts } from '../../theme/fonts';
import { colors } from '../../theme/colours';

const { width, height } = Dimensions.get('window');

const REC_DESIGN_WIDTH = 440;
const rs = (n: number) => (n / REC_DESIGN_WIDTH) * width;

const REC_PANEL_MARGIN = rs(8);
const REC_PANEL_PAD = rs(9);
const REC_CARD_GAP = rs(5);
const REC_CARD_W = Math.floor(
  (width - REC_PANEL_MARGIN * 2 - REC_PANEL_PAD * 2 - REC_CARD_GAP * 2) / 3,
);
const REC_CARD_H = Math.round(REC_CARD_W * (189 / 132));
const REC_CARD_TOP_H = Math.round(REC_CARD_W * (116 / 132));
const REC_CARD_IMG = Math.round(REC_CARD_W * (83 / 132));

const RECOMMENDED_PLACEHOLDER_ENABLED = __DEV__;

const RECOMMENDED_PLACEHOLDER_CARDS = RECOMMENDED.map(item => ({
  key: `rec_mock_${item.id}`,
  image: item.image,
  name: `${item.name} ${item.subtitle}`,
  price: item.price.replace('$', '₹'),
  mrp: item.mrp.replace('$', '₹'),
  discount: item.discount,
  product: null as any,
  productId: null as any,
}));

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

const RecArrow: React.FC = () => (
  <Svg width={rs(22)} height={rs(16)} viewBox="0 0 22 16" fill="none">
    <Path
      d="M1 8.00004H21M12.25 15L21 8.00004L12.25 1.00004"
      stroke="#FFFFFF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const RecHeart: React.FC<{ filled?: boolean }> = ({ filled }) => (
  <Svg width={rs(15)} height={rs(13)} viewBox="0 0 14 12" fill="none">
    <Path
      d="M13.6613 2.45916C13.4441 1.97793 13.1309 1.54184 12.7392 1.17532C12.3472 0.807695 11.8851 0.51555 11.3779 0.31477C10.852 0.105731 10.288 -0.0012594 9.71847 1.11852e-05C8.91954 1.11852e-05 8.14005 0.209334 7.46266 0.60472C7.3006 0.699 7.14666 0.802563 7.00082 0.914939C6.85498 0.802563 6.70104 0.699 6.53898 0.60472C5.86159 0.209334 5.0821 1.11852e-05 4.28317 1.11852e-05C3.71362 -0.0012594 3.14965 0.105731 2.62371 0.31477C2.11491 0.51555 1.65442 0.807695 1.2624 1.17532C0.870729 1.54184 0.557527 1.97793 0.340362 2.45916C0.114559 2.95949 0 3.49103 0 4.03789C0 4.55354 0.111323 5.09084 0.332273 5.63855C0.517301 6.09646 0.782452 6.57139 1.12129 7.05064C1.65792 7.80891 2.39605 8.59972 3.3129 9.40095C4.83184 10.7284 6.33594 11.6449 6.39975 11.6821L6.7873 11.9167C6.91427 11.9932 7.08574 11.9932 7.21271 11.9167L7.60026 11.6821C7.66407 11.6438 9.16709 10.7284 10.6871 9.40095C11.604 8.59972 12.3421 7.80891 12.8787 7.05064C13.2176 6.57139 13.4838 6.09646 13.6677 5.63855C13.8887 5.09084 14 4.55354 14 4.03789C14 3.49103 13.8854 2.95949 13.6613 2.45916Z"
      fill={filled ? '#F25000' : 'none'}
      stroke={filled ? '#F25000' : '#656565'}
      strokeWidth={0.9}
    />
  </Svg>
);

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { profile } = useUser();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState<any>(null);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [midBannerIndex, setMidBannerIndex] = useState(0);
  const [bestSellingIndex, setBestSellingIndex] = useState(1);
  const [selectedAccessorize, setSelectedAccessorize] = useState<string | null>(
    null,
  );
  const [headerHeight, setHeaderHeight] = useState(0);
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler(e => {
    scrollY.value = e.contentOffset.y;
  });

  const bannerRef = useRef<FlatList>(null);
  const accessorizeSubListRef = useRef<FlatList>(null);

  const userName =
    profile?.custName || profile?.name || profile?.firstName || 'Guest';

  const fetchData = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const storedAreaId = await getKshopeAreaId();
      const areaId = storedAreaId ?? profile?.pincode ?? null;

      const data = await getHomepageData(areaId, 100);
      setHomeData(data?.data || data);
    } catch (e) {
      console.error('Error fetching home data for K-shope', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData(true);
    setRefreshing(false);
  }, []);

  const topBanner =
    homeData?.banners?.filter(
      (b: any) =>
        b.placementKey === 'app_home_top_banner' ||
        b.PlacementKey === 'app_home_top_banner',
    ) || [];

  const midBanner =
    homeData?.banners?.filter(
      (b: any) =>
        b.placementKey === 'app_home_mid_banner' ||
        b.PlacementKey === 'app_home_mid_banner',
    ) || [];

  const bottomBanner =
    homeData?.banners?.filter(
      (b: any) =>
        b.placementKey === 'app_home_bottom' ||
        b.PlacementKey === 'app_home_bottom',
    ) || [];

  const midBannerBottom =
    homeData?.banners?.filter(
      (b: any) =>
        b.placementKey === 'app_home_mid_banner_bottom' ||
        b.PlacementKey === 'app_home_mid_banner_bottom',
    ) || [];

  const topBrands =
    homeData?.brands && homeData.brands.length > 0
      ? homeData.brands
      : homeData?.topBrands && homeData.topBrands.length > 0
      ? homeData.topBrands
      : homeData?.banners?.filter(
          (b: any) =>
            b.placementKey === 'app_top_brands' ||
            b.PlacementKey === 'app_top_brands',
        ) || [];

  const gShockMainBanner = homeData?.banners?.find(
    (b: any) =>
      b.placementKey === 'app_home_bottom_showcase_banner_image' ||
      b.PlacementKey === 'app_home_bottom_showcase_banner_image',
  );
  const activeGShockItems =
    homeData?.banners?.filter(
      (b: any) =>
        b.placementKey === 'app_home_bottom_showcase_product_image' ||
        b.PlacementKey === 'app_home_bottom_showcase_product_image',
    ) || [];
  const gShockMainBanner2 = homeData?.banners?.find(
    (b: any) =>
      b.placementKey === 'app_home_bottom_showcase_banner_image2' ||
      b.PlacementKey === 'app_home_bottom_showcase_banner_image2',
  );
  const bottomShowcaseItems2 =
    homeData?.banners?.filter(
      (b: any) =>
        b.placementKey === 'app_home_bottom_showcase_product_image2' ||
        b.PlacementKey === 'app_home_bottom_showcase_product_image2',
    ) || [];

  const activeGoatDeals =
    homeData?.banners?.filter(
      (b: any) =>
        b.placementKey === 'app_home_cat_top_sidebyside_four' ||
        b.PlacementKey === 'app_home_cat_top_sidebyside_four',
    ) || [];

  const bestSelling = homeData?.showcaseSlider || [];

  const categories =
    homeData?.featuredCategories || homeData?.FeaturedCategories || [];

  const unwrapBlock = (block: any): any => {
    if (!block) return null;
    let current = block;
    for (let i = 0; i < 3; i++) {
      if (
        typeof current === 'string' &&
        (current.trim().startsWith('{') || current.trim().startsWith('['))
      ) {
        try {
          current = JSON.parse(current);
        } catch (e) {
          break;
        }
      } else {
        break;
      }
    }
    if (current && typeof current === 'object') {
      if (current.firstProductBlock) current = current.firstProductBlock;
      else if (current.FirstProductBlock) current = current.FirstProductBlock;
      else if (current.secondProductBlock) current = current.secondProductBlock;
      else if (current.SecondProductBlock) current = current.SecondProductBlock;
      else if (current.thirdProductBlock) current = current.thirdProductBlock;
      else if (current.ThirdProductBlock) current = current.ThirdProductBlock;
      else if (current.data && !current.items && !current.Items)
        current = current.data;
      if (
        typeof current === 'string' &&
        (current.trim().startsWith('{') || current.trim().startsWith('['))
      ) {
        try {
          current = JSON.parse(current);
        } catch (e) {}
      }
    }
    return current;
  };

  const getItems = (block: any) => {
    if (!block) return [];
    if (Array.isArray(block)) return block;
    if (block.items && Array.isArray(block.items)) return block.items;
    if (block.Items && Array.isArray(block.Items)) return block.Items;
    if (block.data && Array.isArray(block.data)) return block.data;
    return [];
  };

  const parsedFirstBlock = unwrapBlock(
    homeData?.firstProductBlock || homeData?.firstproductblock,
  );
  const parsedSecondBlock = unwrapBlock(
    homeData?.secondProductBlock || homeData?.secondproductblock,
  );

  const parsedThirdBlock = unwrapBlock(
    homeData?.thirdProductBlock || homeData?.thirdproductblock,
  );

  const activeFirstProducts = getItems(parsedFirstBlock).filter(
    (i: any) => i && (i.productId || i.id),
  );
  const activeSecondProducts = getItems(parsedSecondBlock).filter(
    (i: any) => i && (i.productId || i.id),
  );
  const activeRecommended = getItems(parsedThirdBlock).filter(
    (i: any) => i && (i.productId || i.id),
  );

  const getSectionTitle = (sectionKey: string, fallback: string) => {
    const titles = homeData?.titles || homeData?.Titles || [];
    const found = titles.find(
      (t: any) =>
        (t.section || t.id || t.key || '').toLowerCase() ===
        sectionKey.toLowerCase(),
    );
    return found?.title || found?.Title || fallback;
  };

  useEffect(() => {
    if (!topBanner || topBanner.length <= 1) return;
    const timer = setInterval(() => {
      setBannerIndex(prev => {
        const next = (prev + 1) % topBanner.length;
        bannerRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [topBanner]);

  const getImageSource = (imgPath: any) => {
    if (!imgPath) return require('../../assets/images/logo.png');
    if (typeof imgPath === 'object' && imgPath.uri) return imgPath;
    if (typeof imgPath === 'string') {
      const trimmedPath = imgPath.trim();
      if (trimmedPath.startsWith('http')) return { uri: trimmedPath };
      const base = CONFIG.image_base_url.replace(/\/$/, '');
      const path = trimmedPath.startsWith('/')
        ? trimmedPath
        : `/${trimmedPath}`;
      return { uri: `${base}${path}` };
    }
    return imgPath;
  };

  const handleBannerPress = (banner: any) => {
    if (!banner) return;
    const linkType = (banner.linkType || banner.LinkType || '').toLowerCase();
    const linkValue = banner.linkValue || banner.LinkValue;
    if (linkType === 'product') {
      navigation.navigate('KshopeProductDetails', { productId: linkValue });
    } else if (linkType === 'category') {
      navigation.navigate('KshopeSearch', {
        catId: linkValue,
        catName: 'Category',
      });
    }
  };

  const resolveCatId = (cat: any) =>
    cat?.catId ??
    cat?.CatId ??
    cat?.categoryId ??
    cat?.CategoryId ??
    cat?.id ??
    cat?.Id;

  const resolveCatName = (cat: any, fallback = 'Category') =>
    cat?.catName ||
    cat?.CatName ||
    cat?.displayTitle ||
    cat?.DisplayTitle ||
    cat?.name ||
    cat?.Name ||
    fallback;

  const handleCategoryPress = (cat: any) => {
    if (!cat) return;
    const catId = resolveCatId(cat);
    if (catId === undefined || catId === null || catId === '') {
      navigation.navigate('KshopeSearch');
      return;
    }
    navigation.navigate('KshopeSearch', {
      catId,
      catName: resolveCatName(cat),
    });
  };

  const displayCategories = categories.slice(0, 8);
  let rawTabShowcase =
    homeData?.categoryTabShowcase ||
    homeData?.CategoryTabShowcase ||
    homeData?.categorytabshowcase;

  if (!rawTabShowcase && homeData?.data) {
    rawTabShowcase =
      homeData.data.categoryTabShowcase ||
      homeData.data.CategoryTabShowcase ||
      homeData.data.categorytabshowcase;
  }

  let parsedTabShowcase = unwrapBlock(rawTabShowcase);

  if (parsedTabShowcase && !Array.isArray(parsedTabShowcase)) {
    parsedTabShowcase =
      parsedTabShowcase.categoryTabShowcase ||
      parsedTabShowcase.CategoryTabShowcase ||
      parsedTabShowcase.categorytabshowcase ||
      parsedTabShowcase.data ||
      parsedTabShowcase.items ||
      parsedTabShowcase.Items ||
      parsedTabShowcase;
    parsedTabShowcase = unwrapBlock(parsedTabShowcase);
  }

  const accessorizeCategories = Array.isArray(parsedTabShowcase)
    ? parsedTabShowcase
    : [];

  useEffect(() => {
    if (accessorizeCategories.length > 0) {
      const exists = accessorizeCategories.some((t: any) => {
        const tId = t.tabId || t.TabId || t.catId || t.CatId || t.id || t.Id;
        return String(tId) === String(selectedAccessorize);
      });
      if (!exists || !selectedAccessorize) {
        const firstItem = accessorizeCategories[0];
        const firstId =
          firstItem.tabId ||
          firstItem.TabId ||
          firstItem.catId ||
          firstItem.CatId ||
          firstItem.id ||
          firstItem.Id;
        setSelectedAccessorize(firstId);
      }
    }
  }, [accessorizeCategories]);

  useEffect(() => {
    if (accessorizeSubListRef.current) {
      try {
        accessorizeSubListRef.current.scrollToOffset({
          offset: 0,
          animated: false,
        });
      } catch (err) {
        console.warn('Failed to scroll accessorize sublist:', err);
      }
    }
  }, [selectedAccessorize]);

  const headerPlaceholders = [
    require('../../assets/images/home/items/gshock.png'),
    require('../../assets/images/home/items/shoes.png'),
    require('../../assets/images/home/items/watch.png'),
    require('../../assets/images/home/items/shoes_02.png'),
  ];

  const headerTabs = [
    { id: 'all', name: 'All' },
    ...accessorizeCategories.map((t: any, i: number) => ({
      id: String(t.tabId || t.TabId || t.catId || t.CatId || t.id || t.Id || i),
      name: t.tabName || t.TabName || t.catName || t.CatName || t.name || 'Tab',
    })),
  ];

  const [headerTabId, setHeaderTabId] = useState('all');

  const activeHeaderTab = accessorizeCategories.find((t: any, i: number) => {
    const tId = t.tabId || t.TabId || t.catId || t.CatId || t.id || t.Id || i;
    return String(tId) === String(headerTabId);
  });

  const headerSource =
    headerTabId === 'all'
      ? displayCategories
      : activeHeaderTab?.items || activeHeaderTab?.Items || [];

  const headerItems: HeaderItem[] = headerSource.map(
    (item: any, index: number) => {
      const img = item.imageUrl || item.ImageUrl || item.image || item.Image;
      return {
        id: String(resolveCatId(item) ?? index),
        name: resolveCatName(item, ''),
        image: img
          ? getImageSource(img)
          : headerPlaceholders[index % headerPlaceholders.length],
        raw: item,
      };
    },
  );

  const renderBannerItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => handleBannerPress(item)}
      style={styles.bannerSlide}
    >
      <Image
        source={getImageSource(item.imageUrl || item.ImageUrl || item.image)}
        style={styles.bannerImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: any }) => {
    const imgSrc =
      item.image || item.imageUrl
        ? getImageSource(item.imageUrl || item.image)
        : require('../../assets/images/logo.png');
    return (
      <TouchableOpacity
        style={styles.categoryItem}
        onPress={() => handleCategoryPress(item)}
      >
        <ImageBackground
          source={require('../../assets/images/profile/backimg.png')}
          style={styles.categoryCircle}
          resizeMode="contain"
        >
          <Image
            source={imgSrc}
            style={styles.categoryImage}
            resizeMode="contain"
          />
        </ImageBackground>
        <Text style={styles.categoryLabel} numberOfLines={2}>
          {item.catName || item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderAccessorizeItem = ({ item }: { item: any }) => {
    const tabImage =
      item.tabImageUrl ||
      item.TabImageUrl ||
      item.imageUrl ||
      item.ImageUrl ||
      item.image ||
      item.Image;
    const imgSrc = tabImage
      ? getImageSource(tabImage)
      : require('../../assets/images/logo.png');

    const itemId =
      item.tabId ||
      item.TabId ||
      item.catId ||
      item.CatId ||
      item.id ||
      item.Id;
    const isSelected = String(selectedAccessorize) === String(itemId);
    const title =
      item.tabName ||
      item.TabName ||
      item.catName ||
      item.CatName ||
      item.name ||
      item.Name;

    return (
      <TouchableOpacity
        style={[
          styles.accessorizeCard,
          isSelected && styles.accessorizeCardActive,
        ]}
        onPress={() => setSelectedAccessorize(itemId)}
      >
        <View style={styles.accessorizeImageContainer}>
          <Image
            source={imgSrc}
            style={styles.accessorizeImage}
            resizeMode="cover"
          />
        </View>
        <View style={{ height: 6 }} />
        <Text
          style={[
            styles.accessorizeLabel,
            isSelected && { color: colors.black },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMidBanner = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => handleBannerPress(item)}
      style={styles.midBannerCard}
    >
      <Image
        source={getImageSource(item.imageUrl || item.ImageUrl || item.image)}
        style={styles.midBannerImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderBrandItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.brandCard}
      onPress={() => {
        if (item.attrValueId !== undefined && item.attrValueId !== null) {
          navigation.navigate('KshopeSearch', {
            attrValueId: item.attrValueId,
            catName: item.brandName || 'Brand',
          });
        } else {
          handleBannerPress(item);
        }
      }}
    >
      <Image
        source={getImageSource(
          item.brandImage ||
            item.imageUrl ||
            item.ImageUrl ||
            item.image ||
            item.logo,
        )}
        style={styles.brandImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  const renderGShockCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.gShockCard}
      onPress={() => handleBannerPress(item)}
    >
      <Image
        source={getImageSource(item.imageUrl || item.ImageUrl || item.image)}
        style={styles.gShockCardImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  const openRecommendedAll = () => {
    if (activeGoatDeals.length > 0) {
      const linked =
        activeGoatDeals.find(
          (b: any) =>
            (b.linkType || b.LinkType || '').toLowerCase() === 'category',
        ) || activeGoatDeals[0];
      handleBannerPress(linked);
      return;
    }
    const catId =
      parsedThirdBlock?.catId ??
      parsedThirdBlock?.CatId ??
      parsedThirdBlock?.categoryId ??
      parsedThirdBlock?.CategoryId ??
      parsedThirdBlock?.id ??
      parsedThirdBlock?.Id;
    navigation.navigate('KshopeProductCategoryDetail', {
      catId: catId?.toString(),
      title:
        parsedThirdBlock?.title || parsedThirdBlock?.Title || 'Recommended',
      products: activeRecommended,
    });
  };

  const toCardPricing = (item: any) => {
    const price = item.specialPrice || item.price || item.currentPrice || 0;
    const mrp = item.unitPrice || item.mrp || item.originalPrice || 0;
    const discount = item.discountPercent
      ? Math.round(item.discountPercent)
      : mrp > 0 && price > 0 && mrp > price
      ? Math.round(((mrp - price) / mrp) * 100)
      : 0;

    return {
      price: price > 0 ? `₹${price}/-` : '',
      mrp: mrp > 0 && mrp > price ? `₹${mrp}/-` : '',
      discount: discount > 0 ? `${discount}% OFF` : '',
    };
  };

  const toRecommendedCard = (item: any, index: number) => {
    const productId = item.productId || item.id;

    return {
      key: `rec_${productId || index}`,
      image: getImageSource(
        item.featuredImage ||
          item.productImage ||
          item.imageUrl ||
          item.ImageUrl ||
          item.image,
      ),
      name: item.prName || item.productName || item.title || item.name,
      ...toCardPricing(item),
      product: item,
      productId,
      onPress: () =>
        navigation.navigate('KshopeProductDetails', {
          productId,
          product: item,
        }),
    };
  };

  const toGoatDealCard = (banner: any, index: number) => {
    const linkType = (banner.linkType || banner.LinkType || '').toLowerCase();
    const linkValue = banner.linkValue || banner.LinkValue;

    return {
      key: `goat_${
        banner.bannerId || banner.BannerId || banner.id || banner.Id || index
      }`,
      image: getImageSource(banner.imageUrl || banner.ImageUrl || banner.image),
      name:
        banner.title ||
        banner.Title ||
        banner.bannerName ||
        banner.BannerName ||
        banner.name ||
        '',
      ...toCardPricing(banner),
      product: null as any,
      productId: linkType === 'product' ? linkValue : null,
      onPress: () => handleBannerPress(banner),
    };
  };

  const recommendedCards =
    activeGoatDeals.length > 0
      ? activeGoatDeals.slice(0, 6).map(toGoatDealCard)
      : activeRecommended.length > 0
      ? activeRecommended.slice(0, 6).map(toRecommendedCard)
      : RECOMMENDED_PLACEHOLDER_ENABLED
      ? RECOMMENDED_PLACEHOLDER_CARDS
      : [];

  const renderRecommendedCard = (card: any) => (
    <TouchableOpacity
      key={card.key}
      activeOpacity={card.onPress ? 0.9 : 1}
      style={styles.recCard}
      onPress={() => card.onPress?.()}
    >
      <View style={styles.recCardTop}>
        {!!card.discount && (
          <View style={styles.recBadge}>
            <Text style={styles.recBadgeText}>{card.discount}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.recHeart}
          disabled={!card.product}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => card.product && toggleWishlist(card.product)}
        >
          <RecHeart filled={!!card.product && isInWishlist(card.productId)} />
        </TouchableOpacity>
        <Image
          source={card.image}
          style={styles.recCardImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.recCardBody}>
        <Text style={styles.recCardName} numberOfLines={2}>
          {card.name}
        </Text>
        {!!card.price && (
          <Text style={styles.recCardPrice} numberOfLines={1}>
            {card.price}
          </Text>
        )}
        {!!card.mrp && (
          <Text style={styles.recCardMrp} numberOfLines={1}>
            {card.mrp}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <>
        <HomeStatusBar />
        <HomeSkeleton />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <HomeStatusBar />
      <Animated.ScrollView
        style={headerHeight ? styles.scrollReady : styles.scrollMeasuring}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#F25000"
            progressViewOffset={headerHeight}
          />
        }
        contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: 0 }}
      >
        <View style={styles.featuredBannerContainer}>
          <Image
            source={require('../../assets/images/gifs/onam.gif')}
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
          source={require('../../assets/images/gifs/offer_flowers.gif')}
          style={styles.offerBannerImage}
          imageStyle={styles.offerBannerBackdrop}
          resizeMode="cover"
        >
          <Image
            source={require('../../assets/images/home/offer_onam.png')}
            style={styles.offerBannerForeground}
            resizeMode="contain"
          />
        </ImageBackground>
        {displayCategories.length > 0 && (
          <View style={{ paddingBottom: 10, marginTop: hp('2%') }}>
            <FlatList
              data={displayCategories.reduce(
                (rows: any[][], item: any, index: number) => {
                  if (index % 2 === 0) rows.push([item]);
                  else rows[rows.length - 1].push(item);
                  return rows;
                },
                [],
              )}
              keyExtractor={(_, i) => `cat_col_${i}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesGrid}
              renderItem={({ item: pair }) => (
                <View style={{ flexDirection: 'column' }}>
                  {pair.map((catItem: any, idx: number) => (
                    <React.Fragment key={catItem.catId || catItem.id || idx}>
                      {renderCategoryItem({ item: catItem })}
                    </React.Fragment>
                  ))}
                </View>
              )}
            />
          </View>
        )}

        {activeGShockItems?.length > 0 && gShockMainBanner && (
          <View style={{ ...styles.section, marginTop: hp('0%') }}>
            <ImageBackground
              source={{
                uri: CONFIG.image_base_url + gShockMainBanner.imageUrl,
              }}
              style={styles.gShockTopBanner}
              resizeMode="stretch"
            >
              <View
                style={{
                  paddingHorizontal: 16,
                  position: 'absolute',
                  bottom: 20,
                  left: 0,
                  right: 0,
                }}
              >
                <FlatList
                  data={activeGShockItems}
                  renderItem={renderGShockCard}
                  keyExtractor={(item, index) =>
                    item.bannerId?.toString() ||
                    item.id?.toString() ||
                    index.toString()
                  }
                  numColumns={2}
                  columnWrapperStyle={{
                    justifyContent: 'space-between',
                  }}
                  scrollEnabled={false}
                />
              </View>
            </ImageBackground>
          </View>
        )}

        {topBrands && topBrands.length > 0 && (
          <View style={[styles.section, { marginTop: hp('2%') }]}>
            <Text style={[styles.sectionTitle, { marginTop: hp('2%') }]}>
              {getSectionTitle('top_brands', 'TOP BRANDS')}
            </Text>
            <FlatList
              data={topBrands}
              renderItem={renderBrandItem}
              keyExtractor={(_, i) => `brand_${i}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: wp('3%'),
                paddingBottom: 20,
              }}
            />
          </View>
        )}

        {accessorizeCategories.length > 0 && (
          <View style={[styles.section, { marginTop: hp('2%') }]}>
            <Text
              style={[
                styles.sectionTitle,
                { textTransform: 'uppercase', marginBottom: hp('2%') },
              ]}
            >
              {getSectionTitle('category_tabs_images', 'ACCESSORIZE')}
            </Text>
            <View
              style={{
                marginHorizontal: -wp('0%'),
              }}
            >
              <FlatList
                data={accessorizeCategories}
                renderItem={renderAccessorizeItem}
                keyExtractor={(item, i) => `acc_${item.catId || i}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: wp('4%') }}
              />
            </View>

            {(() => {
              const activeTab = accessorizeCategories.find((t: any) => {
                const tId =
                  t.tabId || t.TabId || t.catId || t.CatId || t.id || t.Id;
                return String(tId) === String(selectedAccessorize);
              });
              const activeTabItems = activeTab?.items || activeTab?.Items || [];
              if (activeTabItems.length === 0) return null;

              return (
                <LinearGradient
                  colors={[colors.themeTeal, '#FFD9C6', colors.figmaTeal]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.dummyAccessorizeContainer}
                >
                  <FlatList
                    ref={accessorizeSubListRef}
                    data={activeTabItems}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: wp('4%') }}
                    keyExtractor={(item, idx) => `tabItem_${item.catId || idx}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.accessorizeBannerCard}
                        onPress={() => handleCategoryPress(item)}
                      >
                        <Image
                          source={getImageSource(
                            item.imageUrl ||
                              item.ImageUrl ||
                              item.image ||
                              item.Image,
                          )}
                          style={styles.dummyAccessorizeImage}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    )}
                  />
                </LinearGradient>
              );
            })()}
          </View>
        )}

        {activeFirstProducts.length > 0 && (
          <View style={[styles.section, { marginTop: '1%' }]}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  textTransform: 'uppercase',
                  marginTop: '1%',
                },
              ]}
            >
              {parsedFirstBlock?.title ||
                parsedFirstBlock?.Title ||
                'Top Deals'}
            </Text>

            <FlatList
              data={activeFirstProducts}
              renderItem={({ item }) => (
                <ExploreItem
                  item={item}
                  onPress={() =>
                    navigation.navigate('KshopeProductDetails', {
                      productId: item.productId,
                      product: item,
                    })
                  }
                  toggleWishlist={toggleWishlist}
                  isInWishlist={id => isInWishlist(id)}
                />
              )}
              keyExtractor={(item, i) => `first_${item.productId || i}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: wp('4%') }}
            />
            <View style={{ marginTop: 16 }}>
              <ClickForMoreButton
                onPress={() => {
                  const id =
                    parsedFirstBlock?.catId ||
                    parsedFirstBlock?.CatId ||
                    parsedFirstBlock?.id ||
                    parsedFirstBlock?.Id ||
                    parsedFirstBlock?.categoryId ||
                    parsedFirstBlock?.CategoryId;
                  navigation.navigate('KshopeProductCategoryDetail', {
                    catId: id?.toString(),
                    title: parsedFirstBlock?.title || 'Top Deals',
                    products: activeFirstProducts,
                  });
                }}
                title={`Click for more ${parsedFirstBlock?.title || 'Deals'}`}
              />
            </View>
          </View>
        )}

        {midBanner && midBanner.length > 0 && (
          <View style={styles.section}>
            <FlatList
              data={midBanner}
              renderItem={renderMidBanner}
              keyExtractor={(_, i) => `mid_${i}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={wp('93%')}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: wp('4%') }}
              onMomentumScrollEnd={e => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.x / wp('93%'),
                );
                setMidBannerIndex(index);
              }}
            />
            <View style={styles.indicatorContainer}>
              {midBanner.map((_: any, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.indicatorPill,
                    midBannerIndex === index && styles.indicatorPillActive,
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {recommendedCards.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.recSectionTitle}>
              Recommended
              <Text style={styles.recSectionAccent}> For you</Text>
            </Text>

            <View style={styles.recPanel}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.recSeeAll}
                onPress={openRecommendedAll}
              >
                <RecArrow />
              </TouchableOpacity>

              <View style={styles.recGrid}>
                {recommendedCards.map(renderRecommendedCard)}
              </View>

              <View style={styles.recPanelRule} />

              <View style={styles.recFooterRow}>
                <Image
                  source={require('../../assets/images/home/redesign/rec_footer_left.png')}
                  style={styles.recFooterArt}
                  resizeMode="contain"
                />
                <Image
                  source={require('../../assets/images/home/redesign/rec_footer_right.png')}
                  style={styles.recFooterArt}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        )}

        {bestSelling && bestSelling.length > 0 && (
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  textTransform: 'uppercase',
                  marginBottom: hp('1%'),
                  marginTop: hp('0%'),
                },
              ]}
            >
              {getSectionTitle('image_slides', 'BEST SELLING')}
            </Text>
            <View style={{ position: 'relative' }}>
              <ImageBackground
                source={require('../../assets/images/profile/bestsellingbg.png')}
                style={styles.bestSellingCard}
                resizeMode="contain"
                imageStyle={{ alignSelf: 'center', alignContent: 'center' }}
              >
                {bestSellingIndex > 0 && (
                  <Image
                    source={getImageSource(
                      bestSelling[bestSellingIndex - 1].imageUrl ||
                        bestSelling[bestSellingIndex - 1].image,
                    )}
                    style={[styles.sideImage, styles.sideImageLeft]}
                    resizeMode="contain"
                  />
                )}

                {bestSellingIndex < bestSelling.length - 1 && (
                  <Image
                    source={getImageSource(
                      bestSelling[bestSellingIndex + 1].imageUrl ||
                        bestSelling[bestSellingIndex + 1].image,
                    )}
                    style={[styles.sideImage, styles.sideImageRight]}
                    resizeMode="contain"
                  />
                )}

                <TouchableOpacity
                  style={styles.centerImageContainer}
                  activeOpacity={0.8}
                  onPress={() => {
                    const item = bestSelling[bestSellingIndex];
                    navigation.navigate('KshopeProductDetails', {
                      productId: item.productId || item.id,
                      product: item,
                    });
                  }}
                >
                  <Image
                    source={getImageSource(
                      bestSelling[bestSellingIndex].imageUrl ||
                        bestSelling[bestSellingIndex].image,
                    )}
                    style={styles.centerImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <View style={styles.bestSellingTextOverlay}>
                  <Text style={styles.bestSellingTitleText} numberOfLines={2}>
                    {bestSelling[bestSellingIndex].brand ||
                      bestSelling[bestSellingIndex].prName ||
                      'Product'}
                  </Text>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.bestSellingMrpText}>
                      MRP ₹
                      {bestSelling[bestSellingIndex].unitPrice ||
                        bestSelling[bestSellingIndex].originalPrice ||
                        '0'}
                    </Text>
                    <Text style={styles.bestSellingPriceText}>
                      ₹
                      {bestSelling[bestSellingIndex].specialPrice ||
                        bestSelling[bestSellingIndex].price ||
                        '0'}
                    </Text>
                  </View>
                </View>
              </ImageBackground>

              <View style={styles.arrowRow}>
                {bestSellingIndex > 0 ? (
                  <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => setBestSellingIndex(prev => prev - 1)}
                  >
                    <Image
                      source={require('../../assets/images/profile/arrowleft.png')}
                      style={{ width: wp('10%'), height: hp('10%') }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ) : (
                  <View style={{ width: wp('10%') }} />
                )}
                <View style={{ flex: 1 }} />
                {bestSellingIndex < bestSelling.length - 1 ? (
                  <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => setBestSellingIndex(prev => prev + 1)}
                  >
                    <Image
                      source={require('../../assets/images/profile/arrowright.png')}
                      style={{ width: wp('10%'), height: hp('10%') }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ) : (
                  <View style={{ width: wp('10%') }} />
                )}
              </View>
            </View>
          </View>
        )}

        {activeSecondProducts.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { textTransform: 'uppercase' }]}>
              {parsedSecondBlock?.title ||
                parsedSecondBlock?.Title ||
                'Featured Products'}
            </Text>
            <FlatList
              data={activeSecondProducts}
              renderItem={({ item }) => (
                <ExploreItem
                  item={item}
                  onPress={() =>
                    navigation.navigate('KshopeProductDetails', {
                      productId: item.productId,
                      product: item,
                    })
                  }
                  toggleWishlist={toggleWishlist}
                  isInWishlist={id => isInWishlist(id)}
                />
              )}
              keyExtractor={(item, i) => `second_${item.productId || i}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: wp('4%') }}
            />
            <View style={{ marginTop: 16 }}>
              <ClickForMoreButton
                onPress={() => {
                  const id =
                    parsedSecondBlock?.catId ||
                    parsedSecondBlock?.CatId ||
                    parsedSecondBlock?.id ||
                    parsedSecondBlock?.Id ||
                    parsedSecondBlock?.categoryId ||
                    parsedSecondBlock?.CategoryId;
                  navigation.navigate('KshopeProductCategoryDetail', {
                    catId: id?.toString(),
                    title: parsedSecondBlock?.title || 'Featured Products',
                    products: activeSecondProducts,
                  });
                }}
                title={`Click for more ${
                  parsedSecondBlock?.title || 'Featured'
                }`}
              />
            </View>
          </View>
        )}

        {bottomBanner && bottomBanner.length > 0 && (
          <View style={styles.section}>
            <FlatList
              data={bottomBanner}
              renderItem={renderMidBanner}
              keyExtractor={(_, i) => `bottom_${i}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={wp('48%')}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: wp('4%') }}
            />
          </View>
        )}

        {bottomShowcaseItems2?.length > 0 && gShockMainBanner2 && (
          <View style={{ ...styles.section, marginTop: hp('2%') }}>
            <ImageBackground
              source={{
                uri: CONFIG.image_base_url + gShockMainBanner2.imageUrl,
              }}
              style={styles.gShockTopBanner}
              resizeMode="stretch"
            >
              <View
                style={{
                  paddingHorizontal: 16,
                  position: 'absolute',
                  bottom: 20,
                  left: 0,
                  right: 0,
                }}
              >
                <FlatList
                  data={bottomShowcaseItems2}
                  renderItem={renderGShockCard}
                  keyExtractor={(item, index) =>
                    item.bannerId?.toString() ||
                    item.id?.toString() ||
                    index.toString()
                  }
                  numColumns={2}
                  columnWrapperStyle={{
                    justifyContent: 'space-between',
                  }}
                  scrollEnabled={false}
                />
              </View>
            </ImageBackground>
          </View>
        )}

        {midBannerBottom && midBannerBottom.length > 0 && (
          <View
            style={[
              styles.section,
              { marginTop: hp('0%'), marginBottom: hp('0%') },
            ]}
          >
            <FlatList
              data={midBannerBottom}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handleBannerPress(item)}
                  style={{ marginRight: 15 }}
                >
                  <Image
                    source={getImageSource(
                      item.imageUrl || item.ImageUrl || item.image,
                    )}
                    style={{
                      width: wp('45%'),
                      height: hp('15%'),
                      borderRadius: 12,
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) =>
                item.bannerId?.toString() ||
                item.id?.toString() ||
                `midbot_${index}`
              }
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: wp('4%') }}
            />
          </View>
        )}

        <View
          style={{
            backgroundColor: colors.figmaTeal,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        />
        <Image
          source={require('../../assets/images/profile/kaprabottom.png')}
          style={{
            width: wp('100%'),
            height: hp('48%'),
          }}
          resizeMode="contain"
        />
      </Animated.ScrollView>
      <View style={styles.headerOverlay}>
        <HomeHeader
          title="Home"
          address={
            profile?.address || profile?.pincode || 'Set your delivery address'
          }
          avatar={
            profile?.profileImage
              ? getImageSource(profile.profileImage)
              : undefined
          }
          tabs={headerTabs}
          selectedTabId={headerTabId}
          items={headerItems}
          onSelectTab={setHeaderTabId}
          onItemPress={item => handleCategoryPress(item.raw)}
          onSearchPress={() => navigation.navigate('KshopeSearch')}
          onAvatarPress={() => navigation.navigate('KshopeProfile')}
          onNotificationsPress={() => navigation.navigate('KshopeProfile')}
          onWishlistPress={() => navigation.navigate('WishlistScreen')}
          onProfilePress={() => navigation.navigate('KshopeProfile')}
          scrollY={scrollY}
          onHeightChange={setHeaderHeight}
        />
      </View>
      <FloatingCartButton bottom={20} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.figmaTeal,
  },

  header: {},
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
  topSectionContainer: {
    width: width,
    backgroundColor: colors.white,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 10,
  },
  topSectionImage: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  headerSectionContainer: {
    width: width,
    backgroundColor: '#ffffff',
    top: -20,
  },
  featuredBannerContainer: {
    width: width,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    overflow: 'hidden',
  },
  featuredBannerImage: {
    width: width,
    height: hp('21%'),
  },
  offerBannerImage: {
    width: width,
    aspectRatio: 344 / 80,
    alignSelf: 'stretch',
    marginTop: hp('1.5%'),
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
  featuredBannerBlend: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: hp('5%'),
  },
  mockDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  mockDot: {
    width: 25,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  activeMockDot: {
    backgroundColor: '#000000',
  },
  bestDealTitle: {
    fontSize: 18,
    fontFamily: Fonts.gilroyBold,
    color: '#000000',
    textAlign: 'center',
    marginTop: 15,
    textTransform: 'uppercase',
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    width: width,
  },
  headerSearchBar: {
    flex: 1,
    width: undefined,
  },
  topBarIcon: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bcoinContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  bcoinBackground: {
    width: 54,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomBrandingSection: {
    alignItems: 'center',
    marginTop: hp('3%'),
    marginBottom: hp('1%'),
    paddingVertical: hp('2%'),
  },
  kapraLogoBottom: {
    width: wp('50%'),
    height: hp('8%'),
    resizeMode: 'contain',
    marginBottom: hp('1%'),
  },
  footerBranding: {
    alignItems: 'flex-start',
    paddingVertical: hp('2%'),
    marginBottom: 0,
  },
  tokenSvg: {
    marginRight: -5,
  },
  tokenText: {
    fontSize: 12,
    fontFamily: Fonts.gilroyBold,
    color: '#000000',
  },
  profileIconMainView: {
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
  },
  profileIcon: {
    width: 30,
    height: 30,
  },
  profileIconView: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crownImage: {
    width: 15,
    height: 15,
    position: 'absolute',
    top: -5,
    right: -2,
    zIndex: 2,
  },
  headerDotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  headerDot: {
    width: 32,
    height: 8,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 3,
    top: hp('1%'),
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: hp('0.5%'),
  },
  profileArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userName: {
    fontFamily: Fonts.gilroyMedium,
    fontSize: 17,
    color: '#222222',
    fontWeight: '400',
    marginLeft: wp('4%'),
  },
  topIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 20,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('4%'),
    height: 48,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 45,
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: wp('6%'),
    paddingHorizontal: wp('4%'),
    height: hp('5.5%'),
    marginTop: hp('0.5%'),
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: wp('2%'),
    fontSize: wp('3.5%'),
    color: '#999999',
  },
  bannerContainer: {
    marginTop: hp('0.5%'),
    backgroundColor: colors.themeDarkTeal,
  },
  bannerSlide: {
    width: width,
    height: hp('35%'),
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('1%'),
    marginBottom: hp('0.5%'),
  },
  dot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    backgroundColor: '#CCCCCC',
    marginHorizontal: wp('0.8%'),
  },
  activeDot: {
    backgroundColor: '#00BCD4',
    width: wp('2.5%'),
    height: wp('2.5%'),
  },
  section: {
    marginTop: hp('2%'),
  },
  sectionTitle: {
    fontSize: 16,
    color: colors.black,
    fontFamily: Fonts.gilroySemiBold,
    textAlign: 'left',
    textTransform: 'uppercase',
    paddingHorizontal: wp('4%'),
    marginBottom: hp('1.5%'),
    letterSpacing: 0.8,
  },
  categoriesGrid: {
    paddingHorizontal: wp('4%'),
  },
  categoryItem: {
    width: (width - wp('6%')) / 4,
    height: wp('28%'),
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  categoryCircle: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFE0CE',
  },
  categoryImage: {
    width: wp('13.5%'),
    height: wp('13.5%'),
  },
  categoryLabel: {
    fontSize: 12,
    color: colors.black1,
    fontFamily: Fonts.gilroySemiBold,
    textAlign: 'center',
    marginTop: hp('0.5%'),
    width: wp('18%'),
  },
  accessorizeCard: {
    backgroundColor: colors.white,
    width: wp('22%'),
    marginRight: wp('2%'),
    alignItems: 'center',
    paddingTop: hp('1%'),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  accessorizeCardActive: {
    backgroundColor: colors.themeTeal,
    borderColor: colors.themeTeal,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: hp('1%'),
  },
  accessorizeImageContainer: {
    width: wp('16%'),
    height: wp('16%'),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  accessorizeImage: {
    width: '100%',
    height: '100%',
  },
  accessorizeLabel: {
    fontSize: 12,
    color: '#999999',
    fontFamily: Fonts.gilroySemiBold,
    textAlign: 'center',
    paddingBottom: hp('1%'),
  },
  dummyAccessorizeContainer: {
    marginTop: -hp('0%'),
  },
  accessorizeBannerCard: {
    width: wp('39%'),
    height: hp('27%'),
    marginRight: wp('4%'),
    borderRadius: 20,
    overflow: 'hidden',
  },
  dummyAccessorizeImage: {
    width: '100%',
    height: '100%',
  },
  bannerTextOverlay: {
    position: 'absolute',
    top: hp('3%'),
    left: wp('5%'),
    right: wp('5%'),
  },
  bannerTitleText: {
    fontSize: wp('7%'),
    fontFamily: Fonts.gilroyBold,
    color: '#000',
    fontWeight: '800',
    lineHeight: wp('8%'),
  },
  midBannerCard: {
    width: wp('90%'),
    height: hp('20%'),
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: wp('3%'),
  },
  midBannerImage: {
    width: '100%',
    height: '100%',
  },
  brandCard: {
    width: 86,
    height: 86,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
    borderWidth: 1,
    borderColor: '#FFE8DC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  brandImage: {
    width: '80%',
    height: '70%',
  },
  gShockSectionWrapper: {
    width: '100%',
    overflow: 'hidden',
  },
  gShockTopBanner: {
    width: width,
    height: hp('40%'),
    alignSelf: 'center',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  gShockCard: {
    width: (width - 32 - 16) / 2,
    height: 90,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  gShockCardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('1.5%'),
  },
  indicatorPill: {
    width: wp('6%'),
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: wp('1%'),
  },
  indicatorPillActive: {
    backgroundColor: '#F25000',
    width: wp('10%'),
  },
  bestSellingCard: {
    marginHorizontal: wp('4%'),
    width: width * 0.9,
    height: hp('35%'),
    overflow: 'hidden',
    position: 'relative',
    padding: wp('4%'),
  },
  sideImage: {
    position: 'absolute',
    width: wp('23%'),
    height: hp('18%'),
    top: hp('8%'),
    opacity: 0.45,
  },
  sideImageLeft: {
    left: -wp('1%'),
  },
  sideImageRight: {
    right: -wp('1%'),
  },
  centerImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  centerImage: {
    width: '100%',
    height: '100%',
    bottom: hp('2%'),
    resizeMode: 'contain',
  },
  arrowRow: {
    position: 'absolute',
    left: wp('1%'),
    right: wp('1%'),
    top: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  arrowButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  bestSellingTextOverlay: {
    position: 'absolute',
    bottom: wp('9%'),
    left: wp('5%'),
    right: wp('5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 2,
  },
  bestSellingTitleText: {
    fontSize: 18,
    fontFamily: Fonts.gilroyBold,
    color: colors.black,
    maxWidth: '48%',
    bottom: hp('1%'),
  },
  bestSellingPriceText: {
    fontSize: 20,
    fontFamily: Fonts.gilroyBold,
    color: colors.black,
  },
  bestSellingMrpText: {
    fontSize: 12,
    color: '#999999',
    textDecorationLine: 'line-through',
    fontFamily: Fonts.gilroyMedium,
    marginBottom: 2,
  },
  recSectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.poppins.semiBold,
    color: '#3B1010',
    paddingHorizontal: rs(17),
    marginBottom: rs(10),
  },
  recSectionAccent: {
    fontSize: 24,
    fontFamily: Fonts.italic,
    color: '#6A0000',
  },
  recPanel: {
    marginHorizontal: REC_PANEL_MARGIN,
    borderRadius: rs(10),
    backgroundColor: '#FFDFB8',
    paddingTop: rs(15),
    paddingBottom: rs(12),
  },
  recSeeAll: {
    position: 'absolute',
    top: rs(15),
    right: rs(10),
    width: rs(41),
    height: rs(28),
    borderRadius: rs(7),
    backgroundColor: '#592626',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  recGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    columnGap: REC_CARD_GAP,
    paddingHorizontal: REC_PANEL_PAD,
    marginTop: rs(38),
    marginBottom: -rs(13),
  },
  recCard: {
    width: REC_CARD_W,
    height: REC_CARD_H,
    borderRadius: rs(7),
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#C9C9C9',
    overflow: 'hidden',
    marginBottom: rs(22),
  },
  recCardTop: {
    height: REC_CARD_TOP_H,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C9C9C9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recBadge: {
    position: 'absolute',
    top: rs(6),
    left: rs(6),
    minWidth: rs(38),
    height: rs(13),
    paddingHorizontal: rs(4),
    borderRadius: rs(5),
    backgroundColor: '#F25000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  recBadgeText: {
    fontSize: 8,
    fontFamily: Fonts.poppins.regular,
    color: colors.white,
  },
  recHeart: {
    position: 'absolute',
    top: rs(7),
    right: rs(8),
    zIndex: 2,
  },
  recCardImage: {
    width: REC_CARD_IMG,
    height: REC_CARD_IMG,
  },
  recCardBody: {
    paddingHorizontal: rs(6),
    paddingTop: rs(5),
  },
  recCardName: {
    fontSize: 10,
    lineHeight: 13,
    fontFamily: Fonts.poppins.regular,
    color: colors.black,
  },
  recCardPrice: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: Fonts.poppins.semiBold,
    color: colors.black,
    marginTop: rs(2),
  },
  recCardMrp: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: Fonts.poppins.light,
    color: '#656565',
    textDecorationLine: 'line-through',
  },
  recPanelRule: {
    height: rs(2),
    backgroundColor: '#E4A85D',
  },
  recFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: rs(14),
  },
  recFooterArt: {
    width: rs(210),
    height: rs(77),
  },
  footerLogoContainer: {
    width: '100%',
    alignItems: 'flex-start',
    paddingVertical: 30,
    backgroundColor: colors.figmaTeal,
  },
  footerLogo: {
    width: wp('40%'),
    height: height / 8,
    alignSelf: 'flex-start',
  },
});

export default HomeScreen;
