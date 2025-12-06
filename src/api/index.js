import { get, post, put, postRegister, getNew } from './networkUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';
import CONFIG from '../globals/config';

export const LanguageData = async () => {
  let lang = JSON.parse(await AsyncStorage.getItem('language'));
  return lang;
};

export const updateCheck = async (version, platform, type) => {
  //let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `AppUpdateCheck?versionCode=${version}&platform=${platform}&type=${type}`;
  return await get(URL);
};

//AUTH endpoints
export const registerUser = async payload => {
  const URL = `Customer/Register`;
  let register = await postRegister(URL, payload);
  return register;
};

export const deleteAccount = async id => {
  URL = `Customer/DeleteCustomer?id=${id}`;
  return await post(URL);
};

export const groLoginUser = async payload => {
  const URL = `Account/Login`;
  let login = await post(URL, payload);
  return login;
};

export const changePassword = async (oldPassword, newPassword) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `customer/ChangePassword`;
  let changePassword = await post(URL, {
    custId: profile.groceryCustId ? profile.groceryCustId : null,
    oldPassword: oldPassword,
    newPassword: newPassword,
  });
  return changePassword;
};

export const forgotPassword = async (phone = '', email = '') => {
  const URL = `Customer/ForgotPassword?email=${email}&mobileNumber=${phone}`;
  let res = await get(URL);
  return res;
};

export const forgotPasswordVerify = async (OTP, UrlKey) => {
  const URL = `Customer/VerifyOTP?OTP=${OTP}&OtpUrlKey=${UrlKey}&isChangePass=1`;
  let res = await get(URL);
  return res;
};

export const resendOTP = async UrlKey => {
  const URL = `Customer/SendAgainOTP?OtpUrlKey=${UrlKey}`;
  let res = await get(URL);
  return res;
};

export const forgotPasswordReset = async (password, UrlKey) => {
  const URL = `Customer/ResetPassword?OtpUrlKey=${UrlKey}&password=${password}`;
  let res = await get(URL);
  return res;
};

export const GroVerifyOTP = async (OTP, UrlKey, Ref) => {
  const URL = `Customer/VerifyOTP?OTP=${OTP}&OtpUrlKey=${UrlKey}&referrerId=${Ref}`;
  let verify = await get(URL);
  return verify;
};

export const GroVerifyRefOTP = async (OTP, UrlKey, Ref) => {
  const URL = `Customer/RefVerifyOTP?otp=${OTP}&OtpUrlKey=${UrlKey}&referralCode=${Ref}`;
  let verify = await get(URL);
  return verify;
};

export const GroMergeOnLogin = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/MergeUserCart`;
  let searchResult = await post(URL, {
    custId: profile.groceryCustId,
    guestId: profile.guestId,
  });
  return searchResult;
};

//Normal endpoints
export const getHomeData = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Products/HomeProducts?custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }&guestId=${profile.groceryCustId ? '' : profile.guestId}&pincode=${profile.pincode
    }`;
  let HomeProducts = await get(URL);
  return HomeProducts;
};
export const offerZoneData = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `offerZone`;
  let offerZoneDetails = await get(URL);
  return offerZoneDetails;
};

export const getCategoryOffer = async key => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `offerCatProduct?custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }&guestId=${profile.groceryCustId ? '' : profile.guestId}&catUrlKey=${key}`;
  let offerZoneDetails = await get(URL);
  return offerZoneDetails;
};

export const offerZoneDealData = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `offerDeals?custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }&guestId=${profile.groceryCustId ? '' : profile.guestId}`;
  let offerZoneDetails = await get(URL);
  return offerZoneDetails;
};

export const offerCategoryData = async caturlKey => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `offerCatProduct?custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }&guestId=${profile.groceryCustId ? '' : profile.guestId
    }&catUrlKey=${caturlKey}`;
  let offerZoneDetails = await get(URL);
  return offerZoneDetails;
};

export const getSingleItemData = async UrlKey => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `ProductDetails?urlKey=${UrlKey}&custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }&guestId=${profile.groceryCustId ? '' : profile.guestId}&pincode=${profile.pincode
    }`;
  let SingleItem = await get(URL);
  return SingleItem;
};

export const getRelatedProducts = async UrlKey => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `GetRelatedProducts?urlKey=${UrlKey}&custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }&guestId=${profile.groceryCustId ? '' : profile.guestId}&pincode=${profile.pincode
    }`;
  let SingleItem = await get(URL);
  return SingleItem;
};

export const getSingleItemReviews = async UrlKey => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Product/ProductReview?urlKey=${UrlKey}&CustId=${profile.groceryCustId ? profile.groceryCustId : ''
    }&guestId=${profile.groceryCustId ? '' : profile.guestId}`;
  let ItemReviews = await get(URL);
  return ItemReviews;
};

export const getReferral = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `referralList?custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }`;
  let ItemReviews = await get(URL);
  return ItemReviews;
};

export const postReferral = async payload => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Customer/AddReferral`;
  let searchResult = await post(URL, payload);
  return searchResult;
};

export const writeReview = async payload => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Product/ProductReviewSubmit`;
  let searchResult = await post(URL, {
    ...payload,
    cusId: profile.groceryCustId,
  });
  return searchResult;
};

export const getDeliverySlots = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/GetTimeSlot?vendorUrlkey=kaprabuyerzkartdigitalcommercepvtltd&pincodeId=${profile.pincode}`;
  return await get(URL);
};

export const GroGetCartList = async (addID, delMode) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/CartList?cusId=${profile.groceryCustId ? profile.groceryCustId : ''
    }&guestId=${profile.groceryCustId ? '' : profile.guestId}&pincode=${profile.pincode
    }&addressId=${addID}&delMode=${delMode}`;
  return await get(URL);
};

export const getCartSummary = async (addID, delMode) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/CartSummary?cusId=${profile.groceryCustId ? profile.groceryCustId : ''
    }&guestId=${profile.groceryCustId ? '' : profile.guestId}&pincode=${profile.pincode
    }&addressId=${addID}&delMode=${delMode}`;
  let res = await get(URL);
  return res;
};

export const getOrderList = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/CustOrderList?cusId=${profile.groceryCustId ? profile.groceryCustId : ''
    }&guestId=${profile.groceryCustId ? '' : profile.guestId}`;
  return await get(URL);
};

export const getOrderListWithPagination = async (index, count) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/custOrderListTop5WithImages?cusId=${profile.groceryCustId ? profile.groceryCustId : ''}&pageIndex=${index}&pageSize=${count}`;
  return await get(URL);
};

export const getSingleOrder = async id => {
  const URL = `Order/CustOrderItemList?orderId=${id}`;
  return await get(URL);
};

export const getETA = async (agentId, orderId) => {
  const URL = `Delivery/getETA?agentId=${agentId}&orderId=${orderId}`;
  return await get(URL);
};

export const getSingleOrderStatus = async id => {
  const URL = `Order/TrackOrder?orderId=${id}`;
  return await get(URL);
};

export const ReturnRequest = async (oNumber, pID, Qty) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/ReturnRequest`;
  let searchResult = await post(URL, {
    custId: profile.groceryCustId ? profile.groceryCustId : '',
    qty: Qty,
    orderId: oNumber,
    productId: pID,
  });
  return searchResult;
};

export const postDeliveryReview = async payload => {
  const URL = `Delivery/AddDeliveryReview`;
  let searchResult = await post(URL, payload);
  return searchResult;
};

export const deliveryStuck = async ID => {
  const URL = `intimateDeliveryStuck`;
  let searchResult = await post(URL, { orderId: ID });
  return searchResult;
};

export const postReOrder = async ID => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/ReOrder`;
  let searchResult = await post(URL, {
    custId: profile.groceryCustId ? profile.groceryCustId : profile.guestId,
    orderId: ID,
  });
  return searchResult;
};

export const CancelOrder = async orderID => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/CancelOrderItem?orderId=${orderID}&custId=${profile.groceryCustId ? profile.groceryCustId : profile.guestId
    }`;
  return await get(URL);
};

export const removeFromCart = async id => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/RemoveCartItem?cartItemId=${id}`;
  return await get(URL);
};

export const decreaseCartItemByURLKey = async urlKey => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/CartItemSubQtyByUrlKey`;
  let cartResult = await post(URL, {
    custId: profile.groceryCustId ? profile.groceryCustId : null,
    guestId: profile.groceryCustId ? null : profile.guestId,
    urlKey: urlKey,
  });
  return cartResult;
};

export const RemoveCartItemByUrlkey = async key => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/RemoveCartItemByUrlkey`;
  let searchResult = await post(URL, {
    urlKey: key,
    guestId: profile.groceryCustId ? '' : profile.guestId,
    custId: profile.groceryCustId ? profile.groceryCustId : '',
  });
  return searchResult;
};

export const removeAllFromCart = async id => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/RemoveAllCartItem?cusId=${profile.groceryCustId ? profile.groceryCustId : ''
    }&guestId=${profile.groceryCustId ? '' : profile.guestId}`;
  return await get(URL);
};

export const removeBuyNow = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `RemoveBuyNow?custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }`;
  return await get(URL);
};

export const moveToWishlistFromCart = async id => {
  const URL = `Order/MoveToWish?cartItemId=${id}`;
  return await get(URL);
};

export const increaseCartItem = async id => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/CartItemAddQty?cartItemId=${id}`;
  return await get(URL);
};

export const decreaseCartItem = async id => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/CartItemSubQty?cartItemId=${id}`;
  return await get(URL);
};

export const addtoCart = async (urlKey, Qty) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/AddToCart`;
  let searchResult = await post(URL, {
    productQty: Qty ? Qty : 1,
    cusId: profile.groceryCustId ? profile.groceryCustId : null,
    guestId: profile.groceryCustId ? null : profile.guestId,
    urlKey: urlKey,
    pincode: profile.pincode
  });
  return searchResult;
};

export const productBuyNow = async (urlKey, Qty) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/BuyNow`;
  let searchResult = await post(URL, {
    productQty: Qty ? Qty : 1,
    cusId: profile.groceryCustId ? profile.groceryCustId : null,
    guestId: profile.groceryCustId ? null : profile.guestId,
    urlKey: urlKey,
  });
  return searchResult;
};

export const getSearchList = async payload => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Product/Search`;
  let searchResult = await post(URL, {
    custId: profile.groceryCustId ? profile.groceryCustId : null,
    guestId: profile.groceryCustId ? null : profile.guestId,
    pincode: profile.pincode,
    ...payload,
  });
  return searchResult;
};

export const getSearchFilterData = async payload => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Product/SearchFilter`;
  let searchResult = await post(URL, {
    custId: profile.groceryCustId ? profile.groceryCustId : null,
    guestId: profile.groceryCustId ? null : profile.guestId,
    vendorUrlKey: profile.pincode,
    ...payload,
  });
  return searchResult;
};

export const getVendorData = async payload => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Vendor/Search`;
  let searchResult = await post(URL, {
    custId: profile.groceryCustId ? profile.groceryCustId : null,
    guestId: profile.groceryCustId ? null : profile.guestId,
    pincode: profile.pincode,
    ...payload,
  });
  return searchResult;
};

export const getSearchAutoCompleteList = async payload => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Product/SearchAutoComplete?term=${payload}&pincode=${profile.pincode}`;
  let searchResult = await get(URL);
  return searchResult;
};

export const getTopSellerList = async () => {
  const URL = `TopSeller`;
  return await get(URL);
};

export const getGroWishList = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/WishLists?custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }&guestId=${profile.groceryCustId ? '' : profile.guestId}&pincode=${profile.pincode
    }`;
  return await get(URL);
};

export const getRefHistory = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Customer/ReferalHistory?custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }&type=`;
  return await get(URL);
};

export const getWallet = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Account/getWalletDetails?userId=${profile.groceryCustId ? profile.groceryCustId : ''
    }`;
  return await get(URL);
};

export const getBCoin = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Account/getBCoinDetails?custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }`;
  return await get(URL);
};

export const redeemBCoin = async payload => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/BcoinRedeemRequest`;
  return await post(URL, payload);
};

export const getBToken = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Account/getBTokenDetails?custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }`;
  return await get(URL);
};

export const getValueHistory = async () => {
  const URL = `Account/getBCoinValueHistory?custId=4`;
  return await get(URL);
};

export const getCoinRedeemModes = async () => {
  const URL = `Account/getAvailableRedeemModes?custId=4`;
  return await get(URL);
};

export const redeemWallet = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Customer/updRedeemRequest?id=${profile.groceryCustId ? profile.groceryCustId : ''
    }`;
  return await post(URL);
};

export const getLanguageList = async LangCode => {
  //let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `mobLanguage?lg=${LangCode}`;
  return await get(URL);
};

export const moveAllFromWishListToCart = async id => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/MoveAllWishListsToCart`;
  let searchResult = await post(URL, {
    custId: profile.groceryCustId ? profile.groceryCustId : '',
    guestId: profile.groceryCustId ? '' : profile.guestId
  });
  return searchResult;
};

export const removeAllFromWishList = async id => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/DeleteAllWishListItems`;
  let searchResult = await post(URL, {
    custId: profile.groceryCustId ? profile.groceryCustId : '',
    guestId: profile.groceryCustId ? '' : profile.guestId
  });
  return searchResult;
};

export const removeFromWishList = async id => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/InsertWishListsDel?custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }&guestId=${profile.groceryCustId ? '' : profile.guestId}&urlKey=${id}`;
  let searchResult = await post(URL);
  return searchResult;
};

export const addToWishList = async urlKey => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/InsertWishLists?`;
  let searchResult = await post(URL, {
    custId: profile.groceryCustId ? profile.groceryCustId : null,
    guestId: profile.groceryCustId ? null : profile.guestId,
    urlKey: urlKey,
  });

  return searchResult;
};

export const addressList = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/CusAddressList?cusId=${profile.groceryCustId ? profile.groceryCustId : ''
    }`;
  return await get(URL);
};

export const getShortestAddress = async (lati, longi) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/NearestDeliveryAddress?custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }&lat=${lati}&lng=${longi}`;
  return await get(URL);
};

export const DeleteAddress = async payload => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Customer/DelAddress/${payload}`;
  return await get(URL);
};

export const addAddress = async payload => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `NewAddress`;
  let searchResult = await post(URL, payload);
  return searchResult;
};

export const updateAddress = async payload => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Customer/UpdateAddress`;
  let searchResult = await post(URL, payload);
  return searchResult;
};

export const placeOrder = async payload => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order`;
  let searchResult = await post(URL, {
    custId: profile.groceryCustId ? profile.groceryCustId : null,
    ...payload,
  });
  return searchResult;
};

export const getCategory = async () => {
  const URL = `category/TopCategory`;
  return await get(URL);
};

export const getCategoryArchive = async URL => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  URL = `${URL}?custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }&guestId=${profile.groceryCustId ? '' : profile.guestId}&pincode=${profile.pincode
    }`;
  return await get(URL);
};

export const getBrandList = async URL => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  URL = `BrandList`;
  return await get(URL);
};

export const catBrandList = async url => {
  const URL = `catBrandList?catUrlKey=${url}`;
  return await get(URL);
};

export const getLatestArrival = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `LatestArrival?custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }&guestId=${profile.groceryCustId ? '' : profile.guestId}&pincode=${profile.pincode
    }`;
  return await get(URL);
};

export const getRecentProducts = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `RecentProducts?custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }&guestId=${profile.groceryCustId ? '' : profile.guestId}&pincode=${profile.pincode
    }`;
  return await get(URL);
};

export const getAllBrandOffer = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `BrandProduct?custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }&guestId=${profile.groceryCustId ? '' : profile.guestId}&pincode=${profile.pincode
    }`;
  return await get(URL);
};

export const getRecommendedProducts = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `RecommendedProducts?custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }&guestId=${profile.groceryCustId ? '' : profile.guestId}&pincode=${profile.pincode
    }`;
  return await get(URL);
};

export const getTopDealProducts = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `TopDealProduct?custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }&guestId=${profile.groceryCustId ? '' : profile.guestId}&pincode=${profile.pincode
    }`;
  return await get(URL);
};

export const getDealOfTheDay = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `DealOfDay?custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }&guestId=${profile.groceryCustId ? '' : profile.guestId}`;
  return await get(URL);
};

export const writeToUs = async (email, phone, title, message) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Support`;
  let response = await post(URL, {
    custId: profile.groceryCustId ? profile.groceryCustId : null,
    email: email,
    mobile: phone,
    title: title,
    message: message,
  });
  return response;
};

export const leadGeneration = async (phone, pincodeAreaId) => {
  const URL = `Customer/leads`;
  let response = await post(URL, {
    phoneNo: phone,
    pincodeAreaId: pincodeAreaId,
  });
  return response;
};

export const getHomeCategoryList = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `getMobileHomeCategories?pincode=${profile.pincode}`;
  return await get(URL);
};

export const shopByCategory = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `category?pincode=${profile.pincode}`;
  return await get(URL);
};

export const getPaymentMethods = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/PaymentModes`;
  return await get(URL);
};

export const initiatePayment = async id => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `OrderPaymentInitiate?orderId=${id}`;
  return await get(URL);
};

export const completePayment = async id => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `OrderComplete?orderId=${id}`;
  return await get(URL);
};

export const getCoupons = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `CouponList?custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }&guestId=${profile.groceryCustId ? '' : profile.guestId}`;
  return await get(URL);
};

export const getGiftCards = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/GetAvailableGiftCards?custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }`;
  return await get(URL);
};

export const applyCoupon = async Code => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/ApplyCouponCode?`;
  let response = await post(URL, {
    custId: profile.groceryCustId ? profile.groceryCustId : null,
    ccode: Code,
  });
  return response;
};

export const applyBCoin = async coin => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/ApplyBCoins?`;
  let response = await post(URL, {
    custId: profile.groceryCustId ? profile.groceryCustId : null,
    bCoinsAmount: coin,
  });
  return response;
};

export const removeBCoin = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/ApplyBCoins?`;
  let response = await post(URL, {
    custId: profile.groceryCustId ? profile.groceryCustId : null,
  });
  return response;
};

export const postApplyGiftCard = async Code => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/ApplyGiftCard`;
  let response = await post(URL, {
    custId: profile.groceryCustId ? profile.groceryCustId : null,
    giftCardIds: Code,
  });
  return response;
};

export const removeCoupon = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `RemoveCoupon?`;
  let config = {
    headers: {
      custId: profile.groceryCustId,
      pincode: profile.pincode,
    },
  };
  let response = await get(URL, config);
  return response;
};

export const getProfile = async URL => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  URL = `CustomerDetails?custId=${profile.groceryCustId ? profile.groceryCustId : ''
    }`;
  return await get(URL);
};

export const GroUpdateProfile = async (email, phone, name) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `ProfileUpdate?`;
  let response = await post(URL, {
    custId: profile.groceryCustId ? profile.groceryCustId : null,
    custName: name,
    emailId: email,
    phoneNo: phone,
  });
  return response;
};

export const changePincode = async term => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  URL = `Customer/getPincodeList?term=${term}`;
  return await get(URL);
};


export const areaListPincodeWise = async code => {
  URL = `Customer/getAreaByPincode?term=${code}`;
  return await get(URL);
};


export const areaList = async code => {
  URL = `Customer/getAreaNameList?term=${code}`;
  return await get(URL);
};

export const checkUser = async id => {
  URL = `Customer/UserExistCheck?UserName=${id}`;
  return await get(URL);
};

export const getPolicies = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  // console.log('pppp', profile)
  const URL = `CompanyPolicy?pincode=${profile.pincode}`;
  return await get(URL);
};

export const getCountry = async () => {
  const URL = `CountryList`;
  return await get(URL);
};

export const getState = async id => {
  URL = `StateList?CountryId=${id}`;
  return await get(URL);
};

export const getDistrict = async id => {
  URL = `CityList?stateId=${id}`;
  return await get(URL);
};

export const checkAvailability = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/checkAvailability?custId=${profile.groceryCustId}&pincode=${profile.pincode}`;
  // const URL = `Order/checkAvailability?custId=${19516}&pincode=${661}`;
  return await getNew(URL);
}

export const getAvailableLocations = async () => {
  const URL = `getAvailablePincodeArea`;
  return await getNew(URL);
};
