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

const mockAsyncStore = new Map();
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async k => (mockAsyncStore.has(k) ? mockAsyncStore.get(k) : null)),
  setItem: jest.fn(async (k, v) => { mockAsyncStore.set(k, v); }),
  removeItem: jest.fn(async k => { mockAsyncStore.delete(k); }),
  multiRemove: jest.fn(async ks => { ks.forEach(k => mockAsyncStore.delete(k)); }),
}));

const AsyncStorage = require('@react-native-async-storage/async-storage');
const storage = require('../src/kshope/globals/storage');

beforeEach(() => {
  mockAsyncStore.clear();
  jest.clearAllMocks();
});

test('every storage key is KSHOPE_-prefixed', () => {
  Object.values(storage.KSHOPE_KEYS).forEach(key => {
    expect(key).toMatch(/^KSHOPE_/);
  });
});

test('no storage key collides with a host key name', () => {
  const hostKeys = ['pincodeAreaId', 'profile', 'selectedAddressId', 'ACCESS_TOKEN', 'REFRESH_TOKEN'];
  Object.values(storage.KSHOPE_KEYS).forEach(key => {
    expect(hostKeys).not.toContain(key);
  });
});

test('area id round-trips as a number', async () => {
  await storage.setKshopeAreaId(207);
  expect(await storage.getKshopeAreaId()).toBe(207);
});

test('area id is null when never set — never a hardcoded fallback', async () => {
  expect(await storage.getKshopeAreaId()).toBeNull();
});

test('reading the area id never touches the host key', async () => {
  mockAsyncStore.set('pincodeAreaId', '999');
  expect(await storage.getKshopeAreaId()).toBeNull();
  expect(AsyncStorage.getItem).not.toHaveBeenCalledWith('pincodeAreaId');
});

test('setting a null area id clears the key', async () => {
  await storage.setKshopeAreaId(207);
  await storage.setKshopeAreaId(null);
  expect(await storage.getKshopeAreaId()).toBeNull();
});

test('a non-numeric stored value resolves to null rather than NaN', async () => {
  mockAsyncStore.set(storage.KSHOPE_KEYS.AREA_ID, 'not-a-number');
  expect(await storage.getKshopeAreaId()).toBeNull();
});

test('clearKshopeLocalData removes module keys and leaves host keys alone', async () => {
  mockAsyncStore.set('pincodeAreaId', '999');
  mockAsyncStore.set('profile', '{"host":true}');
  await storage.setKshopeAreaId(207);
  await storage.setCachedProfile({ name: 'module' });

  await storage.clearKshopeLocalData();

  expect(await storage.getKshopeAreaId()).toBeNull();
  expect(await storage.getCachedProfile()).toBeNull();
  expect(mockAsyncStore.get('pincodeAreaId')).toBe('999');
  expect(mockAsyncStore.get('profile')).toBe('{"host":true}');
});
