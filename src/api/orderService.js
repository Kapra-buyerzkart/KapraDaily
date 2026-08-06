import { post, get } from './networkUtils';

export const getMyOrdersApi = async () => {
    return get(`order/mine`);
};

export const getOrderDetailsApi = async (orderId) => {
    const response = await get(`order/${orderId}`);
    console.log('getOrderDetailsApi', orderId, JSON.stringify(response, null, 2));
    return response;
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

export const createOrderApi = async (payload) => {
    return post(`order/create`, payload);
};

export const confirmCodApi = async (orderId) => {
    return post(`order/${orderId}/confirmcod`);
};

export const rateDeliveryAgentApi = async (payload) => {
    return post(`order/deliveryagent/review`, payload);
};

export const rateOrderApi = async (payload) => {
    return post(`order/delivery/review`, payload);
};
