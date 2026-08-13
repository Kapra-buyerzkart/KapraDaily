import AsyncStorage from '@react-native-async-storage/async-storage';
import secureStore from '../../../utils/secureStore';

const MODULE_PROFILE_KEY = 'DEALS48_profile';

export const getPincodeAreaId = async (): Promise<string | null> =>
  secureStore.getItem('pincodeAreaId');

export const getCachedProfile = async (): Promise<string | null> =>
  AsyncStorage.getItem(MODULE_PROFILE_KEY);

export const setCachedProfile = async (profile: unknown): Promise<void> =>
  AsyncStorage.setItem(MODULE_PROFILE_KEY, JSON.stringify(profile));

export const clearCachedProfile = async (): Promise<void> =>
  AsyncStorage.removeItem(MODULE_PROFILE_KEY);
