import createTokenStore from '../../api/createTokenStore';

const kshopeTokenStore = createTokenStore('KSHOPE_');

export const {
  setTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  setResetToken,
  getResetToken,
  clearResetToken,
} = kshopeTokenStore;

export default kshopeTokenStore;
