import { get } from './networkUtils';

export const searchPincodeArea = async (search, limit = 20) => {

    const config = {
        params: {
            search,
            limit
        }
    };
    return get('pincodearea/search', config);
};
