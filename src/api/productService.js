import axios from 'axios';
import { get, post } from './networkUtils';

export const getProductDetails = async (productId, pincodeAreaId) => {
    return get(`product/${productId}`, {
        params: { pincodeAreaId }
    });
};

export const searchProductsApi = async (payload) => {
    return post(`product/search`, payload);
};

export const getRelatedProductsApi = async (productId, pincodeAreaId, limit = 10) => {
    return get(`product/${productId}/related`, {
        params: { pincodeAreaId, limit }
    });
};

export const getProductSuggestionsApi = async (term, pincodeAreaId, limit = 8, signal) => {
    try {
        const response = await get(`product/suggestions`, {
            params: { term, pincodeAreaId, limit },
            signal,
        });

        if (response && response.success && Array.isArray(response.data)) {
            return response;
        }

        if (response && response.status === 'SERVER_ERROR') {
            console.log('Search API returned SERVER_ERROR, treating as no results.');
            return { success: true, data: [] };
        }

        return { success: true, data: [] };
    } catch (error) {
        if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
            throw error;
        }
        return { success: true, data: [] };
    }
};
