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

const Keychain = require('react-native-keychain');
const kshopeTokenStore = require('../src/kshope/api/tokenService').default;
const hostTokenStore = require('../src/api/tokenService').default;
const {
  syncKshopeSession,
  ensureKshopeSession,
  clearKshopeSession,
} = require('../src/kshope/api/session');

const tokenForCustId = custId => {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ sub: String(custId) })).toString('base64url');
  return `${header}.${payload}.sig`;
};

beforeEach(async () => {
  Keychain.__store.clear();
  jest.clearAllMocks();
  await kshopeTokenStore.clearTokens();
  await hostTokenStore.clearTokens();
});

test('stores kshope tokens from a successful login payload', async () => {
  const ok = await syncKshopeSession({
    custId: 42,
    kshope: { success: true, accessToken: 'k-access', refreshToken: 'k-refresh', custId: 42 },
  });

  expect(ok).toBe(true);
  expect(await kshopeTokenStore.getAccessToken()).toBe('k-access');
  expect(await kshopeTokenStore.getRefreshToken()).toBe('k-refresh');
});

test('clears the session when the kshope block reports failure', async () => {
  await kshopeTokenStore.setTokens('stale', 'stale-r');

  const ok = await syncKshopeSession({ kshope: { success: false } });

  expect(ok).toBe(false);
  expect(await kshopeTokenStore.getAccessToken()).toBeNull();
});

test('clears the session when the kshope block is absent entirely', async () => {
  await kshopeTokenStore.setTokens('stale', 'stale-r');

  const ok = await syncKshopeSession({ custId: 42 });

  expect(ok).toBe(false);
  expect(await kshopeTokenStore.getAccessToken()).toBeNull();
});

test('handles a null payload without throwing', async () => {
  await expect(syncKshopeSession(null)).resolves.toBe(false);
});

test('a missing refresh token does not throw and does not block the access token', async () => {
  const ok = await syncKshopeSession({
    kshope: { success: true, accessToken: 'k-access', custId: 42 },
  });

  expect(ok).toBe(true);
  expect(await kshopeTokenStore.getAccessToken()).toBe('k-access');
  expect(await kshopeTokenStore.getRefreshToken()).toBeNull();
});

test('never touches host tokens', async () => {
  await hostTokenStore.setTokens('host-a', 'host-r');

  await syncKshopeSession({
    kshope: { success: true, accessToken: 'k-access', refreshToken: 'k-refresh' },
  });

  expect(await hostTokenStore.getAccessToken()).toBe('host-a');
});

test('ensureKshopeSession is false when no module token is stored', async () => {
  expect(await ensureKshopeSession()).toBe(false);
});

test('ensureKshopeSession is true when host and module custIds match', async () => {
  await hostTokenStore.setTokens(tokenForCustId(42), 'host-r');
  await kshopeTokenStore.setTokens(tokenForCustId(42), 'k-r');

  expect(await ensureKshopeSession()).toBe(true);
});

test('ensureKshopeSession wipes the module session when custIds differ', async () => {
  await hostTokenStore.setTokens(tokenForCustId(42), 'host-r');
  await kshopeTokenStore.setTokens(tokenForCustId(99), 'k-r');

  expect(await ensureKshopeSession()).toBe(false);
  expect(await kshopeTokenStore.getAccessToken()).toBeNull();
  expect(await hostTokenStore.getAccessToken()).not.toBeNull();
});

test('ensureKshopeSession allows an undecodable token rather than locking the user out', async () => {
  await hostTokenStore.setTokens('not-a-jwt', 'host-r');
  await kshopeTokenStore.setTokens('also-not-a-jwt', 'k-r');

  expect(await ensureKshopeSession()).toBe(true);
});

test('clearKshopeSession removes module tokens and leaves host tokens alone', async () => {
  await hostTokenStore.setTokens('host-a', 'host-r');
  await kshopeTokenStore.setTokens('k-a', 'k-r');

  await clearKshopeSession();

  expect(await kshopeTokenStore.getAccessToken()).toBeNull();
  expect(await hostTokenStore.getAccessToken()).toBe('host-a');
});
