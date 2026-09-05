import { get } from '../client';

export const getHomepageData = async (pincodeAreaId: number | string | null, blocksize: number = 100): Promise<any> => {
    const config = {
        params: {
            pincodeAreaId,
            blocksize
        }
    };
    const res = await get('homepage', config);
    console.log('[kshope] homepage API response:', res);
    return res;
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
