import React, { createContext, useState, useContext, useCallback, useMemo, useRef, useEffect } from 'react';
import { addToWishlistApi, removeFromWishlistApi, getWishlistApi } from '../api/wishlistService';
import secureStore from '../utils/secureStore';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const lastFetchedRef = useRef(0);
    const loadRequestRef = useRef(null);

    const loadWishlist = useCallback(async (force = false) => {
        const now = Date.now();
        // Prevent frequent fetches (e.g., within 30 seconds) unless forced
        if (!force && lastFetchedRef.current && (now - lastFetchedRef.current < 30000)) {
            return;
        }

        if (loadRequestRef.current) {
            return loadRequestRef.current;
        }

        setIsLoading(true);
        const promise = (async () => {
            try {
                const storedPincodeAreaId = await secureStore.getItem('pincodeAreaId');
                const areaId = storedPincodeAreaId ? parseInt(storedPincodeAreaId) : null;
                const response = await getWishlistApi(areaId);
                const items = Array.isArray(response?.data?.items) ? response.data.items : [];
                setWishlistItems(items);
                setError(null);
                lastFetchedRef.current = Date.now();
            } catch (err) {
                console.error('Error loading wishlist:', err);
                setError(err);
            } finally {
                setIsLoading(false);
                loadRequestRef.current = null;
            }
        })();

        loadRequestRef.current = promise;
        return promise;
    }, []);

    const addToWishlist = useCallback(async (item) => {
        const productId = item.productId || item.id;

        // Optimistic Update
        setWishlistItems(prevItems => {
            if (!prevItems.find(i => (i.productId || i.id) === productId)) {
                return [...prevItems, { ...item, productId }];
            }
            return prevItems;
        });

        try {
            await addToWishlistApi(productId);
        } catch (err) {
            console.error('Error adding to wishlist API:', err);
            // Revert on failure
            setWishlistItems(prevItems => prevItems.filter(i => (i.productId || i.id) !== productId));
            loadWishlist(true); // Retry fetch
        }
    }, [loadWishlist]);

    const removeFromWishlist = useCallback(async (itemId) => {
        let removedItem = null;

        setWishlistItems(prevItems => {
            removedItem = prevItems.find(item => (item.productId || item.id) === itemId);
            return prevItems.filter(item => (item.productId || item.id) !== itemId);
        });

        try {
            await removeFromWishlistApi(itemId);
        } catch (err) {
            console.error('Error removing from wishlist API:', err);
            // Revert on failure
            if (removedItem) {
                setWishlistItems(prevItems => [...prevItems, removedItem]);
            }
            loadWishlist(true); // Retry fetch
        }
    }, [loadWishlist]);

    const isInWishlist = useCallback((itemId) => {
        return wishlistItems.some(wishlistItem => wishlistItem.productId === itemId);
    }, [wishlistItems]);

    const toggleWishlist = useCallback((item) => {
        const id = item.productId || item.id;
        if (isInWishlist(id)) {
            removeFromWishlist(id);
        } else {
            addToWishlist(item);
        }
    }, [isInWishlist, addToWishlist, removeFromWishlist]);

    const value = useMemo(() => ({
        wishlistItems,
        isLoading,
        error,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        loadWishlist
    }), [wishlistItems, isLoading, error, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist, loadWishlist]);

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
