import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import { useWishlist } from '../../context/WishlistContext';
import { getHomepageData } from '../../api/services/homeService';
import { getPincodeAreaId } from '../../globals/storage';
import CONFIG from '../../globals/config';
import { DEALS48_ROUTES } from '../../navigation/routes';
import { BANNER_INTERVAL } from './motion';

const FALLBACK_IMAGE = require('../../assets/images/logo.png');

const byPlacement = (banners: any[], key: string) =>
  banners?.filter(
    (b: any) => b.placementKey === key || b.PlacementKey === key,
  ) || [];

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
      } catch {
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
    else if (current.data && !current.items && !current.Items)
      current = current.data;
    if (
      typeof current === 'string' &&
      (current.trim().startsWith('{') || current.trim().startsWith('['))
    ) {
      try {
        current = JSON.parse(current);
      } catch {}
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

export const getImageSource = (imgPath: any) => {
  if (!imgPath) return FALLBACK_IMAGE;
  if (typeof imgPath === 'object' && imgPath.uri) return imgPath;
  if (typeof imgPath === 'string') {
    const trimmedPath = imgPath.trim();
    if (trimmedPath.startsWith('http')) return { uri: trimmedPath };
    const base = CONFIG.image_base_url.replace(/\/$/, '');
    const path = trimmedPath.startsWith('/') ? trimmedPath : `/${trimmedPath}`;
    return { uri: `${base}${path}` };
  }
  return imgPath;
};

export const tabIdOf = (item: any) =>
  item?.tabId ?? item?.TabId ?? item?.catId ?? item?.CatId ?? item?.id ?? item?.Id;

export const useKshopeScreen = () => {
  const navigation = useNavigation<any>();
  const { profile } = useUser();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [refreshing, setRefreshing] = useState(false);
  const [homeData, setHomeData] = useState<any>(null);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [midBannerIndex, setMidBannerIndex] = useState(0);
  const [bestSellingIndex, setBestSellingIndex] = useState(0);
  const [selectedAccessorize, setSelectedAccessorize] = useState<string | null>(
    null,
  );
  const bannerRef = useRef<FlatList>(null);

  const fetchData = useCallback(async () => {
    try {
      const storedPincodeAreaId = await getPincodeAreaId();
      const areaId = storedPincodeAreaId
        ? parseInt(storedPincodeAreaId, 10)
        : profile?.pincode || null;

      const data = await getHomepageData(areaId, 100);
      setHomeData(data?.data || data);
    } catch (e) {
      console.error('Error fetching home data for K-shope', e);
    }
  }, [profile?.pincode]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const banners = homeData?.banners;

  const topBanner = useMemo(
    () => byPlacement(banners, 'app_home_top_banner'),
    [banners],
  );
  const midBanner = useMemo(
    () => byPlacement(banners, 'app_home_mid_banner'),
    [banners],
  );
  const bottomBanner = useMemo(
    () => byPlacement(banners, 'app_home_bottom'),
    [banners],
  );
  const goatDeals = useMemo(
    () => byPlacement(banners, 'app_home_cat_top_sidebyside_four'),
    [banners],
  );
  const showcaseItems = useMemo(
    () => byPlacement(banners, 'app_home_bottom_showcase_product_image'),
    [banners],
  );

  const showcaseBanner = banners?.find(
    (b: any) =>
      b.placementKey === 'app_home_bottom_showcase_banner_image' ||
      b.PlacementKey === 'app_home_bottom_showcase_banner_image',
  );

  const topBrands = useMemo(() => {
    if (homeData?.brands?.length) return homeData.brands;
    if (homeData?.topBrands?.length) return homeData.topBrands;
    return byPlacement(banners, 'app_top_brands');
  }, [homeData, banners]);

  const bestSelling = homeData?.showcaseSlider || [];

  const categories =
    homeData?.featuredCategories || homeData?.FeaturedCategories || [];
  const displayCategories = categories.slice(0, 8);

  const firstBlock = useMemo(
    () => unwrapBlock(homeData?.firstProductBlock || homeData?.firstproductblock),
    [homeData],
  );
  const secondBlock = useMemo(
    () =>
      unwrapBlock(homeData?.secondProductBlock || homeData?.secondproductblock),
    [homeData],
  );

  const firstProducts = useMemo(
    () => getItems(firstBlock).filter((i: any) => i && (i.productId || i.id)),
    [firstBlock],
  );
  const secondProducts = useMemo(
    () => getItems(secondBlock).filter((i: any) => i && (i.productId || i.id)),
    [secondBlock],
  );

  const accessorizeCategories = useMemo(() => {
    let raw =
      homeData?.categoryTabShowcase ||
      homeData?.CategoryTabShowcase ||
      homeData?.categorytabshowcase;

    if (!raw && homeData?.data) {
      raw =
        homeData.data.categoryTabShowcase ||
        homeData.data.CategoryTabShowcase ||
        homeData.data.categorytabshowcase;
    }

    let parsed = unwrapBlock(raw);

    if (parsed && !Array.isArray(parsed)) {
      parsed =
        parsed.categoryTabShowcase ||
        parsed.CategoryTabShowcase ||
        parsed.categorytabshowcase ||
        parsed.data ||
        parsed.items ||
        parsed.Items ||
        parsed;
      parsed = unwrapBlock(parsed);
    }

    return Array.isArray(parsed) ? parsed : [];
  }, [homeData]);

  useEffect(() => {
    if (accessorizeCategories.length === 0) return;
    const exists = accessorizeCategories.some(
      (t: any) => String(tabIdOf(t)) === String(selectedAccessorize),
    );
    if (!exists || !selectedAccessorize) {
      setSelectedAccessorize(tabIdOf(accessorizeCategories[0]));
    }
  }, [accessorizeCategories, selectedAccessorize]);

  const accessorizeItems = useMemo(() => {
    const activeTab = accessorizeCategories.find(
      (t: any) => String(tabIdOf(t)) === String(selectedAccessorize),
    );
    return activeTab?.items || activeTab?.Items || [];
  }, [accessorizeCategories, selectedAccessorize]);

  useEffect(() => {
    if (topBanner.length <= 1) return;
    const timer = setInterval(() => {
      setBannerIndex(prev => {
        const next = (prev + 1) % topBanner.length;
        bannerRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, BANNER_INTERVAL);
    return () => clearInterval(timer);
  }, [topBanner.length]);

  const openBanner = useCallback(
    (banner: any) => {
      if (!banner) return;
      const linkType = (banner.linkType || banner.LinkType || '').toLowerCase();
      const linkValue = banner.linkValue || banner.LinkValue;
      if (linkType === 'product') {
        navigation.navigate(DEALS48_ROUTES.PRODUCT_DETAILS, {
          productId: linkValue,
        });
      } else if (linkType === 'category') {
        navigation.navigate(DEALS48_ROUTES.SEARCH, {
          catId: linkValue,
          catName: 'Category',
        });
      }
    },
    [navigation],
  );

  const openCategory = useCallback(
    (cat: any) => {
      navigation.navigate(DEALS48_ROUTES.SEARCH, {
        catId: cat.catId || cat.id,
        catName: cat.catName || cat.name,
      });
    },
    [navigation],
  );

  const openBrand = useCallback(
    (item: any) => {
      if (item.attrValueId !== undefined && item.attrValueId !== null) {
        navigation.navigate(DEALS48_ROUTES.SEARCH, {
          attrValueId: item.attrValueId,
          catName: item.brandName || 'Brand',
        });
        return;
      }
      openBanner(item);
    },
    [navigation, openBanner],
  );

  const openProduct = useCallback(
    (item: any) => {
      navigation.navigate(DEALS48_ROUTES.PRODUCT_DETAILS, {
        productId: item.productId,
        product: item,
      });
    },
    [navigation],
  );

  const openCollection = useCallback(
    (params: any) => {
      navigation.navigate(DEALS48_ROUTES.PRODUCT_CATEGORY, params);
    },
    [navigation],
  );

  const blockCatId = (block: any) =>
    block?.catId ||
    block?.CatId ||
    block?.id ||
    block?.Id ||
    block?.categoryId ||
    block?.CategoryId;

  return {
    navigation,
    profile,
    refreshing,
    onRefresh,
    isLoading: homeData === null,
    toggleWishlist,
    isInWishlist,
    bannerRef,
    bannerIndex,
    setBannerIndex,
    midBannerIndex,
    setMidBannerIndex,
    bestSellingIndex,
    setBestSellingIndex,
    selectedAccessorize,
    setSelectedAccessorize,
    topBanner,
    midBanner,
    bottomBanner,
    goatDeals,
    showcaseBanner,
    showcaseItems,
    topBrands,
    bestSelling,
    displayCategories,
    firstBlock,
    secondBlock,
    firstProducts,
    secondProducts,
    accessorizeCategories,
    accessorizeItems,
    openBanner,
    openCategory,
    openBrand,
    openProduct,
    openCollection,
    blockCatId,
  };
};
