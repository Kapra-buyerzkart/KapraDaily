import { useState, useEffect, useContext } from 'react';
import secureStore from '../utils/secureStore';
import { getCategoriesApi } from '../api/categoryService';
import { searchProductsApi } from '../api/productService';
import { AppContext } from '../context/appContext';
import { shuffle } from '../utils/shuffle';

const PAGE_SIZE = 20;

// Owns categories/sub-categories/products fetching + pagination for
// CategoriesScreen. Re-fetches products whenever the selected
// category/sub-category, debounced search text, or filters change.
const useCategoriesData = (catId, debouncedSearchText, filters) => {
  const { profile, setStoreUnavailable } = useContext(AppContext);

  const [selectedId, setSelectedId] = useState(catId?.toString() || '1');
  const [selectedSubCatId, setSelectedSubCatId] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  const [subCategoriesList, setSubCategoriesList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingSubCategories, setIsFetchingSubCategories] = useState(false);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [pincodeAreaId, setPincodeAreaId] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  const fetchProducts = async (categoryId, page = 1) => {
    try {
      if (page === 1) {
        setProductsList([]); // Clear previous products immediately to show local loader
        setIsFetchingProducts(true);
        setHasMoreData(true);
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
        JSON.stringify(payload, null, 2),
      );
      const response = await searchProductsApi(payload);
      console.log('Products Response:', JSON.stringify(response, null, 2));

      if (
        response &&
        response.success &&
        response.data &&
        response.data.items
      ) {
        // Shuffle each page as it arrives (not the accumulated list on every
        // render) so already-rendered items never reorder from under the
        // user mid-scroll — only the freshly fetched page gets randomized.
        const newProducts = shuffle(response.data.items);
        if (page === 1) {
          setProductsList(newProducts);
        } else {
          setProductsList(prev => [...prev, ...newProducts]);
        }

        setPageNumber(page);
        // Check if we have more data based on totalCount or item length
        if (newProducts.length < PAGE_SIZE) {
          setHasMoreData(false);
        }
      } else {
        if (page === 1) setProductsList([]);
        setHasMoreData(false);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      if (page === 1) setProductsList([]);
      setHasMoreData(false);
    } finally {
      if (page === 1) setIsFetchingProducts(false);
      setIsFetchingMore(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategoriesApi(1); // Fetch root categories to find 105
      console.log('Categories Response:', JSON.stringify(response, null, 2));
      if (
        response &&
        response.success &&
        response.data &&
        response.data.items
      ) {
        setStoreUnavailable(false);
        setCategoriesList(response.data.items);

        // Try to find and select 105 as requested
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
      console.log('SubCategories Response:', JSON.stringify(response, null, 2));
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
      }
    };

    initializeLocationAndSettings();
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
  }, [selectedSubCatId, debouncedSearchText, selectedId, filters]);

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
    isFetchingMore,
    handleLoadMore,
  };
};

export default useCategoriesData;
