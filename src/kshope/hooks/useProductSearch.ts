import { useState, useEffect, useCallback, useMemo } from 'react';
import { searchProductsApi } from '../api/services/productService';
import { useDebounce } from './useDebounce';
import { useKshopeAreaId } from './useKshopeAreaId';

const useProductSearch = (initialPincodeId: any, initialCatId: any = null, filters: any = {}, initialAttrValueId: any = null, initialSearchTerm: string = '') => {
    const { areaId } = useKshopeAreaId();
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [catId, setCatId] = useState(initialCatId);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(100);
    const [resultCount, setResultCount] = useState(0);
    const [isGlobalFallback, setIsGlobalFallback] = useState(false);

    const activePincodeId = initialPincodeId || areaId;
    const [error, setError] = useState<any>(null);
    const showLoader = (_: boolean) => {};

    const sortBy = filters.sortBy || 'relevance';
    const priceMin = filters.priceMin ?? 0;
    const priceMax = filters.priceMax ?? 5000;

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        if (searchTerm.trim() !== debouncedSearchTerm.trim()) {
            setLoading(true);
        }
    }, [searchTerm, debouncedSearchTerm]);

    const fetchProducts = useCallback(async (page = 1) => {
        const trimmedTerm = debouncedSearchTerm.trim();

        if (trimmedTerm.length === 0 && !catId && !initialAttrValueId) {
            setSuggestions([]);
            setResultCount(0);
            setLoading(false);
            setHasMore(false);
            return;
        }

        if (page === 1) {
            setLoading(true);
            showLoader(true);
        } else {
            setIsLoadingMore(true);
        }
        setError(null);

        try {
            let response: any;

            if (trimmedTerm.length > 0) {
                const payload = {
                    pincodeAreaId: activePincodeId,
                    prName: trimmedTerm || null,
                    catId: catId ? parseInt(catId) : null,
                    priceMin: priceMin,
                    priceMax: priceMax,
                    filterValues: initialAttrValueId ? initialAttrValueId.toString() : null,
                    attrValueId: initialAttrValueId,
                    sortBy: sortBy,
                    pageNumber: page,
                    pageSize: pageSize
                };
                response = await searchProductsApi(payload);

                if (response && response.success && response.data && Array.isArray(response.data.items)) {
                    const newItems = response.data.items;
                    if (page === 1) {
                        setSuggestions(newItems);
                        setResultCount(response.data.totalCount || newItems.length);
                    } else {
                        setSuggestions(prev => [...prev, ...newItems]);
                    }
                    setHasMore(newItems.length === pageSize);
                    setPageNumber(page);
                    setIsGlobalFallback(!!catId);
                } else {
                    if (page === 1) {
                        setSuggestions([]);
                        setResultCount(0);
                    }
                    setHasMore(false);
                }
            } else if (catId) {
                const payload = {
                    pincodeAreaId: activePincodeId,
                    prName: null,
                    catId: parseInt(catId),
                    priceMin: priceMin,
                    priceMax: priceMax,
                    filterValues: initialAttrValueId ? initialAttrValueId.toString() : null,
                    attrValueId: initialAttrValueId,
                    sortBy: sortBy,
                    pageNumber: page,
                    pageSize: pageSize
                };
                response = await searchProductsApi(payload);

                if (response && response.success && response.data && Array.isArray(response.data.items)) {
                    const newItems = response.data.items;
                    if (page === 1) {
                        setSuggestions(newItems);
                        setResultCount(response.data.totalCount || newItems.length);
                    } else {
                        setSuggestions(prev => [...prev, ...newItems]);
                    }
                    setHasMore(newItems.length === pageSize);
                    setPageNumber(page);
                    setIsGlobalFallback(false);
                } else {
                    if (page === 1) {
                        setSuggestions([]);
                        setResultCount(0);
                    }
                    setHasMore(false);
                }
            } else if (initialAttrValueId) {
                const payload = {
                    pincodeAreaId: activePincodeId,
                    prName: null,
                    catId: null,
                    priceMin: priceMin,
                    priceMax: priceMax,
                    filterValues: initialAttrValueId.toString(),
                    attrValueId: initialAttrValueId,
                    sortBy: sortBy,
                    pageNumber: page,
                    pageSize: pageSize
                };
                response = await searchProductsApi(payload);

                if (response && response.success && response.data && Array.isArray(response.data.items)) {
                    const newItems = response.data.items;
                    if (page === 1) {
                        setSuggestions(newItems);
                        setResultCount(response.data.totalCount || newItems.length);
                    } else {
                        setSuggestions(prev => [...prev, ...newItems]);
                    }
                    setHasMore(newItems.length === pageSize);
                    setPageNumber(page);
                    setIsGlobalFallback(false);
                } else {
                    if (page === 1) {
                        setSuggestions([]);
                        setResultCount(0);
                    }
                    setHasMore(false);
                }
            }
        } catch (err) {
            console.error('Error in useProductSearch:', err);
            setError(err);
            if (page === 1) {
                setSuggestions([]);
                setResultCount(0);
            }
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
            showLoader(false);
        }
    }, [debouncedSearchTerm, catId, initialAttrValueId, activePincodeId, sortBy, priceMin, priceMax, pageSize]);

    useEffect(() => {
        fetchProducts(1);
    }, [fetchProducts]);

    const loadMore = useCallback(() => {
        if (!loading && !isLoadingMore && hasMore) {
            fetchProducts(pageNumber + 1);
        }
    }, [loading, isLoadingMore, hasMore, pageNumber, fetchProducts]);

    const sortedSuggestions = useMemo(() => {
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
                return sorted;
            default:
                return sorted;
        }
    }, [suggestions, sortBy, catId]);

    const filteredSuggestions = useMemo(() => {
        if (catId) return sortedSuggestions;
        if (priceMin === 0 && priceMax >= 5000) return sortedSuggestions;

        return sortedSuggestions.filter(item => {
            const price = item.sellingPrice || item.price || 0;
            return price >= priceMin && price <= priceMax;
        });
    }, [sortedSuggestions, priceMin, priceMax, catId]);

    const clearSearch = useCallback(() => {
        setSearchTerm('');
        setCatId(null);
        setSuggestions([]);
        setResultCount(0);
        setPageNumber(1);
        setHasMore(true);
    }, []);

    return {
        searchTerm,
        setSearchTerm,
        catId,
        setCatId,
        suggestions: filteredSuggestions,
        loading,
        isLoadingMore,
        hasMore,
        loadMore,
        resultCount,
        error,
        isGlobalFallback,
        clearSearch
    };
};

export default useProductSearch;
