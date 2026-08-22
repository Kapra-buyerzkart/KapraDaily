import createTokenStore from './createTokenStore';

const hostTokenStore = createTokenStore('');

export const setTokens = hostTokenStore.setTokens;
export const getAccessToken = hostTokenStore.getAccessToken;
export const getRefreshToken = hostTokenStore.getRefreshToken;
export const clearTokens = hostTokenStore.clearTokens;
export const setResetToken = hostTokenStore.setResetToken;
export const getResetToken = hostTokenStore.getResetToken;
export const clearResetToken = hostTokenStore.clearResetToken;

export default hostTokenStore;
