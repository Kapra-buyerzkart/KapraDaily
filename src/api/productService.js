import { get, post } from './networkUtils';

export const getProductDetails = async (productId, pincodeAreaId = 105) => {
    return get(`product/${productId}`, {
        params: { pincodeAreaId }
    });
};

export const searchProductsApi = async (payload) => {
    return post(`product/search`, payload);
};

export const getRelatedProductsApi = async (productId, pincodeAreaId = 105, limit = 10) => {
    return get(`product/${productId}/related`, {
        params: { pincodeAreaId, limit }
    });
};

export const getProductSuggestionsApi = async (term, pincodeAreaId = 105, limit = 8) => {
    return get(`product/suggestions`, {
        params: { term, pincodeAreaId, limit }
    });
};
