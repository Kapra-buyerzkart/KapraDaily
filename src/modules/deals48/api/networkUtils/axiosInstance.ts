import axios, { AxiosInstance } from 'axios';
import CONFIG from '../../globals/config';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: CONFIG.base_url,
  headers: {
    lang: '2',
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

export default axiosInstance;
