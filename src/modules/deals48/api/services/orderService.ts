import { post, get } from '../networkUtils';

export const getMyOrdersApi = async (): Promise<any> => {
    return get(`order/mine`);
};

export const getOrderDetailsApi = async (orderId: string | number): Promise<any> => {
    return get(`order/${orderId}`);
};

export const cancelOrderApi = async (payload: any): Promise<any> => {
    return post(`order/cancel`, payload);
};

export const reorderApi = async (payload: any): Promise<any> => {
    return post(`order/reorder`, payload);
};

export const returnOrderItemApi = async (payload: any): Promise<any> => {
    return post(`order/itemreturn`, payload);
};

export const createOrderApi = async (payload: any): Promise<any> => {
    return post(`order/create`, payload);
};

export const confirmCodApi = async (orderId: string | number): Promise<any> => {
    return post(`order/${orderId}/confirmcod`, {});
};

export const rateDeliveryAgentApi = async (payload: any): Promise<any> => {
    return post(`order/deliveryagent/review`, payload);
};

export const rateOrderApi = async (payload: any): Promise<any> => {
    return post(`order/delivery/review`, payload);
};
