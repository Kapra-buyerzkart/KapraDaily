import React, { createContext, useState, useContext, useCallback, useMemo, useRef, useEffect } from 'react';
import { addToCartApi, removeFromCartApi, updateCartItemApi, getCartApi, getCartSummaryApi, clearCartApi, applyCouponApi, removeCouponApi, applyGiftCardApi, removeGiftCardApi } from '../api/cartService';
import Toast from 'react-native-simple-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cartSummary, setCartSummary] = useState(null);
    const [cartVersion, setCartVersion] = useState(null);
    const [cartId, setCartId] = useState(null);
    const loadRequestRef = useRef(null);

    useEffect(() => {
        loadCart();
    }, []);
    const loadCart = useCallback(async () => {
        if (loadRequestRef.current) {
            return loadRequestRef.current;
        }

        setIsLoading(true);
        const promise = (async () => {
            try {
                const response = await getCartApi();
                console.log('🛒 [CART] API Response:', JSON.stringify(response, null, 2));
                if (response && response.data) {
                    if (response.data.cart && response.data.cart.cartVersion) {
                        setCartVersion(response.data.cart.cartVersion);
                    }
                    if (response.data.cart && response.data.cart.cartId) {
                        setCartId(response.data.cart.cartId);
                    }
                    if (response.data.items) {
                        // API returns { success: true, data: { items: [...] } }
                        const items = Array.isArray(response.data.items) ? response.data.items : [];
                        setCartItems(items);
                        console.log('🛒 [CART] Loaded cart items count:', items.length);
                        console.log('🛒 [CART] Cart items details:', items.map(item => ({
                            cartItemId: item.cartItemId,
                            productId: item.productId || item.id,
                            name: item.prName || item.productName || item.name,
                            quantity: item.quantity,
                            price: item.specialPrice || item.unitPrice || item.price
                        })));
                    } else {
                        console.log('🛒 [CART] No items in response, setting empty cart');
                        setCartItems([]);
                    }
                } else {
                    console.log('🛒 [CART] No items in response, setting empty cart');
                    setCartItems([]);
                }
            } catch (error) {
                console.error('🛒 [CART] Error loading cart:', error);
                setCartItems([]);
            } finally {
                setIsLoading(false);
                loadRequestRef.current = null;
            }
        })();

        loadRequestRef.current = promise;
        return promise;
    }, []);

    const addToCart = useCallback(async (item) => {
        const productId = item.productId || item.id;

        console.log('➕ [ADD TO CART] Adding product:', {
            productId,
            name: item.prName || item.productName || item.name,
            price: item.specialPrice || item.unitPrice || item.price,
            fullItem: item
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
                // Rollback optimistically added item
                rollback();
                await loadCart();
                return; // Exit without throwing error
            }

            Toast.show('Item added to cart', Toast.SHORT);
            await loadCart();
            await getCartSummary();
        } catch (error) {
            console.error('➕ [ADD TO CART] API Error:', error);
            rollback();
            await loadCart();
            await getCartSummary();
        }
    }, [loadCart, getCartSummary]);

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
            const response = await removeFromCartApi(cartItemId, cartVersion, removedItem?.productId || removedItem?.id);
            console.log('Removed from cart API:', response);
            await loadCart();
            await getCartSummary();
        } catch (error) {
            console.error('Error removing from cart API:', error);
            if (removedItem) {
                setCartItems(prevItems => [...prevItems, removedItem]);
            }
            await loadCart();
            await getCartSummary();
        }
    }, [cartItems, cartVersion, loadCart, getCartSummary]);

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
            const response = await updateCartItemApi(cartItemId, quantity, cartVersion);
            console.log('🔄 [UPDATE QTY] API Response:', JSON.stringify(response, null, 2));
            console.log('🔄 [UPDATE QTY] Reloading cart to sync with backend...');
            await loadCart();
            await getCartSummary();
        } catch (error) {
            console.error('🔄 [UPDATE QTY] API Error:', error);
            setCartItems(prevItems =>
                prevItems.map(item =>
                    (item.cartItemId || item.productId || item.id) === cartItemId ? { ...item, quantity: oldQuantity } : item
                )
            );
            await loadCart();
            await getCartSummary();
        }
    }, [loadCart, removeFromCart, cartVersion, getCartSummary]);
    const getCartSummary = useCallback(async (deliveryMode = 'express', deliverySlotId = null) => {
        try {
            const response = await getCartSummaryApi(deliveryMode, deliverySlotId, cartVersion, cartId);
            console.log('Cart Summary Response:', JSON.stringify(response, null, 2));
            if (response && response.data) {
                setCartSummary(response.data);
                if (response.data.cartVersion) {
                    setCartVersion(response.data.cartVersion);
                }
                if (response.data.cartId) {
                    setCartId(response.data.cartId);
                }
                return response.data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching cart summary:', error);
            return null;
        }
    }, [cartId, cartVersion]);

    const clearCart = useCallback(async () => {
        try {
            const previousItems = cartItems;
            setCartItems([]);
            setCartSummary(null);
            const response = await clearCartApi(cartVersion);
            console.log('Cart cleared:', response);
        } catch (error) {
            console.error('Error clearing cart:', error);
            setCartItems(previousItems);
            await loadCart();
        }
    }, [cartItems, loadCart, cartVersion]);

    const applyCoupon = useCallback(async (couponCode) => {
        try {
            const response = await applyCouponApi(couponCode, cartVersion, null, cartId);
            console.log('Coupon Applied:', response);
            await loadCart();
            await getCartSummary();
            return { success: true, message: 'Coupon applied successfully' };
        } catch (error) {
            console.error('Error applying coupon:', error);
            return { success: false, message: error.Message || 'Failed to apply coupon' };
        }
    }, [cartVersion, loadCart, cartId, getCartSummary]);

    const removeCoupon = useCallback(async () => {
        try {
            const response = await removeCouponApi(cartVersion, cartId);
            console.log('Coupon Removed:', response);
            await loadCart();
            await getCartSummary();
            return { success: true };
        } catch (error) {
            console.error('Error removing coupon:', error);
            return { success: false, message: error.Message || 'Failed to remove coupon' };
        }
    }, [cartVersion, loadCart, cartId, getCartSummary]);

    const applyGiftCard = useCallback(async (giftCode) => {
        try {
            const response = await applyGiftCardApi(giftCode, cartVersion, cartId);
            console.log('Gift Card Applied:', response);
            await loadCart();
            await getCartSummary();
            return { success: true, message: 'Gift card applied successfully' };
        } catch (error) {
            console.error('Error applying gift card:', error);
            return { success: false, message: error.Message || 'Failed to apply gift card' };
        }
    }, [cartVersion, loadCart, cartId, getCartSummary]);

    const removeGiftCard = useCallback(async () => {
        try {
            const response = await removeGiftCardApi(cartVersion, cartId);
            console.log('Gift Card Removed:', response);
            await loadCart();
            await getCartSummary();
            return { success: true };
        } catch (error) {
            console.error('Error removing gift card:', error);
            return { success: false, message: error.Message || 'Failed to remove gift card' };
        }
    }, [cartVersion, loadCart, cartId, getCartSummary]);

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
        removeGiftCard
    }), [cartItems, cartCount, cartTotal, cartSummary, isLoading, addToCart, removeFromCart, updateCartItemQuantity, loadCart, getCartSummary, clearCart, applyCoupon, removeCoupon, applyGiftCard, removeGiftCard]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
