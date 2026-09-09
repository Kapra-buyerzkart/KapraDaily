import { get } from '../client';
import { logApi } from '../../utils/apiLog';

export const getHomepageData = async (pincodeAreaId: number | string | null, blocksize: number = 100): Promise<any> => {
    const config = {
        params: {
            pincodeAreaId,
            blocksize
        }
    };
    const res = await get('homepage', config);
    logApi('home/homepage · request', config.params);
    logApi('home/homepage · response', res);
    return res;
};

export const getCategoryProducts = async (catId: number | string, pincodeAreaId: number | string | null): Promise<any> => {
    const config = {
        params: {
            catId,
            pincodeAreaId
        }
    };
    const res = await get('homepage/categoryproducts', config);
    logApi('home/categoryproducts · request', config.params);
    logApi('home/categoryproducts · response', res);
    return res;
};
