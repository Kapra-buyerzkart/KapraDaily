import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getCategoriesApi } from '../../../../api/services/categoryService';
import { searchProductsApi } from '../../../../api/services/productService';
import { LoaderContext } from '../../../../context/loaderContext';
import { getKshopeAreaId } from '../../../../globals/storage';
import { useDebounce } from '../../../../hooks/useDebounce';
import {
  DEFAULT_CATEGORY_FILTERS,
  isDefaultCategoryFilters,
} from '../../constants';
import { KAPRA_CATEGORY_CIRCLES } from '../../../Home/redesign/content';
import {
  ALL_TILE_ID,
  bannerSource,
  findCategory,
  toCategoryTiles,
  toProductCards,
  toSubCategoryTiles,
} from './selectors';

const ROOT_PARENT_ID = '1';
const PAGE_SIZE = 100;

const FALLBACK_CATEGORIES = KAPRA_CATEGORY_CIRCLES.map(tile => ({
  catId: tile.id,
  catName: tile.label,
  displayTitle: tile.label,
  imageUrl: tile.image,
  image: tile.image,
}));

const extractItems = (response: any): any[] => {
  if (!response) return [];
  const rawData = response?.data ?? response?.Data ?? response;
  if (Array.isArray(rawData)) return rawData;
  if (Array.isArray(rawData?.items)) return rawData.items;
  if (Array.isArray(rawData?.Items)) return rawData.Items;
  return [];
};

export type Filters = {
  sortBy: string;
  priceMin: number;
  priceMax: number;
};

export const useCategoryData = (initialCatId?: string | number) => {
  const { showLoader } = useContext(LoaderContext) || { showLoader: () => {} };

  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialCatId?.toString() ?? null,
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    string | null
  >(null);

  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [pincodeAreaId, setPincodeAreaId] = useState<number | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_CATEGORY_FILTERS);

  const debouncedSearchText = useDebounce(searchText, 500);
  const areaIdRef = useRef<number | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      showLoader(true);
      const response = await getCategoriesApi(ROOT_PARENT_ID);
      let items = extractItems(response);

      // If parentCatId '1' yielded no items, attempt '0' for backends using 0 as root
      if (items.length === 0) {
        try {
          const altResponse = await getCategoriesApi('0');
          const altItems = extractItems(altResponse);
          if (altItems.length > 0) {
            items = altItems;
          }
        } catch {
          // ignore fallback attempt error
        }
      }

      if (items && items.length > 0) {
        setCategories(items);
        const target =
          initialCatId?.toString() ?? items[0]?.catId?.toString() ?? null;
        if (target) {
          setSelectedCategoryId(target);
        }
      } else {
        setCategories(FALLBACK_CATEGORIES);
        setSelectedCategoryId(
          initialCatId?.toString() ??
            FALLBACK_CATEGORIES[0]?.catId?.toString() ??
            null,
        );
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(FALLBACK_CATEGORIES);
      setSelectedCategoryId(
        initialCatId?.toString() ??
          FALLBACK_CATEGORIES[0]?.catId?.toString() ??
          null,
      );
    } finally {
      setLoading(false);
      showLoader(false);
    }
  }, [initialCatId, showLoader]);

  const fetchSubCategories = useCallback(
    async (parentId: string) => {
      if (!parentId || parentId === ALL_TILE_ID) {
        setSubCategories([]);
        setSelectedSubCategoryId(null);
        return;
      }
      try {
        showLoader(true);
        const response = await getCategoriesApi(parentId);
        const items = extractItems(response);
        setSubCategories(items);
        setSelectedSubCategoryId(null);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        setSubCategories([]);
      } finally {
        showLoader(false);
      }
    },
    [showLoader],
  );

  const fetchProducts = useCallback(
    async (categoryId: string | null, page = 1) => {
      const showsLoader = page === 1;
      try {
        if (showsLoader) {
          showLoader(true);
        } else {
          setIsLoadingMore(true);
        }

        const parsedCatId = categoryId ? parseInt(categoryId, 10) : NaN;
        const isNumericId = !isNaN(parsedCatId);
        const targetCatId =
          isNumericId && categoryId !== ALL_TILE_ID ? parsedCatId : null;

        // If categoryId is non-numeric (e.g. from static jewelry fallback),
        // use category title as query term if no search text was typed
        const queryTerm =
          debouncedSearchText.trim() ||
          (!isNumericId && categoryId && categoryId !== ALL_TILE_ID
            ? categoryId
            : '');

        const response = await searchProductsApi({
          pincodeAreaId: areaIdRef.current,
          prName: queryTerm,
          catId: targetCatId,
          priceMin: filters.priceMin,
          priceMax: filters.priceMax,
          filterValues: null,
          sortBy: filters.sortBy,
          pageNumber: page,
          pageSize: PAGE_SIZE,
        });

        const items = extractItems(response);
        if (items && items.length > 0) {
          setProducts(prev => (page === 1 ? items : [...prev, ...items]));
          setPageNumber(page);
          setHasMore(items.length === PAGE_SIZE);
        } else {
          if (page === 1) {
            setProducts([]);
          }
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        if (page === 1) {
          setProducts([]);
        }
      } finally {
        if (showsLoader) {
          showLoader(false);
        }
        setIsLoadingMore(false);
      }
    },
    [debouncedSearchText, filters, showLoader],
  );

  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      try {
        const storedAreaId = await getKshopeAreaId();
        if (!cancelled) {
          areaIdRef.current = storedAreaId;
          setPincodeAreaId(storedAreaId);
        }
      } catch (error) {
        console.error('Error reading kshope area id:', error);
      }
      if (!cancelled) {
        fetchCategories();
      }
    };
    boot();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedCategoryId && selectedCategoryId !== ALL_TILE_ID) {
      fetchSubCategories(selectedCategoryId);
    } else {
      setSubCategories([]);
      setSelectedSubCategoryId(null);
    }
  }, [selectedCategoryId, fetchSubCategories]);

  useEffect(() => {
    const target = selectedSubCategoryId || selectedCategoryId;
    if (target) {
      fetchProducts(target);
    }
  }, [
    selectedSubCategoryId,
    selectedCategoryId,
    debouncedSearchText,
    filters,
    pincodeAreaId,
    fetchProducts,
  ]);

  const loadMore = useCallback(() => {
    const target = selectedSubCategoryId || selectedCategoryId;
    if (!isLoadingMore && hasMore && target) {
      fetchProducts(target, pageNumber + 1);
    }
  }, [
    fetchProducts,
    hasMore,
    isLoadingMore,
    pageNumber,
    selectedCategoryId,
    selectedSubCategoryId,
  ]);

  const selectSubCategory = useCallback((id: string) => {
    setSelectedSubCategoryId(id === ALL_TILE_ID ? null : id);
  }, []);

  const selectCategory = useCallback((id: string) => {
    setSearchText('');
    setSelectedCategoryId(id);
  }, []);

  const clearSearch = useCallback(() => setSearchText(''), []);

  const activeCategory = useMemo(
    () => findCategory(categories, selectedCategoryId),
    [categories, selectedCategoryId],
  );

  return {
    loading,
    isLoadingMore,
    categoryTiles: useMemo(() => toCategoryTiles(categories, true), [categories]),
    subCategoryTiles: useMemo(
      () => toSubCategoryTiles(subCategories, activeCategory),
      [subCategories, activeCategory],
    ),
    productCards: useMemo(() => toProductCards(products), [products]),
    activeCategory,
    categoryName: activeCategory?.catName ?? 'Categories',
    banner: bannerSource(activeCategory),
    selectedCategoryId,
    setSelectedCategoryId: selectCategory,
    selectedSubCategoryId: selectedSubCategoryId ?? ALL_TILE_ID,
    selectSubCategory,
    searchText,
    setSearchText,
    clearSearch,
    activeSearchTerm: debouncedSearchText.trim(),
    resultCount: products.length,
    filters,
    setFilters,
    filtersActive: !isDefaultCategoryFilters(filters),
    loadMore,
  };
};
