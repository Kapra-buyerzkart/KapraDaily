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

test('syncKshopeSession persists the host cust id from authData.custId', async () => {
  await syncKshopeSession({
    custId: 42,
    kshope: { success: true, accessToken: 'k-access', refreshToken: 'k-refresh' },
  });

  await hostTokenStore.setTokens(tokenForCustId(42), 'host-r');
  await kshopeTokenStore.setTokens('k-access', 'k-refresh');

  expect(await ensureKshopeSession()).toBe(true);
});

test('syncKshopeSession falls back to the host token when authData.custId is absent', async () => {
  await hostTokenStore.setTokens(tokenForCustId(42), 'host-r');

  await syncKshopeSession({
    kshope: { success: true, accessToken: 'k-access', refreshToken: 'k-refresh' },
  });

  expect(await ensureKshopeSession()).toBe(true);
});

test('ensureKshopeSession is false when no module token is stored', async () => {
  expect(await ensureKshopeSession()).toBe(false);
});

test('ensureKshopeSession succeeds when stored and current host cust ids match', async () => {
  await hostTokenStore.setTokens(tokenForCustId(42), 'host-r');
  await syncKshopeSession({
    kshope: { success: true, accessToken: 'k-access', refreshToken: 'k-refresh' },
  });

  expect(await ensureKshopeSession()).toBe(true);
});

test('ensureKshopeSession wipes and returns false when stored and current host cust ids differ', async () => {
  await hostTokenStore.setTokens(tokenForCustId(42), 'host-r');
  await syncKshopeSession({
    kshope: { success: true, accessToken: 'k-access', refreshToken: 'k-refresh' },
  });

  await hostTokenStore.setTokens(tokenForCustId(99), 'host-r');

  expect(await ensureKshopeSession()).toBe(false);
  expect(await kshopeTokenStore.getAccessToken()).toBeNull();
  expect(await hostTokenStore.getAccessToken()).not.toBeNull();
});

test('ensureKshopeSession wipes and returns false when the stored host cust id is missing', async () => {
  await hostTokenStore.setTokens(tokenForCustId(42), 'host-r');
  await kshopeTokenStore.setTokens(tokenForCustId(42), 'k-r');

  expect(await ensureKshopeSession()).toBe(false);
  expect(await kshopeTokenStore.getAccessToken()).toBeNull();
  expect(await hostTokenStore.getAccessToken()).not.toBeNull();
});

test('ensureKshopeSession wipes and returns false when the host token is undecodable', async () => {
  await hostTokenStore.setTokens(tokenForCustId(42), 'host-r');
  await syncKshopeSession({
    kshope: { success: true, accessToken: 'k-access', refreshToken: 'k-refresh' },
  });

  await hostTokenStore.setTokens('not-a-jwt', 'host-r');

  expect(await ensureKshopeSession()).toBe(false);
  expect(await kshopeTokenStore.getAccessToken()).toBeNull();
});

test('wipe clears the stored host cust id so a later mismatch check fails closed again', async () => {
  await hostTokenStore.setTokens(tokenForCustId(42), 'host-r');
  await syncKshopeSession({
    kshope: { success: true, accessToken: 'k-access', refreshToken: 'k-refresh' },
  });

  await clearKshopeSession();
  await kshopeTokenStore.setTokens(tokenForCustId(42), 'k-r');

  expect(await ensureKshopeSession()).toBe(false);
});

test('clearKshopeSession removes module tokens and leaves host tokens alone', async () => {
  await hostTokenStore.setTokens('host-a', 'host-r');
  await kshopeTokenStore.setTokens('k-a', 'k-r');

  await clearKshopeSession();

  expect(await kshopeTokenStore.getAccessToken()).toBeNull();
  expect(await hostTokenStore.getAccessToken()).toBe('host-a');
});

test('syncKshopeSession returns false instead of throwing when the token store fails', async () => {
  const setTokensSpy = jest
    .spyOn(kshopeTokenStore, 'setTokens')
    .mockRejectedValueOnce(new Error('keychain write failed'));

  await expect(
    syncKshopeSession({
      kshope: { success: true, accessToken: 'k-access', refreshToken: 'k-refresh', custId: 42 },
    }),
  ).resolves.toBe(false);

  setTokensSpy.mockRestore();
});

test('clearKshopeSession resolves instead of throwing when the store fails', async () => {
  const clearTokensSpy = jest
    .spyOn(kshopeTokenStore, 'clearTokens')
    .mockRejectedValueOnce(new Error('keychain wipe failed'));

  await expect(clearKshopeSession()).resolves.toBeUndefined();

  clearTokensSpy.mockRestore();
});

test('the fail-safe guard does not swallow a real successful sync', async () => {
  const ok = await syncKshopeSession({
    kshope: { success: true, accessToken: 'k-access-2', refreshToken: 'k-refresh-2', custId: 42 },
  });

  expect(ok).toBe(true);
  expect(await kshopeTokenStore.getAccessToken()).toBe('k-access-2');
});

test('the fail-safe guard does not swallow a real successful clear', async () => {
  await kshopeTokenStore.setTokens('k-a', 'k-r');

  await clearKshopeSession();

  expect(await kshopeTokenStore.getAccessToken()).toBeNull();
});
