import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../../../../context/UserContext';
import { useCart } from '../../../../context/CartContext';
import { getHomepageData } from '../../../../api/services/homeService';
import { getKshopeAreaId } from '../../../../globals/storage';
import type { HeaderItem } from '../../../../components/HomeHeader';
import {
  BEST_SELLING,
  BRANDS,
  CATEGORY_CARDS,
  CATEGORY_CHIPS,
  CATEGORY_TABS,
  FEATURED_PRODUCTS,
  HEADER_CIRCLES,
  HEADER_CONTENT,
  RECENTLY_VIEWED,
  RECOMMENDED,
} from '../content';
import type { Tile } from '../content';
import {
  bannersFor,
  getProducts,
  resolveCatId,
  resolveCatName,
  sectionTitle,
  unwrapBlock,
} from './blocks';
import {
  mapBrandTile,
  mapCategoryTile,
  mapExploreTile,
  mapProductTile,
  bannerProductId,
  mapGoatDealCard,
  mapRecCard,
  mapRecentlyViewed,
  mapTabChip,
  orFallback,
  resolveImageSource,
} from './mappers';

const HEADER_PLACEHOLDERS = [
  require('../../../../assets/images/home/items/gshock.png'),
  require('../../../../assets/images/home/items/shoes.png'),
  require('../../../../assets/images/home/items/watch.png'),
  require('../../../../assets/images/home/items/shoes_02.png'),
];

const FALLBACK_HEADER_ITEMS: HeaderItem[] = HEADER_CIRCLES.map(tile => ({
  id: tile.id,
  name: tile.label,
  image: tile.image,
  raw: tile.raw,
}));

export const useHomeData = () => {
  const { profile } = useUser();
  const { fetchAddresses, selectedAddress: activeAddress } = useCart();

  const [homeData, setHomeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(
    async (isRefresh = false) => {
      try {
        if (!isRefresh) {
          setLoading(true);
        }
        const storedAreaId = await getKshopeAreaId();
        const areaId = storedAreaId ?? profile?.pincode ?? null;
        const data = await getHomepageData(areaId, 100);
        setHomeData(data?.data || data);
      } catch (e) {
        console.error('Error fetching home data for K-shope', e);
      } finally {
        setLoading(false);
      }
    },
    [profile?.pincode],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [fetchAddresses]),
  );

  const selectedAddress = useMemo(() => {
    if (__DEV__) {
      console.log('[kshope][home] activeAddress =', activeAddress?.id, activeAddress?.address);
    }
    if (!activeAddress) return null;
    const label = [activeAddress.type, activeAddress.address].filter(Boolean).join(' · ');
    return label || null;
  }, [activeAddress]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData(true);
    setRefreshing(false);
  }, [fetchData]);

  const sections = useMemo(() => {
    const categories =
      homeData?.featuredCategories || homeData?.FeaturedCategories || [];

    const firstBlock = unwrapBlock(
      homeData?.firstProductBlock || homeData?.firstproductblock,
    );
    const firstProducts = getProducts(firstBlock);
    const secondProducts = getProducts(
      unwrapBlock(homeData?.secondProductBlock || homeData?.secondproductblock),
    );
    const thirdBlock = unwrapBlock(
      homeData?.thirdProductBlock || homeData?.thirdproductblock,
    );

    const rawBrands =
      homeData?.brands?.length > 0
        ? homeData.brands
        : homeData?.topBrands?.length > 0
        ? homeData.topBrands
        : bannersFor(homeData, 'app_top_brands');

    let tabShowcase = unwrapBlock(
      homeData?.categoryTabShowcase ||
        homeData?.CategoryTabShowcase ||
        homeData?.categorytabshowcase,
    );
    if (tabShowcase && !Array.isArray(tabShowcase)) {
      tabShowcase = unwrapBlock(
        tabShowcase.categoryTabShowcase ||
          tabShowcase.CategoryTabShowcase ||
          tabShowcase.data ||
          tabShowcase.items ||
          tabShowcase.Items ||
          tabShowcase,
      );
    }
    const tabs = Array.isArray(tabShowcase) ? tabShowcase : [];
    if (__DEV__ && tabs.length > 0) {
      console.log('[kshope] TAB OBJECT:', JSON.stringify(tabs[0], null, 2).slice(0, 1500));
      console.log('[kshope] TAB KEYS:', Object.keys(tabs[0] || {}));
    }

    const categoryById = new Map<string, any>();
    categories.forEach((cat: any) => {
      const id = resolveCatId(cat);
      if (id !== undefined && id !== null && id !== '') {
        categoryById.set(String(id), cat);
      }
    });
    const svgCategories = (() => {
      const svgOf = (item: any) =>
        item?.svgurl || item?.svgUrl || item?.SvgUrl || item?.SvgURL;
      const hasSvg = (list: any) =>
        Array.isArray(list) && list.some((item: any) => svgOf(item));
      const named =
        homeData?.categorySvgs ||
        homeData?.CategorySvgs ||
        homeData?.categorySvg ||
        homeData?.svgCategories ||
        homeData?.categoryIcons;
      if (hasSvg(named)) return named as any[];

      const seen = new Set<any>();
      const search = (node: any, depth: number): any[] | null => {
        if (!node || typeof node !== 'object' || depth > 4 || seen.has(node)) {
          return null;
        }
        seen.add(node);
        if (hasSvg(node)) return node as any[];
        for (const value of Object.values(node)) {
          const found = search(value, depth + 1);
          if (found) return found;
        }
        return null;
      };
      return search(homeData, 0) ?? [];
    })();
    const exploreTiles = svgCategories
      .filter((cat: any) => cat?.svgurl || cat?.svgUrl || cat?.SvgUrl || cat?.SvgURL)
      .slice(0, 10)
      .map((cat: any, index: number) => {
        const tile = mapExploreTile(cat, index);
        const linked = categoryById.get(String(resolveCatId(cat) ?? ''));
        return linked ? { ...tile, raw: { ...linked, ...cat } } : tile;
      });

    const goatDeals = bannersFor(homeData, 'app_home_cat_top_sidebyside_four');
    const thirdProducts = getProducts(thirdBlock);

    const productIndex = new Map<string, any>();
    [...thirdProducts, ...secondProducts, ...firstProducts].forEach(product => {
      const id = product?.productId ?? product?.ProductId ?? product?.id;
      if (id !== undefined && !productIndex.has(String(id))) {
        productIndex.set(String(id), product);
      }
    });

    const recommendedCards = orFallback(
      goatDeals.length > 0
        ? goatDeals
            .slice(0, 6)
            .map((banner: any, index: number) =>
              mapGoatDealCard(
                banner,
                index,
                productIndex.get(String(bannerProductId(banner))),
              ),
            )
            .filter(card => card.image)
        : thirdProducts.slice(0, 6).map(mapRecCard).filter(card => card.image),
      RECOMMENDED,
    );

    return {
      header: {
        title: sectionTitle(homeData, 'home', HEADER_CONTENT.title),
        address: selectedAddress,
        searchPlaceholder: HEADER_CONTENT.searchPlaceholder,
      },
      headerTabs: [
        { id: 'all', name: 'All' },
        ...tabs.map((tab: any, i: number) => ({
          id: String(
            tab.tabId ?? tab.TabId ?? resolveCatId(tab) ?? i,
          ),
          name:
            tab.tabName || tab.TabName || resolveCatName(tab, '') || 'Tab',
          image: resolveImageSource(
            tab.toptabimgurl ??
              tab.topTabImgUrl ??
              tab.TopTabImgUrl ??
              tab.TopTabImgURL,
          ),
        })),
      ],
      headerItemsFor: (tabId: string): HeaderItem[] => {
        const source =
          tabId === 'all'
            ? categories.slice(0, 8)
            : (() => {
                const tab = tabs.find((t: any, i: number) => {
                  const id = t.tabId ?? t.TabId ?? resolveCatId(t) ?? i;
                  return String(id) === String(tabId);
                });
                return tab?.items || tab?.Items || [];
              })();

        const mapped: HeaderItem[] = source.map((item: any, index: number) => ({
          id: String(resolveCatId(item) ?? index),
          name: resolveCatName(item, ''),
          image:
            mapCategoryTile(item, index).image ??
            HEADER_PLACEHOLDERS[index % HEADER_PLACEHOLDERS.length],
          raw: item,
        }));

        return orFallback(mapped, FALLBACK_HEADER_ITEMS);
      },
      searchTabs: orFallback(
        tabs.map((t: any) => resolveCatName(t, '')).filter(Boolean),
        CATEGORY_TABS,
      ),
      featured: orFallback(
        firstProducts.slice(0, 3).map(mapProductTile),
        FEATURED_PRODUCTS,
      ),
      categoryChips: orFallback(tabs.map(mapTabChip), CATEGORY_CHIPS),
      categoryCardsFor: (chipId: string): Tile[] => {
        const tab = tabs.find(
          (t: any, i: number) =>
            String(mapTabChip(t, i).id) === String(chipId),
        );
        const items = tab?.items || tab?.Items || [];
        return orFallback(items.map(mapCategoryTile), CATEGORY_CARDS);
      },
      bestSelling: orFallback(
        (homeData?.showcaseSlider || []).slice(0, 6).map(mapCategoryTile),
        BEST_SELLING,
      ),
      brands: orFallback(rawBrands.map(mapBrandTile), BRANDS),
      recommended: recommendedCards,
      recentlyViewed: orFallback(
        secondProducts.slice(0, 5).map(mapRecentlyViewed),
        RECENTLY_VIEWED,
      ),
      exploreRowOne: exploreTiles.slice(0, 5),
      exploreRowTwo: exploreTiles.slice(5, 10),
      banners: {
        top: bannersFor(homeData, 'app_home_top_banner'),
        mid: bannersFor(homeData, 'app_home_mid_banner'),
        midBottom: bannersFor(homeData, 'app_home_mid_banner_bottom'),
        bottom: bannersFor(homeData, 'app_home_bottom'),
      },
      topDeals: {
        title: 'Top deals',
        items: firstProducts.slice(3, 5).map(mapProductTile),
        block: firstBlock,
      },
      recommendedTitleBlock: thirdBlock,
      recommendedFooterImage: resolveImageSource(
        bannersFor(homeData, 'app_flahs_sale')[0]?.imageUrl,
      ),
    };
  }, [homeData, profile, selectedAddress]);

  return { homeData, loading, refreshing, onRefresh, sections };
};

export const bannerImage = (banner: any) =>
  resolveImageSource(banner?.imageUrl || banner?.ImageUrl || banner?.image);
