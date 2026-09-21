jest.mock('react-native-keychain', () => {
  const store = new Map();
  return {
    __store: store,
    setGenericPassword: jest.fn(async (u, p, o) => {
      if (!u || !p) throw new Error('empty');
      store.set(o.service, p);
      return true;
    }),
    getGenericPassword: jest.fn(async o =>
      store.has(o.service) ? { username: o.service, password: store.get(o.service) } : false,
    ),
    resetGenericPassword: jest.fn(async o => {
      store.delete(o.service);
      return true;
    }),
  };
});

jest.mock('../src/utils/logger', () => ({
  log: jest.fn(), warn: jest.fn(), debug: jest.fn(), error: jest.fn(),
}));

const mockAsyncStore = new Map();
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async k => (mockAsyncStore.has(k) ? mockAsyncStore.get(k) : null)),
  setItem: jest.fn(async (k, v) => { mockAsyncStore.set(k, v); }),
  removeItem: jest.fn(async k => { mockAsyncStore.delete(k); }),
  multiRemove: jest.fn(async ks => { ks.forEach(k => mockAsyncStore.delete(k)); }),
}));

const Keychain = require('react-native-keychain');
const KSHOPE_CONFIG = require('../src/kshope/globals/config').default;
const kshopeAxios = require('../src/kshope/api/client').default;
const kshopeTokenStore = require('../src/kshope/api/tokenService').default;
const hostTokenStore = require('../src/api/tokenService').default;

beforeEach(() => {
  Keychain.__store.clear();
  jest.clearAllMocks();
});

test('module config points at gdapi and gdadmin udendeal endpoints', () => {
  expect(KSHOPE_CONFIG.base_url).toBe('https://gdapi.udendeal.com/api/v1/');
  expect(KSHOPE_CONFIG.image_base_url).toBe('https://gdadmin.udendeal.com/');
  expect(KSHOPE_CONFIG.referalUrl).toBe('https://kshonboarding.kapradaily.com/');
});

test('module client is bound to the module base url', () => {
  expect(kshopeAxios.defaults.baseURL).toBe(KSHOPE_CONFIG.base_url);
});

test('module tokens are stored under KSHOPE_ keys and never collide with host tokens', async () => {
  await hostTokenStore.setTokens('host-a', 'host-r');
  await kshopeTokenStore.setTokens('kshope-a', 'kshope-r');

  expect(Keychain.__store.get('ACCESS_TOKEN')).toBe('host-a');
  expect(Keychain.__store.get('KSHOPE_ACCESS_TOKEN')).toBe('kshope-a');
  expect(await hostTokenStore.getAccessToken()).toBe('host-a');
  expect(await kshopeTokenStore.getAccessToken()).toBe('kshope-a');
});

test('module requests carry the module token, not the host token', async () => {
  await hostTokenStore.setTokens('host-a', 'host-r');
  await kshopeTokenStore.setTokens('kshope-a', 'kshope-r');

  const handler = kshopeAxios.interceptors.request.handlers[0].fulfilled;
  const config = await handler({ url: 'cart/list', headers: {} });

  expect(config.headers.Authorization).toBe('Bearer kshope-a');
});
