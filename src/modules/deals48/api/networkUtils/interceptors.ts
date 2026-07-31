import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import CONFIG from '../../globals/config';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from '../services/tokenService';
import { errorHandler } from './errorHandler';
import * as NavigationService from '../NavigationService';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

export const setupInterceptors = (axiosInstance: AxiosInstance): void => {
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const isAuthApi =
        config.url?.includes('auth/loginpassword') ||
        config.url?.includes('auth/sendotp') ||
        config.url?.includes('auth/verifyotp') ||
        config.url?.includes('auth/checkphone') ||
        config.url?.includes('auth/register') ||
        config.url?.includes('auth/resendotp');

      const fullUrl = config.baseURL ? `${config.baseURL}${config.url}` : config.url;
      console.log('API URL 👉', fullUrl, 'isAuthApi 👉', isAuthApi);

      if (!isAuthApi) {
        const token = await getAccessToken();
        console.log("App token---->", token)
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      console.log('🔄 [API] Response Error:', error.response?.status, originalRequest?.url);

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('refreshtoken') &&
        !originalRequest.url?.includes('auth/loginpassword')
      ) {
        console.log('🔄 [API] 401 detected, attempting refresh...');
        if (isRefreshing) {
          console.log('🔄 [API] Refresh already in progress, queuing request...');
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = await getRefreshToken();
          console.log('🔄 [API] Refresh Token Found:', !!refreshToken);

          if (!refreshToken) throw new Error('No refresh token available');

          const res = await axios.post(
            `${CONFIG.base_url}/auth/refreshtoken`,
            { refresh_token: refreshToken }
          );

          console.log('🔄 [API] Refresh Response:', res.status, !!res.data);
          // Check for data nesting (Data vs data) and support both camelCase and snake_case
          const data = res.data.Data || res.data.data || res.data;
          const access_token = data.access_token || data.accessToken;
          const refresh_token = data.refresh_token || data.refreshToken;

          if (!access_token) {
            console.error('🔄 [API] Refresh Response Structure:', JSON.stringify(data).substring(0, 100));
            throw new Error('Refreshtoken response missing access_token');
          }

          console.log('🔄 [API] Refresh Success, updating tokens...');
          await setTokens(access_token, refresh_token || refreshToken);
          processQueue(null, access_token);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          return axiosInstance(originalRequest);
        } catch (err) {
          console.error('🔄 [API] Token Refresh Failed:', err);
          processQueue(err);
          await clearTokens();
          NavigationService.reset(NavigationService.AUTH_FALLBACK_ROUTE);
          throw err;
        } finally {
          isRefreshing = false;
        }
      }

      return errorHandler(error);
    }
  );
};
