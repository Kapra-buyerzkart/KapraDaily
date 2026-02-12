import React, { createContext, useState, useContext, useCallback, useMemo, useRef, useEffect } from 'react';
import { addToCartApi, removeFromCartApi, updateCartItemApi, getCartApi, getCartSummaryApi, clearCartApi, applyCouponApi, removeCouponApi, applyGiftCardApi, removeGiftCardApi, applyBCoinApi, removeBCoinApi } from '../api/cartService';
import Toast from 'react-native-simple-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cartSummary, setCartSummary] = useState(null);
    const [cartId, setCartId] = useState(null);

    // ─── useRef for cartVersion so every callback always reads the LATEST value ───
    const cartVersionRef = useRef(null);
    const [cartVersion, setCartVersion] = useState(null); // kept for dependency tracking / re-renders
    const loadRequestRef = useRef(null);

    // Helper to update version in both ref and state
    const updateCartVersion = useCallback((newVersion) => {
        cartVersionRef.current = newVersion;
        setCartVersion(newVersion);
    }, []);

    useEffect(() => {
        loadCart();
    }, []);

    // ─── loadCart: fetches item list and returns cartVersion (bootstrap only) ───
    const loadCart = useCallback(async () => {
        if (loadRequestRef.current) {
            return loadRequestRef.current;
        }

        setIsLoading(true);
        const promise = (async () => {
            try {
                const response = await getCartApi();
                console.log('🛒 [CART] API Response:', JSON.stringify(response, null, 2));
                let fetchedCartVersion = null;
                if (response && response.data) {
                    if (response.data.cart && response.data.cart.cartVersion) {
                        fetchedCartVersion = response.data.cart.cartVersion;
                    }
                    if (response.data.cart && response.data.cart.cartId) {
                        setCartId(response.data.cart.cartId);
                    }
                    if (response.data.items) {
                        const items = Array.isArray(response.data.items) ? response.data.items : [];
                        setCartItems(items);
                    } else {
                        setCartItems([]);
                    }
                } else {
                    setCartItems([]);
                }
                return { success: true, cartVersion: fetchedCartVersion };
            } catch (error) {
                console.error('🛒 [CART] Error loading cart:', error);
                setCartItems([]);
                return { success: false, error };
            } finally {
                setIsLoading(false);
                loadRequestRef.current = null;
            }
        })();

        loadRequestRef.current = promise;
        return promise;
    }, []);

    // ─── getCartSummary: THE SINGLE SOURCE OF TRUTH for cartVersion ───
    // After this call, cartVersionRef.current is always up-to-date.
    const getCartSummary = useCallback(async (deliveryMode = 'express', deliverySlotId = null, cartVersionOverride = null) => {
        try {
            // Use override if provided (bootstrap from loadCart), otherwise use ref
            const versionToUse = cartVersionOverride || cartVersionRef.current;
            console.log('📊 [SUMMARY] Calling with version:', versionToUse);
            const response = await getCartSummaryApi(deliveryMode, deliverySlotId, versionToUse, cartId);
            console.log('📊 [SUMMARY] Response:', JSON.stringify(response, null, 2));
            if (response && response.data) {
                setCartSummary(response.data);
                if (response.data.cartVersion) {
                    updateCartVersion(response.data.cartVersion);
                    console.log('📊 [SUMMARY] Updated cartVersion to:', response.data.cartVersion);
                }
                if (response.data.cartId) {
                    setCartId(response.data.cartId);
                }
                return { success: true, data: response.data, cartVersion: response.data.cartVersion };
            }
            return { success: false };
        } catch (error) {
            console.error('Error fetching cart summary:', error);
            return { success: false, error };
        }
    }, [cartId, updateCartVersion]);

    // ─── Helper: after any mutation, reload list + recalculate summary ───
    // Always uses the cartVersion from list API (freshest after mutation)
    const refreshCart = useCallback(async () => {
        const loadResult = await loadCart();
        const listVersion = loadResult?.cartVersion;
        // Pass the list API version to summary — summary will update the ref
        await getCartSummary(undefined, undefined, listVersion);
    }, [loadCart, getCartSummary]);

    // ─── addToCart ───
    const addToCart = useCallback(async (item) => {
        const productId = item.productId || item.id;

        console.log('➕ [ADD TO CART] Adding product:', {
            productId,
            name: item.prName || item.productName || item.name,
            price: item.specialPrice || item.unitPrice || item.price,
        });

        setCartItems(prevItems => {
            const itemId = productId;
            const existingItem = prevItems.find(i => {
                const cartItemId = i.productId || i.id;
                return cartItemId === itemId;
            });

            if (existingItem) {
                return prevItems.map(i => {
                    const cartItemId = i.productId || i.id;
                    return cartItemId === itemId ? { ...i, quantity: (i.quantity || 1) + 1 } : i;
                });
            }
            return [...prevItems, { ...item, productId, quantity: 1 }];
        });

        const rollback = () => {
            setCartItems(prevItems => {
                const existingItem = prevItems.find(i => (i.productId || i.id) === productId);
                if (existingItem && existingItem.quantity > 1) {
                    return prevItems.map(i =>
                        (i.productId || i.id) === productId ? { ...i, quantity: i.quantity - 1 } : i
                    );
                }
                return prevItems.filter(i => (i.productId || i.id) !== productId);
            });
        };

        try {
            const response = await addToCartApi(productId, 1);
            console.log('➕ [ADD TO CART] API Response:', JSON.stringify(response, null, 2));

            if (response && response.success === false) {
                if (response.status === 'INSUFFICIENT_STOCK') {
                    Toast.show(response.message || 'Insufficient stock', Toast.LONG);
                } else {
                    Toast.show(response.message || 'Failed to add to cart', Toast.SHORT);
                }
                rollback();
                await refreshCart();
                return;
            }

            Toast.show('Item added to cart', Toast.SHORT);
            await refreshCart();
        } catch (error) {
            console.error('➕ [ADD TO CART] API Error:', error);
            rollback();
            await refreshCart();
        }
    }, [refreshCart]);

    // ─── removeFromCart ───
    const removeFromCart = useCallback(async (identifier) => {
        let removedItem = null;
        let cartItemId = identifier;
        const itemToRemove = cartItems.find(item =>
            (item.cartItemId === identifier) ||
            (item.productId || item.id) === identifier
        );

        if (itemToRemove) {
            cartItemId = itemToRemove.cartItemId;
            removedItem = itemToRemove;
        } else {
            console.warn('🛒 [REMOVE] Item not found for identifier:', identifier);
            return;
        }
        setCartItems(prevItems => prevItems.filter(item => item !== removedItem));

        console.log('Removed from cart local:', cartItemId);

        try {
            const version = cartVersionRef.current;
            const response = await removeFromCartApi(cartItemId, version, removedItem?.productId || removedItem?.id);
            console.log('Removed from cart API:', response);
            await refreshCart();
        } catch (error) {
            console.error('Error removing from cart API:', error);
            if (removedItem) {
                setCartItems(prevItems => [...prevItems, removedItem]);
            }
            await refreshCart();
        }
    }, [cartItems, refreshCart]);

    // ─── updateCartItemQuantity ───
    const updateCartItemQuantity = useCallback(async (cartItemId, quantity) => {
        console.log('🔄 [UPDATE QTY] Updating quantity:', { cartItemId, newQuantity: quantity });

        if (quantity <= 0) {
            console.log('🔄 [UPDATE QTY] Quantity is 0, removing item');
            return removeFromCart(cartItemId);
        }

        let oldQuantity = 1;

        setCartItems(prevItems => {
            const updated = prevItems.map(item => {
                if ((item.cartItemId || item.productId || item.id) === cartItemId) {
                    oldQuantity = item.quantity || 1;
                    console.log('🔄 [UPDATE QTY] Found item, updating from', oldQuantity, 'to', quantity);
                    return { ...item, quantity };
                }
                return item;
            });
            return updated;
        });

        try {
            const version = cartVersionRef.current;
            const response = await updateCartItemApi(cartItemId, quantity, version);
            console.log('🔄 [UPDATE QTY] API Response:', JSON.stringify(response, null, 2));
            await refreshCart();
        } catch (error) {
            console.error('🔄 [UPDATE QTY] API Error:', error);
            setCartItems(prevItems =>
                prevItems.map(item =>
                    (item.cartItemId || item.productId || item.id) === cartItemId ? { ...item, quantity: oldQuantity } : item
                )
            );
            await refreshCart();
        }
    }, [removeFromCart, refreshCart]);

    // ─── clearCart ───
    const clearCart = useCallback(async () => {
        const previousItems = cartItems;
        try {
            setCartItems([]);
            setCartSummary(null);
            const version = cartVersionRef.current;
            const response = await clearCartApi(version);
            console.log('Cart cleared:', response);
        } catch (error) {
            console.error('Error clearing cart:', error);
            setCartItems(previousItems);
            await refreshCart();
        }
    }, [cartItems, refreshCart]);

    // ─── applyCoupon ───
    const applyCoupon = useCallback(async (couponCode) => {
        try {
            const version = cartVersionRef.current;
            const response = await applyCouponApi(couponCode, version, null, cartId);
            console.log('Coupon Applied:', response);
            await refreshCart();
            return { success: true, message: 'Coupon applied successfully' };
        } catch (error) {
            console.error('Error applying coupon:', error);
            return { success: false, message: error.Message || 'Failed to apply coupon' };
        }
    }, [cartId, refreshCart]);

    // ─── removeCoupon ───
    const removeCoupon = useCallback(async () => {
        try {
            const version = cartVersionRef.current;
            const response = await removeCouponApi(version, cartId);
            console.log('Coupon Removed:', response);
            await refreshCart();
            return { success: true };
        } catch (error) {
            console.error('Error removing coupon:', error);
            return { success: false, message: error.Message || 'Failed to remove coupon' };
        }
    }, [cartId, refreshCart]);

    // ─── applyBCoins ───
    const applyBCoins = useCallback(async (bcoins) => {
        try {
            const version = cartVersionRef.current;
            console.log('🪙 [BCOIN] Applying with version:', version);
            const response = await applyBCoinApi(bcoins, version);
            console.log('🪙 [BCOIN] Applied:', response);
            // After apply, recalculate summary (which updates version)
            await refreshCart();
            return { success: true, ...response };
        } catch (error) {
            console.error('Error applying BCoins:', error);
            if (error?.response?.data?.status === 'CART_VERSION_MISMATCH') {
                await refreshCart();
            }
            return { success: false, message: error.Message || 'Failed to apply BCoins' };
        }
    }, [refreshCart]);

    // ─── removeBCoins ───
    const removeBCoins = useCallback(async () => {
        try {
            const version = cartVersionRef.current;
            console.log('🪙 [BCOIN] Removing with version:', version);
            const response = await removeBCoinApi(version);
            console.log('🪙 [BCOIN] Removed:', response);
            await refreshCart();
            return { success: true, ...response };
        } catch (error) {
            console.error('Error removing BCoins:', error);
            if (error?.response?.data?.status === 'CART_VERSION_MISMATCH') {
                await refreshCart();
            }
            return { success: false, message: error.Message || 'Failed to remove BCoins' };
        }
    }, [refreshCart]);

    // ─── applyGiftCard ───
    const applyGiftCard = useCallback(async (giftCode) => {
        try {
            const version = cartVersionRef.current;
            const response = await applyGiftCardApi(giftCode, version, cartId);
            console.log('Gift Card Applied:', response);
            await refreshCart();
            return { success: true, message: 'Gift card applied successfully' };
        } catch (error) {
            console.error('Error applying gift card:', error);
            return { success: false, message: error.Message || 'Failed to apply gift card' };
        }
    }, [cartId, refreshCart]);

    // ─── removeGiftCard ───
    const removeGiftCard = useCallback(async () => {
        try {
            const version = cartVersionRef.current;
            const response = await removeGiftCardApi(version, cartId);
            console.log('Gift Card Removed:', response);
            await refreshCart();
            return { success: true };
        } catch (error) {
            console.error('Error removing gift card:', error);
            return { success: false, message: error.Message || 'Failed to remove gift card' };
        }
    }, [cartId, refreshCart]);

    // ─── Derived values ───
    const cartCount = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    }, [cartItems]);

    const cartTotal = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            const price = item.specialPrice || item.unitPrice || item.price || 0;
            const quantity = item.quantity || 1;
            return sum + (price * quantity);
        }, 0);
    }, [cartItems]);

    const value = useMemo(() => ({
        cartItems,
        cartCount,
        cartTotal,
        cartSummary,
        isLoading,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        loadCart,
        getCartSummary,
        clearCart,
        applyCoupon,
        removeCoupon,
        applyGiftCard,
        removeGiftCard,
        applyBCoins,
        removeBCoins
    }), [cartItems, cartCount, cartTotal, cartSummary, isLoading, addToCart, removeFromCart, updateCartItemQuantity, loadCart, getCartSummary, clearCart, applyCoupon, removeCoupon, applyGiftCard, removeGiftCard, applyBCoins, removeBCoins]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
