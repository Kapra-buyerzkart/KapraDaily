import { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { Image } from 'react-native';
import { useDebounce } from './useDebounce';
import { AppContext } from '../context/appContext';
import { LoaderContext } from '../context/loaderContext';
import useProductSuggestionsQuery from '../queries/useProductSuggestionsQuery';
import useCategorySearchQuery from '../queries/useCategorySearchQuery';
import { getProductImageUri } from '../utils/imageUrl';

// First screen of results plus a small buffer beyond the FlatList's render
// window — enough to make scrolling feel instant without competing for
// bandwidth with images that are still visible.
const PREFETCH_LOOKAHEAD = 15;

// Below this many (trimmed) characters we never hit the network — matches the
// threshold recent-searches uses so "did this term actually search" stays consistent
// app-wide (see useRecentSearches's MIN_KEYWORD_LENGTH).
export const MIN_SEARCH_LENGTH = 3;

const useProductSearch = (
  initialPincodeId,
  initialCatId = null,
  filters = {},
) => {
  const { profile } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  // The term actually handed to the search query. Unlike `searchTerm` (which
  // updates on every keystroke) this only advances when the user submits, or —
  // as a fallback — after they've stopped typing for a while. That's what keeps
  // partial words like "oni"/"onio" from each firing their own request.
  const [effectiveTerm, setEffectiveTerm] = useState('');
  const [catId, setCatId] = useState(initialCatId);
  const { showLoader } = useContext(LoaderContext);

  const activePincodeId = initialPincodeId || profile?.pincode;

  // Extract filter values with defaults
  const sortBy = filters.sortBy || 'relevance';
  const priceMin = filters.priceMin ?? 0;
  const priceMax = filters.priceMax ?? 5000;

  const trimmedRawTerm = searchTerm.trim();

  // Live fallback: once typing has settled for this long, search automatically
  // even if the user never pressed the return key / tapped the search icon.
  const debouncedSearchTerm = useDebounce(searchTerm, 1200);
  useEffect(() => {
    const settled = debouncedSearchTerm.trim();
    if (settled.length >= MIN_SEARCH_LENGTH) setEffectiveTerm(settled);
  }, [debouncedSearchTerm]);

  // Backspacing/clearing below the searchable length instantly drops back to
  // category / recent-search browsing instead of lingering on the last search.
  useEffect(() => {
    if (trimmedRawTerm.length < MIN_SEARCH_LENGTH) setEffectiveTerm('');
  }, [trimmedRawTerm]);

  // Fire a search right now for the current (or an explicitly provided) term,
  // bypassing the debounce — used by the return key, the search icon, and
  // tapping a recent search.
  const submitSearch = useCallback(
    term => {
      const next = (typeof term === 'string' ? term : searchTerm).trim();
      if (next.length >= MIN_SEARCH_LENGTH) setEffectiveTerm(next);
    },
    [searchTerm],
  );

  // A real search is currently active (drives global suggestions + the results
  // header / empty state). Based on the submitted term, not on keystrokes.
  const isSearchActive = effectiveTerm.length >= MIN_SEARCH_LENGTH;

  // Submitted search -> ALWAYS Global Search (show products from other
  // categories too). useProductSuggestionsQuery refuses to fetch below
  // MIN_SEARCH_LENGTH, so an empty effectiveTerm is a no-op.
  const suggestionsQuery = useProductSuggestionsQuery(
    effectiveTerm,
    activePincodeId,
  );
  // Browsing category (no active search) -> Category specific
  const categoryQuery = useCategorySearchQuery(
    isSearchActive ? null : catId,
    activePincodeId,
    sortBy,
    priceMin,
    priceMax,
  );

  const activeQuery = isSearchActive ? suggestionsQuery : categoryQuery;
  // Reflects only a real in-flight request — no spinner while the user is still
  // typing or waiting out the live-fallback window.
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
