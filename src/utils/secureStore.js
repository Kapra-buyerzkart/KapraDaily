import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getItem = async key => {
  try {
    const result = await Keychain.getGenericPassword({ service: key });
    if (result && result.password) {
      return result.password;
    }
  } catch (error) {
    // Keychain unavailable, check AsyncStorage fallback
  }
  try {
    return await AsyncStorage.getItem(`@secure_${key}`);
  } catch {
    return null;
  }
};

const removeItem = async key => {
  try {
    await Keychain.resetGenericPassword({ service: key });
  } catch (error) {
    // ignore
  }
  try {
    await AsyncStorage.removeItem(`@secure_${key}`);
  } catch {
    // ignore
  }
};

const setItem = async (key, value) => {
  if (value === null || value === undefined || value === '') {
    return removeItem(key);
  }
  const strVal = String(value);
  try {
    await Keychain.setGenericPassword(key, strVal, { service: key });
  } catch (error) {
    // ignore keychain error, store in AsyncStorage
  }
  try {
    await AsyncStorage.setItem(`@secure_${key}`, strVal);
  } catch {
    // ignore
  }
};

const multiSet = pairs =>
  Promise.all(pairs.map(([key, value]) => setItem(key, value)));

const multiRemove = keys => Promise.all(keys.map(removeItem));

const secureStore = {
  getItem,
  setItem,
  removeItem,
  multiSet,
  multiRemove,
};

export default secureStore;
