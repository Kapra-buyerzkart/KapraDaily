import axios from 'axios';
import CONFIG from '../globals/config';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from './tokenService';

/* -------------------- ERROR HANDLER -------------------- */
const errorHandler = error => {
  if (error.message === 'Network Error') {
    throw 'Network Error. Ensure you are connected to internet.';
  }

  if (error.code === 'ECONNABORTED') {
    throw 'Server is not responding';
  }

  const status = error?.response?.status;
  const message = error?.response?.data?.Message;

  if (status === 401) {
    throw { Message: message || 'Unauthorized', status };
  }

  if (typeof message === 'string') {
    throw message;
  }

  throw 'Something went wrong.';
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
    const isAuthApi =
      config.url?.includes('loginpassword') ||
      config.url?.includes('sendotp') ||
      config.url?.includes('verifyotp');

    console.log('API URL 👉', config.url, 'isAuthApi 👉', isAuthApi);

    if (!isAuthApi) {
      const token = await getAccessToken();
      console.log('tokentoken', token)
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

/* -------------------- RESPONSE INTERCEPTOR -------------------- */
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('refreshtoken')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();

        const res = await axios.post(
          `${CONFIG.base_url}/auth/refreshtoken`,
          { refresh_token: refreshToken }
        );

        const { access_token, refresh_token } = res.data.Data;
        console.log('access_token', access_token)

        await setTokens(access_token, refresh_token);
        processQueue(null, access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err);
        await clearTokens();
        throw err;
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
  console.log('res.data', res.data)
  return res.data;
};

export const post = async (url, payload, config) => {
  const res = await axiosInstance.post(url, payload, config);
  return res.data;
};

export const put = async (url, payload) => {
  const res = await axiosInstance.put(url, payload);
  return res.data.Data;
};

export const postRegister = async (url, payload) => {
  const res = await axiosInstance.post(url, payload);
  return res.data.Data;
};

export const getNew = async (url, config) => {
  return axiosInstance.get(url, config); // full response
};
