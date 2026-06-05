import axios from 'axios';
import CONFIG from '../globals/config';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from './tokenService';

let logoutHandler = () => {
  console.warn('⚠️ [API]: Logout handler called but not registered.');
};

let isLoggingOut = false;

/**
 * Registers a callback for handling 401 Unauthorized logouts from the network layer.
 * @param {Function} handler The logout function to be called on auth failure.
 */
export const setLogoutHandler = (handler) => {
  logoutHandler = handler;
};

/* -------------------- HELPERS -------------------- */
const checkAuthApi = (url) => {
  if (!url) return false;
  return url.includes('auth/loginpassword') ||
    url.includes('auth/sendotp') ||
    url.includes('auth/verifyotp') ||
    url.includes('auth/checkphone') ||
    url.includes('auth/resendotp') ||
    url.includes('auth/register') ||
    url.includes('auth/refreshtoken') ||
    url.includes('auth/resetpassword');
};

/* -------------------- ERROR HANDLER -------------------- */
const errorHandler = error => {
  console.log('❌ [API ERROR]:', error?.response?.data || error?.message || error);

  if (error.message === 'Network Error') {
    throw 'Network Error. Ensure you are connected to internet.';
  }

  if (error.code === 'ECONNABORTED') {
    throw 'Server is not responding';
  }

  const status = error?.response?.status;
  const message = error?.response?.data?.Message ||
    error?.response?.data?.message ||
    (error?.response?.data?.errors ? Object.values(error?.response?.data?.errors).flat().join(', ') : null);

  const isAuthApi = checkAuthApi(error?.config?.url);

  // 401 and other auth errors are handled by the response interceptor

  // Handle specific database identity conflicts (FK_Carts_Customers)
  if (typeof message === 'string' && (message.includes('FK_Carts_Customers') || (message.includes('conflict') && message.includes('custId')))) {
    console.log('🔒 [API]: Database identity conflict detected (error), triggering logout.');
    if (!isLoggingOut) {
      isLoggingOut = true;
      logoutHandler(true);
      setTimeout(() => { isLoggingOut = false; }, 2000);
    }
    throw { Message: 'Session expired, please login again.', status: 401 };
  }

  if (typeof message === 'string' && message.length > 0) {
    const errorWithMeta = new Error(message);
    errorWithMeta.data = error?.response?.data;
    errorWithMeta.status = status;
    errorWithMeta.response = error?.response;
    throw errorWithMeta;
  }

  const genericError = new Error('Something went wrong.');
  genericError.data = error?.response?.data;
  throw genericError;
};

/* -------------------- AXIOS INSTANCE -------------------- */
const axiosInstance = axios.create({
  baseURL: CONFIG.base_url,
  headers: {
    lang: '2',
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

/* -------------------- REQUEST INTERCEPTOR -------------------- */
axiosInstance.interceptors.request.use(
  async config => {
    const isAuthApi = checkAuthApi(config.url);

    const fullUrl = config.baseURL ? `${config.baseURL}${config.url}` : config.url;
    console.log('API URL 👉', fullUrl, 'isAuthApi 👉', isAuthApi);

    if (!isAuthApi) {
      const token = await getAccessToken();
      // console.log('tokentoken', token)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  error => Promise.reject(error)
);

/* -------------------- REFRESH TOKEN LOGIC -------------------- */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

/**
 * Resets the internal state of the network utility.
 * Useful during logout to clear any pending refresh attempts or queues.
 */
export const resetNetworkState = () => {
  isRefreshing = false;
  isLoggingOut = false;
  failedQueue = [];
  console.log('🔄 [API]: Network state reset.');
};

/* -------------------- RESPONSE INTERCEPTOR -------------------- */
axiosInstance.interceptors.response.use(
  response => {
    // Check for specific database errors that imply an invalid session even if the status is 200 OK
    const data = response.data;
    if (data && data.success === false && data.message) {
      const msg = String(data.message);
      if (msg.includes('FK_Carts_Customers') || (msg.includes('conflict') && msg.includes('custId'))) {
        console.log('🔒 [API]: Database identity conflict detected (success branch), triggering logout.');
        if (!isLoggingOut) {
          isLoggingOut = true;
          logoutHandler(true);
          setTimeout(() => { isLoggingOut = false; }, 2000);
        }
      }
    }
    return response;
  },
  async error => {
    const originalRequest = error.config;
    const isAuthApi = checkAuthApi(originalRequest?.url);

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthApi
    ) {
      originalRequest._retry = true;

      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        const hadAuthHeader = !!originalRequest.headers?.Authorization;
        console.log('🔒 [API]: No refresh token available. hadAuthHeader:', hadAuthHeader);

        // Only yank user to LoginScreen with "Session expired" if they *were* logged in
        if (hadAuthHeader) {
          if (!isLoggingOut) {
            isLoggingOut = true;
            logoutHandler(true);
            setTimeout(() => { isLoggingOut = false; }, 3000);
          }
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        console.log('🔄 [API]: Attempting token refresh...');
        const res = await axios.post(
          `${CONFIG.base_url}auth/refreshtoken`,
          { refreshToken: refreshToken }
        );

        console.log('🔄 [API]: Refresh response:', JSON.stringify(res.data));

        // API returns { success, data: { accessToken, refreshToken } }
        const apiData = res.data?.data || res.data?.Data || res.data;
        const newAccessToken = apiData?.accessToken || apiData?.access_token;
        const newRefreshToken = apiData?.refreshToken || apiData?.refresh_token;

        if (newAccessToken) {
          console.log('✅ [API]: Token refresh successful, storing new tokens');
          // Store both new access token AND new refresh token
          await setTokens(newAccessToken, newRefreshToken || refreshToken);
          processQueue(null, newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } else {
          throw new Error('New access token not found in refresh response');
        }
      } catch (err) {
        console.log('🔒 [API]: Token refresh failed:', err?.response?.data || err?.message);
        processQueue(err);
        await clearTokens();
        // Both tokens invalid — session expired
        if (!isLoggingOut) {
          isLoggingOut = true;
          logoutHandler(true);
          setTimeout(() => { isLoggingOut = false; }, 3000);
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    errorHandler(error);
  }
);

/* -------------------- API METHODS -------------------- */
export const get = async (url, config) => {
  const res = await axiosInstance.get(url, config);
  // console.log('res.data', res.data)
  return res.data;
};

export const post = async (url, payload, config) => {
  const res = await axiosInstance.post(url, payload, config);
  return res.data;
};

export const put = async (url, payload) => {
  const res = await axiosInstance.put(url, payload);
  return res.data;
};

export const postRegister = async (url, payload) => {
  const res = await axiosInstance.post(url, payload);
  return res.data;
};

export const patch = async (url, payload) => {
  const res = await axiosInstance.patch(url, payload);
  return res.data;
};

export const getNew = async (url, config) => {
  return axiosInstance.get(url, config); // full response
};

export const deleteRequest = async (url, payload) => {
  const res = await axiosInstance.delete(url, { data: payload });
  return res.data;
};
