import { get, post, put, deleteRequest } from "./networkUtils";

export const getAddressListApi = async () => {
    return await get('me/addresslist');
};

export const getAddressDetailsApi = async (id) => {
    return await get(`me/address/${id}`);
};

export const addAddressApi = async (payload) => {
    return await post('me/address', payload);
};

export const updateAddressApi = async (id, payload) => {
    return await put(`me/address/${id}`, payload);
};

export const deleteAddressApi = async (id) => {
    return await deleteRequest(`me/address/${id}`);
};
