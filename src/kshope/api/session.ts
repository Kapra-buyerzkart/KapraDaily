import kshopeTokenStore from './tokenService';
import { getAccessToken as getHostAccessToken } from '../../api/tokenService';
import { getUserIdFromToken } from '../../utils/jwt';
import secureStore from '../../utils/secureStore';
import logger from '../../utils/logger';
import { clearKshopeLocalData } from '../globals/storage';

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

const KSHOPE_LOCAL_KEYS = ['KSHOPE_HOST_CUST_ID'];
const KSHOPE_HOST_CUST_ID_KEY = 'KSHOPE_HOST_CUST_ID';

const wipe = async (): Promise<void> => {
  await kshopeTokenStore.clearTokens();
  await secureStore.multiRemove(KSHOPE_LOCAL_KEYS);
  await clearKshopeLocalData();
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

    const hostCustId =
      authData?.custId ?? getUserIdFromToken(await getHostAccessToken());
    if (hostCustId !== null && hostCustId !== undefined) {
      await secureStore.setItem(KSHOPE_HOST_CUST_ID_KEY, String(hostCustId));
    }

    return true;
  } catch (error) {
    logger.error('[kshope] syncKshopeSession failed', error);
    return false;
  }
};

export const ensureKshopeSession = async (): Promise<boolean> => {
  const moduleToken = await kshopeTokenStore.getAccessToken();
  if (!moduleToken) return false;

  const storedHostCustId = await secureStore.getItem(KSHOPE_HOST_CUST_ID_KEY);
  const currentHostCustId = getUserIdFromToken(await getHostAccessToken());

  if (
    !storedHostCustId ||
    currentHostCustId === null ||
    storedHostCustId !== String(currentHostCustId)
  ) {
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
