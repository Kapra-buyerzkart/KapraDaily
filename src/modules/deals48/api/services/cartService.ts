import { post, get, deleteRequest } from '../networkUtils';
import {
    getPincodeAreaId as getStoredPincodeAreaId,
    getCachedProfile,
} from '../../globals/storage';
import { getAccessToken } from './tokenService';
import { Buffer } from 'buffer';

const getUserId = async (): Promise<number> => {
    try {
        const profileStr = await getCachedProfile();
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
                let decodedStr: string;
                try {
                    decodedStr = Buffer.from(base64, 'base64').toString('utf8');
                } catch (e) {
                    if (token.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwicGhvbmUiOiI4MTM3OTU2NTc0')) {
                        return 3;
                    }
                    console.warn('atob failed, user might need to login');
                    return 3;
                }
                const decoded = JSON.parse(decodedStr);
                if (decoded.sub) {
                    return parseInt(decoded.sub);
                }
            }
        }
    } catch (error) {
        console.error('Error getting userId:', error);
    }
    return 3;
};

const getPincodeAreaId = async (): Promise<number | null> => {
    try {
        const pincodeAreaId = await getStoredPincodeAreaId();
        if (pincodeAreaId) {
            return parseInt(pincodeAreaId);
        }
        const profileStr = await getCachedProfile();
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
        console.error('Error getting pincodeAreaId:', error);
    }
    return 105; // Default to 105 (dummy area)
};

export const addToCartApi = async (productId: string | number, quantity: number = 1, pincodeAreaIdOverride: number | null = null): Promise<any> => {
    const pincodeAreaId = pincodeAreaIdOverride || await getPincodeAreaId();
    const payload = { pincodeAreaId, productId, quantity };
    return post('cart/add', payload);
};

export const updateCartItemApi = async (cartItemId: string | number, quantity: number, cartVersion: number | string, productId: string | number | null = null, pincodeAreaIdOverride: number | null = null): Promise<any> => {
    const pincodeAreaId = pincodeAreaIdOverride || await getPincodeAreaId();
    const payload: any = { pincodeAreaId, quantity, ifMatchCartVersion: cartVersion };
    if (productId) payload.productId = productId;
    return post(`cart/update/${cartItemId}`, payload);
};

export const removeFromCartApi = async (cartItemId: string | number, cartVersion: number | string, productId: string | number, pincodeAreaIdOverride: number | null = null): Promise<any> => {
    const pincodeAreaId = pincodeAreaIdOverride || await getPincodeAreaId();
    const payload = { quantity: 0, pincodeAreaId, productId, ifMatchCartVersion: cartVersion };
    return post(`cart/update/${cartItemId}`, payload);
};

export const getCartApi = async (pincodeAreaId?: number | null): Promise<any> => {
    const areaId = pincodeAreaId || await getPincodeAreaId();
    return get(`cart/list`, { params: { pincodeAreaId: areaId } });
};

export const getCartSummaryApi = async (deliveryMode: string = 'express', deliverySlotId: string | number | null = null, cartVersion: string | number | null = null, cartId: string | number | null = null, pincodeAreaIdOverride: number | null = null): Promise<any> => {
    const userId = await getUserId();
    const pincodeAreaId = pincodeAreaIdOverride || await getPincodeAreaId();
    const idToUse = (cartId !== undefined && cartId !== null) ? cartId : userId;
    const payload = {
        pincodeAreaId,
        deliveryMode,
        deliverySlotId,
        ...(cartVersion && { ifMatchCartVersion: cartVersion })
    };
    return post(`cart/${idToUse}/summary`, payload);
};

export const clearCartApi = async (cartVersion?: string | number | null, cartId?: string | number | null): Promise<any> => {
    const payload = { ...(cartVersion && { ifMatchCartVersion: cartVersion }) };
    return deleteRequest('cart/clear', payload);
};

export const applyBCoinApi = async (bcoins: number, cartVersion: string | number, cartId?: string | number | null): Promise<any> => {
    const userId = await getUserId();
    const idToUse = (cartId !== undefined && cartId !== null) ? cartId : userId;
    console.log('🪙 [API] applyBCoin:', { bcoins, cartVersion, cartId, userId, idToUse });
    const payload = { bcoins, ifMatchCartVersion: cartVersion };
    return post(`cart/${idToUse}/applybcoin`, payload);
};

export const removeBCoinApi = async (cartVersion: string | number, cartId?: string | number | null): Promise<any> => {
    const userId = await getUserId();
    const idToUse = (cartId !== undefined && cartId !== null) ? cartId : userId;
    const payload = { ifMatchCartVersion: cartVersion };
    return post(`cart/${idToUse}/removebcoin`, payload);
};

export const applyCouponApi = async (couponCode: string, cartVersion: string | number, pincodeAreaId?: number | null, cartId?: string | number | null): Promise<any> => {
    const userId = await getUserId();
    const areaId = pincodeAreaId || await getPincodeAreaId();
    const idToUse = (cartId !== undefined && cartId !== null) ? cartId : userId;
    console.log('🎫 [API] applyCoupon:', { couponCode, cartVersion, cartId, userId, idToUse, areaId });
    const payload = { couponCode, pincodeAreaId: areaId, ifMatchCartVersion: cartVersion };
    return post(`cart/${idToUse}/applycoupon`, payload);
};

export const removeCouponApi = async (cartVersion: string | number, cartId?: string | number | null): Promise<any> => {
    const userId = await getUserId();
    const idToUse = (cartId !== undefined && cartId !== null) ? cartId : userId;
    const payload = { ifMatchCartVersion: cartVersion };
    return post(`cart/${idToUse}/removecoupon`, payload);
};

export const getAvailableCouponsApi = async (pincodeAreaId?: number | null): Promise<any> => {
    const areaId = pincodeAreaId || await getPincodeAreaId();
    return get(`cart/availablecoupons`, { params: { pincodeAreaId: areaId } });
};

export const applyGiftCardApi = async (giftCode: string, cartVersion: string | number, pincodeAreaId?: number | null, cartId?: string | number | null): Promise<any> => {
    const userId = await getUserId();
    const idToUse = (cartId !== undefined && cartId !== null) ? cartId : userId;
    const areaId = pincodeAreaId || await getPincodeAreaId();
    console.log('🎁 [API] applyGiftCard:', { giftCode, cartVersion, cartId, userId, idToUse, areaId });
    const payload = { giftCode, pincodeAreaId: areaId, ifMatchCartVersion: cartVersion };
    return post(`cart/${idToUse}/applygiftcard`, payload);
};

export const removeGiftCardApi = async (cartVersion: string | number, cartId?: string | number | null): Promise<any> => {
    const userId = await getUserId();
    const idToUse = (cartId !== undefined && cartId !== null) ? cartId : userId;
    const payload = { ifMatchCartVersion: cartVersion };
    return post(`cart/${idToUse}/removegiftcard`, payload);
};

export const getDeliverySlotsApi = async (pincodeAreaId?: number | null): Promise<any> => {
    const areaId = pincodeAreaId || await getPincodeAreaId();
    return get('cart/availableslots', { params: { pincodeAreaId: areaId } });
};

export const getAvailableGiftCardsApi = async (pincodeAreaId?: number | null): Promise<any> => {
    const areaId = pincodeAreaId || await getPincodeAreaId();
    return get('cart/availablegiftcards', { params: { pincodeAreaId: areaId } });
};
