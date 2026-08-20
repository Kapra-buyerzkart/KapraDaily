jest.mock('react-native-keychain', () => {
  const store = new Map();
  return {
    __store: store,
    setGenericPassword: jest.fn(async (username, password, options) => {
      if (!username || !password) {
        throw new Error('you passed empty or null username/password');
      }
      store.set(options.service, password);
      return true;
    }),
    getGenericPassword: jest.fn(async options =>
      store.has(options.service)
        ? { username: options.service, password: store.get(options.service) }
        : false,
    ),
    resetGenericPassword: jest.fn(async options => {
      store.delete(options.service);
      return true;
    }),
  };
});

const Keychain = require('react-native-keychain');
const secureStore = require('../src/utils/secureStore').default;

beforeEach(() => {
  Keychain.__store.clear();
  jest.clearAllMocks();
});

describe('secureStore with the Android Keychain empty-value guard', () => {
  it('stores and reads back a non-empty value', async () => {
    await secureStore.setItem('DEALS48_ACCESS_TOKEN', 'token-abc');
    await expect(secureStore.getItem('DEALS48_ACCESS_TOKEN')).resolves.toBe(
      'token-abc',
    );
  });

  it('does not throw when writing an empty string', async () => {
    await expect(secureStore.setItem('DEALS48_REFRESH_TOKEN', '')).resolves.not.toThrow();
    await expect(secureStore.getItem('DEALS48_REFRESH_TOKEN')).resolves.toBeNull();
  });

  it('does not throw when writing null or undefined', async () => {
    await expect(secureStore.setItem('DEALS48_REFRESH_TOKEN', null)).resolves.not.toThrow();
    await expect(secureStore.setItem('DEALS48_RESET_TOKEN', undefined)).resolves.not.toThrow();
  });

  it('clears a previously stored value when overwritten with an empty string', async () => {
    await secureStore.setItem('DEALS48_REFRESH_TOKEN', 'old-refresh');
    await secureStore.setItem('DEALS48_REFRESH_TOKEN', '');
    await expect(secureStore.getItem('DEALS48_REFRESH_TOKEN')).resolves.toBeNull();
  });

  it('multiSet survives a pair whose value is empty', async () => {
    await expect(
      secureStore.multiSet([
        ['DEALS48_ACCESS_TOKEN', 'token-abc'],
        ['DEALS48_REFRESH_TOKEN', ''],
      ]),
    ).resolves.not.toThrow();
    await expect(secureStore.getItem('DEALS48_ACCESS_TOKEN')).resolves.toBe('token-abc');
  });
});
