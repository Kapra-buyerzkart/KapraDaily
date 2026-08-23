import { post, get, deleteRequest } from '../client';
import kshopeTokenStore from '../tokenService';
import { getUserIdFromToken } from '../../../utils/jwt';
import { getKshopeAreaId, getCachedProfile } from '../../globals/storage';

const getUserId = async (): Promise<number> => {
    try {
        const profile = await getCachedProfile();
        if (profile && (profile.userId || profile.id)) {
            return profile.userId || profile.id;
        }
        const token = await kshopeTokenStore.getAccessToken();
        if (token) {
            const userId = getUserIdFromToken(token);
            if (userId !== null) {
                return userId;
            }
        }
    } catch (error) {
        console.error('Error getting userId:', error);
    }
    return 3;
};

const getPincodeAreaId = async (): Promise<number | null> => {
    return getKshopeAreaId();
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
