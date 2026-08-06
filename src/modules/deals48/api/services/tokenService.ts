import secureStore from '../../../../utils/secureStore';

const ACCESS_TOKEN = 'DEALS48_ACCESS_TOKEN';
const REFRESH_TOKEN = 'DEALS48_REFRESH_TOKEN';
const RESET_TOKEN = 'DEALS48_RESET_TOKEN';

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
