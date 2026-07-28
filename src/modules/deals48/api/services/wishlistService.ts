import { post, get } from '../networkUtils';

export const addToWishlistApi = async (productId: string | number): Promise<any> => {
    const payload = { productId };
    return post(`wishlist/add`, payload);
};

export const removeFromWishlistApi = async (productId: string | number): Promise<any> => {
    return post(`wishlist/delete/${productId}`);
};

export const getWishlistApi = async (pincodeAreaId: number | null): Promise<any> => {
    return get(`wishlist/list`, {
        params: { pincodeAreaId }
    });
};
