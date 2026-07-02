import { useQuery } from '@tanstack/react-query';
import { getProductSuggestionsApi } from '../api/productService';
import { searchKeys } from './queryKeys';

// Matches the minimum searchable length enforced upstream in useProductSearch —
// kept here too so this hook is never accidentally fired below that length if reused elsewhere.
const MIN_SEARCH_LENGTH = 3;

const useProductSuggestionsQuery = (term, areaId) => {
  const trimmedTerm = (term || '').trim();

  return useQuery({
    queryKey: searchKeys.suggestions(trimmedTerm, areaId),
    queryFn: ({ signal }) => getProductSuggestionsApi(trimmedTerm, areaId, undefined, signal),
    select: (response) => (response?.success ? response.data || [] : []),
    enabled: trimmedTerm.length >= MIN_SEARCH_LENGTH,
    staleTime: 60 * 1000, // retyping/back-navigating to the same term within a session is instant
  });
};

export default useProductSuggestionsQuery;
