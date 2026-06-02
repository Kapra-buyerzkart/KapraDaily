import { useState, useEffect, useCallback } from 'react';
import { getWishlistApi } from '../api/wishlistService';

export const useWishlistData = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadWishlist = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getWishlistApi();

            if (response && response.data && response.data.items) {
                const items = Array.isArray(response.data.items) ? response.data.items : [];
                setWishlistItems(items);
            } else {
                setWishlistItems([]);
            }
        } catch (err) {
            setError(err);
            setWishlistItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadWishlist();
    }, [loadWishlist]);

    const refresh = useCallback(() => {
        loadWishlist();
    }, [loadWishlist]);

    return {
        wishlistItems,
        loading,
        error,
        refresh,
    };
};
