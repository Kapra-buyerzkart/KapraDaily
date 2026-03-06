import { get } from './networkUtils';

export const getHomepageData = async (pincodeAreaId, blocksize = 100) => {
    const config = {
        params: {
            pincodeAreaId,
            blocksize
        }
    };
    return get('homepage', config);
};

export const getCategoryProducts = async (catId, pincodeAreaId) => {
    const config = {
        params: {
            catId,
            pincodeAreaId
        }
    };


    return get('homepage/categoryproducts', config);
};
