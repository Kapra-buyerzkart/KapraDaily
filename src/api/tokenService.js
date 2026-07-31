// Auth tokens are sensitive — persist them only through the secureStore seam so
// the backing store can be hardened (Keychain/Keystore) in one place.
import secureStore from '../utils/secureStore';

const ACCESS_TOKEN = 'ACCESS_TOKEN';
const REFRESH_TOKEN = 'REFRESH_TOKEN';
const RESET_TOKEN = 'RESET_TOKEN';

// The request interceptor reads the access token on EVERY call, and each read is
// a native Keychain/Keystore round-trip (tens of ms on Android). Cache it in
// memory instead: `accessTokenLoaded` distinguishes "cached as absent" (a guest,
// which is a legitimate null) from "never read", so guests stop paying for a
// Keychain miss per request too. `inFlightAccessRead` collapses the burst of
// concurrent reads at startup into a single one.
//
// Every write path below invalidates the cache, and setTokens/clearTokens are
// the only writers in the app — so the cache cannot drift from the Keychain.
let cachedAccessToken = null;
let accessTokenLoaded = false;
let inFlightAccessRead = null;

const setAccessTokenCache = value => {
    cachedAccessToken = value;
    accessTokenLoaded = true;
    inFlightAccessRead = null;
};

export const setTokens = async (accessToken, refreshToken) => {
    // Invalidate before the write so a read racing the persist can't re-cache
    // the previous token and hold it after this resolves.
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
            // A write may have landed while this read was in flight; that write
            // clears inFlightAccessRead, so only cache when ours is still current.
            if (inFlightAccessRead) setAccessTokenCache(token);
            return token;
        })
        .catch(error => {
            inFlightAccessRead = null;
            throw error;
        });

    return inFlightAccessRead;
};

// Read on the 401 refresh path only, which is rare — left uncached so it always
// reflects what is actually persisted.
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
