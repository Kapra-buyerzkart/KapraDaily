import { get, post, getNew } from './networkUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

// /* -------------------- HELPERS -------------------- */
// const getProfile = async () => {
//   const profile = await AsyncStorage.getItem('profile');
//   return profile ? JSON.parse(profile) : {};
// };

// /* -------------------- AUTH -------------------- */
// export const groLoginUser = payload => post('Account/Login', payload);
// export const registerUser = payload => post('Customer/Register', payload);

// /* -------------------- HOME -------------------- */
// export const getHomeData = async () => {
//   const p = await getProfile();
//   const URL = `Products/HomeProducts?custId=${p.groceryCustId || ''}&guestId=${p.groceryCustId ? '' : p.guestId}&pincode=${p.pincode}`;
//   return get(URL);
// };

// /* -------------------- PRODUCT -------------------- */
// export const getSingleItemData = async urlKey => {
//   const p = await getProfile();
//   const URL = `ProductDetails?urlKey=${urlKey}&custId=${p.groceryCustId || ''}&guestId=${p.groceryCustId ? '' : p.guestId}&pincode=${p.pincode}`;
//   return get(URL);
// };

// /* -------------------- CART -------------------- */
// export const addToCart = async (urlKey, qty = 1) => {
//   const p = await getProfile();
//   return post('Order/AddToCart', {
//     urlKey,
//     productQty: qty,
//     cusId: p.groceryCustId || null,
//     guestId: p.groceryCustId ? null : p.guestId,
//     pincode: p.pincode,
//   });
// };

// /* -------------------- ORDERS -------------------- */
// export const getOrderList = async () => {
//   const p = await getProfile();
//   const URL = `Order/CustOrderList?cusId=${p.groceryCustId || ''}&guestId=${p.groceryCustId ? '' : p.guestId}`;
//   return get(URL);
// };

// /* -------------------- PAYMENT -------------------- */
// export const initiatePayment = id => get(`OrderPaymentInitiate?orderId=${id}`);
// export const completePayment = id => get(`OrderComplete?orderId=${id}`);

// /* -------------------- MISC -------------------- */
// export const getAvailableLocations = () => getNew('getAvailablePincodeArea');

export const loginWithPassword = async payload => {
  const response = await post('auth/loginpassword', payload);
  const { accessToken, refreshToken } = response;
  await setTokens(accessToken, refreshToken);

  return response;
};

export const sendLoginOtp = async phone => {
  const payload = {
    phone,
    otpType: 'login',
  };
  console.log('33333', payload)
  return post('auth/sendotp', payload);
};
