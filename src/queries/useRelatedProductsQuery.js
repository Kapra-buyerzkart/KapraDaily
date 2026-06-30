import { useQuery } from '@tanstack/react-query';
import { getRelatedProductsApi } from '../api/productService';
import { productKeys } from './queryKeys';

const useRelatedProductsQuery = (productId, pincodeAreaId, limit = 10) =>
  useQuery({
    queryKey: productKeys.related(productId, pincodeAreaId),
    queryFn: () => getRelatedProductsApi(productId, pincodeAreaId, limit),
    select: response => response?.data?.items || [],
    enabled: !!productId,
  });

export default useRelatedProductsQuery;
