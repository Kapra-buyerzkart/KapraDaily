import { TokenStore } from './createTokenStore';

export interface CreateApiClientOptions {
  baseUrl: string;
  tokenStore: TokenStore;
  headers?: Record<string, string>;
  timeout?: number;
  label?: string;
}

export interface ApiClient {
  instance: any;
  get: (url: string, config?: any) => Promise<any>;
  post: (url: string, payload?: any, config?: any) => Promise<any>;
  put: (url: string, payload?: any) => Promise<any>;
  patch: (url: string, payload?: any) => Promise<any>;
  postRegister: (url: string, payload?: any) => Promise<any>;
  getNew: (url: string, config?: any) => Promise<any>;
  deleteRequest: (url: string, payload?: any) => Promise<any>;
  resetNetworkState: () => void;
  setLogoutHandler: (handler: (force?: boolean) => void) => void;
}

declare const createApiClient: (options: CreateApiClientOptions) => ApiClient;

export default createApiClient;
