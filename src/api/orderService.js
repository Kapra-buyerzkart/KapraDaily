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


/**
 * Creates a new order.
 * @param {Object} payload Order creation details.
 * @returns {Promise<Object>} API response.
 */
export const createOrderApi = async (payload) => {
    return post(`order/create`, payload);
};

/**
 * Confirms a Cash on Delivery (COD) order.
 * @param {number|string} orderId The ID of the order to confirm.
 * @returns {Promise<Object>} API response.
 */
export const confirmCodApi = async (orderId) => {
    return post(`order/${orderId}/confirmcod`);
};

/**
 * Submits a review for the delivery agent.
 * @param {Object} payload { orderid, rating, reviewtext }
 */
export const rateDeliveryAgentApi = async (payload) => {
    return post(`order/deliveryagent/review`, payload);
};

/**
 * Submits a review for the order.
 * @param {Object} payload { orderid, rating, reviewtext }
 */
export const rateOrderApi = async (payload) => {
    return post(`order/delivery/review`, payload);
};
