import { get, post, patch, deleteRequest } from './networkUtils';

export const getDashboardDataApi = async () => {
  return get('me/dashboard');
};

export const getWalletDataApi = async () => {
  return get('me/bwallet');
};

export const redeemBCoinsApi = async payload => {
  return post('me/bcoin/redeem', payload);
};
export const updateProfileApi = async payload => {
  return post('me/update', payload);
};

export const updateProfilePatchApi = async payload => {
  return patch('me', payload);
};

export const changePasswordApi = async payload => {
  return post('me/changepassword', payload);
};

export const requestEmailOtpApi = async payload => {
  return post('me/updateemail/requestotp', payload);
};

export const verifyEmailOtpApi = async payload => {
  return post('me/updateemail/verifyotp', payload);
};

export const requestPhoneOtpApi = async payload => {
  return post('me/updatephone/requestotp', payload);
};

export const verifyPhoneOtpApi = async payload => {
  return post('me/updatephone/verifyotp', payload);
};

export const getReferralHistoryApi = async (page = 1, pageSize = 20) => {
  return get(`me/referrals`, { params: { page, pageSize } });
};

export const getGeneralSettingsApi = async () => {
  return get('general/settings');
};

export const getReferralNetworkLevelsApi = async () => {
  return get('referral/network/levels');
};

export const getReferralNetworkLevelMembersApi = async level => {
  return get(`referral/network/levels/${level}/members`);
};
export const requestProductApi = async payload => {
  return post('me/requestproduct', payload);
};

export const getBCoinValueChangesApi = async () => {
  return get('general/bcoinvaluechanges');
};

export const getAppUpdateCheckApi = async (
  versioncode,
  platform,
  apptype = 'customer',
) => {
  return get('general/appupdatecheck', {
    params: { versioncode, platform, apptype },
  });
};

export const deleteAccountApi = async () => {
  return deleteRequest('me');
};

export const getCoPartnerAreasApi = async () => {
  return get('me/copartner/areas');
};

export const getCoPartnerListApi = async pincodeAreaId => {
  return get('me/copartner/list', { params: { pincodeAreaId } });
};

export const getCoPartnerSummaryApi = async pincodeAreaId => {
  return get('me/copartner/summary', { params: { pincodeAreaId } });
};

export const getCoPartnerCustomersApi = async params => {
  return get('me/copartner/customers', { params });
};

export const getCoPartnerOrdersApi = async params => {
  return get('me/copartner/orders', { params });
};

export const getCoPartnerPayoutsApi = async params => {
  return get('me/copartner/payouts', { params });
};
