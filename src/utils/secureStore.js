// Single seam for persisting SENSITIVE values (auth tokens, sensitive profile
// fields). Every sensitive read/write should go through here so the storage
// backend can be hardened in ONE place.
//
// Current backend: AsyncStorage (NOT encrypted on Android). To harden, swap the
// implementation below to react-native-keychain (tokens) and/or
// react-native-encrypted-storage (PII) — callers do not change. See the
// security remediation plan (P2) for the migration notes.
import AsyncStorage from '@react-native-async-storage/async-storage';

const secureStore = {
  getItem: key => AsyncStorage.getItem(key),
  setItem: (key, value) => AsyncStorage.setItem(key, value),
  removeItem: key => AsyncStorage.removeItem(key),
  multiSet: pairs => AsyncStorage.multiSet(pairs),
  multiRemove: keys => AsyncStorage.multiRemove(keys),
};

export default secureStore;
