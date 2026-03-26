import React, { createContext, useState, useContext, useCallback, useMemo, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from './appContext';
import Toast from 'react-native-simple-toast';
import { addToCartApi, removeFromCartApi, updateCartItemApi, getCartApi, getCartSummaryApi, clearCartApi, applyCouponApi, removeCouponApi, applyGiftCardApi, removeGiftCardApi, applyBCoinApi, removeBCoinApi } from '../api/cartService';
import { getAddressListApi, deleteAddressApi } from '../api/addressService';
import ConfirmationModal from '../components/ConfirmationModal';
import StatusModal from '../components/StatusModal';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cartSummary, setCartSummary] = useState(null);
    const [isStoreUnavailable, setIsStoreUnavailable] = useState(false);
    const [storeUnavailableData, setStoreUnavailableData] = useState({ image: null, text: '' });
    const [serviceabilityTrigger, setServiceabilityTrigger] = useState(false);
    const [hasAlertedServiceability, setHasAlertedServiceability] = useState(false);
    const [cartId, setCartId] = useState(null);
    const cartIdRef = useRef(null);
    const [error, setError] = useState(null);
    const [updatingItems, setUpdatingItems] = useState([]); // [cartItemId1, cartItemId2, ...]
    const debounceTimersRef = useRef({});

    // ─── Addresses State ───
    const [addresses, setAddresses] = useState([]);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressConfirmationData, setAddressConfirmationData] = useState(null);
    const [confirmationConfig, setConfirmationConfig] = useState(null);
    const [statusConfig, setStatusConfig] = useState(null);

    // ─── useRef for cartVersion so every callback always reads the LATEST value ───
    const cartVersionRef = useRef(null);
    const [cartVersion, setCartVersion] = useState(null); // kept for dependency tracking / re-renders
    const loadRequestRef = useRef(null);
    const summaryRequestRef = useRef(null);
    const failedPincodesRef = useRef(new Set());

    // Helper to update version in both ref and state
    const updateCartVersion = useCallback((newVersion) => {
        cartVersionRef.current = newVersion;
        setCartVersion(newVersion);
    }, []);

    const { profile, editPincode } = useContext(AppContext);
    const lastPincodeRef = useRef(profile?.pincode);
    const lastUserIdRef = useRef(profile?.custId || profile?.id || null);

    useEffect(() => {
        loadCart();
        fetchAddresses();
    }, []);

    // ─── User Switch Sync: Clear and reload cart when user identity changes ───
    useEffect(() => {
        const currentUserId = profile?.custId || profile?.id || null;
        if (lastUserIdRef.current !== null && currentUserId !== lastUserIdRef.current) {
            console.log('👤 [CART] User changed, resetting cart:', lastUserIdRef.current, '->', currentUserId);
            // Immediately clear stale in-memory data from previous user
            setCartItems([]);
            setCartSummary(null);
            setCartId(null);
            cartIdRef.current = null;
            updateCartVersion(null);
            setAddresses([]);
            setError(null);
            // Fetch fresh data for the new user
            loadCart();
            fetchAddresses();
        }
        lastUserIdRef.current = currentUserId;
    }, [profile?.custId, profile?.id]);

    // ─── Location Sync: Refresh cart when pincode changes ───
    useEffect(() => {
        const currentPincode = profile?.pincode;
        if (currentPincode !== lastPincodeRef.current) {
            console.log('📍 [CART] Location changed, refreshing cart:', lastPincodeRef.current, '->', currentPincode);
            lastPincodeRef.current = currentPincode;
            refreshCart();
        }
    }, [profile?.pincode, refreshCart]);

    const showConfirmation = useCallback((config) => {
        setConfirmationConfig(config);
    }, []);

    const showStatus = useCallback((config) => {
        setStatusConfig(config);
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
                const storedSelectedId = await AsyncStorage.getItem('selectedAddressId');

                let selectionFound = false;
                const mappedAddresses = addressList.map(addr => {
                    const validId = addr.custAddressId || addr.addressId || addr.id;
                    if (!validId) console.warn('⚠️ [ADDRESS] Found address with no ID:', addr);

                    let isSelected = false;
                    if (storedSelectedId && String(validId) === storedSelectedId) {
                        isSelected = true;
                        selectionFound = true;
                    }

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
                    // Do not auto-select address if none is selected
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

    // Auto-select address removed

    const onSelectAddress = useCallback(async (addressId, showConfirmationPopup = true) => {
        console.log('👆 [ADDRESS] Selecting addressId:', addressId, 'showConfirmationPopup:', showConfirmationPopup);
        if (!addressId) {
            console.warn('⚠️ [ADDRESS] Attempted to select invalid addressId:', addressId);
            return;
        }

        try {
            await AsyncStorage.setItem('selectedAddressId', String(addressId));
        } catch (e) {
            console.log('Error saving selectedAddressId', e);
        }

        const selectedAddr = addresses.find(item => String(item.id) === String(addressId));
        if (!selectedAddr) {
            console.warn('⚠️ [ADDRESS] Selected address not found in local list:', addressId);
            return;
        }

        // 1. Update the local address highlights (Pure state update)
        setHasAlertedServiceability(false); // Reset so new address can show its own alert if bad
        setAddresses(prev => prev.map(item => ({
            ...item,
            selected: String(item.id) === String(addressId)
        })));

        // 2. Performance side-effects (Validation or Refresh)
        if (showConfirmationPopup) {
            const pincode = selectedAddr.pin || '';
            const area = selectedAddr.raw?.areaName || selectedAddr.raw?.pincodeAreaName || selectedAddr.raw?.area_name || 'N/A';

            setShowAddressModal(false);

            try {
                // Fetch summary for the NEW pincode to check server-side serviceability
                let res = await getCartSummaryApi(undefined, undefined, cartVersionRef.current, cartIdRef.current, selectedAddr.pincodeAreaId);
                console.log('👆 [ADDRESS] Selection Validation Response:', JSON.stringify(res, null, 2));

                // Handle concurrency failure (cart was modified elsewhere)
                if (res?.success === false && String(res?.message).toLowerCase().includes('modified')) {
                    console.log('🔄 [ADDRESS] Concurrency failure during validation. Retrying with fresh load...');
                    const loadRes = await loadCart();
                    res = await getCartSummaryApi(undefined, undefined, loadRes?.cartVersion, cartIdRef.current, selectedAddr.pincodeAreaId);
                }

                const isUnserviceable = (res?.success === false || res?.status === 'STORE_NOT_FOUND' || res?.status === 'STORE_CLOSED_FOR_DELIVERY');

                // Small delay to allow AddressModal to close on Native before potentially showing AddressConfirmationModal
                setTimeout(() => {
                    if (isUnserviceable) {
                        const msg = res?.message || "Delivery currently not available in this area.";
                        setError(msg);
                        setServiceabilityTrigger(true);
                        setHasAlertedServiceability(true);
                        setAddressConfirmationData({
                            pincode,
                            areaName: area,
                            isServiceable: false,
                            unavailableMessage: msg
                        });
                    } else {
                        setError(null);
                        setServiceabilityTrigger(false);
                        setHasAlertedServiceability(false);
                        setAddressConfirmationData({ pincode, areaName: area, isServiceable: true });
                        // Trigger full cart items and summary refresh for the new address
                        refreshCart(selectedAddr.pincodeAreaId);
                    }
                }, 400);
            } catch (err) {
                console.error('Validation error in onSelectAddress:', err);
                const errorMsg = typeof err === 'string' ? err : (err?.message || "");
                setTimeout(() => {
                    setError(errorMsg);
                    setServiceabilityTrigger(true);
                    setHasAlertedServiceability(true);
                    setAddressConfirmationData({
                        pincode,
                        areaName: area,
                        isServiceable: false,
                        unavailableMessage: errorMsg || "Failed to validate address. Please try again."
                    });
                }, 400);
            }
        } else {
            refreshCart(selectedAddr.pincodeAreaId);
        }
    }, [addresses, refreshCart]);
    /* Note: getCartSummaryApi is imported at top of file */

    const onThreeDotsClicked = useCallback((addressId) => {
        setAddresses(prev =>
            prev.map(item => ({ ...item, threeDotsClicked: item.id === addressId }))
        );
    }, []);

    const onDeleteClicked = useCallback(async (addressId) => {
        // Close the AddressModal first if it's open to avoid modal collision on iOS
        setShowAddressModal(false);

        // Slight delay to allow AddressModal to close before showing confirmation
        setTimeout(() => {
            showConfirmation({
                title: "Delete Address",
                message: "Are you sure you want to delete this address?",
                confirmText: "Delete",
                onConfirm: async () => {
                    try {
                        const response = await deleteAddressApi(addressId);
                        if (response?.success) {
                            setAddresses(prev => {
                                const deletedItem = prev.find(item => item.id === addressId);
                                const newList = prev.filter(item => item.id !== addressId);

                                if (deletedItem?.selected && newList.length > 0) {
                                    newList[0].selected = true;
                                }
                                return newList;
                            });
                            Toast.show('Address deleted successfully');
                        } else {
                            showStatus({
                                type: 'error',
                                title: 'Error',
                                message: response?.message || 'Failed to delete address'
                            });
                        }
                    } catch (error) {
                        console.error('Error deleting address:', error);
                        showStatus({
                            type: 'error',
                            title: 'Error',
                            message: typeof error === 'string' ? error : 'Failed to delete address'
                        });
                    }
                }
            });
        }, 400);
    }, [deleteAddressApi, showConfirmation, showStatus]);


    const onCloseThreeDots = useCallback(() => {
        setAddresses(prev =>
            prev.map(item => ({ ...item, threeDotsClicked: false }))
        );
    }, []);

    // Ensure at least one address is selected removed

    const clearSelectedAddress = useCallback(async () => {
        try {
            await AsyncStorage.removeItem('selectedAddressId');
        } catch (e) {
            console.log('Error clearing selectedAddressId', e);
        }
        setAddresses(prev => prev.map(item => ({ ...item, selected: false })));
    }, []);

    // ─── loadCart: fetches item list and returns cartVersion (bootstrap only) ───
    const loadCart = useCallback(async (pincodeAreaIdOverride) => {
        if (loadRequestRef.current) {
            return loadRequestRef.current;
        }

        setIsLoading(true);
        const promise = (async () => {
            try {
                const response = await getCartApi(pincodeAreaIdOverride);
                console.log('🛒 [CART] API Response:', JSON.stringify(response, null, 2));
                let fetchedCartVersion = null;
                if (response && response.data) {
                    if (response.data.cart && response.data.cart.cartVersion) {
                        fetchedCartVersion = response.data.cart.cartVersion;
                        // Always keep the ref up-to-date so coupon/gift card apply calls have the latest version
                        updateCartVersion(fetchedCartVersion);
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

                if (response && (response.status === 'STORE_NOT_FOUND' || response.status === 'STORE_CLOSED_FOR_DELIVERY')) {
                    setError(response.message || 'Store not available for this area');
                    if (!hasAlertedServiceability) {
                        setServiceabilityTrigger(true);
                        setHasAlertedServiceability(true);
                    }
                } else {
                    setError(null);
                    setServiceabilityTrigger(false);
                    // Clear failed pincodes on success
                    failedPincodesRef.current.clear();
                }
                return { success: true, cartVersion: fetchedCartVersion };
            } catch (error) {
                console.error('🛒 [CART] Error loading cart:', error);
                setCartItems([]);
                setError(error?.message || error || 'Store not found for this area');
                return { success: false, error };
            } finally {
                setIsLoading(false);
                loadRequestRef.current = null;
            }
        })();

        loadRequestRef.current = promise;
        return promise;
    }, [updateCartVersion]);

    // After this call, cartVersionRef.current is always up-to-date.
    const getCartSummary = useCallback(async (deliveryMode = 'express', deliverySlotId = null, cartVersionOverride = null, pincodeAreaId = null, cartIdOverride = null, isAutoReload = false) => {
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

                    if (response.status === 'STORE_NOT_FOUND' || response.status === 'STORE_CLOSED_FOR_DELIVERY') {
                        setError(response.message || 'Store not available for this area');
                        if (!hasAlertedServiceability) {
                            setServiceabilityTrigger(true);
                            setHasAlertedServiceability(true);
                        }
                    } else {
                        setError(null);
                        setServiceabilityTrigger(false);
                        failedPincodesRef.current.clear();
                    }

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
                    const errorMsg = response?.message || 'Failed to fetch summary';
                    const status = response?.status;

                    if (errorMsg.toLowerCase().includes('cart not found') || status === 'CART_NOT_FOUND') {
                        console.log('🔄 [SUMMARY] Cart not found/expired. Resetting local cart...');
                        setCartId(null);
                        cartIdRef.current = null;
                        updateCartVersion(null);
                        setCartItems([]);
                        setCartSummary(null);
                        // Trigger a fresh load to recover
                        setTimeout(() => loadCart(), 100);
                        return { success: false, error: 'Your cart session has expired. Refreshing...', status: 'CART_NOT_FOUND' };
                    }

                    if (!isAutoReload && errorMsg.toLowerCase().includes('modified')) {
                        console.log('🔄 [SUMMARY] Cart modified error caught. Auto-reloading...');
                        setTimeout(async () => {
                            const loadResult = await loadCart();
                            const newListVersion = loadResult?.cartVersion;
                            await getCartSummary(deliveryMode, deliverySlotId, newListVersion, pincodeAreaId, cartIdOverride, true);
                        }, 0);

                        setCartSummary(null);
                        setError(null);
                        return { success: false, error: 'Auto-reloading...', status };
                    }

                    // Special case for serviceability - don't show generic error toast if it's a known non-serviceable status
                    // but we still set the error state so the BillSection can show it or components can react
                    setCartSummary(null);
                    setError(errorMsg);

                    if (status === 'STORE_NOT_FOUND' || status === 'STORE_CLOSED_FOR_DELIVERY' ||
                        errorMsg.toLowerCase().includes('no store') ||
                        errorMsg.toLowerCase().includes('not found') ||
                        errorMsg.toLowerCase().includes('closed for delivery')) {
                        if (!hasAlertedServiceability) {
                            setServiceabilityTrigger(true);
                            setHasAlertedServiceability(true);
                        }
                    }

                    return {
                        success: false,
                        error: errorMsg,
                        status: status
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
    }, [updateCartVersion, loadCart]);

    // ─── refreshCart: re-fetches items and summary (Parallelized for speed) ───
    const refreshCart = useCallback(async (pincodeAreaIdOverride) => {
        const selectedAddress = addresses.find(a => a.selected);
        const pincodeAreaId = pincodeAreaIdOverride !== undefined ? pincodeAreaIdOverride : selectedAddress?.pincodeAreaId;

        console.log('🔄 [CART] Refreshing items and summary in parallel...');
        // We run these in parallel. NOTE: getCartSummary uses cartVersionRef.current.
        // If loadCart updates the version, there might be a race.
        // However, most of the time we just need both to finish.
        await Promise.all([
            loadCart(pincodeAreaId),
            getCartSummary('express', null, null, pincodeAreaId)
        ]);
    }, [loadCart, getCartSummary, addresses]);

    const handleStoreNotFound = useCallback(async () => {
        if (!serviceabilityTrigger) return;
        // The trigger informs the screen to show the AddressConfirmationModal
        console.log('📍 [CART] Serviceability trigger activated');
    }, [serviceabilityTrigger]);

    useEffect(() => {
        if (serviceabilityTrigger) {
            handleStoreNotFound();
        }
    }, [serviceabilityTrigger, handleStoreNotFound]);

    // ─── addToCart ───
    const addToCart = useCallback(async (item, pincodeAreaIdOverride = null) => {
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
            const response = await addToCartApi(productId, 1, pincodeAreaIdOverride || profile?.pincode);
            console.log('➕ [ADD TO CART] API Response:', JSON.stringify(response, null, 2));

            if (response && response.success === false) {
                rollback();
                const isStoreNotFound = error && (String(error).toLowerCase().includes('store not found') || error?.message?.toLowerCase().includes('store not found'));
                if (response.status === 'INSUFFICIENT_STOCK' || response.message?.includes('stock')) {
                    if (!isStoreNotFound) {
                        Toast.show('Requested qty is not available', Toast.LONG);
                    }
                } else if (!response.message?.toLowerCase().includes('modified')) {
                    if (!isStoreNotFound) {
                        Toast.show(response.message || 'Failed to add to cart', Toast.SHORT);
                    }
                }
                await refreshCart();
                return;
            }

            // Toast.show('Item added to cart', Toast.SHORT);
            await refreshCart(pincodeAreaIdOverride || profile?.pincode);
        } catch (error) {
            console.error('➕ [ADD TO CART] API Error:', error);
            const errorMsg = typeof error === 'string' ? error : (error?.Message || error?.message || '');
            const isStoreNotFound = error && (String(error).toLowerCase().includes('store not found') || error?.message?.toLowerCase().includes('store not found'));
            const isStockError = errorMsg.toLowerCase().includes('stock') || errorMsg.toLowerCase().includes('available');

            if (isStockError && !isStoreNotFound) {
                Toast.show('Requested qty is not available', Toast.LONG);
            } else if (errorMsg && !isStoreNotFound) {
                // Generic error only if not store not found
                // Toast.show(errorMsg, Toast.SHORT);
            }

            rollback();
            await refreshCart(pincodeAreaIdOverride || profile?.pincode);
        }
    }, [refreshCart]);

    // ─── removeFromCart ───
    const removeFromCart = useCallback(async (identifier, pincodeAreaIdOverride = null) => {
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
        setCartItems(prevItems => {
            const newItems = prevItems.filter(item => item !== removedItem);
            if (newItems.length === 0) {
                // If cart is emptied manually, also void the selected address just like in clearCart
                try {
                    AsyncStorage.removeItem('selectedAddressId');
                    setAddresses(prev => prev.map(a => ({ ...a, selected: false })));
                } catch (e) {
                    console.log('Error removing selectedAddressId', e);
                }
            }
            return newItems;
        });

        console.log('Removed from cart local:', cartItemId);

        try {
            const version = cartVersionRef.current;
            const response = await removeFromCartApi(cartItemId, version, removedItem?.productId || removedItem?.id, pincodeAreaIdOverride);
            console.log('Removed from cart API:', response);
            await refreshCart(pincodeAreaIdOverride);
        } catch (error) {
            console.error('Error removing from cart API:', error);
            if (removedItem) {
                setCartItems(prevItems => [...prevItems, removedItem]);
            }
            await refreshCart(pincodeAreaIdOverride);
        }
    }, [cartItems, refreshCart]);

    // ─── updateCartItemQuantity (Debounced per item) ───
    const updateCartItemQuantity = useCallback(async (cartItemId, quantity, pincodeAreaIdOverride = null) => {
        const cartItemIdStr = String(cartItemId);
        console.log('🔄 [UPDATE QTY] Requested:', { cartItemId: cartItemIdStr, newQuantity: quantity });

        if (quantity <= 0) {
            console.log('🔄 [UPDATE QTY] Quantity is 0, removing item');
            return removeFromCart(cartItemId);
        }

        let oldQuantity = 1;
        // 1. Optimistic UI update for quantity text
        setCartItems(prevItems => {
            const updated = prevItems.map(item => {
                if (String(item.cartItemId || item.productId || item.id) === cartItemIdStr) {
                    oldQuantity = item.quantity || 1;
                    return { ...item, quantity };
                }
                return item;
            });
            return updated;
        });

        // 2. Debounce the API call
        if (debounceTimersRef.current[cartItemIdStr]) {
            clearTimeout(debounceTimersRef.current[cartItemIdStr]);
        }

        setUpdatingItems(prev => [...prev, cartItemIdStr]);

        debounceTimersRef.current[cartItemIdStr] = setTimeout(async () => {
            try {
                const version = cartVersionRef.current;
                const response = await updateCartItemApi(cartItemId, quantity, version, null, pincodeAreaIdOverride);
                console.log('🔄 [UPDATE QTY] API Response:', JSON.stringify(response, null, 2));

                if (response && response.success) {
                    // Update version immediately if returned
                    if (response.data?.cart?.cartVersion) {
                        updateCartVersion(response.data.cart.cartVersion);
                    }
                    await refreshCart(pincodeAreaIdOverride);
                } else if (response && response.message) {
                    throw response.message;
                }
            } catch (error) {
                console.error('🔄 [UPDATE QTY] API Error:', error);
                const errorMsg = typeof error === 'string' ? error : (error?.Message || error?.message || '');
                const isStoreNotFound = error && (String(error).toLowerCase().includes('store not found') || error?.message?.toLowerCase().includes('store not found'));

                if ((errorMsg.toLowerCase().includes('stock') || errorMsg.toLowerCase().includes('available')) && !isStoreNotFound) {
                    Toast.show('Requested qty is not available', Toast.LONG);
                }

                // Rollback on error
                setCartItems(prevItems =>
                    prevItems.map(item =>
                        String(item.cartItemId || item.productId || item.id) === cartItemIdStr ? { ...item, quantity: oldQuantity } : item
                    )
                );
                await refreshCart(pincodeAreaIdOverride);
            } finally {
                setUpdatingItems(prev => prev.filter(id => id !== cartItemIdStr));
                delete debounceTimersRef.current[cartItemIdStr];
            }
        }, 500); // 500ms debounce
    }, [removeFromCart, refreshCart, updateCartVersion]);

    // ─── clearCart ───
    const clearCart = useCallback(async () => {
        const previousItems = cartItems;
        try {
            setCartItems([]);
            setCartSummary(null);

            // Also clear the persistently selected address on checkout completion
            try {
                await AsyncStorage.removeItem('selectedAddressId');
                setAddresses(prev => prev.map(item => ({ ...item, selected: false })));
            } catch (clearErr) {
                console.log('Error clearing selectedAddressId', clearErr);
            }

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
            if (response && (response.success === true || response.status === 'OK')) {
                await refreshCart();
                return { success: true, message: response.message || 'Coupon applied successfully' };
            } else {
                const msg = response?.message || 'Failed to apply coupon';
                if (msg.toLowerCase().includes('modified')) {
                    console.log('🔄 [CART] Auto-refreshing cart due to modified error in applyCoupon');
                    await refreshCart();
                }
                return { success: false, message: msg, status: response?.status };
            }
        } catch (error) {
            console.error('Error applying coupon:', error);
            const msg = error.Message || error.message || 'Failed to apply coupon';
            if (msg.toLowerCase().includes('modified') || error?.response?.data?.status === 'CART_VERSION_MISMATCH') {
                console.log('🔄 [CART] Auto-refreshing cart due to modified error in applyCoupon catch');
                await refreshCart();
            }
            return { success: false, message: msg };
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
            const response = await applyBCoinApi(bcoins, version, cartIdRef.current);
            console.log('🪙 [BCOIN] Applied:', response);
            if (response && response.success) {
                await refreshCart();
                return { success: true, message: response.message || 'B-Coins applied successfully' };
            } else {
                if (msg?.toLowerCase().includes('modified')) {
                    console.log('🚫 [CART] Suppressing modified Toast:', msg);
                } else {
                    Toast.show(msg, Toast.LONG);
                }
                return { success: false, message: msg };
            }
        } catch (error) {
            console.error('Error applying BCoins:', error);
            if (error?.response?.data?.status === 'CART_VERSION_MISMATCH') {
                await refreshCart();
            }
            if (msg?.toLowerCase().includes('modified')) {
                console.log('🚫 [CART] Suppressing modified Toast:', msg);
            } else {
                Toast.show(msg, Toast.LONG);
            }
            return { success: false, message: msg };
        }
    }, [refreshCart]);

    // ─── removeBCoins ───
    const removeBCoins = useCallback(async () => {
        try {
            const version = cartVersionRef.current;
            console.log('🪙 [BCOIN] Removing with version:', version);
            const response = await removeBCoinApi(version, cartIdRef.current);
            console.log('🪙 [BCOIN] Removed:', response);
            if (response && response.success) {
                await refreshCart();
                return { success: true };
            } else {
                if (msg?.toLowerCase().includes('modified')) {
                    console.log('🚫 [CART] Suppressing modified Toast:', msg);
                } else {
                    Toast.show(msg, Toast.LONG);
                }
                return { success: false, message: msg };
            }
        } catch (error) {
            console.error('Error removing BCoins:', error);
            if (error?.response?.data?.status === 'CART_VERSION_MISMATCH') {
                await refreshCart();
            }
            if (msg?.toLowerCase().includes('modified')) {
                console.log('🚫 [CART] Suppressing modified Toast:', msg);
            } else {
                Toast.show(msg, Toast.LONG);
            }
            return { success: false, message: msg };
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
            if (response && (response.success === true || response.status === 'OK')) {
                await refreshCart();
                return { success: true, message: response.message || 'Gift card applied successfully' };
            } else {
                const msg = response?.message || 'Failed to apply gift card';
                if (msg.toLowerCase().includes('modified')) {
                    console.log('🔄 [CART] Auto-refreshing cart due to modified error in applyGiftCard');
                    await refreshCart();
                }
                return { success: false, message: msg, status: response?.status };
            }
        } catch (error) {
            console.error('Error applying gift card:', error);
            const msg = error.Message || error.message || 'Failed to apply gift card';
            if (msg.toLowerCase().includes('modified') || error?.response?.data?.status === 'CART_VERSION_MISMATCH') {
                console.log('🔄 [CART] Auto-refreshing cart due to modified error in applyGiftCard catch');
                await refreshCart();
            }
            return { success: false, message: msg };
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
        refreshCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        applyGiftCard,
        removeGiftCard,
        applyBCoins,
        removeBCoins,
        updatingItems,

        // Addresses
        addresses,
        isLoadingAddresses,
        fetchAddresses,
        onSelectAddress,
        onThreeDotsClicked,
        onDeleteClicked,
        onCloseThreeDots,
        clearSelectedAddress,
        showAddressModal,
        setShowAddressModal,
        addressConfirmationData,
        setAddressConfirmationData,
        showConfirmation,
        showStatus,
        serviceabilityTrigger,
        setServiceabilityTrigger
    }), [cartItems, cartCount, cartTotal, cartSummary, isLoading, error, addToCart, removeFromCart, updateCartItemQuantity, loadCart, getCartSummary, refreshCart, clearCart, applyCoupon, removeCoupon, applyGiftCard, removeGiftCard, applyBCoins, removeBCoins, updatingItems, addresses, isLoadingAddresses, fetchAddresses, onSelectAddress, onThreeDotsClicked, onDeleteClicked, onCloseThreeDots, clearSelectedAddress, showAddressModal, setShowAddressModal, addressConfirmationData, setAddressConfirmationData, showConfirmation, showStatus, serviceabilityTrigger, setServiceabilityTrigger]);

    return (
        <CartContext.Provider value={value}>
            {children}
            {confirmationConfig && (
                <ConfirmationModal
                    visible={!!confirmationConfig}
                    onClose={() => setConfirmationConfig(null)}
                    onConfirm={confirmationConfig.onConfirm}
                    title={confirmationConfig.title}
                    message={confirmationConfig.message}
                    confirmText={confirmationConfig.confirmText}
                    cancelText={confirmationConfig.cancelText}
                />
            )}
            {statusConfig && (
                <StatusModal
                    visible={!!statusConfig}
                    type={statusConfig.type}
                    title={statusConfig.title}
                    message={statusConfig.message}
                    onClose={() => {
                        statusConfig.onClose?.();
                        setStatusConfig(null);
                    }}
                />
            )}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
