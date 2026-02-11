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
