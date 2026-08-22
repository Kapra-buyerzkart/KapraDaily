import CONFIG from '../globals/config';
import createApiClient from './createApiClient';
import hostTokenStore from './tokenService';

const hostClient = createApiClient({
  baseUrl: CONFIG.base_url,
  tokenStore: hostTokenStore,
  label: 'API',
});

export const setLogoutHandler = hostClient.setLogoutHandler;
export const resetNetworkState = hostClient.resetNetworkState;
export const get = hostClient.get;
export const post = hostClient.post;
export const put = hostClient.put;
export const patch = hostClient.patch;
export const postRegister = hostClient.postRegister;
export const getNew = hostClient.getNew;
export const deleteRequest = hostClient.deleteRequest;

export default hostClient.instance;
