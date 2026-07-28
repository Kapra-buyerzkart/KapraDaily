// 48hrs Deals authenticates against its own backend, so its tokens must never
// share storage keys with the host app's session — identical keys would mean
// logging into one service silently invalidates the other. Keys are prefixed,
// and persistence goes through the host's Keychain-backed secureStore seam
// rather than plain AsyncStorage.
import secureStore from '../../../../utils/secureStore';

const ACCESS_TOKEN = 'DEALS48_ACCESS_TOKEN';
const REFRESH_TOKEN = 'DEALS48_REFRESH_TOKEN';
const RESET_TOKEN = 'DEALS48_RESET_TOKEN';

export const setTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
    await secureStore.multiSet([
        [ACCESS_TOKEN, accessToken],
        [REFRESH_TOKEN, refreshToken],
    ]);
};

export const getAccessToken = async (): Promise<string | null> => {
    return secureStore.getItem(ACCESS_TOKEN);
};

export const getRefreshToken = (): Promise<string | null> =>
    secureStore.getItem(REFRESH_TOKEN);

export const clearTokens = async (): Promise<void> => {
    await secureStore.multiRemove([ACCESS_TOKEN, REFRESH_TOKEN, RESET_TOKEN]);
};

export const setResetToken = async (resetToken: string): Promise<void> => {
    await secureStore.setItem(RESET_TOKEN, resetToken);
};

export const getResetToken = (): Promise<string | null> =>
    secureStore.getItem(RESET_TOKEN);

export const clearResetToken = async (): Promise<void> => {
    await secureStore.removeItem(RESET_TOKEN);
};
