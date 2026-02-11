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
    try {
        console.log('getProductSuggestionsApi params:', { term, pincodeAreaId, limit });
        const response = await get(`product/suggestions`, {
            params: { term, pincodeAreaId, limit }
        });
        // Handle case where success is false or data is missing
        if (response && response.success && Array.isArray(response.data)) {
            return response;
        }
        // If server returns error or success:false, return empty list structure to prevent UI errors
        return { success: true, data: [] };
    } catch (error) {
        console.error('Error in getProductSuggestionsApi:', error);
        return { success: true, data: [] };
    }
};
