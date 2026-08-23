import React, { createContext, useContext, useState, useMemo, ReactNode, useCallback, useEffect } from 'react';
import { getCartApi, getCartSummaryApi, clearCartApi } from '../api/services/cartService';
import { getAddressListApi, deleteAddressApi } from '../api/services/addressService';
import { Alert } from 'react-native';
import Toast from 'react-native-simple-toast';
import CONFIG from '../globals/config';
import { useUser } from './UserContext';

export interface CartItem {
    cartItemId: number;
    productId: number;
    productName: string;
    productImage: string;
    quantity: number;
    unitPrice: number;
    specialPrice?: number;
    mrp?: number;
    totalBtokens?: number;
    [key: string]: any;
}

interface CartContextType {
    cartItems: CartItem[];
    cartSummary: any | null;
    cartCount: number;
    cartTotal: number;
    error: string | null;
    loadCart: () => Promise<any>;
    getCartSummary: (deliveryMode?: string, deliverySlotId?: any, cartVersion?: any, couponCode?: any, pincodeAreaId?: any) => Promise<any>;
    clearCart: () => Promise<void>;
    addresses: any[];
    fetchAddresses: () => Promise<void>;
    isLoadingAddresses: boolean;
    onSelectAddress: (id: string | number, showConfirmation: boolean) => void;
    onThreeDotsClicked: (id: string | number) => void;
    onCloseThreeDots: () => void;
    onDeleteClicked: (id: string | number) => void;
    addressConfirmationData: any;
    setAddressConfirmationData: (data: any) => void;
    [key: string]: any;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { profile } = useUser();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartSummary, setCartSummary] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
    const [addressConfirmationData, setAddressConfirmationData] = useState<any>(null);
    const cartSummaryRef = React.useRef<any>(null);

    const loadCart = useCallback(async () => {
        try {
            const response = await getCartApi();

            if (response && response.success && response.data) {
                const items = response.data.items || [];
                const mappedItems = items.map((item: any) => ({
                    ...item,
                    productName: item.prName || item.productName,
                    productImage: item.featuredImage ? `${CONFIG.image_base_url}${item.featuredImage}` : (item.productImage || ''),
                    quantity: item.addedQty || item.quantity || 0,
                }));
                setCartItems(mappedItems);

                const cartId = response.data.cartId ?? response.data.cart?.cartId ?? response.data.id ?? response.data.cart?.id;
                const cartVersion = response.data.cartVersion ?? response.data.cart?.cartVersion ?? response.data.version ?? response.data.cart?.version;

                if (cartId !== undefined && cartId !== null || cartVersion) {
                    cartSummaryRef.current = {
                        ...(cartSummaryRef.current || {}),
                        ...(cartVersion && { cartVersion }),
                        ...((cartId !== undefined && cartId !== null) && { cartId }),
                    };
                    setCartSummary((prev: any) => ({
                        ...(prev || {}),
                        ...(cartVersion && { cartVersion }),
                        ...((cartId !== undefined && cartId !== null) && { cartId }),
                    }));
                }
                return response.data;
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load cart');
        }
        return null;
    }, []);

    const getCartSummary = useCallback(async (deliveryMode = 'express', deliverySlotId = null, cartVersion = null, couponCode = null, pincodeAreaId = null) => {
        const versionToUse = cartVersion || cartSummaryRef.current?.cartVersion;
        const cartIdToUse = cartSummaryRef.current?.cartId;
        try {
            const response = await getCartSummaryApi(deliveryMode, deliverySlotId, versionToUse, cartIdToUse, pincodeAreaId);
            if (response && response.success) {
                setCartSummary(response.data);
                cartSummaryRef.current = response.data;
                return response;
            } else {
                setError(response?.message || 'Failed to get cart summary');
                return response;
            }
        } catch (err: any) {
            setError(err.message || 'Error occurred while fetching summary');
        }
        return null;
    }, []);

    const clearCart = useCallback(async () => {
        try {
            await clearCartApi(cartSummaryRef.current?.cartVersion);
            setCartItems([]);
            setCartSummary(null);
            cartSummaryRef.current = null;
        } catch (err: any) {
            setError(err.message || 'Failed to clear cart');
        }
    }, []);

    const fetchAddresses = useCallback(async () => {
        try {
            setIsLoadingAddresses(true);
            const response = await getAddressListApi();
            if (response && response.success && Array.isArray(response.data)) {
                const formatted = response.data.map((addr: any, index: number) => {
                    const actualId = addr.custAddressId ?? addr.addressId ?? addr.id ?? index;
                    return {
                        id: actualId,
                        type: addr.addressType === 'HOME' ? 'Home'
                            : addr.addressType === 'OFFICE' ? 'Office'
                                : addr.addressType || 'Other',
                        address: [addr.addLine1, addr.addLine2, addr.landmark, addr.pincodeAreaName || addr.areaName].filter(Boolean).join(', '),
                        phone: addr.phone || '',
                        pin: addr.pincode || '',
                        selected: addr.isDefaultShippingAddress || false,
                        threeDotsClicked: false,
                        pincodeAreaId: addr.pincodeAreaId,
                        raw: addr,
                    };
                });
                setAddresses(formatted);
            }
        } catch (error) {
            console.error('Error refreshing addresses:', error);
        } finally {
            setIsLoadingAddresses(false);
        }
    }, []);

    const onSelectAddress = useCallback((id: string | number, showConfirmation: boolean) => {
        setAddresses(prev =>
            prev.map(addr => ({
                ...addr,
                selected: addr.id === id,
                threeDotsClicked: false,
            }))
        );
        const selectedAddr = addresses.find(a => a.id === id);
        if (selectedAddr && showConfirmation) {
            setAddressConfirmationData({
                pincode: selectedAddr.pin,
                areaName: selectedAddr.raw?.pincodeAreaName || '',
                isServiceable: true,
                isPlacingOrder: false,
            });
        }
    }, [addresses]);

    const onThreeDotsClicked = useCallback((id: string | number) => {
        setAddresses(prev =>
            prev.map(addr => ({
                ...addr,
                threeDotsClicked: addr.id === id,
            }))
        );
    }, []);

    const onCloseThreeDots = useCallback(() => {
        setAddresses(prev =>
            prev.map(addr => ({
                ...addr,
                threeDotsClicked: false,
            }))
        );
    }, []);

    const onDeleteClicked = useCallback((id: string | number) => {
        Alert.alert(
            'Delete Address',
            'Are you sure you want to delete this address?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await deleteAddressApi(id);
                            if (response && response.success !== false) {
                                Toast.show('Address deleted', Toast.SHORT);
                                await fetchAddresses();
                            } else {
                                Toast.show(response?.message || 'Failed to delete', Toast.SHORT);
                            }
                        } catch (error) {
                            console.error('Error deleting address:', error);
                            Toast.show('Error deleting address', Toast.SHORT);
                        }
                    },
                },
            ]
        );
    }, [fetchAddresses]);

    useEffect(() => {
        if (profile) {
            loadCart();
        } else {
            setCartItems([]);
            setCartSummary(null);
        }
    }, [profile, loadCart]);

    const cartCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);
    const cartTotal = useMemo(() => cartSummary?.grandTotal || 0, [cartSummary]);

    return (
        <CartContext.Provider value={{
            cartItems,
            cartSummary,
            cartCount,
            cartTotal,
            error,
            loadCart,
            getCartSummary,
            clearCart,
            addresses,
            fetchAddresses,
            isLoadingAddresses,
            onSelectAddress,
            onThreeDotsClicked,
            onCloseThreeDots,
            onDeleteClicked,
            addressConfirmationData,
            setAddressConfirmationData,
            refreshCart: loadCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
