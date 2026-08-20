jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

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

const LOGIN_RESPONSE_DATA = {
  custId: 20189,
  accessToken: 'uden-access-token',
  refreshToken: 'vxGyhJlKOUGn60xCQ44C7Q==',
  customer: { udenCustId: 20189, kshopeCustId: null },
  uden: {
    accessToken: 'uden-access-token',
    refreshToken: 'vxGyhJlKOUGn60xCQ44C7Q==',
  },
  kshope: {
    success: true,
    status: 'SUCCESS',
    message: 'Kshope authentication successful',
    custId: null,
    accessToken: '',
    refreshToken: '',
  },
};

beforeEach(() => {
  Keychain.__store.clear();
  jest.clearAllMocks();
  jest.resetModules();
});

describe('host tokenService (login / otp / registration all use setTokens)', () => {
  it('stores both tokens when the server returns a real refresh token', async () => {
    const ts = require('../src/api/tokenService');
    await ts.setTokens(
      LOGIN_RESPONSE_DATA.accessToken,
      LOGIN_RESPONSE_DATA.refreshToken,
    );
    await expect(ts.getAccessToken()).resolves.toBe('uden-access-token');
    await expect(ts.getRefreshToken()).resolves.toBe('vxGyhJlKOUGn60xCQ44C7Q==');
  });

  it('keeps the access token when the refresh token comes back empty', async () => {
    const ts = require('../src/api/tokenService');
    await expect(ts.setTokens('uden-access-token', '')).resolves.not.toThrow();
    await expect(ts.getAccessToken()).resolves.toBe('uden-access-token');
    await expect(ts.getRefreshToken()).resolves.toBeFalsy();
  });

  it('clearTokens leaves nothing behind', async () => {
    const ts = require('../src/api/tokenService');
    await ts.setTokens('a', 'b');
    await ts.clearTokens();
    await expect(ts.getAccessToken()).resolves.toBeNull();
    await expect(ts.getRefreshToken()).resolves.toBeNull();
  });
});

describe('syncDeals48Session with the live login payload', () => {
  it('does not throw on kshope tokens returned as empty strings', async () => {
    const { syncDeals48Session } = require('../src/modules/deals48/api/session');
    await expect(syncDeals48Session(LOGIN_RESPONSE_DATA)).resolves.toBe(true);
  });

  it('stores real kshope tokens when the server issues them', async () => {
    const { syncDeals48Session } = require('../src/modules/deals48/api/session');
    const ts = require('../src/modules/deals48/api/services/tokenService');
    await syncDeals48Session({
      ...LOGIN_RESPONSE_DATA,
      kshope: { accessToken: 'kshope-access', refreshToken: 'kshope-refresh' },
    });
    await expect(ts.getAccessToken()).resolves.toBe('kshope-access');
    await expect(ts.getRefreshToken()).resolves.toBe('kshope-refresh');
  });

  it('clears the deals48 session when there is no kshope auth at all', async () => {
    jest.doMock('../src/modules/deals48/globals/config', () => ({
      __esModule: true,
      default: {},
      DEV_ACCESS_TOKEN: '',
    }));
    const { syncDeals48Session } = require('../src/modules/deals48/api/session');
    const ts = require('../src/modules/deals48/api/services/tokenService');
    await expect(syncDeals48Session({ kshope: undefined })).resolves.toBe(false);
    await expect(ts.getAccessToken()).resolves.toBeNull();
  });
});

describe('profile merge used by login, otp and registration screens', () => {
  it('round-trips a profile through secureStore', async () => {
    const secureStore = require('../src/utils/secureStore').default;
    await secureStore.setItem('profile', JSON.stringify({ custId: 20189 }));
    const stored = await secureStore.getItem('profile');
    expect(JSON.parse(stored)).toEqual({ custId: 20189 });
  });
});
