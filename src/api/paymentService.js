import { post } from './networkUtils';

export const createRazorpayOrderApi = async (payload) => {
    return post(`payments/razorpay/create`, payload);
};

export const verifyRazorpayPaymentApi = async (payload) => {
    return post(`payments/razorpay/verify`, payload);
};
