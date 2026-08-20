import { setTokens, clearTokens, getAccessToken } from './services/tokenService';
import { clearCachedProfile } from '../globals/storage';
import { DEV_ACCESS_TOKEN } from '../globals/config';

interface HostAuthData {
  kshope?: {
    success?: boolean;
    accessToken?: string;
    refreshToken?: string;
    custId?: number | null;
  };
}

export const syncDeals48Session = async (
  authData: HostAuthData | null | undefined,
): Promise<boolean> => {
  const kshope = authData?.kshope;
  const accessToken = kshope?.accessToken || DEV_ACCESS_TOKEN;
  const refreshToken = kshope?.accessToken ? kshope?.refreshToken : '';

  if (!accessToken) {
    await clearTokens();
    return false;
  }

  await setTokens(accessToken, refreshToken || '');
  return true;
};

export const ensureDeals48Session = async (): Promise<boolean> => {
  const existingToken = await getAccessToken();
  if (existingToken) return true;
  if (!DEV_ACCESS_TOKEN) return false;

  await setTokens(DEV_ACCESS_TOKEN, '');
  return true;
};

export const clearDeals48Session = async (): Promise<void> => {
  await clearTokens();
  await clearCachedProfile();
};
