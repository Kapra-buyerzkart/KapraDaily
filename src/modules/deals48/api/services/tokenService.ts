// 48hrs Deals authenticates against its own backend, so its tokens must never
// share storage keys with the host app's session — identical keys would mean
// logging into one service silently invalidates the other. Keys are prefixed,
// and persistence goes through the host's Keychain-backed secureStore seam
// rather than plain AsyncStorage.
import secureStore from '../../../../utils/secureStore';

const ACCESS_TOKEN = 'DEALS48_ACCESS_TOKEN';
const REFRESH_TOKEN = 'DEALS48_REFRESH_TOKEN';
const RESET_TOKEN = 'DEALS48_RESET_TOKEN';

// Mirrors the host app's access-token cache (src/api/tokenService.js) so this
// module's interceptor stops paying a native Keychain round-trip per request.
// The cache is deliberately module-local: sharing one with the host would let a
// 48hrs Deals session leak into host requests, which is exactly what the
// separate key prefixes above exist to prevent.
let cachedAccessToken: string | null = null;
let accessTokenLoaded = false;
let inFlightAccessRead: Promise<string | null> | null = null;

const setAccessTokenCache = (value: string | null): void => {
    cachedAccessToken = value;
    accessTokenLoaded = true;
    inFlightAccessRead = null;
};

export const setTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
    accessTokenLoaded = false;
    inFlightAccessRead = null;
    await secureStore.multiSet([
        [ACCESS_TOKEN, accessToken],
        [REFRESH_TOKEN, refreshToken],
    ]);
    setAccessTokenCache(accessToken);
};

export const getAccessToken = async (): Promise<string | null> => {
    if (accessTokenLoaded) return cachedAccessToken;
    if (inFlightAccessRead) return inFlightAccessRead;

    inFlightAccessRead = secureStore
        .getItem(ACCESS_TOKEN)
        .then((token: string | null) => {
            if (inFlightAccessRead) setAccessTokenCache(token);
            return token;
        })
        .catch((error: unknown) => {
            inFlightAccessRead = null;
            throw error;
        });

    return inFlightAccessRead;
};

export const getRefreshToken = (): Promise<string | null> =>
    secureStore.getItem(REFRESH_TOKEN);

export const clearTokens = async (): Promise<void> => {
    accessTokenLoaded = false;
    inFlightAccessRead = null;
    await secureStore.multiRemove([ACCESS_TOKEN, REFRESH_TOKEN, RESET_TOKEN]);
    setAccessTokenCache(null);
};

export const setResetToken = async (resetToken: string): Promise<void> => {
    await secureStore.setItem(RESET_TOKEN, resetToken);
};

export const getResetToken = (): Promise<string | null> =>
    secureStore.getItem(RESET_TOKEN);

export const clearResetToken = async (): Promise<void> => {
    await secureStore.removeItem(RESET_TOKEN);
};
