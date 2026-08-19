import { get, post, put, deleteRequest } from "../networkUtils";

export const getAddressListApi = async (): Promise<any> => {
    return await get('me/addresslist');
};

export const getAddressDetailsApi = async (id: string | number): Promise<any> => {
    return await get(`me/address/${id}`);
};

export const addAddressApi = async (payload: any): Promise<any> => {
    console.log('payloadd', payload);
    return await post('me/address', payload);
};

export const updateAddressApi = async (id: string | number, payload: any): Promise<any> => {
    return await put(`me/address/${id}`, payload);
};

export const deleteAddressApi = async (id: string | number): Promise<any> => {
    return await deleteRequest(`me/address/${id}`);
};
