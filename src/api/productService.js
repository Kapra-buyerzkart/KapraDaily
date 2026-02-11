import { get, post } from './networkUtils';

export const getProductDetails = async (productId, pincodeAreaId = 105) => {
    return get(`product/${productId}`, {
        params: { pincodeAreaId }
    });
};

export const searchProductsApi = async (payload) => {
    return post(`product/search`, payload);
};
