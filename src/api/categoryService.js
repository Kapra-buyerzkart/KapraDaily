import { get } from './networkUtils';

export const getCategoriesApi = async (parentCatId = 1) => {
    return get(`categories/list`, {
        params: { parentCatId }
    });
};
