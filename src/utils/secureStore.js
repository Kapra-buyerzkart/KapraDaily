// Single seam for persisting SENSITIVE values (auth tokens, profile PII,
// selected-address pointer). Every sensitive read/write goes through here so
// the storage backend can be hardened in ONE place. Backed by
// react-native-keychain (Keychain Services on iOS, Keystore-backed
// EncryptedSharedPreferences-equivalent on Android) — callers do not change.
//
// Keychain has no native multi-key store — each secureStore key maps to its
// own Keychain "service" entry, so multiSet/multiRemove fan out per key.
import * as Keychain from 'react-native-keychain';

const getItem = async key => {
  const result = await Keychain.getGenericPassword({ service: key });
  return result ? result.password : null;
};

const setItem = (key, value) =>
  Keychain.setGenericPassword(key, value, { service: key });

const removeItem = key => Keychain.resetGenericPassword({ service: key });

const multiSet = pairs => Promise.all(pairs.map(([key, value]) => setItem(key, value)));

const multiRemove = keys => Promise.all(keys.map(removeItem));

const secureStore = {
  getItem,
  setItem,
  removeItem,
  multiSet,
  multiRemove,
};

export default secureStore;
