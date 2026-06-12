import { get, post, patch, deleteRequest } from './networkUtils';

/**
 * Fetches dashboard summary data including order count, address count, and wallet balances.
 * @returns {Promise<Object>} The dashboard data.
 */
export const getDashboardDataApi = async () => {
  return get('me/dashboard');
};

/**
 * Fetches detailed wallet data including bTokens, bCoins balances and transaction history.
 * @returns {Promise<Object>} The wallet and history data.
 */
export const getWalletDataApi = async () => {
  return get('me/bwallet');
};

/**
 * Redeems UD-coins using the specified amount and method.
 * @param {Object} payload The redemption details (requestedCoins, preferredMethod).
 * @returns {Promise<Object>} The API response.
 */
export const redeemBCoinsApi = async payload => {
  return post('me/bcoin/redeem', payload);
};
/**
 * Updates the user's profile details.
 * @param {Object} payload The updated profile details (name, email, etc.).
 * @returns {Promise<Object>} The API response.
 */
export const updateProfileApi = async payload => {
  return post('me/update', payload);
};

/**
 * Updates the user's profile details using PATCH.
 * @param {Object} payload The updated profile details (fullName, dob, gender).
 * @returns {Promise<Object>} The API response.
 */
export const updateProfilePatchApi = async payload => {
  return patch('me', payload);
};

/**
 * Changes the user's password.
 * @param {Object} payload The old and new passwords (oldPassword, newPassword, confirmPassword).
 * @returns {Promise<Object>} The API response.
 */
export const changePasswordApi = async payload => {
  return post('me/changepassword', payload);
};

/**
 * Requests an OTP for updating the user's email.
 * @param {Object} payload { newEmail }
 * @returns {Promise<Object>}
 */
export const requestEmailOtpApi = async payload => {
  return post('me/updateemail/requestotp', payload);
};

/**
 * Verifies the OTP and updates the user's email.
 * @param {Object} payload { newEmail, otp }
 * @returns {Promise<Object>}
 */
export const verifyEmailOtpApi = async payload => {
  return post('me/updateemail/verifyotp', payload);
};

/**
 * Requests an OTP for updating the user's phone number.
 * @param {Object} payload { newPhone }
 * @returns {Promise<Object>}
 */
export const requestPhoneOtpApi = async payload => {
  return post('me/updatephone/requestotp', payload);
};

/**
 * Verifies the OTP and updates the user's phone number.
 * @param {Object} payload { newPhone, otp }
 * @returns {Promise<Object>}
 */
export const verifyPhoneOtpApi = async payload => {
  return post('me/updatephone/verifyotp', payload);
};

/**
 * Fetches the referral history for the current user.
 * @param {number} page The page number.
 * @param {number} pageSize The number of items per page.
 * @returns {Promise<Object>} The API response.
 */
export const getReferralHistoryApi = async (page = 1, pageSize = 20) => {
  return get(`me/referrals`, { params: { page, pageSize } });
};

/**
 * Fetches general settings for the app.
 * @returns {Promise<Object>} The API response.
 */
export const getGeneralSettingsApi = async () => {
  return get('general/settings');
};
/**
 * Requests a product that is not currently available.
 * @param {Object} payload { requestdetails }
 * @returns {Promise<Object>}
 */
export const requestProductApi = async payload => {
  return post('me/requestproduct', payload);
};

/**
 * Fetches the history of UD-coin value changes.
 * @returns {Promise<Object>} The API response.
 */
export const getBCoinValueChangesApi = async () => {
  return get('general/bcoinvaluechanges');
};

/**
 * Checks for app updates.
 * @param {string} versioncode The current version code.
 * @param {string} platform The platform (ANDROID/IOS).
 * @param {string} apptype The app type (customer).
 * @returns {Promise<Object>} The API response.
 */
export const getAppUpdateCheckApi = async (
  versioncode,
  platform,
  apptype = 'customer',
) => {
  return get('general/appupdatecheck', {
    params: { versioncode, platform, apptype },
  });
};

/**
 * Deletes the current user's account.
 * @returns {Promise<Object>} The API response.
 */
export const deleteAccountApi = async () => {
  return deleteRequest('me');
};

/**
 * Fetches the areas for the co-partner dashboard.
 * @returns {Promise<Object>} The API response.
 */
export const getCoPartnerAreasApi = async () => {
  return get('me/copartner/areas');
};

/**
 * Fetches the co-partner list for a specific area.
 * @param {string|number} pincodeAreaId The ID of the area.
 * @returns {Promise<Object>} The API response.
 */
export const getCoPartnerListApi = async pincodeAreaId => {
  return get('me/copartner/list', { params: { pincodeAreaId } });
};

/**
 * Fetches the co-partner profile summary.
 * @param {string|number} pincodeAreaId The ID of the area.
 * @returns {Promise<Object>} The API response.
 */
export const getCoPartnerSummaryApi = async pincodeAreaId => {
  return get('me/copartner/summary', { params: { pincodeAreaId } });
};

/**
 * Fetches the co-partner customers (registration report).
 * @param {Object} params { pincodeAreaId, fromDate, toDate }
 * @returns {Promise<Object>} The API response.
 */
export const getCoPartnerCustomersApi = async params => {
  return get('me/copartner/customers', { params });
};

/**
 * Fetches the co-partner orders (order report).
 * @param {Object} params { pincodeAreaId, fromDate, toDate }
 * @returns {Promise<Object>} The API response.
 */
export const getCoPartnerOrdersApi = async params => {
  return get('me/copartner/orders', { params });
};

/**
 * Fetches the co-partner payouts (payout report).
 * @param {Object} params { pincodeAreaId, fromDate, toDate }
 * @returns {Promise<Object>} The API response.
 */
export const getCoPartnerPayoutsApi = async params => {
  return get('me/copartner/payouts', { params });
};
