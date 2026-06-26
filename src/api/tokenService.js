// Auth tokens are sensitive — persist them only through the secureStore seam so
// the backing store can be hardened (Keychain/Keystore) in one place.
import secureStore from '../utils/secureStore';

const ACCESS_TOKEN = 'ACCESS_TOKEN';
const REFRESH_TOKEN = 'REFRESH_TOKEN';
const RESET_TOKEN = 'RESET_TOKEN';

export const setTokens = async (accessToken, refreshToken) => {
    await secureStore.multiSet([
        [ACCESS_TOKEN, accessToken],
        [REFRESH_TOKEN, refreshToken],
    ]);
};

export const getAccessToken = () =>
    secureStore.getItem(ACCESS_TOKEN);

export const getRefreshToken = () =>
    secureStore.getItem(REFRESH_TOKEN);

export const clearTokens = async () => {
    await secureStore.multiRemove([ACCESS_TOKEN, REFRESH_TOKEN, RESET_TOKEN]);
};

export const setResetToken = async (resetToken) => {
    await secureStore.setItem(RESET_TOKEN, resetToken);
};

export const getResetToken = () =>
    secureStore.getItem(RESET_TOKEN);

export const clearResetToken = async () => {
    await secureStore.removeItem(RESET_TOKEN);
};
