import { useQuery } from '@tanstack/react-query';
import { getCategoryProducts } from '../api/homeService';
import { homeKeys } from './queryKeys';

const useCategoryDiscoveryProductsQuery = (catId, areaId) =>
  useQuery({
    queryKey: homeKeys.categoryProducts(catId, areaId),
    queryFn: () => getCategoryProducts(catId, areaId),
    select: (response) => (response?.success ? response.data?.items || [] : []),
    enabled: !!catId,
  });

export default useCategoryDiscoveryProductsQuery;
