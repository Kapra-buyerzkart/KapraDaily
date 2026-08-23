import { get, post, patch, deleteRequest } from '../client';

export const getProfile = async (): Promise<any> => {
  return get('me');
};

export const getWalletDataApi = async (): Promise<any> => {
  return get('me/bwallet');
};

export const redeemBCoinsApi = async (payload: { requestedCoins: number; preferredMethod: string }): Promise<any> => {
  return post('me/bcoin/redeem', payload);
};

export const updateProfilePatchApi = async (payload: any): Promise<any> => {
  return patch('me', payload);
};

export const requestEmailOtpApi = async (payload: { email: string }): Promise<any> => {
  return post('me/updateemail/requestotp', { newEmail: payload.email });
};

export const verifyEmailOtpApi = async (payload: { email: string; otp: string }): Promise<any> => {
  return post('me/updateemail/verifyotp', { newEmail: payload.email, otp: payload.otp });
};

export const requestPhoneOtpApi = async (payload: { phone: string }): Promise<any> => {
  return post('me/updatephone/requestotp', { newPhone: payload.phone });
};

export const verifyPhoneOtpApi = async (payload: { phone: string; otp: string }): Promise<any> => {
  return post('me/updatephone/verifyotp', { newPhone: payload.phone, otp: payload.otp });
};

export const getReferralHistoryApi = async (page: number = 1, pageSize: number = 20): Promise<any> => {
  return get('me/referrals', { params: { page, pageSize } });
};

export const getBCoinValueChangesApi = async (): Promise<any> => {
  return get('general/bcoinvaluechanges');
};

export const deleteAccountApi = async (): Promise<any> => {
  return deleteRequest('me');
};
