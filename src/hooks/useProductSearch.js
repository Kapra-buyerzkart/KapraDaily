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

const useProductSearch = (initialPincodeId, initialCatId = null, filters = {}) => {
    const { profile } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [catId, setCatId] = useState(initialCatId);
    const { showLoader } = useContext(LoaderContext);

    const activePincodeId = initialPincodeId || profile?.pincode;

    // Extract filter values with defaults
    const sortBy = filters.sortBy || 'relevance';
    const priceMin = filters.priceMin ?? 0;
    const priceMax = filters.priceMax ?? 5000;

    // Debounce the search term to avoid excessive API calls
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const isDebouncing = searchTerm.trim() !== debouncedSearchTerm.trim();
    const trimmedTerm = debouncedSearchTerm.trim();
    const isSearchingTerm = trimmedTerm.length > 0;

    // USER typing -> ALWAYS Global Search (per user request to show products from other categories)
    const suggestionsQuery = useProductSuggestionsQuery(trimmedTerm, activePincodeId);
    // Browsing category (no search term) -> Category specific
    const categoryQuery = useCategorySearchQuery(
        isSearchingTerm ? null : catId,
        activePincodeId,
        sortBy,
        priceMin,
        priceMax,
    );

    const activeQuery = isSearchingTerm ? suggestionsQuery : categoryQuery;
    const loading = isDebouncing || (activeQuery.isFetching && (isSearchingTerm || !!catId));
    const error = activeQuery.error || null;

    const isGlobalFallback = isSearchingTerm && !!catId;

    // Mirror `loading` into the global ref-counted loader. The cleanup releases
    // it whenever loading turns off OR the component unmounts mid-fetch, so the
    // increment/decrement pair always stays balanced.
    useEffect(() => {
        if (!loading) return;
        showLoader(true);
        return () => showLoader(false);
    }, [loading, showLoader]);

    // Client-side sort for general search (no catId) since getProductSuggestionsApi may not support server-side sorting
    const sortedSuggestions = useMemo(() => {
        const suggestions = isSearchingTerm
            ? suggestionsQuery.data || []
            : catId
                ? categoryQuery.data || []
                : [];

        // Only apply client-side sort when NOT using catId (server handles sort for catId-based search)
        if (!isSearchingTerm || sortBy === 'relevance') return suggestions;

        const sorted = [...suggestions];
        switch (sortBy) {
            case 'lowToHigh':
                return sorted.sort((a, b) => (a.sellingPrice || a.price || 0) - (b.sellingPrice || b.price || 0));
            case 'highToLow':
                return sorted.sort((a, b) => (b.sellingPrice || b.price || 0) - (a.sellingPrice || a.price || 0));
            case 'a-z':
                return sorted.sort((a, b) => (a.productName || a.name || '').localeCompare(b.productName || b.name || ''));
            case 'z-a':
                return sorted.sort((a, b) => (b.productName || b.name || '').localeCompare(a.productName || a.name || ''));
            case 'latest':
                return sorted; // Default order from API is usually latest
            default:
                return sorted;
        }
    }, [suggestionsQuery.data, categoryQuery.data, catId, sortBy, isSearchingTerm]);

    // Client-side price filter for general search
    const filteredSuggestions = useMemo(() => {
        if (!isSearchingTerm) return sortedSuggestions; // Server handles filtering for catId
        if (priceMin === 0 && priceMax >= 5000) return sortedSuggestions;

        return sortedSuggestions.filter(item => {
            const price = item.sellingPrice || item.price || 0;
            return price >= priceMin && price <= priceMax;
        });
    }, [sortedSuggestions, priceMin, priceMax, isSearchingTerm]);

    // Warm the image cache for the upcoming results before the user scrolls
    // to them, so the rows that mount as they scroll are already cached.
    useEffect(() => {
        const uris = filteredSuggestions
            .slice(0, PREFETCH_LOOKAHEAD)
            .map(getProductImageUri)
            .filter(Boolean);

        uris.forEach(uri => Image.prefetch(uri));
    }, [filteredSuggestions]);

    // Function to clear search manually if needed
    const clearSearch = useCallback(() => {
        setSearchTerm('');
        setCatId(null);
    }, []);

    return {
        searchTerm,
        setSearchTerm,
        catId,
        setCatId,
        suggestions: filteredSuggestions,
        loading,
        resultCount: filteredSuggestions.length,
        error,
        isGlobalFallback,
        clearSearch
    };
};

export default useProductSearch;
