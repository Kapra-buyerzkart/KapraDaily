import { post, get, deleteRequest } from './networkUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAccessToken } from './tokenService';

const getUserId = async () => {
    try {
        const profileStr = await AsyncStorage.getItem('userProfile');
        if (profileStr) {
            const profile = JSON.parse(profileStr);
            if (profile.userId || profile.id) {
                return profile.userId || profile.id;
            }
        }
        const token = await getAccessToken();
        if (token) {
            const base64Url = token.split('.')[1];
            if (base64Url) {
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                let decodedStr;
                try {
                    decodedStr = decodeURIComponent(escape(atob(base64)));
                } catch (e) {
                    if (token.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwicGhvbmUiOiI4MTM3OTU2NTc0')) {
                        return 3;
                    }
                    return 3;
                }
                const decoded = JSON.parse(decodedStr);
                if (decoded.sub) {
                    return parseInt(decoded.sub);
                }
            }
        }
    } catch (error) {
    }
    return 3;
};

const getPincodeAreaId = async () => {
    try {
        const pincodeAreaId = await AsyncStorage.getItem('pincodeAreaId');
        if (pincodeAreaId) {
            return parseInt(pincodeAreaId);
        }
        const profileStr = await AsyncStorage.getItem('profile');
        if (profileStr) {
            const profile = JSON.parse(profileStr);
            if (profile.pincode) {
                return profile.pincode;
            }
            if (profile.pincodeAreaId) {
                return profile.pincodeAreaId;
            }
        }
    } catch (error) {
    }
    return null;
};

export const addToCartApi = async (productId, quantity = 1, pincodeAreaIdOverride = null) => {
    const pincodeAreaId = pincodeAreaIdOverride || await getPincodeAreaId();

    const payload = {
        pincodeAreaId,
        productId,
        quantity
    };

    return post('cart/add', payload);
};

export const updateCartItemApi = async (cartItemId, quantity, cartVersion, productId = null, pincodeAreaIdOverride = null) => {
    const pincodeAreaId = pincodeAreaIdOverride || await getPincodeAreaId();

    const payload = {
        pincodeAreaId,
        quantity,
        ifMatchCartVersion: cartVersion
    };
    if (productId) {
        payload.productId = productId;
    }

    return post(`cart/update/${cartItemId}`, payload);
};

export const removeFromCartApi = async (cartItemId, cartVersion, productId, pincodeAreaIdOverride = null) => {
    const pincodeAreaId = pincodeAreaIdOverride || await getPincodeAreaId();

    const payload = {
        quantity: 0,
        pincodeAreaId,
        productId,
        ifMatchCartVersion: cartVersion
    };

    return post(`cart/update/${cartItemId}`, payload);
};

export const getCartApi = async (pincodeAreaId) => {
    const areaId = pincodeAreaId || await getPincodeAreaId();
    return get(`cart/list`, {
        params: { pincodeAreaId: areaId }
    });
};

export const getCartSummaryApi = async (deliveryMode = 'express', deliverySlotId = null, cartVersion = null, cartId = null, pincodeAreaIdOverride = null) => {
    const userId = await getUserId();
    const pincodeAreaId = pincodeAreaIdOverride || await getPincodeAreaId();
    const idToUse = cartId || userId;

    const payload = {
        pincodeAreaId,
        deliveryMode,
        deliverySlotId,
        ...(cartVersion && { ifMatchCartVersion: cartVersion })
    };

    return post(`cart/${idToUse}/summary`, payload);
};

export const clearCartApi = async (cartVersion, cartId) => {
    const payload = {
        ...(cartVersion && { ifMatchCartVersion: cartVersion })
    };

    return deleteRequest('cart/clear', payload);
};

export const applyBCoinApi = async (bcoins, cartVersion, cartId) => {
    const userId = await getUserId();
    const idToUse = cartId || userId;
    const payload = {
        bcoins,
        ifMatchCartVersion: cartVersion
    };
    return post(`cart/${idToUse}/applybcoin`, payload);
};

export const removeBCoinApi = async (cartVersion, cartId) => {
    const userId = await getUserId();
    const idToUse = cartId || userId;
    const payload = {
        ifMatchCartVersion: cartVersion
    };

    return post(`cart/${idToUse}/removebcoin`, payload);
};

export const applyCouponApi = async (couponCode, cartVersion, pincodeAreaId, cartId) => {
    const userId = await getUserId();
    const areaId = pincodeAreaId || await getPincodeAreaId();
    const idToUse = cartId || userId;
    const payload = {
        couponCode,
        pincodeAreaId: areaId,
        ifMatchCartVersion: cartVersion
    };
);
    return post(`cart/${idToUse}/applycoupon`, payload);
};

export const removeCouponApi = async (cartVersion, cartId) => {
    const userId = await getUserId();
    const idToUse = cartId || userId;
    const payload = {
        ifMatchCartVersion: cartVersion
    };
    return post(`cart/${idToUse}/removecoupon`, payload);
};

export const getAvailableCouponsApi = async (pincodeAreaId) => {
    const areaId = pincodeAreaId || await getPincodeAreaId();
    return get(`cart/availablecoupons`, {
        params: { pincodeAreaId: areaId }
    });
};

export const applyGiftCardApi = async (giftCode, cartVersion, pincodeAreaId, cartId) => {
    const userId = await getUserId();
    const idToUse = cartId || userId;
    const areaId = pincodeAreaId || await getPincodeAreaId();
    const payload = {
        giftCode,
        pincodeAreaId: areaId,
        ifMatchCartVersion: cartVersion
    };
);
    return post(`cart/${idToUse}/applygiftcard`, payload);
};

export const removeGiftCardApi = async (cartVersion, cartId) => {
    const userId = await getUserId();
    const idToUse = cartId || userId;
    const payload = {
        ifMatchCartVersion: cartVersion
    };
    return post(`cart/${idToUse}/removegiftcard`, payload);
};

export const getDeliverySlotsApi = async (pincodeAreaId) => {
    const areaId = pincodeAreaId || await getPincodeAreaId();
    return get('cart/availableslots', {
        params: { pincodeAreaId: areaId }
    });
};

export const getAvailableGiftCardsApi = async (pincodeAreaId) => {
    const areaId = pincodeAreaId || await getPincodeAreaId();
    return get('cart/availablegiftcards', {
        params: { pincodeAreaId: areaId }
    });
};
