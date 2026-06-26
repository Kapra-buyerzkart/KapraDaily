import { useQuery } from '@tanstack/react-query';
import { getProductSuggestionsApi } from '../api/productService';
import { searchKeys } from './queryKeys';

const useProductSuggestionsQuery = (term, areaId) => {
  const trimmedTerm = (term || '').trim();

  return useQuery({
    queryKey: searchKeys.suggestions(trimmedTerm, areaId),
    queryFn: () => getProductSuggestionsApi(trimmedTerm, areaId),
    select: (response) => (response?.success ? response.data || [] : []),
    enabled: trimmedTerm.length > 0,
    staleTime: 60 * 1000, // retyping/back-navigating to the same term within a session is instant
  });
};

export default useProductSuggestionsQuery;
