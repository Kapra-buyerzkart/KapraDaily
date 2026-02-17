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
        const response = await get(`product/suggestions`, {
            params: { term, pincodeAreaId, limit }
        });

        // Handle case where success is false or data is missing
        if (response && response.success && Array.isArray(response.data)) {
            return response;
        }

        // Handle specific server errors gracefully
        if (response && response.status === 'SERVER_ERROR') {
            console.log('Search API returned SERVER_ERROR, treating as no results.');
            return { success: true, data: [] };
        }

        // If server returns error or success:false, return empty list structure to prevent UI errors
        return { success: true, data: [] };
    } catch (error) {
        // Silently handle error as no results found
        return { success: true, data: [] };
    }
};
