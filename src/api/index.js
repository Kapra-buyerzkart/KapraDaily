import { get, post } from './networkUtils';


export const loginWithPassword = async (phone, password) => {
  const payload = {
    phone,
    password
  }
  return post('auth/loginpassword', payload);
};

export const sendLoginOtp = async phone => {
  const payload = {
    phone,
    otpType: 'login',
  };
  return post('auth/sendotp', payload);
};

export const sendForgotPwdOtp = async phone => {
  const payload = {
    phone,
    otpType: 'reset',
  };
  return post('auth/sendotp', payload);
};

export const sendRegisterOtp = async phone => {
  const payload = {
    phone,
    otpType: 'register',
  };
  return post('auth/sendotp', payload);
};

export const verifyLoginOtp = async (phone, otp) => {
  const payload = {
    phone,
    otp,
    otpType: 'login',
    loggedInFromDevice: "app"
  };
  return post('auth/verifyotp', payload);
};

export const verifyForgotPwdOtp = async (phone, otp) => {
  const payload = {
    phone,
    otp,
    otpType: 'reset',
  };
  return post('auth/verifyotp', payload);
};

export const verifyRegisterOtp = async (phone, otp) => {
  const payload = {
    phone,
    otp,
    otpType: 'register',
  };
  return post('auth/verifyotp', payload);
};

export const resetPassword = async (resetToken, newPassword) => {
  const payload = {
    resetToken,
    newPassword,
  };
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
}) => {
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

export const resendLoginOtp = async phone => {
  const payload = {
    phone,
    otpType: 'login',
  };
  return post('auth/resendotp', payload);
};

export const resendForgotPwdOtp = async phone => {
  const payload = {
    phone,
    otpType: 'reset',
  };
  return post('auth/resendotp', payload);
};

export const getProfile = async () => {
  return get('me');
};

export const getAreasByPincode = async (pincode) => {
  return get(`pincodearea/getbypincode?search=${pincode}`);
};

export const getAreasBySearch = async (search) => {
  return get(`/pincodearea/search?search=${search}`);
};

export const checkPhone = async (phoneNo) => {
  const payload = {
    phone: phoneNo
  };
  return post(`auth/checkphone`, payload)
}