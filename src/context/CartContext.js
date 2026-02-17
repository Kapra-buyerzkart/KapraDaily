import React, { createContext, useState, useContext, useCallback, useMemo, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { addToCartApi, removeFromCartApi, updateCartItemApi, getCartApi, getCartSummaryApi, clearCartApi, applyCouponApi, removeCouponApi, applyGiftCardApi, removeGiftCardApi, applyBCoinApi, removeBCoinApi } from '../api/cartService';
import { getAddressListApi, deleteAddressApi } from '../api/addressService';
import Toast from 'react-native-simple-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cartSummary, setCartSummary] = useState(null);
    const [cartId, setCartId] = useState(null);
    const cartIdRef = useRef(null);
    const [error, setError] = useState(null);

    // ─── Addresses State ───
    const [addresses, setAddresses] = useState([]);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);

    // ─── useRef for cartVersion so every callback always reads the LATEST value ───
    const cartVersionRef = useRef(null);
    const [cartVersion, setCartVersion] = useState(null); // kept for dependency tracking / re-renders
    const loadRequestRef = useRef(null);
    const summaryRequestRef = useRef(null);

    // Helper to update version in both ref and state
    const updateCartVersion = useCallback((newVersion) => {
        cartVersionRef.current = newVersion;
        setCartVersion(newVersion);
    }, []);

    useEffect(() => {
        loadCart();
        fetchAddresses();
    }, []);

    // ─── Addresses Logic ───
    const fetchAddresses = useCallback(async () => {
        setIsLoadingAddresses(true);
        try {
            const response = await getAddressListApi();
            console.log('📍 [ADDRESS] Raw API Response:', JSON.stringify(response, null, 2));

            // Handle both formats: data as array or data as object with items
            const addressList = Array.isArray(response?.data)
                ? response.data
                : response?.data?.items || response?.data || [];

            if (addressList.length > 0) {
                let selectionFound = false;
                const mappedAddresses = addressList.map(addr => {
                    const isSelected = addr.isDefaultShippingAddress && !selectionFound;
                    if (isSelected) selectionFound = true;

                    const validId = addr.custAddressId || addr.addressId || addr.id;
                    if (!validId) console.warn('⚠️ [ADDRESS] Found address with no ID:', addr);

                    // If mapping "raw", ensure it has the ID we expect for updates
                    const rawWithId = { ...addr, addressId: validId };

                    return {
                        id: validId,
                        type: addr.addressType || 'Home',
                        address: `${addr.addLine1}, ${addr.addLine2}${addr.landmark ? `, ${addr.landmark}` : ''}`,
                        phone: addr.phone,
                        pin: addr.pincode,
                        pincodeAreaId: addr.pincodeAreaId,
                        icon: addr.addressType?.toLowerCase() === 'home'
                            ? require('../assets/images/home_icon.png')
                            : require('../assets/images/office_icon.png'),
                        selected: isSelected,
                        threeDotsClicked: false,
                        raw: rawWithId
                    };
                }).filter(addr => {
                    if (!addr.id) {
                        console.warn('⚠️ [ADDRESS] Skipping address due to missing ID:', addr);
                        return false;
                    }
                    return true;
                });

                if (mappedAddresses.length > 0 && !selectionFound) {
                    mappedAddresses[0].selected = true;
                }
                console.log('📍 [ADDRESS] Mapped addresses:', mappedAddresses.length);
                setAddresses(mappedAddresses);
            } else {
                console.log('📍 [ADDRESS] No addresses found in response');
                setAddresses([]);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setIsLoadingAddresses(false);
        }
    }, []);

    // Auto-select the first address if none is selected
    useEffect(() => {
        if (addresses.length > 0 && !addresses.some(a => a.selected)) {
            setAddresses(prev => prev.map((addr, index) => ({
                ...addr,
                selected: index === 0
            })));
        }
    }, [addresses]);

    const onSelectAddress = useCallback((addressId) => {
        console.log('👆 [ADDRESS] Selecting addressId:', addressId);
        if (!addressId) {
            console.warn('⚠️ [ADDRESS] Attempted to select invalid addressId:', addressId);
            return;
        }
        setAddresses(prev =>
            prev.map(item => ({
                ...item,
                selected: String(item.id) === String(addressId)
            }))
        );
    }, []);

    const onThreeDotsClicked = useCallback((addressId) => {
        setAddresses(prev =>
            prev.map(item => ({ ...item, threeDotsClicked: item.id === addressId }))
        );
    }, []);

    const onDeleteClicked = useCallback(async (addressId) => {
        Alert.alert(
            "Delete Address",
            "Are you sure you want to delete this address?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await deleteAddressApi(addressId);
                            if (response?.success) {
                                setAddresses(prev => {
                                    const deletedItem = prev.find(item => item.id === addressId);
                                    const newList = prev.filter(item => item.id !== addressId);

                                    // If we deleted the selected address and have other addresses, select the first one
                                    if (deletedItem?.selected && newList.length > 0) {
                                        newList[0].selected = true;
                                    }
                                    return newList;
                                });
                                Toast.show('Address deleted successfully');
                            } else {
                                Toast.show(response?.message || 'Failed to delete address');
                            }
                        } catch (error) {
                            console.error('Error deleting address:', error);
                            Toast.show(typeof error === 'string' ? error : 'Failed to delete address');
                        }
                    }
                }
            ]
        );
    }, [deleteAddressApi]);

    const onCloseThreeDots = useCallback(() => {
        setAddresses(prev =>
            prev.map(item => ({ ...item, threeDotsClicked: false }))
        );
    }, []);

    // Ensure at least one address is selected if list is not empty
    useEffect(() => {
        if (addresses.length > 0) {
            const hasSelection = addresses.some(a => a.selected);
            if (!hasSelection) {
                console.log('🔄 [ADDRESS] No selected address found, auto-selecting first one');
                setAddresses(prev => {
                    if (prev.length === 0) return prev;
                    // Check again inside setAddresses to avoid race conditions with multiple updates
                    const currentSelection = prev.find(a => a.selected);
                    if (currentSelection) return prev;

                    const next = [...prev];
                    next[0] = { ...next[0], selected: true };
                    return next;
                });
            }
        }
    }, [addresses]);

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
                        cartIdRef.current = response.data.cart.cartId;
                    }
                    if (response.data.items) {
                        const items = Array.isArray(response.data.items) ? response.data.items : [];
                        // Normalize addedQty → quantity so all components can use item.quantity
                        const normalizedItems = items.map(item => ({
                            ...item,
                            quantity: item.quantity || item.addedQty || 1,
                        }));
                        setCartItems(normalizedItems);
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

    // After this call, cartVersionRef.current is always up-to-date.
    const getCartSummary = useCallback(async (deliveryMode = 'express', deliverySlotId = null, cartVersionOverride = null, pincodeAreaId = null, cartIdOverride = null) => {
        if (summaryRequestRef.current) {
            return summaryRequestRef.current;
        }

        const promise = (async () => {
            try {
                // Use override if provided (bootstrap from loadCart), otherwise use ref
                const versionToUse = cartVersionOverride || cartVersionRef.current;
                // Use ref for cartId to stabilize callback
                const idToUse = cartIdOverride || cartIdRef.current;
                console.log('📊 [SUMMARY] Calling with version:', versionToUse, 'cartId:', idToUse, 'pincodeAreaId:', pincodeAreaId);
                const response = await getCartSummaryApi(deliveryMode, deliverySlotId, versionToUse, idToUse, pincodeAreaId);
                console.log('📊 [SUMMARY] Response:', JSON.stringify(response, null, 2));

                if (response && response.success && response.data) {
                    setCartSummary(response.data);
                    setError(null);
                    if (response.data.cartVersion) {
                        updateCartVersion(response.data.cartVersion);
                        console.log('📊 [SUMMARY] Updated cartVersion to:', response.data.cartVersion);
                    }
                    if (response.data.cartId) {
                        setCartId(response.data.cartId);
                        cartIdRef.current = response.data.cartId;
                    }
                    return { success: true, data: response.data, cartVersion: response.data.cartVersion };
                } else {
                    setCartSummary(null);
                    setError(response?.message || 'Failed to fetch summary');
                    return {
                        success: false,
                        error: response?.message || 'Failed to fetch summary',
                        status: response?.status
                    };
                }
            } catch (error) {
                console.error('Error fetching cart summary:', error);
                setError('Error fetching cart summary');
                return { success: false, error };
            } finally {
                summaryRequestRef.current = null;
            }
        })();

        summaryRequestRef.current = promise;
        return promise;
    }, [updateCartVersion]);

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
            const itemId = String(productId);
            const existingItem = prevItems.find(i => {
                const cartProdId = String(i.productId || i.id);
                return cartProdId === itemId;
            });

            if (existingItem) {
                return prevItems.map(i => {
                    const cartProdId = String(i.productId || i.id);
                    return cartProdId === itemId ? { ...i, quantity: (i.quantity || 1) + 1 } : i;
                });
            }
            return [...prevItems, { ...item, productId, quantity: 1 }];
        });

        const rollback = () => {
            setCartItems(prevItems => {
                const existingItem = prevItems.find(i => String(i.productId || i.id) === String(productId));
                if (existingItem && existingItem.quantity > 1) {
                    return prevItems.map(i =>
                        String(i.productId || i.id) === String(productId) ? { ...i, quantity: i.quantity - 1 } : i
                    );
                }
                return prevItems.filter(i => String(i.productId || i.id) !== String(productId));
            });
        };

        try {
            const response = await addToCartApi(productId, 1);
            console.log('➕ [ADD TO CART] API Response:', JSON.stringify(response, null, 2));

            if (response && response.success === false) {
                if (response.status === 'INSUFFICIENT_STOCK' || response.message?.includes('stock')) {
                    Toast.show('Requested qty is not available', Toast.LONG);
                } else {
                    Toast.show(response.message || 'Failed to add to cart', Toast.SHORT);
                }
                rollback();
                await refreshCart();
                return;
            }

            // Toast.show('Item added to cart', Toast.SHORT);
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
        const identifierStr = String(identifier);
        const itemToRemove = cartItems.find(item =>
            String(item.cartItemId) === identifierStr ||
            String(item.productId || item.id) === identifierStr
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
            const cartItemIdStr = String(cartItemId);
            const updated = prevItems.map(item => {
                if (String(item.cartItemId || item.productId || item.id) === cartItemIdStr) {
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

            // Handle insufficient stock message from networkUtils throw or direct error object
            const errorMsg = typeof error === 'string' ? error : (error?.Message || error?.message || '');
            if (errorMsg.toLowerCase().includes('stock') || errorMsg.toLowerCase().includes('available')) {
                Toast.show('Requested qty is not available', Toast.LONG);
            }

            setCartItems(prevItems =>
                prevItems.map(item =>
                    String(item.cartItemId || item.productId || item.id) === String(cartItemId) ? { ...item, quantity: oldQuantity } : item
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
            const response = await clearCartApi(version, cartIdRef.current);
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
            const selectedAddress = addresses.find(a => a.selected);
            const pincodeAreaId = selectedAddress?.pincodeAreaId;

            const response = await applyCouponApi(couponCode, version, pincodeAreaId, cartIdRef.current);
            console.log('Coupon Applied:', response);
            if (response && response.success) {
                await refreshCart();
                return { success: true, message: response.message || 'Coupon applied successfully' };
            } else {
                return { success: false, message: response?.message || 'Failed to apply coupon', status: response?.status };
            }
        } catch (error) {
            console.error('Error applying coupon:', error);
            return { success: false, message: error.Message || error.message || 'Failed to apply coupon' };
        }
    }, [refreshCart]);

    // ─── removeCoupon ───
    const removeCoupon = useCallback(async () => {
        try {
            const version = cartVersionRef.current;
            const response = await removeCouponApi(version, cartIdRef.current);
            console.log('Coupon Removed:', response);
            await refreshCart();
            return { success: true };
        } catch (error) {
            console.error('Error removing coupon:', error);
            return { success: false, message: error.Message || 'Failed to remove coupon' };
        }
    }, [refreshCart]);

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
            const selectedAddress = addresses.find(a => a.selected);
            const pincodeAreaId = selectedAddress?.pincodeAreaId;

            const response = await applyGiftCardApi(giftCode, version, pincodeAreaId, cartIdRef.current);
            console.log('Gift Card Applied:', response);
            if (response && response.success) {
                await refreshCart();
                return { success: true, message: response.message || 'Gift card applied successfully' };
            } else {
                return { success: false, message: response?.message || 'Failed to apply gift card', status: response?.status };
            }
        } catch (error) {
            console.error('Error applying gift card:', error);
            return { success: false, message: error.Message || error.message || 'Failed to apply gift card' };
        }
    }, [refreshCart]);

    // ─── removeGiftCard ───
    const removeGiftCard = useCallback(async () => {
        try {
            const version = cartVersionRef.current;
            const response = await removeGiftCardApi(version, cartIdRef.current);
            console.log('Gift Card Removed:', response);
            await refreshCart();
            return { success: true };
        } catch (error) {
            console.error('Error removing gift card:', error);
            return { success: false, message: error.Message || 'Failed to remove gift card' };
        }
    }, [refreshCart]);

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
        error,
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
        removeBCoins,

        // Addresses
        addresses,
        isLoadingAddresses,
        fetchAddresses,
        onSelectAddress,
        onThreeDotsClicked,
        onDeleteClicked,
        onCloseThreeDots,
        showAddressModal,
        setShowAddressModal
    }), [cartItems, cartCount, cartTotal, cartSummary, isLoading, addToCart, removeFromCart, updateCartItemQuantity, loadCart, getCartSummary, clearCart, applyCoupon, removeCoupon, applyGiftCard, removeGiftCard, applyBCoins, removeBCoins, addresses, isLoadingAddresses, fetchAddresses, onSelectAddress, onThreeDotsClicked, onDeleteClicked, onCloseThreeDots, showAddressModal, setShowAddressModal]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
