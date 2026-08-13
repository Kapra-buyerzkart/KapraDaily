import { get, post } from './networkUtils';

export const getVouchersApi = async () => {
  return get('vouchers');
};

export const getVoucherByIdApi = async voucherId => {
  return get(`vouchers/${voucherId}`);
};

export const getVoucherQuoteApi = async (voucherId, quantity, udcoinsrequested) => {
  return post(`vouchers/${voucherId}/quote`, { quantity, udcoinsrequested });
};

export const initiateVoucherPurchaseApi = async (payload) => {
  return post('vouchers/purchase/initiate', payload);
};

export const verifyVoucherPurchaseApi = async (payload) => {
  return post('vouchers/purchase/verify', payload);
};

export const getMyVouchersApi = async () => {
  return get('vouchers/myvouchers');
};
