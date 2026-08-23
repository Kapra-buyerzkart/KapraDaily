import { post } from '../client';

export const createRazorpayOrderApi = async (payload: { orderId: string | number }): Promise<any> => {
    return post(`payments/razorpay/create`, payload);
};

export const verifyRazorpayPaymentApi = async (payload: {
    orderId: string | number;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    amount: number;
}): Promise<any> => {
    return post(`payments/razorpay/verify`, payload);
};
