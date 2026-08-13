import { useQuery } from '@tanstack/react-query';
import { searchProductsApi } from '../api/productService';
import { searchKeys } from './queryKeys';

const useCategorySearchQuery = (catId, areaId, sortBy, priceMin, priceMax) =>
  useQuery({
    queryKey: searchKeys.categorySearch(catId, areaId, sortBy, priceMin, priceMax),
    queryFn: async () => {
      const payload = {
        pincodeAreaId: areaId,
        prName: '',
        catId: parseInt(catId, 10),
        priceMin,
        priceMax,
        filterValues: null,
        sortBy,
        pageNumber: 1,
        pageSize: 50,
      };
      console.log('🛒 [CategorySearch] POST product/search payload:', payload);
      const response = await searchProductsApi(payload);
      console.log(
        '🛒 [CategorySearch] response success:',
        response?.success,
        '| items count:',
        response?.data?.items?.length,
      );
      console.log('🛒 [CategorySearch] response:', response);
      return response;
    },
    select: (response) => (response?.success ? response.data?.items || [] : []),
    enabled: !!catId,
    staleTime: 60 * 1000,
  });

export default useCategorySearchQuery;
