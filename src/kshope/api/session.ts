import kshopeTokenStore from './tokenService';
import { getAccessToken as getHostAccessToken } from '../../api/tokenService';
import { getUserIdFromToken } from '../../utils/jwt';
import secureStore from '../../utils/secureStore';
import logger from '../../utils/logger';

export interface HostAuthData {
  custId?: number | null;
  customer?: {
    udenCustId?: number | null;
    kshopeCustId?: number | null;
  };
  kshope?: {
    success?: boolean;
    status?: string;
    message?: string;
    accessToken?: string;
    refreshToken?: string;
    custId?: number | null;
  };
}

const KSHOPE_LOCAL_KEYS = ['KSHOPE_PROFILE', 'KSHOPE_PINCODE_AREA_ID'];

const wipe = async (): Promise<void> => {
  await kshopeTokenStore.clearTokens();
  await secureStore.multiRemove(KSHOPE_LOCAL_KEYS);
};

export const syncKshopeSession = async (
  authData: HostAuthData | null | undefined,
): Promise<boolean> => {
  try {
    const kshope = authData?.kshope;

    if (kshope?.success === false || !kshope?.accessToken) {
      await wipe();
      return false;
    }

    await kshopeTokenStore.setTokens(kshope.accessToken, kshope.refreshToken || '');
    return true;
  } catch (error) {
    logger.error('[kshope] syncKshopeSession failed', error);
    return false;
  }
};

export const ensureKshopeSession = async (): Promise<boolean> => {
  const moduleToken = await kshopeTokenStore.getAccessToken();
  if (!moduleToken) return false;

  const hostToken = await getHostAccessToken();
  const hostCustId = getUserIdFromToken(hostToken);
  const moduleCustId = getUserIdFromToken(moduleToken);

  if (hostCustId !== null && moduleCustId !== null && hostCustId !== moduleCustId) {
    await wipe();
    return false;
  }

  return true;
};

export const clearKshopeSession = async (): Promise<void> => {
  try {
    await wipe();
  } catch (error) {
    logger.error('[kshope] clearKshopeSession failed', error);
  }
};
