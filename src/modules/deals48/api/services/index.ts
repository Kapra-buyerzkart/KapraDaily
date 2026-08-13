import { get, post } from '../networkUtils';

export const loginWithPassword = async (phone: string, password: string): Promise<any> => {
  const payload = { phone, password };
  return post('auth/loginpassword', payload);
};

export const sendLoginOtp = async (phone: string): Promise<any> => {
  const payload = { phone, otpType: 'login' };
  return post('auth/sendotp', payload);
};

export const sendForgotPwdOtp = async (phone: string): Promise<any> => {
  const payload = { phone, otpType: 'reset' };
  return post('auth/sendotp', payload);
};

export const sendRegisterOtp = async (phone: string): Promise<any> => {
  const payload = { phone, otpType: 'register' };
  return post('auth/sendotp', payload);
};

export const verifyLoginOtp = async (phone: string, otp: string): Promise<any> => {
  const payload = { phone, otp, otpType: 'login', loggedInFromDevice: "app" };
  const response = await post('auth/verifyotp', payload);
  console.log('[verifyLoginOtp] response:', response);
  return response;
};

export const verifyForgotPwdOtp = async (phone: string, otp: string): Promise<any> => {
  const payload = { phone, otp, otpType: 'reset' };
  return post('auth/verifyotp', payload);
};

export const verifyRegisterOtp = async (phone: string, otp: string): Promise<any> => {
  const payload = { phone, otp, otpType: 'register' };
  return post('auth/verifyotp', payload);
};

export const resetPassword = async (resetToken: string, newPassword: string): Promise<any> => {
  const payload = { resetToken, newPassword };
  return post('auth/resetpassword', payload);
};

export const registerUser = async ({
  registerToken,
  name,
  email,
  password,
  whatsAppNo,
  referCode,
  pincodeAreaId,
}: {
  registerToken: string;
  name: string;
  email: string;
  password?: string;
  whatsAppNo?: string;
  referCode?: string;
  pincodeAreaId: number | string;
}): Promise<any> => {
  const payload = {
    registerToken,
    name,
    email,
    password,
    whatsAppNo,
    referCode,
    pincodeAreaId,
    registeredFromDevice: 'app',
  };
  return post('auth/register', payload);
};

export const resendLoginOtp = async (phone: string): Promise<any> => {
  const payload = { phone, otpType: 'login' };
  return post('auth/resendotp', payload);
};

export const resendForgotPwdOtp = async (phone: string): Promise<any> => {
  const payload = { phone, otpType: 'reset' };
  return post('auth/resendotp', payload);
};

export const getProfile = async (): Promise<any> => {
  return get('me');
};

export const getAreasByPincode = async (pincode: string | number): Promise<any> => {
  return get(`pincodearea/getbypincode?search=${pincode}`);
};

export const getAreasBySearch = async (search: string): Promise<any> => {
  return get(`/pincodearea/search?search=${search}`);
};

export const checkPhone = async (phoneNo: string): Promise<any> => {
  const payload = { phone: phoneNo };
  return post(`auth/checkphone`, payload);
};

export const getWalletDataApi = async (): Promise<any> => {
  return get('me/bwallet');
};

export const redeemBCoinsApi = async (payload: { requestedCoins: number; preferredMethod: string }): Promise<any> => {
  return post('me/bcoin/redeem', payload);
};

export const getReferralHistoryApi = async (page = 1, pageSize = 20): Promise<any> => {
  return get(`me/referrals`, { params: { page, pageSize } });
};

export const getBCoinValueChangesApi = async (): Promise<any> => {
  return get('general/bcoinvaluechanges');
};

export * from './cartService';

