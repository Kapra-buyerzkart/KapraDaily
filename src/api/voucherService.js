import { get, post } from './networkUtils';

export const getVouchersApi = async () => {
  return get('vouchers');
};

export const getVoucherByIdApi = async voucherId => {
  return get(`vouchers/${voucherId}`);
};

export const getVoucherQuoteApi = async (voucherId, quantity) => {
  return post(`vouchers/${voucherId}/quote`, { quantity });
};
