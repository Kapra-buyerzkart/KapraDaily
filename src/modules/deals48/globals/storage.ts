// Storage seam for the 48hrs module.
//
// Standalone, this module read `profile` and `pincodeAreaId` straight out of
// AsyncStorage. Inside KapraDaily the host writes both to the Keychain-backed
// secureStore, so those reads would come back null and the homepage would be
// fetched with no area — hence this indirection.
//
// Two different kinds of key live here:
//   - SHARED  : owned by the host, read-only from this module. The delivery area
//               is a user-level fact, not a per-service one.
//   - MODULE  : owned by this module, namespaced so it cannot collide with the
//               host's identically-named keys.
import AsyncStorage from '@react-native-async-storage/async-storage';
import secureStore from '../../../utils/secureStore';

const MODULE_PROFILE_KEY = 'DEALS48_profile';

/** Delivery area, owned by the host app. Read-only from this module. */
export const getPincodeAreaId = async (): Promise<string | null> =>
  secureStore.getItem('pincodeAreaId');

/** Cached 48hrs profile — distinct from the host's KapraDaily profile. */
export const getCachedProfile = async (): Promise<string | null> =>
  AsyncStorage.getItem(MODULE_PROFILE_KEY);

export const setCachedProfile = async (profile: unknown): Promise<void> =>
  AsyncStorage.setItem(MODULE_PROFILE_KEY, JSON.stringify(profile));

export const clearCachedProfile = async (): Promise<void> =>
  AsyncStorage.removeItem(MODULE_PROFILE_KEY);
