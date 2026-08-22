import createApiClient from '../../api/createApiClient';
import KSHOPE_CONFIG from '../globals/config';
import kshopeTokenStore from './tokenService';

const kshopeClient = createApiClient({
  baseUrl: KSHOPE_CONFIG.base_url,
  tokenStore: kshopeTokenStore,
  label: 'KSHOPE',
});

export const setLogoutHandler = kshopeClient.setLogoutHandler;
export const resetNetworkState = kshopeClient.resetNetworkState;
export const get = kshopeClient.get;
export const post = kshopeClient.post;
export const put = kshopeClient.put;
export const patch = kshopeClient.patch;
export const postRegister = kshopeClient.postRegister;
export const getNew = kshopeClient.getNew;
export const deleteRequest = kshopeClient.deleteRequest;

export default kshopeClient.instance;
