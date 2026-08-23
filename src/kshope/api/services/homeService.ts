import { get } from '../client';

export const getHomepageData = async (pincodeAreaId: number | string | null, blocksize: number = 100): Promise<any> => {
    console.log('pincodeAreaId---->', pincodeAreaId)
    console.log('blocksize---->', blocksize)
    const config = {
        params: {
            pincodeAreaId,
            blocksize
        }
    };
    return get('homepage', config);
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
