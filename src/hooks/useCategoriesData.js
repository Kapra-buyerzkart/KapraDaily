import { useState, useEffect, useContext, useRef } from 'react';
import secureStore from '../utils/secureStore';
import { getCategoriesApi } from '../api/categoryService';
import {
  searchProductsApi,
  getProductSuggestionsApi,
} from '../api/productService';
import { AppContext } from '../context/appContext';
import { shuffle } from '../utils/shuffle';

const PAGE_SIZE = 20;

const useCategoriesData = (catId, debouncedSearchText, filters) => {
  const { profile, setStoreUnavailable } = useContext(AppContext);

  const [selectedId, setSelectedId] = useState(catId?.toString() || '1');
  const [selectedSubCatId, setSelectedSubCatId] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  const [subCategoriesList, setSubCategoriesList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingSubCategories, setIsFetchingSubCategories] = useState(false);
  const [isFetchingProducts, setIsFetchingProducts] = useState(true);
  const [hasFetchedProducts, setHasFetchedProducts] = useState(false);
  const [pincodeAreaId, setPincodeAreaId] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [locationInitialized, setLocationInitialized] = useState(false);
  const [isGlobalFallback, setIsGlobalFallback] = useState(false);
  const requestIdRef = useRef(0);

  const fetchGlobalFallback = async requestId => {
    try {
      console.log('Global search fallback for:', debouncedSearchText);
      const response = await getProductSuggestionsApi(
        debouncedSearchText,
        pincodeAreaId,
        PAGE_SIZE,
      );
      console.log('Global search fallback response:', response);
      if (requestId !== requestIdRef.current) return;

      const items = Array.isArray(response?.data) ? response.data : [];
      setProductsList(items);
      setIsGlobalFallback(items.length > 0);
    } catch (error) {
      console.error('Error in global search fallback:', error);
      if (requestId !== requestIdRef.current) return;
      setProductsList([]);
      setIsGlobalFallback(false);
    } finally {
      if (requestId === requestIdRef.current) setHasMoreData(false);
    }
  };

  const fetchProducts = async (categoryId, page = 1) => {
    const requestId = ++requestIdRef.current;
    try {
      if (page === 1) {
        setProductsList([]);
        setIsFetchingProducts(true);
        setHasMoreData(true);
        setIsGlobalFallback(false);
      } else {
        setIsFetchingMore(true);
      }

      const payload = {
        pincodeAreaId: pincodeAreaId,
        prName: debouncedSearchText,
        catId: parseInt(categoryId),
        priceMin: filters.priceMin,
        priceMax: filters.priceMax,
        filterValues: null,
        sortBy: filters.sortBy,
        pageNumber: page,
        pageSize: PAGE_SIZE,
      };
      console.log(
        'Fetching Products Payload:',
        payload,
      );
      const response = await searchProductsApi(payload);
      console.log('Products Response:', response);

      if (requestId !== requestIdRef.current) {
        return;
      }

      if (
        response &&
        response.success &&
        response.data &&
        response.data.items
      ) {
        const newProducts = shuffle(response.data.items);
        if (page === 1) {
          if (newProducts.length === 0 && debouncedSearchText) {
            await fetchGlobalFallback(requestId);
            return;
          }
          setProductsList(newProducts);
        } else {
          setProductsList(prev => [...prev, ...newProducts]);
        }

        setPageNumber(page);
        if (newProducts.length < PAGE_SIZE) {
          setHasMoreData(false);
        }
      } else {
        if (page === 1) {
          setProductsList([]);
          if (debouncedSearchText) {
            await fetchGlobalFallback(requestId);
            return;
          }
        }
        setHasMoreData(false);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      if (requestId !== requestIdRef.current) return;
      if (page === 1) {
        setProductsList([]);
        if (debouncedSearchText) {
          await fetchGlobalFallback(requestId);
          return;
        }
      }
      setHasMoreData(false);
    } finally {
      if (requestId === requestIdRef.current) {
        if (page === 1) {
          setIsFetchingProducts(false);
          setHasFetchedProducts(true);
        }
        setIsFetchingMore(false);
      }
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategoriesApi(1);
      console.log('Categories Response:', response);
      if (
        response &&
        response.success &&
        response.data &&
        response.data.items
      ) {
        setCategoriesList(response.data.items);

        const targetCat = response.data.items.find(item => item.catId === 105);
        if (targetCat) {
          setSelectedId('105');
        } else if (response.data.items.length > 0) {
          setSelectedId(response.data.items[0]?.catId?.toString());
        }
      } else if (
        response?.status === 'STORE_NOT_FOUND' ||
        response?.data?.status === 'STORE_NOT_FOUND'
      ) {
        setStoreUnavailable(true, response.data);
        setCategoriesList([]);
      } else {
        setCategoriesList([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async parentId => {
    try {
      setIsFetchingSubCategories(true);
      const response = await getCategoriesApi(parentId);
      console.log('SubCategories Response:', response);
      if (
        response &&
        response.success &&
        response.data &&
        response.data.items
      ) {
        setSubCategoriesList(response.data.items);
        setSelectedSubCatId(null);
      } else {
        setSubCategoriesList([]);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubCategoriesList([]);
    } finally {
      setIsFetchingSubCategories(false);
    }
  };

  const handleLoadMore = () => {
    if (!isFetchingMore && !isFetchingProducts && hasMoreData && !loading) {
      const catIdToFetch = selectedSubCatId || selectedId;
      if (catIdToFetch) {
        fetchProducts(catIdToFetch, pageNumber + 1);
      }
    }
  };

  useEffect(() => {
    const initializeLocationAndSettings = async () => {
      try {
        const storedPincodeAreaId = await secureStore.getItem('pincodeAreaId');
        setPincodeAreaId(
          storedPincodeAreaId
            ? parseInt(storedPincodeAreaId)
            : profile?.pincode || null,
        );
      } catch (error) {
        console.error(
          'Error in initializeLocationAndSettings in CategoriesScreen:',
          error,
        );
      } finally {
        setLocationInitialized(true);
      }
    };

    initializeLocationAndSettings();
  }, [profile?.pincode]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (catId) {
      setSelectedId(catId.toString());
    }
  }, [catId]);

  useEffect(() => {
    if (selectedId) {
      fetchSubCategories(selectedId);
    }
  }, [selectedId]);

  useEffect(() => {
    if (!locationInitialized) return;
    const catIdToFetch = selectedSubCatId || selectedId;
    if (catIdToFetch) {
      console.log(
        'Fetching products for:',
        catIdToFetch,
        'with search:',
        debouncedSearchText,
      );
      fetchProducts(catIdToFetch, 1);
    }
  }, [
    selectedSubCatId,
    debouncedSearchText,
    selectedId,
    filters,
    locationInitialized,
    pincodeAreaId,
  ]);

  return {
    selectedId,
    setSelectedId,
    selectedSubCatId,
    setSelectedSubCatId,
    categoriesList,
    subCategoriesList,
    productsList,
    loading,
    isFetchingSubCategories,
    isFetchingProducts,
    hasFetchedProducts,
    isFetchingMore,
    handleLoadMore,
    isGlobalFallback,
  };
};

export default useCategoriesData;
