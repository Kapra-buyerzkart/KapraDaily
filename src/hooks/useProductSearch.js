import { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { Image } from 'react-native';
import { useDebounce } from './useDebounce';
import { AppContext } from '../context/appContext';
import { LoaderContext } from '../context/loaderContext';
import useProductSuggestionsQuery from '../queries/useProductSuggestionsQuery';
import useCategorySearchQuery from '../queries/useCategorySearchQuery';
import { getProductImageUri } from '../utils/imageUrl';

const PREFETCH_LOOKAHEAD = 15;

export const MIN_SEARCH_LENGTH = 3;

const useProductSearch = (
  initialPincodeId,
  initialCatId = null,
  filters = {},
) => {
  const { profile } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [effectiveTerm, setEffectiveTerm] = useState('');
  const [catId, setCatId] = useState(initialCatId);
  const { showLoader } = useContext(LoaderContext);

  const activePincodeId = initialPincodeId || profile?.pincode;

  // Extract filter values with defaults
  const sortBy = filters.sortBy || 'relevance';
  const priceMin = filters.priceMin ?? 0;
  const priceMax = filters.priceMax ?? 5000;

  const trimmedRawTerm = searchTerm.trim();

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  useEffect(() => {
    const settled = debouncedSearchTerm.trim();
    if (settled.length >= MIN_SEARCH_LENGTH) setEffectiveTerm(settled);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (trimmedRawTerm.length < MIN_SEARCH_LENGTH) setEffectiveTerm('');
  }, [trimmedRawTerm]);

  const submitSearch = useCallback(
    term => {
      const next = (typeof term === 'string' ? term : searchTerm).trim();
      if (next.length >= MIN_SEARCH_LENGTH) setEffectiveTerm(next);
    },
    [searchTerm],
  );

  const isSearchActive = effectiveTerm.length >= MIN_SEARCH_LENGTH;

  const suggestionsQuery = useProductSuggestionsQuery(
    effectiveTerm,
    activePincodeId,
  );
  const categoryQuery = useCategorySearchQuery(
    isSearchActive ? null : catId,
    activePincodeId,
    sortBy,
    priceMin,
    priceMax,
  );

  const activeQuery = isSearchActive ? suggestionsQuery : categoryQuery;
  const loading = activeQuery.isFetching && (isSearchActive || !!catId);
  const error = activeQuery.error || null;

  const isGlobalFallback = isSearchActive && !!catId;

  useEffect(() => {
    if (!loading) return;
    showLoader(true);
    return () => showLoader(false);
  }, [loading, showLoader]);

  const sortedSuggestions = useMemo(() => {
    const suggestions = isSearchActive
      ? suggestionsQuery.data || []
      : catId
      ? categoryQuery.data || []
      : [];

    if (!isSearchActive || sortBy === 'relevance') return suggestions;

    const sorted = [...suggestions];
    switch (sortBy) {
      case 'lowToHigh':
        return sorted.sort(
          (a, b) =>
            (a.sellingPrice || a.price || 0) - (b.sellingPrice || b.price || 0),
        );
      case 'highToLow':
        return sorted.sort(
          (a, b) =>
            (b.sellingPrice || b.price || 0) - (a.sellingPrice || a.price || 0),
        );
      case 'a-z':
        return sorted.sort((a, b) =>
          (a.productName || a.name || '').localeCompare(
            b.productName || b.name || '',
          ),
        );
      case 'z-a':
        return sorted.sort((a, b) =>
          (b.productName || b.name || '').localeCompare(
            a.productName || a.name || '',
          ),
        );
      case 'latest':
        return sorted; // Default order from API is usually latest
      default:
        return sorted;
    }
  }, [
    suggestionsQuery.data,
    categoryQuery.data,
    catId,
    sortBy,
    isSearchActive,
  ]);

  // Client-side price filter for general search
  const filteredSuggestions = useMemo(() => {
    if (!isSearchActive) return sortedSuggestions; // Server handles filtering for catId
    if (priceMin === 0 && priceMax >= 5000) return sortedSuggestions;

    return sortedSuggestions.filter(item => {
      const price = item.sellingPrice || item.price || 0;
      return price >= priceMin && price <= priceMax;
    });
  }, [sortedSuggestions, priceMin, priceMax, isSearchActive]);

  useEffect(() => {
    const uris = filteredSuggestions
      .slice(0, PREFETCH_LOOKAHEAD)
      .map(getProductImageUri)
      .filter(Boolean);

    uris.forEach(uri => Image.prefetch(uri));
  }, [filteredSuggestions]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setEffectiveTerm('');
    setCatId(null);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    submitSearch,
    catId,
    setCatId,
    isSearchActive,
    suggestions: filteredSuggestions,
    loading,
    resultCount: filteredSuggestions.length,
    error,
    isGlobalFallback,
    clearSearch,
  };
};

export default useProductSearch;
