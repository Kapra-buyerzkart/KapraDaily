import { get, post } from '../networkUtils';

export const getProductDetails = async (
  productId: string | number,
  pincodeAreaId: number | null,
): Promise<any> => {
  return get(`product/${productId}`, {
    params: { pincodeAreaId },
  });
};

export const searchProductsApi = async (payload: any): Promise<any> => {
  return post(`product/search`, payload);
};

export const getRelatedProductsApi = async (
  productId: string | number,
  pincodeAreaId: number | null,
  limit: number = 10,
): Promise<any> => {
  return get(`product/${productId}/related`, {
    params: { pincodeAreaId, limit },
  });
};

export const getProductSuggestionsApi = async (
  term: string,
  pincodeAreaId: number | null,
  limit: number = 8,
): Promise<any> => {
  try {
    const response = await get(`product/suggestions`, {
      params: { term, pincodeAreaId, limit },
    });

    if (response && response.success && Array.isArray(response.data)) {
      return response;
    }

    if (response && response.status === 'SERVER_ERROR') {
      return { success: true, data: [] };
    }

    return { success: true, data: [] };
  } catch (error) {
    return { success: true, data: [] };
  }
};
