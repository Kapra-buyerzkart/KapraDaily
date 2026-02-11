import { post, get } from './networkUtils';

export const addToWishlistApi = async (productId) => {
    const payload = {
        productId
    };
    return post(`wishlist/add`, payload);
};

export const removeFromWishlistApi = async (productId) => {
    return post(`wishlist/delete/${productId}`);
};

export const getWishlistApi = async (pincodeAreaId = 105) => {
    return get(`wishlist/list`, {
        params: { pincodeAreaId }
    });
};
