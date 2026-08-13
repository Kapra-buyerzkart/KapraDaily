import secureStore from '../utils/secureStore';

const ACCESS_TOKEN = 'ACCESS_TOKEN';
const REFRESH_TOKEN = 'REFRESH_TOKEN';
const RESET_TOKEN = 'RESET_TOKEN';

let cachedAccessToken = null;
let accessTokenLoaded = false;
let inFlightAccessRead = null;

const setAccessTokenCache = value => {
    cachedAccessToken = value;
    accessTokenLoaded = true;
    inFlightAccessRead = null;
};

export const setTokens = async (accessToken, refreshToken) => {
    accessTokenLoaded = false;
    inFlightAccessRead = null;
    await secureStore.multiSet([
        [ACCESS_TOKEN, accessToken],
        [REFRESH_TOKEN, refreshToken],
    ]);
    setAccessTokenCache(accessToken);
};

export const getAccessToken = async () => {
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

export const getRefreshToken = () =>
    secureStore.getItem(REFRESH_TOKEN);

export const clearTokens = async () => {
    accessTokenLoaded = false;
    inFlightAccessRead = null;
    await secureStore.multiRemove([ACCESS_TOKEN, REFRESH_TOKEN, RESET_TOKEN]);
    setAccessTokenCache(null);
};

export const setResetToken = async (resetToken) => {
    await secureStore.setItem(RESET_TOKEN, resetToken);
};

export const getResetToken = () =>
    secureStore.getItem(RESET_TOKEN);

export const clearResetToken = async () => {
    await secureStore.removeItem(RESET_TOKEN);
};
