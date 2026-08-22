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
const createTokenStore = require('../src/api/createTokenStore').default;

beforeEach(() => {
  Keychain.__store.clear();
  jest.clearAllMocks();
  jest.resetModules();
});

test('unprefixed store uses the original key names', async () => {
  const store = createTokenStore('');
  await store.setTokens('access-1', 'refresh-1');
  expect(Keychain.__store.get('ACCESS_TOKEN')).toBe('access-1');
  expect(Keychain.__store.get('REFRESH_TOKEN')).toBe('refresh-1');
});

test('prefixed store uses namespaced keys and does not collide', async () => {
  const host = createTokenStore('');
  const kshope = createTokenStore('KSHOPE_');

  await host.setTokens('host-access', 'host-refresh');
  await kshope.setTokens('kshope-access', 'kshope-refresh');

  expect(await host.getAccessToken()).toBe('host-access');
  expect(await kshope.getAccessToken()).toBe('kshope-access');
  expect(Keychain.__store.get('KSHOPE_ACCESS_TOKEN')).toBe('kshope-access');
});

test('clearing one store leaves the other intact', async () => {
  const host = createTokenStore('');
  const kshope = createTokenStore('KSHOPE_');

  await host.setTokens('host-access', 'host-refresh');
  await kshope.setTokens('kshope-access', 'kshope-refresh');

  await kshope.clearTokens();

  expect(await kshope.getAccessToken()).toBeNull();
  expect(await host.getAccessToken()).toBe('host-access');
});

test('an empty refresh token deletes the key instead of throwing', async () => {
  const store = createTokenStore('KSHOPE_');
  await expect(store.setTokens('access-only', '')).resolves.not.toThrow();
  expect(await store.getAccessToken()).toBe('access-only');
  expect(await store.getRefreshToken()).toBeNull();
});

test('the access token is cached after the first read', async () => {
  const store = createTokenStore('KSHOPE_');
  await store.setTokens('cached', 'r');
  await store.getAccessToken();
  Keychain.getGenericPassword.mockClear();
  await store.getAccessToken();
  expect(Keychain.getGenericPassword).not.toHaveBeenCalled();
});

test('reset tokens are namespaced too', async () => {
  const kshope = createTokenStore('KSHOPE_');
  await kshope.setResetToken('reset-1');
  expect(Keychain.__store.get('KSHOPE_RESET_TOKEN')).toBe('reset-1');
  await kshope.clearResetToken();
  expect(await kshope.getResetToken()).toBeNull();
});
