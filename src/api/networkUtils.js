import axios from 'axios';
import CONFIG from '../globals/config';
import logger from '../utils/logger';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from './tokenService';

let logoutHandler = () => {
  logger.warn('⚠️ [API]: Logout handler called but not registered.');
};

let isLoggingOut = false;

/**
 * Registers a callback for handling 401 Unauthorized logouts from the network layer.
 * @param {Function} handler The logout function to be called on auth failure.
 */
export const setLogoutHandler = handler => {
  logoutHandler = handler;
};

/* -------------------- HELPERS -------------------- */
const checkAuthApi = url => {
  if (!url) return false;
  return (
    url.includes('auth/loginpassword') ||
    url.includes('auth/sendotp') ||
    url.includes('auth/verifyotp') ||
    url.includes('auth/checkphone') ||
    url.includes('auth/resendotp') ||
    url.includes('auth/register') ||
    url.includes('auth/refreshtoken') ||
    url.includes('auth/resetpassword') ||
    url.includes('sendotpmail') ||
    url.includes('verifyotpmail')
  );
};

// Endpoints that make up the payment flows (cart order + voucher purchase).
// Traffic on these is dumped raw via `logger.debug` — dev-only — so a failed
// payment can be traced end to end without redaction hiding the gateway ids and
// signatures you actually need to compare against the Razorpay console.
const PAYMENT_URL_PATTERNS = [
  'payments/razorpay',
  'order/create',
  'confirmcod',
  '/summary',
  'vouchers/',
];

const isPaymentApi = url =>
  !!url && PAYMENT_URL_PATTERNS.some(p => url.toLowerCase().includes(p));

// axios keeps the outgoing body on `config.data` as a serialized string; parse it
// back so it logs as an object instead of one long escaped line.
const safeParse = value => {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

/* -------------------- ERROR HANDLER -------------------- */
const errorHandler = error => {
  if (isPaymentApi(error?.config?.url)) {
    logger.debug('[PAY:http] ✖', error?.response?.status, error?.config?.url, {
      requestBody: safeParse(error?.config?.data),
      responseBody: error?.response?.data,
      message: error?.message,
      code: error?.code,
    });
  }

  logger.log(
    ' [API ERROR]:',
    error?.response?.status,
    error?.config?.url,
    error?.message,
  );

  // Dev-only body dump. `logger.log` is a no-op in production, so the response
  // payload (which can carry PII) never reaches release logs. Status + URL alone
  // don't say *which* field a 400 rejected — the body does.
  if (error?.response) {
    logger.log(' [API ERROR BODY]:', {
      url: error?.config?.url,
      status: error?.response?.status,
      requestBody: safeParse(error?.config?.data),
      responseBody: error?.response?.data,
    });
  }

  if (error.message === 'Network Error') {
    throw 'Network Error. Ensure you are connected to internet.';
  }

  if (error.code === 'ECONNABORTED') {
    throw 'Server is not responding';
  }

  const status = error?.response?.status;
  const message =
    error?.response?.data?.Message ||
    error?.response?.data?.message ||
    (error?.response?.data?.errors
      ? Object.values(error?.response?.data?.errors).flat().join(', ')
      : null) ||
    // ASP.NET ProblemDetails 400s often carry only these two.
    error?.response?.data?.detail ||
    error?.response?.data?.title;

  const isAuthApi = checkAuthApi(error?.config?.url);

  // 401 and other auth errors are handled by the response interceptor

  // Handle specific database identity conflicts (FK_Carts_Customers)
  if (
    typeof message === 'string' &&
    (message.includes('FK_Carts_Customers') ||
      (message.includes('conflict') && message.includes('custId')))
  ) {
    logger.log(
      '[API]: Database identity conflict detected (error), triggering logout.',
    );
    if (!isLoggingOut) {
      isLoggingOut = true;
      logoutHandler(true);
      setTimeout(() => {
        isLoggingOut = false;
      }, 2000);
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

    const fullUrl = config.baseURL
      ? `${config.baseURL}${config.url}`
      : config.url;

    if (!isAuthApi) {
      const token = await getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (isPaymentApi(config.url)) {
      logger.debug('[PAY:http] →', config.method?.toUpperCase(), fullUrl, {
        params: config.params,
        body: safeParse(config.data),
      });
    }

    return config;
  },
  error => Promise.reject(error),
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
  logger.log(' [API]: Network state reset.');
};

/* -------------------- RESPONSE INTERCEPTOR -------------------- */
axiosInstance.interceptors.response.use(
  response => {
    if (isPaymentApi(response?.config?.url)) {
      logger.debug(
        '[PAY:http] ←',
        response.status,
        response?.config?.url,
        response.data,
      );
    }

    // Check for specific database errors that imply an invalid session even if the status is 200 OK
    const data = response.data;
    if (data && data.success === false && data.message) {
      const msg = String(data.message);
      if (
        msg.includes('FK_Carts_Customers') ||
        (msg.includes('conflict') && msg.includes('custId'))
      ) {
        logger.log(
          '[API]: Database identity conflict detected (success branch), triggering logout.',
        );
        if (!isLoggingOut) {
          isLoggingOut = true;
          logoutHandler(true);
          setTimeout(() => {
            isLoggingOut = false;
          }, 2000);
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
        logger.log(
          ' [API]: No refresh token available. hadAuthHeader:',
          hadAuthHeader,
        );

        if (hadAuthHeader) {
          if (!isLoggingOut) {
            isLoggingOut = true;
            logoutHandler(true);
            setTimeout(() => {
              isLoggingOut = false;
            }, 3000);
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
        logger.log('🔄 [API]: Attempting token refresh...');
        const res = await axios.post(`${CONFIG.base_url}auth/refreshtoken`, {
          refreshToken: refreshToken,
        });

        // Do NOT log the response body — it contains access/refresh tokens.
        logger.log('🔄 [API]: Refresh response received:', res.status);

        // API returns { success, data: { accessToken, refreshToken } }
        const apiData = res.data?.data || res.data?.Data || res.data;
        const newAccessToken = apiData?.accessToken || apiData?.access_token;
        const newRefreshToken = apiData?.refreshToken || apiData?.refresh_token;

        if (newAccessToken) {
          logger.log('✅ [API]: Token refresh successful, storing new tokens');
          await setTokens(newAccessToken, newRefreshToken || refreshToken);
          processQueue(null, newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } else {
          throw new Error('New access token not found in refresh response');
        }
      } catch (err) {
        logger.log(
          '🔒 [API]: Token refresh failed:',
          err?.response?.status || err?.message,
        );
        processQueue(err);
        await clearTokens();
        if (!isLoggingOut) {
          isLoggingOut = true;
          logoutHandler(true);
          setTimeout(() => {
            isLoggingOut = false;
          }, 3000);
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    errorHandler(error);
  },
);

/* -------------------- API METHODS -------------------- */
export const get = async (url, config) => {
  const res = await axiosInstance.get(url, config);
  // logger.log('res.data', res.data)
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
