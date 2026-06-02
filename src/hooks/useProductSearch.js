import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { getProductSuggestionsApi, searchProductsApi } from '../api/productService';
import { useDebounce } from './useDebounce';
import { AppContext } from '../context/appContext';
import { LoaderContext } from '../context/loaderContext';

const useProductSearch = (initialPincodeId, initialCatId = null, filters = {}) => {
    const { profile } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [catId, setCatId] = useState(initialCatId);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resultCount, setResultCount] = useState(0);
    const [isGlobalFallback, setIsGlobalFallback] = useState(false);

    const activePincodeId = initialPincodeId || profile?.pincode;
    const [error, setError] = useState(null);
    const { showLoader } = useContext(LoaderContext);

    // Extract filter values with defaults
    const sortBy = filters.sortBy || 'relevance';
    const priceMin = filters.priceMin ?? 0;
    const priceMax = filters.priceMax ?? 5000;

    // Debounce the search term to avoid excessive API calls
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Set loading to true as soon as the user starts typing
    useEffect(() => {
        if (searchTerm.trim() !== debouncedSearchTerm.trim()) {
            setLoading(true);
        }
    }, [searchTerm]);

    useEffect(() => {
        const fetchProducts = async () => {
            const trimmedTerm = debouncedSearchTerm.trim();

            // If neither search term nor catId is present, clear results
            if (trimmedTerm.length === 0 && !catId) {
                setSuggestions([]);
                setResultCount(0);
                setLoading(false);
                return;
            }

            setLoading(true);
            showLoader(true);
            setError(null);

            try {
                let response;
                const trimmedTerm = debouncedSearchTerm.trim();

                if (trimmedTerm.length > 0) {
                    // USER typing -> ALWAYS Global Search (per user request to show products from other categories)
                    response = await getProductSuggestionsApi(trimmedTerm, activePincodeId);

                    if (response && response.success && Array.isArray(response.data)) {
                        setSuggestions(response.data);
                        setResultCount(response.data.length);
                        // If we have a catId but searched globally, show the fallback notice in SearchScreen
                        setIsGlobalFallback(!!catId);
                    } else {
                        setSuggestions([]);
                        setResultCount(0);
                        setIsGlobalFallback(false);
                    }
                } else if (catId) {
                    // Browsing category (no search term) -> Category specific
                    const payload = {
                        pincodeAreaId: activePincodeId,
                        prName: "",
                        catId: parseInt(catId),
                        priceMin: priceMin,
                        priceMax: priceMax,
                        filterValues: null,
                        sortBy: sortBy,
                        pageNumber: 1,
                        pageSize: 50
                    };
                    response = await searchProductsApi(payload);

                    if (response && response.success && response.data && Array.isArray(response.data.items)) {
                        setSuggestions(response.data.items);
                        setResultCount(response.data.items.length);
                        setIsGlobalFallback(false);
                    } else {
                        setSuggestions([]);
                        setResultCount(0);
                        setIsGlobalFallback(false);
                    }
                } else {
                    // Neither search term nor catId
                    setSuggestions([]);
                    setResultCount(0);
                    setIsGlobalFallback(false);
                }
            } catch (err) {
                setError(err);
                setSuggestions([]);
                setResultCount(0);
            } finally {
                setLoading(false);
                showLoader(false);
            }
        };

        fetchProducts();
    }, [debouncedSearchTerm, initialPincodeId, catId, sortBy, priceMin, priceMax]);

    // Client-side sort for general search (no catId) since getProductSuggestionsApi may not support server-side sorting
    const sortedSuggestions = useMemo(() => {
        // Only apply client-side sort when NOT using catId (server handles sort for catId-based search)
        if (catId || sortBy === 'relevance') return suggestions;

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
    }, [suggestions, sortBy, catId]);

    // Client-side price filter for general search
    const filteredSuggestions = useMemo(() => {
        if (catId) return sortedSuggestions; // Server handles filtering for catId
        if (priceMin === 0 && priceMax >= 5000) return sortedSuggestions;

        return sortedSuggestions.filter(item => {
            const price = item.sellingPrice || item.price || 0;
            return price >= priceMin && price <= priceMax;
        });
    }, [sortedSuggestions, priceMin, priceMax, catId]);

    // Function to clear search manually if needed
    const clearSearch = useCallback(() => {
        setSearchTerm('');
        setCatId(null);
        setSuggestions([]);
        setResultCount(0);
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
