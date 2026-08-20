import * as Keychain from 'react-native-keychain';

const getItem = async key => {
  const result = await Keychain.getGenericPassword({ service: key });
  return result ? result.password : null;
};

const removeItem = key => Keychain.resetGenericPassword({ service: key });

const setItem = (key, value) => {
  if (value === null || value === undefined || value === '') {
    return removeItem(key);
  }
  return Keychain.setGenericPassword(key, String(value), { service: key });
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
