import React, { createContext, useState, useContext, useCallback, useMemo, useRef, useEffect } from 'react';
import { addToWishlistApi, removeFromWishlistApi, getWishlistApi } from '../api/services/wishlistService';
import { getPincodeAreaId } from '../globals/storage';

interface WishlistContextType {
    wishlistItems: any[];
    isLoading: boolean;
    addToWishlist: (item: any) => Promise<void>;
    removeFromWishlist: (itemId: string | number) => Promise<void>;
    isInWishlist: (itemId: string | number) => boolean;
    toggleWishlist: (item: any) => void;
    loadWishlist: (force?: boolean) => Promise<void>;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const lastFetchedRef = useRef(0);
    const loadRequestRef = useRef<Promise<void> | null>(null);

    const loadWishlist = useCallback(async (force = false) => {
        const now = Date.now();
        if (!force && lastFetchedRef.current && (now - lastFetchedRef.current < 30000)) {
            return;
        }

        if (loadRequestRef.current) {
            return loadRequestRef.current;
        }

        setIsLoading(true);
        const promise = (async () => {
            try {
                const storedPincodeAreaId = await getPincodeAreaId();
                const areaId = storedPincodeAreaId ? parseInt(storedPincodeAreaId) : 105;
                const response = await getWishlistApi(areaId);
                if (response && response.success && response.data && response.data.items) {
                    const items = Array.isArray(response.data.items) ? response.data.items : [];
                    setWishlistItems(items);
                    lastFetchedRef.current = Date.now();
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

    const addToWishlist = useCallback(async (item: any) => {
        const productId = item.productId || item.id;

        setWishlistItems(prevItems => {
            if (!prevItems.find(i => (i.productId || i.id) === productId)) {
                return [...prevItems, { ...item, productId }];
            }
            return prevItems;
        });

        try {
            await addToWishlistApi(productId);
        } catch (error) {
            console.error('Error adding to wishlist API:', error);
            setWishlistItems(prevItems => prevItems.filter(i => (i.productId || i.id) !== productId));
            loadWishlist(true);
        }
    }, [loadWishlist]);

    const removeFromWishlist = useCallback(async (itemId: string | number) => {
        let removedItem: any = null;

        setWishlistItems(prevItems => {
            removedItem = prevItems.find(item => (item.productId || item.id) === itemId);
            return prevItems.filter(item => (item.productId || item.id) !== itemId);
        });

        try {
            await removeFromWishlistApi(itemId);
        } catch (error) {
            console.error('Error removing from wishlist API:', error);
            if (removedItem) {
                setWishlistItems(prevItems => [...prevItems, removedItem]);
            }
            loadWishlist(true);
        }
    }, [loadWishlist]);

    const isInWishlist = useCallback((itemId: string | number) => {
        return wishlistItems.some(wishlistItem => (wishlistItem.productId || wishlistItem.id) === itemId);
    }, [wishlistItems]);

    const toggleWishlist = useCallback((item: any) => {
        const id = item.productId || item.id;
        if (isInWishlist(id)) {
            removeFromWishlist(id);
        } else {
            addToWishlist(item);
        }
    }, [isInWishlist, addToWishlist, removeFromWishlist]);

    useEffect(() => {
        loadWishlist();
    }, [loadWishlist]);

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

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
