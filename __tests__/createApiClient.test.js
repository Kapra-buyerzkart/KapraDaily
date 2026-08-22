jest.mock('../src/utils/logger', () => ({
  log: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
}));

const createApiClient = require('../src/api/createApiClient').default;

const makeTokenStore = (overrides = {}) => ({
  getAccessToken: jest.fn(async () => 'access-token'),
  getRefreshToken: jest.fn(async () => 'refresh-token'),
  setTokens: jest.fn(async () => {}),
  clearTokens: jest.fn(async () => {}),
  ...overrides,
});

test('builds an axios instance on the supplied base url', () => {
  const client = createApiClient({
    baseUrl: 'https://kshopecore.kapradaily.com/api/v1/',
    tokenStore: makeTokenStore(),
  });
  expect(client.instance.defaults.baseURL).toBe(
    'https://kshopecore.kapradaily.com/api/v1/',
  );
});

test('two clients hold independent token stores', () => {
  const hostStore = makeTokenStore();
  const kshopeStore = makeTokenStore({
    getAccessToken: jest.fn(async () => 'kshope-token'),
  });

  const host = createApiClient({ baseUrl: 'https://a/', tokenStore: hostStore });
  const kshope = createApiClient({ baseUrl: 'https://b/', tokenStore: kshopeStore });

  expect(host.instance).not.toBe(kshope.instance);
  expect(host.instance.defaults.baseURL).not.toBe(kshope.instance.defaults.baseURL);
});

test('attaches a bearer token to non-auth requests', async () => {
  const tokenStore = makeTokenStore();
  const client = createApiClient({ baseUrl: 'https://a/', tokenStore });

  const handler = client.instance.interceptors.request.handlers[0].fulfilled;
  const config = await handler({ url: 'cart/list', headers: {} });

  expect(config.headers.Authorization).toBe('Bearer access-token');
});

test('does not attach a bearer token to auth requests', async () => {
  const tokenStore = makeTokenStore();
  const client = createApiClient({ baseUrl: 'https://a/', tokenStore });

  const handler = client.instance.interceptors.request.handlers[0].fulfilled;
  const config = await handler({ url: 'auth/loginpassword', headers: {} });

  expect(config.headers.Authorization).toBeUndefined();
  expect(tokenStore.getAccessToken).not.toHaveBeenCalled();
});

test('sends the default lang header', () => {
  const client = createApiClient({ baseUrl: 'https://a/', tokenStore: makeTokenStore() });
  expect(client.instance.defaults.headers.lang).toBe('2');
});

test('honours a custom timeout and falls back to 20000', () => {
  const withDefault = createApiClient({ baseUrl: 'https://a/', tokenStore: makeTokenStore() });
  const withCustom = createApiClient({
    baseUrl: 'https://a/',
    tokenStore: makeTokenStore(),
    timeout: 45000,
  });
  expect(withDefault.instance.defaults.timeout).toBe(20000);
  expect(withCustom.instance.defaults.timeout).toBe(45000);
});

test('resetNetworkState is per-client and does not throw', () => {
  const client = createApiClient({ baseUrl: 'https://a/', tokenStore: makeTokenStore() });
  expect(() => client.resetNetworkState()).not.toThrow();
});
