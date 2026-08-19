import { setTokens, clearTokens } from './services/tokenService';
import { clearCachedProfile } from '../globals/storage';

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
  const accessToken = kshope?.accessToken;
  const refreshToken = kshope?.refreshToken;

  if (!accessToken) {
    await clearTokens();
    return false;
  }

  await setTokens(accessToken, refreshToken || '');
  return true;
};

export const clearDeals48Session = async (): Promise<void> => {
  await clearTokens();
  await clearCachedProfile();
};
