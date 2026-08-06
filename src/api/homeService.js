import { get, post } from './networkUtils';
import logger from '../utils/logger';
import CONFIG from '../globals/config';

export const getHomepageData = async (pincodeAreaId, blocksize = 100) => {
  const config = {
    params: {
      pincodeAreaId,
      blocksize,
    },
  };
  logger.debug('[API REQUEST]: homepage', config.params);
  console.log(
    '[HOMEPAGE API]',
    `${CONFIG.base_url}homepage?pincodeAreaId=${pincodeAreaId}&blocksize=${blocksize}`,
  );
  const response = await get('homepage', config);
  console.log('[HOMEPAGE API RESPONSE]', response);
  return response;
};

export const getCategoryProducts = async (catId, pincodeAreaId) => {
  const config = {
    params: {
      catId,
      pincodeAreaId,
    },
  };

  return get('homepage/categoryproducts', config);
};
export const postPopupSeenApi = async popupId => {
  return post('homepage/popup/seen', { popupId });
};
