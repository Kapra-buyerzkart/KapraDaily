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
      const items = response?.success ? response?.data?.items : null;
      if (items) {
        setCategories(items);
        const target =
          initialCatId?.toString() ?? items[0]?.catId?.toString() ?? null;
        if (target) {
          setSelectedCategoryId(target);
        }
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
      showLoader(false);
    }
  }, [initialCatId, showLoader]);

  const fetchSubCategories = useCallback(
    async (parentId: string) => {
      try {
        showLoader(true);
        const response = await getCategoriesApi(parentId);
        const items = response?.success ? response?.data?.items : null;
        setSubCategories(items || []);
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
    async (categoryId: string, page = 1) => {
      const showsLoader = page === 1;
      try {
        if (showsLoader) {
          showLoader(true);
        } else {
          setIsLoadingMore(true);
        }

        const response = await searchProductsApi({
          pincodeAreaId: areaIdRef.current,
          prName: debouncedSearchText.trim(),
          catId: parseInt(categoryId, 10),
          priceMin: filters.priceMin,
          priceMax: filters.priceMax,
          filterValues: null,
          sortBy: filters.sortBy,
          pageNumber: page,
          pageSize: PAGE_SIZE,
        });

        const items = response?.success ? response?.data?.items : null;
        if (items) {
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
    if (selectedCategoryId) {
      fetchSubCategories(selectedCategoryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId]);

  useEffect(() => {
    const target = selectedSubCategoryId || selectedCategoryId;
    if (target) {
      fetchProducts(target);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedSubCategoryId,
    selectedCategoryId,
    debouncedSearchText,
    filters,
    pincodeAreaId,
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
    categoryTiles: useMemo(() => toCategoryTiles(categories), [categories]),
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
