import { get } from '../client';

export const getCategoriesApi = async (parentCatId: string = '1'): Promise<any> => {
    return get(`categories/list`, {
        params: { parentCatId }
    });
};
