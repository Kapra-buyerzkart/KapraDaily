import { useState, useEffect, useCallback } from 'react';
import { getProductSuggestionsApi } from '../api/productService';
import { useDebounce } from './useDebounce';

const useProductSearch = (initialPincodeId = 105) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resultCount, setResultCount] = useState(0);
    const [error, setError] = useState(null);

    // Debounce the search term to avoid excessive API calls
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        const fetchSuggestions = async () => {
            // Trim and check length
            const trimmedTerm = debouncedSearchTerm.trim();
            if (trimmedTerm.length === 0) {
                setSuggestions([]);
                setResultCount(0);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Determine limit based on term length or other logic if needed
                const response = await getProductSuggestionsApi(trimmedTerm, initialPincodeId);

                if (response && response.success && Array.isArray(response.data)) {
                    setSuggestions(response.data);
                    setResultCount(response.data.length);
                } else {
                    // Handle case where success is false or data is invalid
                    setSuggestions([]);
                    setResultCount(0);
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

        fetchSuggestions();
    }, [debouncedSearchTerm, initialPincodeId]);

    // Function to clear search manually if needed
    const clearSearch = useCallback(() => {
        setSearchTerm('');
        setSuggestions([]);
        setResultCount(0);
    }, []);

    return {
        searchTerm,
        setSearchTerm,
        suggestions,
        loading,
        resultCount,
        error,
        clearSearch
    };
};

export default useProductSearch;
