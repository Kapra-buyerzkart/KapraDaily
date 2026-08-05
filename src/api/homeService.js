import { get, post } from './networkUtils';
import logger from '../utils/logger';

export const getHomepageData = async (pincodeAreaId, blocksize = 100) => {
    const config = {
        params: {
            pincodeAreaId,
            blocksize
        }
    };
    // `debug` (not `log`) because `pincodeAreaId` matches the logger's `pincode`
    // redaction pattern — it's an area id, not a user's pincode. Dev-only either way.
    logger.debug('[API REQUEST]: homepage', config.params);
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
export const postPopupSeenApi = async (popupId) => {
    return post('homepage/popup/seen', { popupId });
};
