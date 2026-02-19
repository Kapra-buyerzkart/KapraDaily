import React, { useState, useEffect, useCallback, useContext } from 'react';
import { getProductSuggestionsApi, searchProductsApi } from '../api/productService';
import { useDebounce } from './useDebounce';
import { AppContext } from '../context/appContext';

const useProductSearch = (initialPincodeId, initialCatId = null) => {
    const { profile } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [catId, setCatId] = useState(initialCatId);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resultCount, setResultCount] = useState(0);

    const activePincodeId = initialPincodeId || profile?.pincode;
    const [error, setError] = useState(null);

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
                return;
            }

            setLoading(true);
            setError(null);

            try {
                let response;
                if (catId) {
                    // Use searchProductsApi for category-based search
                    const payload = {
                        pincodeAreaId: activePincodeId,
                        prName: trimmedTerm,
                        catId: parseInt(catId),
                        pageNumber: 1,
                        pageSize: 50
                    };
                    console.log('useProductSearch: Fetching with payload:', payload);
                    response = await searchProductsApi(payload);

                    if (response && response.success && response.data && Array.isArray(response.data.items)) {
                        setSuggestions(response.data.items);
                        setResultCount(response.data.items.length);
                    } else {
                        setSuggestions([]);
                        setResultCount(0);
                    }
                } else {
                    // Use getProductSuggestionsApi for general search suggestions
                    response = await getProductSuggestionsApi(trimmedTerm, activePincodeId);

                    if (response && response.success && Array.isArray(response.data)) {
                        setSuggestions(response.data);
                        setResultCount(response.data.length);
                    } else {
                        setSuggestions([]);
                        setResultCount(0);
                    }
                }
            } catch (err) {
                console.error('Error in useProductSearch:', err);
                setError(err);
                setSuggestions([]);
                setResultCount(0);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [debouncedSearchTerm, initialPincodeId, catId]);

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
        suggestions,
        loading,
        resultCount,
        error,
        clearSearch
    };
};

export default useProductSearch;
