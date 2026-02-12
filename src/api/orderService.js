import { post, get } from './networkUtils';


export const getMyOrdersApi = async () => {
    return get(`order/mine`);
};


export const getOrderDetailsApi = async (orderId) => {
    return get(`order/${orderId}`);
};


export const cancelOrderApi = async (payload) => {
    return post(`order/cancel`, payload);
};


export const reorderApi = async (payload) => {
    return post(`order/reorder`, payload);
};


export const returnOrderItemApi = async (payload) => {
    return post(`order/itemreturn`, payload);
};
