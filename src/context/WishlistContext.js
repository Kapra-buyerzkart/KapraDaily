import React, { createContext, useState, useContext, useCallback, useMemo, useRef } from 'react';
import { addToWishlistApi, removeFromWishlistApi, getWishlistApi } from '../api/wishlistService';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const loadRequestRef = useRef(null);
    const loadWishlist = useCallback(async () => {
        if (loadRequestRef.current) {
            return loadRequestRef.current;
        }

        setIsLoading(true);
        const promise = (async () => {
            try {
                const response = await getWishlistApi();
                console.log('Wishlist Response:', response);
                if (response && response.data && response.data.items) {
                    const items = Array.isArray(response.data.items) ? response.data.items : [];
                    setWishlistItems(items);
                    console.log('Loaded wishlist items:', items.length);
                } else {
                    setWishlistItems([]);
                }
            } catch (error) {
                console.error('Error loading wishlist:', error);
                setWishlistItems([]);
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

        setWishlistItems(prevItems => {
            if (!prevItems.find(i => (i.productId || i.id) === productId)) {
                console.log('Added to wishlist local:', item.prName || item.name);
                return [...prevItems, { ...item, productId }];
            }
            return prevItems;
        });

        try {
            const response = await addToWishlistApi(productId);
            console.log('Added to wishlist API:', response);
        } catch (error) {
            console.error('Error adding to wishlist API:', error);
            setWishlistItems(prevItems => prevItems.filter(i => (i.productId || i.id) !== productId));
            await loadWishlist();
        }
    }, [loadWishlist]);

    const removeFromWishlist = useCallback(async (itemId) => {
        let removedItem = null;
        setWishlistItems(prevItems => {
            removedItem = prevItems.find(item => (item.productId || item.id) === itemId);
            return prevItems.filter(item => (item.productId || item.id) !== itemId);
        });
        console.log('Removed from wishlist local:', itemId);

        try {
            const response = await removeFromWishlistApi(itemId);
            console.log('Removed from wishlist API:', response);
        } catch (error) {
            console.error('Error removing from wishlist API:', error);
            if (removedItem) {
                setWishlistItems(prevItems => [...prevItems, removedItem]);
            }
            await loadWishlist();
        }
    }, [loadWishlist]);

    const isInWishlist = useCallback((itemId) => {
        if (!wishlistItems || !Array.isArray(wishlistItems)) {
            return false;
        }
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
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        loadWishlist
    }), [wishlistItems, isLoading, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist, loadWishlist]);

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
