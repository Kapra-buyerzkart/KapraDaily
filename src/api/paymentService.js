import { post } from './networkUtils';

/**
 * Creates a Razorpay order for a given system orderId.
 * @param {Object} payload { orderId }
 * @returns {Promise<Object>} API response with Razorpay order details.
 */
export const createRazorpayOrderApi = async (payload) => {
    return post(`payments/razorpay/create`, payload);
};

/**
 * Verifies a Razorpay payment on the backend.
 * @param {Object} payload { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature, amount }
 * @returns {Promise<Object>} API response with verification status.
 */
export const verifyRazorpayPaymentApi = async (payload) => {
return post(`payments/razorpay/verify`, payload);
};
