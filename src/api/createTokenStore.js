import secureStore from '../utils/secureStore';

const createTokenStore = (prefix = '') => {
  const ACCESS_TOKEN = `${prefix}ACCESS_TOKEN`;
  const REFRESH_TOKEN = `${prefix}REFRESH_TOKEN`;
  const RESET_TOKEN = `${prefix}RESET_TOKEN`;

  let cachedAccessToken = null;
  let accessTokenLoaded = false;
  let inFlightAccessRead = null;

  const setAccessTokenCache = value => {
    cachedAccessToken = value;
    accessTokenLoaded = true;
    inFlightAccessRead = null;
  };

  const setTokens = async (accessToken, refreshToken) => {
    accessTokenLoaded = false;
    inFlightAccessRead = null;
    await secureStore.multiSet([
      [ACCESS_TOKEN, accessToken],
      [REFRESH_TOKEN, refreshToken],
    ]);
    setAccessTokenCache(accessToken);
  };

  const getAccessToken = async () => {
    if (accessTokenLoaded) return cachedAccessToken;
    if (inFlightAccessRead) return inFlightAccessRead;

    inFlightAccessRead = secureStore
      .getItem(ACCESS_TOKEN)
      .then(token => {
        if (inFlightAccessRead) setAccessTokenCache(token);
        return token;
      })
      .catch(error => {
        inFlightAccessRead = null;
        throw error;
      });

    return inFlightAccessRead;
  };

  const getRefreshToken = () => secureStore.getItem(REFRESH_TOKEN);

  const clearTokens = async () => {
    accessTokenLoaded = false;
    inFlightAccessRead = null;
    await secureStore.multiRemove([ACCESS_TOKEN, REFRESH_TOKEN, RESET_TOKEN]);
    setAccessTokenCache(null);
  };

  const setResetToken = resetToken => secureStore.setItem(RESET_TOKEN, resetToken);

  const getResetToken = () => secureStore.getItem(RESET_TOKEN);

  const clearResetToken = () => secureStore.removeItem(RESET_TOKEN);

  return {
    setTokens,
    getAccessToken,
    getRefreshToken,
    clearTokens,
    setResetToken,
    getResetToken,
    clearResetToken,
  };
};

export default createTokenStore;
