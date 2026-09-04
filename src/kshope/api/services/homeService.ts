import { get } from '../client';

export const getHomepageData = async (pincodeAreaId: number | string | null, blocksize: number = 100): Promise<any> => {
    const config = {
        params: {
            pincodeAreaId,
            blocksize
        }
    };
    const response = await get('homepage', config);
    console.log('[HOMEPAGE API] params:', config.params);
    console.log('[HOMEPAGE API] response:', response);
    return response;
};

export const getCategoryProducts = async (catId: number | string, pincodeAreaId: number | string | null): Promise<any> => {
    const config = {
        params: {
            catId,
            pincodeAreaId
        }
    };
    return get('homepage/categoryproducts', config);
};
