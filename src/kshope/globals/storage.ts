import AsyncStorage from '@react-native-async-storage/async-storage';
import KSHOPE_CONFIG from './config';

export const KSHOPE_KEYS = Object.freeze({
  AREA_ID: 'KSHOPE_PINCODE_AREA_ID',
  PROFILE: 'KSHOPE_PROFILE',
  SELECTED_ADDRESS_ID: 'KSHOPE_SELECTED_ADDRESS_ID',
  RECENT_SEARCHES: 'KSHOPE_RECENT_SEARCHES',
});

export const getKshopeAreaId = async (): Promise<number | null> => {
  const raw = await AsyncStorage.getItem(KSHOPE_KEYS.AREA_ID);
  if (raw === null) return null;
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

export const setKshopeAreaId = async (id: number | null): Promise<void> => {
  if (id === null || id === undefined) {
    await AsyncStorage.removeItem(KSHOPE_KEYS.AREA_ID);
    return;
  }
  await AsyncStorage.setItem(KSHOPE_KEYS.AREA_ID, String(id));
};

export const ensureKshopeAreaId = async (): Promise<number> => {
  const existing = await getKshopeAreaId();
  if (existing !== null) return existing;
  await setKshopeAreaId(KSHOPE_CONFIG.default_pincode_area_id);
  return KSHOPE_CONFIG.default_pincode_area_id;
};

export const getSelectedAddressId = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(KSHOPE_KEYS.SELECTED_ADDRESS_ID);
};

export const setSelectedAddressId = async (id: string | number | null): Promise<void> => {
  if (id === null || id === undefined || String(id).length === 0) {
    await AsyncStorage.removeItem(KSHOPE_KEYS.SELECTED_ADDRESS_ID);
    return;
  }
  await AsyncStorage.setItem(KSHOPE_KEYS.SELECTED_ADDRESS_ID, String(id));
};

export const getCachedProfile = async (): Promise<any | null> => {
  const raw = await AsyncStorage.getItem(KSHOPE_KEYS.PROFILE);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setCachedProfile = async (profile: any): Promise<void> => {
  await AsyncStorage.setItem(KSHOPE_KEYS.PROFILE, JSON.stringify(profile));
};

export const clearKshopeLocalData = async (): Promise<void> => {
  await AsyncStorage.multiRemove(Object.values(KSHOPE_KEYS));
};
