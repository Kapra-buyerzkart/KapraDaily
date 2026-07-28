import axiosInstance from './axiosInstance';
import { setupInterceptors } from './interceptors';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

setupInterceptors(axiosInstance);

export const get = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const res = await axiosInstance.get<T>(url, config);
  return (res as any).data;
};

export const post = async <T = any>(url: string, payload?: any, config?: AxiosRequestConfig): Promise<T> => {
  const res = await axiosInstance.post<T>(url, payload, config);
  return (res as any).data;
};

export const put = async <T = any>(url: string, payload?: any): Promise<T> => {
  const res = await axiosInstance.put<T>(url, payload);
  return (res as any).data;
};

export const postRegister = async <T = any>(url: string, payload?: any): Promise<T> => {
  const res = await axiosInstance.post<T>(url, payload);
  return (res as any).data;
};

export const patch = async <T = any>(url: string, payload?: any): Promise<T> => {
  const res = await axiosInstance.patch<T>(url, payload);
  return (res as any).data;
};

export const getNew = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  return axiosInstance.get<T>(url, config);
};

export const deleteRequest = async <T = any>(url: string, payload?: any): Promise<T> => {
  const res = await axiosInstance.delete<T>(url, { data: payload });
  return (res as any).data;
};
