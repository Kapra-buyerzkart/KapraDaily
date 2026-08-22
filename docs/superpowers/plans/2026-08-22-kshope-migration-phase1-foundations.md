# Kshope Migration — Phase 1: Foundations — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the `src/kshope/` module shell — authenticated against `kshopecore.kapradaily.com` via a token bridge from KapraDaily's login, mounted on the existing `KshopeScreen` route, with dependencies and assets in place — so phases 2-5 can add screens against a working foundation.

**Architecture:** KapraDaily's axios stack is extracted into a `createApiClient({ baseUrl, tokenStore, ... })` factory and its token store into a `createTokenStore(prefix)` factory. The host's existing client and token store are rebuilt on those factories with their current arguments, so host behaviour is unchanged. The kshope module gets a second client bound to `kshopecore` and a `KSHOPE_`-prefixed token store, fed by a session bridge that copies the `kshope` block out of KapraDaily's login response.

**Tech Stack:** React Native 0.82.1, JavaScript (host) + TypeScript (module), axios, react-native-keychain via `secureStore`, React Navigation 7, Jest with the `react-native` preset.

**Spec:** `docs/superpowers/specs/2026-08-22-kshope-module-migration-design.md`

## Global Constraints

- **No code comments.** This repo's own files contain them, but new KapraDaily code is written bare. Reasoning belongs in commit messages and this plan, not in `//` blocks.
- Module code is TypeScript (`.ts`/`.tsx`); host code stays JavaScript. `tsconfig.json` already sets `allowJs: true`, so TS importing host JS is fine.
- Never write an empty string to `secureStore` — Keychain throws on Android for empty values. `secureStore.setItem` already deletes the key instead; rely on that, never bypass it.
- The module must never read the host's `pincodeAreaId`, `selectedAddressId`, or `profile` keys. It uses `KSHOPE_`-prefixed keys exclusively.
- Base URLs: module `https://kshopecore.kapradaily.com/api/v1/`, images `https://kshadmin.kapradaily.com/`, referral `https://kshonboarding.kapradaily.com/`.
- **Do not read or copy from the `archive/deals48-v1` branch.** All ported code comes from `~/kshopeeNew`.
- Route name `KshopeScreen` is load-bearing — `src/config/services.js` and `src/screens/AuthSuccessScreen/useAuthSuccess.js` both navigate to it. Keep the name, change only what it renders.
- Test command: `npx jest <path>`. Full suite: `npm test`.

---

### Task 1: Verify the login response actually carries a `kshope` block

This gates the entire auth model. Nothing in the current codebase reads `kshope` from a login response — the shape below is inferred. If it is absent, **stop and report back**; do not invent a fallback.

**Files:**
- Modify: `src/screens/LoginPwdScreen.js:76` (temporary logging, reverted in Step 5)

- [ ] **Step 1: Widen the existing login response log**

`src/screens/LoginPwdScreen.js` already logs the full response at line 76. Confirm the line reads:

```js
console.log('[LOGIN PWD] response:', JSON.stringify(response, null, 2));
```

If it does, no edit is needed. If it has been trimmed, restore it to exactly that.

- [ ] **Step 2: Run the app and log in**

```bash
npm start -- --reset-cache
```

In a second terminal: `npm run ios` (or `npm run android`). Log in with a real account through the password flow.

- [ ] **Step 3: Read the logged response**

In the Metro output, find `[LOGIN PWD] response:` and record the answers to:

1. Is there a `data.kshope` object? (**If no — STOP. Report to the user.**)
2. What are its exact keys? Expected: `success`, `accessToken`, `refreshToken`, `custId`.
3. Is the refresh field named `refreshToken`, or something else?
4. Does `data.customer` exist with `udenCustId` / `kshopeCustId`?

- [ ] **Step 4: Record findings in the spec**

Append a `## Verified` section to `docs/superpowers/specs/2026-08-22-kshope-module-migration-design.md` stating the observed shape verbatim, and strike assumptions 1 and 2 from the "Assumptions to verify" list.

- [ ] **Step 5: Revert any temporary edit and commit the finding**

```bash
git add docs/superpowers/specs/2026-08-22-kshope-module-migration-design.md
git commit -m "docs: record verified kshope login response shape"
```

---

### Task 2: Extract `createTokenStore(prefix)` from the host token service

**Files:**
- Create: `src/api/createTokenStore.js`
- Modify: `src/api/tokenService.js`
- Test: `__tests__/createTokenStore.test.js`

**Interfaces:**
- Consumes: `src/utils/secureStore.js` (`getItem`, `setItem`, `removeItem`, `multiSet`, `multiRemove`)
- Produces: `createTokenStore(prefix: string) => { setTokens(accessToken, refreshToken): Promise<void>, getAccessToken(): Promise<string|null>, getRefreshToken(): Promise<string|null>, clearTokens(): Promise<void>, setResetToken(t): Promise<void>, getResetToken(): Promise<string|null>, clearResetToken(): Promise<void> }`. `src/api/tokenService.js` keeps every one of its current named exports, backed by `createTokenStore('')`.

- [ ] **Step 1: Write the failing test**

Create `__tests__/createTokenStore.test.js`:

```js
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx jest __tests__/createTokenStore.test.js`
Expected: FAIL — `Cannot find module '../src/api/createTokenStore'`

- [ ] **Step 3: Write the implementation**

Create `src/api/createTokenStore.js`:

```js
import secureStore from '../utils/secureStore';

const createTokenStore = (prefix = '') => {
  const ACCESS_TOKEN = `${prefix}ACCESS_TOKEN`;
  const REFRESH_TOKEN = `${prefix}REFRESH_TOKEN`;
  const RESET_TOKEN = `${prefix}RESET_TOKEN`;

  let cachedAccessToken = null;
  let accessTokenLoaded = false;
  let inFlightAccessRead = null;

  const setAccessTokenCache = value => {
    cachedAccessToken = value;
    accessTokenLoaded = true;
    inFlightAccessRead = null;
  };

  const setTokens = async (accessToken, refreshToken) => {
    accessTokenLoaded = false;
    inFlightAccessRead = null;
    await secureStore.multiSet([
      [ACCESS_TOKEN, accessToken],
      [REFRESH_TOKEN, refreshToken],
    ]);
    setAccessTokenCache(accessToken);
  };

  const getAccessToken = async () => {
    if (accessTokenLoaded) return cachedAccessToken;
    if (inFlightAccessRead) return inFlightAccessRead;

    inFlightAccessRead = secureStore
      .getItem(ACCESS_TOKEN)
      .then(token => {
        if (inFlightAccessRead) setAccessTokenCache(token);
        return token;
      })
      .catch(error => {
        inFlightAccessRead = null;
        throw error;
      });

    return inFlightAccessRead;
  };

  const getRefreshToken = () => secureStore.getItem(REFRESH_TOKEN);

  const clearTokens = async () => {
    accessTokenLoaded = false;
    inFlightAccessRead = null;
    await secureStore.multiRemove([ACCESS_TOKEN, REFRESH_TOKEN, RESET_TOKEN]);
    setAccessTokenCache(null);
  };

  const setResetToken = resetToken => secureStore.setItem(RESET_TOKEN, resetToken);

  const getResetToken = () => secureStore.getItem(RESET_TOKEN);

  const clearResetToken = () => secureStore.removeItem(RESET_TOKEN);

  return {
    setTokens,
    getAccessToken,
    getRefreshToken,
    clearTokens,
    setResetToken,
    getResetToken,
    clearResetToken,
  };
};

export default createTokenStore;
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx jest __tests__/createTokenStore.test.js`
Expected: PASS, 6 tests

- [ ] **Step 5: Rebuild the host token service on the factory**

Replace the entire contents of `src/api/tokenService.js` with:

```js
import createTokenStore from './createTokenStore';

const hostTokenStore = createTokenStore('');

export const setTokens = hostTokenStore.setTokens;
export const getAccessToken = hostTokenStore.getAccessToken;
export const getRefreshToken = hostTokenStore.getRefreshToken;
export const clearTokens = hostTokenStore.clearTokens;
export const setResetToken = hostTokenStore.setResetToken;
export const getResetToken = hostTokenStore.getResetToken;
export const clearResetToken = hostTokenStore.clearResetToken;

export default hostTokenStore;
```

The key names are unchanged (`ACCESS_TOKEN`, `REFRESH_TOKEN`, `RESET_TOKEN`), so users who are already logged in stay logged in across this upgrade.

- [ ] **Step 6: Run the full suite to confirm nothing regressed**

Run: `npm test`
Expected: PASS — same test count as before this task, no new failures.

- [ ] **Step 7: Commit**

```bash
git add src/api/createTokenStore.js src/api/tokenService.js __tests__/createTokenStore.test.js
git commit -m "refactor: extract createTokenStore factory so kshope can namespace its tokens"
```

---

### Task 3: Extract `createApiClient` from the host network layer

**Files:**
- Create: `src/api/createApiClient.js`
- Modify: `src/api/networkUtils.js`
- Test: `__tests__/createApiClient.test.js`

**Interfaces:**
- Consumes: `createTokenStore` from Task 2.
- Produces: `createApiClient({ baseUrl, tokenStore, headers, timeout, onAuthFailure, label }) => { instance, get, post, put, patch, postRegister, getNew, deleteRequest, resetNetworkState, setLogoutHandler }`. `src/api/networkUtils.js` keeps every one of its current named exports, backed by a client built with `baseUrl: CONFIG.base_url` and the host token store.

The existing `networkUtils.js` is 350 lines and mixes six concerns: auth-URL detection, payment logging, error normalisation, request auth, refresh queueing, and the verb helpers. Moving it wholesale into a factory is the change; behaviour must not move with it.

- [ ] **Step 1: Write the failing test**

Create `__tests__/createApiClient.test.js`:

```js
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx jest __tests__/createApiClient.test.js`
Expected: FAIL — `Cannot find module '../src/api/createApiClient'`

- [ ] **Step 3: Write the implementation**

Create `src/api/createApiClient.js` by moving the body of `src/api/networkUtils.js` into a factory. Take the existing file as the source of truth and change only what is listed below — do not retype it from memory, and do not "improve" any logic:

1. Wrap everything from `let logoutHandler = ...` through the verb helpers in `const createApiClient = ({ baseUrl, tokenStore, headers, timeout, label = 'API' }) => { ... }`.
2. Replace the module-level imports of `getAccessToken`, `getRefreshToken`, `setTokens`, `clearTokens` with reads off `tokenStore`.
3. Replace `CONFIG.base_url` with `baseUrl` in both the `axios.create` call and the refresh `axios.post` URL.
4. Replace the literal `[API]` / `[API ERROR]` strings in log calls with `` `[${label}]` `` / `` `[${label} ERROR]` `` so kshope and host logs are distinguishable.
5. Move `isLoggingOut`, `isRefreshing` and `failedQueue` inside the factory so each client has its own.
6. Build the instance as:

```js
const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    lang: '2',
    'Content-Type': 'application/json',
    ...headers,
  },
  timeout: timeout ?? 20000,
});
```

7. Return, at the end of the factory:

```js
return {
  instance: axiosInstance,
  get,
  post,
  put,
  patch,
  postRegister,
  getNew,
  deleteRequest,
  resetNetworkState,
  setLogoutHandler,
};
```

8. `export default createApiClient;`

Everything else — `checkAuthApi`, `PAYMENT_URL_PATTERNS`, `isPaymentApi`, `safeParse`, `errorHandler`, the `FK_Carts_Customers` conflict detection, the refresh queue, the retry semantics — is copied verbatim.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx jest __tests__/createApiClient.test.js`
Expected: PASS, 7 tests

- [ ] **Step 5: Rebuild the host network layer on the factory**

Replace the entire contents of `src/api/networkUtils.js` with:

```js
import CONFIG from '../globals/config';
import createApiClient from './createApiClient';
import hostTokenStore from './tokenService';

const hostClient = createApiClient({
  baseUrl: CONFIG.base_url,
  tokenStore: hostTokenStore,
  label: 'API',
});

export const setLogoutHandler = hostClient.setLogoutHandler;
export const resetNetworkState = hostClient.resetNetworkState;
export const get = hostClient.get;
export const post = hostClient.post;
export const put = hostClient.put;
export const patch = hostClient.patch;
export const postRegister = hostClient.postRegister;
export const getNew = hostClient.getNew;
export const deleteRequest = hostClient.deleteRequest;

export default hostClient.instance;
```

- [ ] **Step 6: Confirm every previous import site still resolves**

Run:

```bash
npx tsc --noEmit -p tsconfig.json 2>&1 | head -30
grep -rn "from '.*networkUtils'" src/ | wc -l
```

Expected: no new TypeScript errors mentioning `networkUtils`, and every listed import site uses only names exported above.

- [ ] **Step 7: Run the full suite**

Run: `npm test`
Expected: PASS, no new failures.

- [ ] **Step 8: Smoke-test the host app**

```bash
npm start -- --reset-cache
```

Then `npm run ios`. Log in, open Home, add an item to the cart. Confirm requests succeed and the session survives a cold restart. This is the check that the refactor did not break the host's auth — the unit tests cannot prove it end to end.

- [ ] **Step 9: Commit**

```bash
git add src/api/createApiClient.js src/api/networkUtils.js __tests__/createApiClient.test.js
git commit -m "refactor: extract createApiClient factory from networkUtils"
```

---

### Task 4: Module scaffolding — config, token store, client

**Files:**
- Create: `src/kshope/globals/config.ts`
- Create: `src/kshope/api/tokenService.ts`
- Create: `src/kshope/api/client.ts`
- Test: `__tests__/kshopeClient.test.js`

**Interfaces:**
- Consumes: `createApiClient` (Task 3), `createTokenStore` (Task 2).
- Produces: `KSHOPE_CONFIG` (default export of `globals/config.ts`); `kshopeTokenStore` (default export of `api/tokenService.ts`) with the `createTokenStore` shape; and from `api/client.ts` the named exports `get`, `post`, `put`, `patch`, `getNew`, `deleteRequest`, `setLogoutHandler`, `resetNetworkState`, plus default export `kshopeAxios`. Every service in phases 2-5 imports its verbs from `src/kshope/api/client`.

- [ ] **Step 1: Write the failing test**

Create `__tests__/kshopeClient.test.js`:

```js
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
const KSHOPE_CONFIG = require('../src/kshope/globals/config').default;
const kshopeAxios = require('../src/kshope/api/client').default;
const kshopeTokenStore = require('../src/kshope/api/tokenService').default;
const hostTokenStore = require('../src/api/tokenService').default;

beforeEach(() => {
  Keychain.__store.clear();
  jest.clearAllMocks();
});

test('module config points at kshopecore, not the host backend', () => {
  expect(KSHOPE_CONFIG.base_url).toBe('https://kshopecore.kapradaily.com/api/v1/');
  expect(KSHOPE_CONFIG.image_base_url).toBe('https://kshadmin.kapradaily.com/');
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx jest __tests__/kshopeClient.test.js`
Expected: FAIL — `Cannot find module '../src/kshope/globals/config'`

- [ ] **Step 3: Write the three module files**

`src/kshope/globals/config.ts`:

```ts
const KSHOPE_CONFIG = {
  siteUrl: 'https://kapradaily.com/',
  base_url: 'https://kshopecore.kapradaily.com/api/v1/',
  image_base_url: 'https://kshadmin.kapradaily.com/',
  referalUrl: 'https://kshonboarding.kapradaily.com/',
  phone_length: 10,
};

export default KSHOPE_CONFIG;
```

`src/kshope/api/tokenService.ts`:

```ts
import createTokenStore from '../../api/createTokenStore';

const kshopeTokenStore = createTokenStore('KSHOPE_');

export const {
  setTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  setResetToken,
  getResetToken,
  clearResetToken,
} = kshopeTokenStore;

export default kshopeTokenStore;
```

`src/kshope/api/client.ts`:

```ts
import createApiClient from '../../api/createApiClient';
import KSHOPE_CONFIG from '../globals/config';
import kshopeTokenStore from './tokenService';

const kshopeClient = createApiClient({
  baseUrl: KSHOPE_CONFIG.base_url,
  tokenStore: kshopeTokenStore,
  label: 'KSHOPE',
});

export const setLogoutHandler = kshopeClient.setLogoutHandler;
export const resetNetworkState = kshopeClient.resetNetworkState;
export const get = kshopeClient.get;
export const post = kshopeClient.post;
export const put = kshopeClient.put;
export const patch = kshopeClient.patch;
export const postRegister = kshopeClient.postRegister;
export const getNew = kshopeClient.getNew;
export const deleteRequest = kshopeClient.deleteRequest;

export default kshopeClient.instance;
```

Also add a type declaration so TS accepts the JS factories. Create `src/kshope/api/hostFactories.d.ts`:

```ts
declare module '../../api/createTokenStore' {
  export interface TokenStore {
    setTokens(accessToken: string, refreshToken: string): Promise<void>;
    getAccessToken(): Promise<string | null>;
    getRefreshToken(): Promise<string | null>;
    clearTokens(): Promise<void>;
    setResetToken(token: string): Promise<void>;
    getResetToken(): Promise<string | null>;
    clearResetToken(): Promise<void>;
  }
  const createTokenStore: (prefix?: string) => TokenStore;
  export default createTokenStore;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx jest __tests__/kshopeClient.test.js`
Expected: PASS, 4 tests

- [ ] **Step 5: Commit**

```bash
git add src/kshope/globals/config.ts src/kshope/api/tokenService.ts src/kshope/api/client.ts src/kshope/api/hostFactories.d.ts __tests__/kshopeClient.test.js
git commit -m "feat: scaffold kshope module config, token store and api client"
```

---

### Task 5: The session bridge

**Files:**
- Create: `src/kshope/api/session.ts`
- Test: `__tests__/kshopeSession.test.js`

**Interfaces:**
- Consumes: `kshopeTokenStore` (Task 4), `getAccessToken` from `src/api/tokenService`, `getUserIdFromToken` from `src/utils/jwt`.
- Produces: `syncKshopeSession(authData: HostAuthData | null | undefined): Promise<boolean>`, `ensureKshopeSession(): Promise<boolean>`, `clearKshopeSession(): Promise<void>`, and the exported type `HostAuthData`.

**If Task 1 found a different field name for the refresh token, use the observed name here** and note the deviation in the commit message.

- [ ] **Step 1: Write the failing test**

Create `__tests__/kshopeSession.test.js`:

```js
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

beforeEach(() => {
  Keychain.__store.clear();
  jest.clearAllMocks();
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx jest __tests__/kshopeSession.test.js`
Expected: FAIL — `Cannot find module '../src/kshope/api/session'`

- [ ] **Step 3: Write the implementation**

Create `src/kshope/api/session.ts`:

```ts
import kshopeTokenStore from './tokenService';
import { getAccessToken as getHostAccessToken } from '../../api/tokenService';
import { getUserIdFromToken } from '../../utils/jwt';
import secureStore from '../../utils/secureStore';

export interface HostAuthData {
  custId?: number | null;
  customer?: {
    udenCustId?: number | null;
    kshopeCustId?: number | null;
  };
  kshope?: {
    success?: boolean;
    status?: string;
    message?: string;
    accessToken?: string;
    refreshToken?: string;
    custId?: number | null;
  };
}

const KSHOPE_LOCAL_KEYS = ['KSHOPE_PROFILE', 'KSHOPE_PINCODE_AREA_ID'];

const wipe = async (): Promise<void> => {
  await kshopeTokenStore.clearTokens();
  await secureStore.multiRemove(KSHOPE_LOCAL_KEYS);
};

export const syncKshopeSession = async (
  authData: HostAuthData | null | undefined,
): Promise<boolean> => {
  const kshope = authData?.kshope;

  if (kshope?.success === false || !kshope?.accessToken) {
    await wipe();
    return false;
  }

  await kshopeTokenStore.setTokens(kshope.accessToken, kshope.refreshToken || '');
  return true;
};

export const ensureKshopeSession = async (): Promise<boolean> => {
  const moduleToken = await kshopeTokenStore.getAccessToken();
  if (!moduleToken) return false;

  const hostToken = await getHostAccessToken();
  const hostCustId = getUserIdFromToken(hostToken);
  const moduleCustId = getUserIdFromToken(moduleToken);

  if (hostCustId !== null && moduleCustId !== null && hostCustId !== moduleCustId) {
    await wipe();
    return false;
  }

  return true;
};

export const clearKshopeSession = async (): Promise<void> => {
  await wipe();
};
```

Add to `src/kshope/api/hostFactories.d.ts`:

```ts
declare module '../../utils/jwt' {
  export const decodeJwtPayload: (token: string | null) => Record<string, unknown> | null;
  export const getUserIdFromToken: (token: string | null) => number | null;
}

declare module '../../utils/secureStore' {
  const secureStore: {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: unknown): Promise<unknown>;
    removeItem(key: string): Promise<unknown>;
    multiSet(pairs: [string, unknown][]): Promise<unknown[]>;
    multiRemove(keys: string[]): Promise<unknown[]>;
  };
  export default secureStore;
}

declare module '../../api/tokenService' {
  export const getAccessToken: () => Promise<string | null>;
  export const getRefreshToken: () => Promise<string | null>;
  export const setTokens: (a: string, r: string) => Promise<void>;
  export const clearTokens: () => Promise<void>;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx jest __tests__/kshopeSession.test.js`
Expected: PASS, 11 tests

- [ ] **Step 5: Commit**

```bash
git add src/kshope/api/session.ts src/kshope/api/hostFactories.d.ts __tests__/kshopeSession.test.js
git commit -m "feat: add kshope session bridge with custId identity guard"
```

---

### Task 6: Wire the bridge into the host auth lifecycle

**Files:**
- Modify: `src/screens/LoginPwdScreen.js:86`
- Modify: `src/screens/OtpScreen.js:214`
- Modify: `src/screens/RegistrationScreen.js:133`
- Modify: `src/context/appContext.js:206`
- Test: `__tests__/kshopeSessionWiring.test.js`

**Interfaces:**
- Consumes: `syncKshopeSession`, `clearKshopeSession` from Task 5.
- Produces: nothing new; this task connects existing pieces.

There are exactly three places the host stores tokens after authentication, and one place it clears them. All four get a matching kshope call.

- [ ] **Step 1: Write the failing test**

Create `__tests__/kshopeSessionWiring.test.js`:

```js
const fs = require('fs');
const path = require('path');

const read = p => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');

const AUTH_SUCCESS_SITES = [
  'src/screens/LoginPwdScreen.js',
  'src/screens/OtpScreen.js',
  'src/screens/RegistrationScreen.js',
];

test.each(AUTH_SUCCESS_SITES)('%s syncs the kshope session after storing host tokens', file => {
  const source = read(file);
  expect(source).toMatch(/import\s*{\s*syncKshopeSession\s*}\s*from\s*'\.\.\/kshope\/api\/session'/);
  expect(source).toMatch(/syncKshopeSession\(/);
});

test('logout clears the kshope session', () => {
  const source = read('src/context/appContext.js');
  expect(source).toMatch(/clearKshopeSession/);
});

test('every host setTokens call site also syncs kshope', () => {
  AUTH_SUCCESS_SITES.forEach(file => {
    const source = read(file);
    const setTokensCalls = (source.match(/await setTokens\(/g) || []).length;
    const syncCalls = (source.match(/syncKshopeSession\(/g) || []).length;
    expect(syncCalls).toBeGreaterThanOrEqual(setTokensCalls);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx jest __tests__/kshopeSessionWiring.test.js`
Expected: FAIL — four failing assertions, none of the imports exist yet.

- [ ] **Step 3: Wire the three auth success sites**

In `src/screens/LoginPwdScreen.js`, add next to the existing `setTokens` import:

```js
import { syncKshopeSession } from '../kshope/api/session';
```

and immediately after `await setTokens(accessToken, refreshToken);` (line 86):

```js
        await syncKshopeSession(response.data);
```

In `src/screens/OtpScreen.js`, add the same import, and after `await setTokens(accessToken, refreshToken);` (line 214):

```js
        await syncKshopeSession(response.data);
```

In `src/screens/RegistrationScreen.js`, add the same import, and after `await setTokens(accessToken, refreshToken);` (line 133):

```js
          await syncKshopeSession(registerResponse.data);
```

All three sites already destructure from `response.data` / `registerResponse.data`, so that object is the correct thing to hand the bridge.

- [ ] **Step 4: Wire logout**

In `src/context/appContext.js`, add to the imports:

```js
import { clearKshopeSession } from '../kshope/api/session';
```

and inside `logout`, immediately after `await clearTokens();` (line 206):

```js
      await clearKshopeSession();
```

This must be explicit. `AsyncStorage.clear()` on the following line does not touch the Keychain, so the kshope tokens would otherwise survive logout and be handed to the next user who signs in on the device.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx jest __tests__/kshopeSessionWiring.test.js`
Expected: PASS, 5 tests

- [ ] **Step 6: Verify end to end on a device**

```bash
npm start -- --reset-cache
```

Then `npm run ios`. Log in, and confirm in the Metro log that no kshope error is thrown. Then log out and log in as a **different** account, confirming from the logs that `syncKshopeSession` ran again for the new user.

- [ ] **Step 7: Commit**

```bash
git add src/screens/LoginPwdScreen.js src/screens/OtpScreen.js src/screens/RegistrationScreen.js src/context/appContext.js __tests__/kshopeSessionWiring.test.js
git commit -m "feat: sync and clear the kshope session across the host auth lifecycle"
```

---

### Task 7: Add the module's dependencies

**Files:**
- Modify: `package.json`
- Modify: `ios/Podfile.lock` (generated)

**Interfaces:**
- Produces: `react-native-ratings`, `@react-native-community/netinfo`, `react-native-uuid`, `lucide-react-native`, `@react-native-community/datetimepicker`, `buffer` available to module code.

These six are used by `~/kshopeeNew` and absent from KapraDaily. `react-native-simple-toast`, `react-native-svg`, `react-native-safe-area-context`, `react-native-screens`, `react-native-vector-icons`, `react-native-linear-gradient`, `react-native-responsive-screen`, `lottie-react-native`, `react-native-razorpay`, `react-native-maps`, `react-native-otp-verify`, `react-native-dropdown-picker`, `react-native-google-places-autocomplete`, `@react-native-community/geolocation` and `@microsoft/signalr` are already present and must not be re-added or version-bumped.

- [ ] **Step 1: Install**

```bash
cd ~/KapraDaily
npm install react-native-ratings @react-native-community/netinfo react-native-uuid lucide-react-native @react-native-community/datetimepicker buffer
```

- [ ] **Step 2: Install iOS pods**

```bash
cd ios && pod install && cd ..
```

Expected: `netinfo` and `datetimepicker` appear as newly installed pods.

- [ ] **Step 3: Verify the JS side resolves**

Create a throwaway check and run it:

```bash
node -e "['react-native-ratings','@react-native-community/netinfo','react-native-uuid','lucide-react-native','@react-native-community/datetimepicker','buffer'].forEach(p => console.log(p, require.resolve(p) ? 'OK' : 'MISSING'))"
```

Expected: six `OK` lines.

- [ ] **Step 4: Rebuild both platforms**

```bash
npm run ios
```

then

```bash
cd android && ./gradlew clean && cd .. && npm run android
```

The `gradlew clean` is not optional. Android keeps shipping stale generated resources otherwise, which has previously cost ~25 MB of invisible bloat in this project and makes the asset measurements in Task 8 meaningless.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json ios/Podfile.lock
git commit -m "build: add kshope module dependencies"
```

---

### Task 8: Port the referenced assets, compressed

**Files:**
- Create: `scripts/portKshopeAssets.js`
- Create: `src/kshope/assets/**` (generated)

**Interfaces:**
- Produces: every asset path referenced by `~/kshopeeNew/src` present under `src/kshope/assets/`, at the same relative path, so ported screens' `require('../assets/...')` calls resolve after a single path rewrite.

`~/kshopeeNew/src/assets` is 61 MB across 181 files, of which `images` alone is 61 MB and `fonts` is 5.8 MB. Copying it wholesale would land in both binaries.

- [ ] **Step 1: Write the porting script**

Create `scripts/portKshopeAssets.js`:

```js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SOURCE_ROOT = path.join(process.env.HOME, 'kshopeeNew', 'src');
const SOURCE_ASSETS = path.join(SOURCE_ROOT, 'assets');
const DEST_ASSETS = path.join(__dirname, '..', 'src', 'kshope', 'assets');

const listSourceFiles = dir =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listSourceFiles(full);
    return /\.(ts|tsx|js|jsx)$/.test(entry.name) ? [full] : [];
  });

const listAssetFiles = dir =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? listAssetFiles(full) : [full];
  });

const sourceText = listSourceFiles(SOURCE_ROOT)
  .map(file => fs.readFileSync(file, 'utf8'))
  .join('\n');

const assets = listAssetFiles(SOURCE_ASSETS);

const referenced = assets.filter(asset => {
  const base = path.basename(asset);
  const stem = base.replace(/@[23]x/, '').replace(/\.[^.]+$/, '');
  return sourceText.includes(base) || sourceText.includes(stem);
});

const bytes = files => files.reduce((n, f) => n + fs.statSync(f).size, 0);

console.log(`assets found:      ${assets.length} (${(bytes(assets) / 1e6).toFixed(1)} MB)`);
console.log(`assets referenced: ${referenced.length} (${(bytes(referenced) / 1e6).toFixed(1)} MB)`);

referenced.forEach(asset => {
  const rel = path.relative(SOURCE_ASSETS, asset);
  const dest = path.join(DEST_ASSETS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(asset, dest);
});

const copied = listAssetFiles(DEST_ASSETS);
console.log(`copied:            ${copied.length} (${(bytes(copied) / 1e6).toFixed(1)} MB)`);

const unreferenced = assets.filter(a => !referenced.includes(a));
fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'kshope', 'assets', 'UNREFERENCED.txt'),
  unreferenced.map(a => path.relative(SOURCE_ASSETS, a)).join('\n'),
);
console.log(`skipped:           ${unreferenced.length} (listed in assets/UNREFERENCED.txt)`);
```

- [ ] **Step 2: Run it and record the numbers**

```bash
node scripts/portKshopeAssets.js
```

Expected: four summary lines. Record the before/after MB figures — they go in the commit message.

- [ ] **Step 3: Compress the copied images**

```bash
brew install pngquant jpegoptim 2>/dev/null || true
find src/kshope/assets -name '*.png' -exec pngquant --force --skip-if-larger --quality 65-90 --ext .png {} +
find src/kshope/assets \( -name '*.jpg' -o -name '*.jpeg' \) -exec jpegoptim --max=85 --strip-all {} +
du -sh src/kshope/assets
```

- [ ] **Step 4: Spot-check fidelity**

Open five of the largest compressed PNGs and their originals side by side:

```bash
find src/kshope/assets -name '*.png' -exec ls -S {} + | head -5
```

Confirm no visible banding or artefacts. If any file degrades, restore that one from `~/kshopeeNew/src/assets` uncompressed.

- [ ] **Step 5: Commit**

```bash
git add scripts/portKshopeAssets.js src/kshope/assets
git commit -m "assets: port referenced kshope assets, compressed from 61MB to <recorded size>"
```

Replace `<recorded size>` with the actual figure from Step 3.

---

### Task 9: Mount the module and delete the placeholder

**Files:**
- Create: `src/kshope/index.ts`
- Create: `src/kshope/navigation/KshopeRoot.tsx`
- Create: `src/kshope/screens/KshopeUnavailable.tsx`
- Modify: `src/navigation/RootNavigator.js:79`
- Delete: `src/screens/KshopeScreen.js`
- Test: `__tests__/kshopeMount.test.js`

**Interfaces:**
- Consumes: `ensureKshopeSession` (Task 5).
- Produces: `KshopeRoot`, the default export of `src/kshope/index.ts`, rendered by the root stack route named `KshopeScreen`. Phases 2-5 add screens to the stack inside `KshopeRoot.tsx`.

The route name `KshopeScreen` stays — `src/config/services.js:35` and `src/screens/AuthSuccessScreen/useAuthSuccess.js:45` both navigate to it, and neither should need to change.

- [ ] **Step 1: Write the failing test**

Create `__tests__/kshopeMount.test.js`:

```js
const fs = require('fs');
const path = require('path');

const read = p => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const exists = p => fs.existsSync(path.join(__dirname, '..', p));

test('the placeholder KshopeScreen is gone', () => {
  expect(exists('src/screens/KshopeScreen.js')).toBe(false);
});

test('the module entry point exists', () => {
  expect(exists('src/kshope/index.ts')).toBe(true);
});

test('the root navigator renders the module on the KshopeScreen route', () => {
  const source = read('src/navigation/RootNavigator.js');
  expect(source).toMatch(/require\('\.\.\/kshope'\)/);
  expect(source).toMatch(/name="KshopeScreen"/);
  expect(source).not.toMatch(/require\('\.\.\/screens\/KshopeScreen'\)/);
});

test('the existing entry points still target the KshopeScreen route', () => {
  expect(read('src/config/services.js')).toMatch(/route: 'KshopeScreen'/);
  expect(read('src/screens/AuthSuccessScreen/useAuthSuccess.js')).toMatch(
    /navigate\('KshopeScreen'\)/,
  );
});

test('nothing outside the module imports from inside it except the mount point', () => {
  const offenders = [];
  const walk = dir => {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'kshope') walk(full);
        return;
      }
      if (!/\.(ts|tsx|js|jsx)$/.test(entry.name)) return;
      const source = fs.readFileSync(full, 'utf8');
      const matches = source.match(/from '[^']*kshope\/[^']+'/g) || [];
      matches
        .filter(m => !m.includes('kshope/api/session'))
        .forEach(m => offenders.push(`${full}: ${m}`));
    });
  };
  walk(path.join(__dirname, '..', 'src'));
  expect(offenders).toEqual([]);
});
```

The last test permits `kshope/api/session` because Task 6 legitimately imports it from the host auth screens; everything else in the module stays private.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx jest __tests__/kshopeMount.test.js`
Expected: FAIL — the placeholder still exists and the module entry does not.

- [ ] **Step 3: Write the unavailable state**

Create `src/kshope/screens/KshopeUnavailable.tsx`:

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const KshopeUnavailable: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>48hrs Deals is unavailable</Text>
      <Text style={styles.body}>
        We could not open your 48hrs Deals account right now. Please sign out and
        sign in again, or try later.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonLabel}>Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#FFFFFF' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
  body: { fontSize: 14, color: '#666666', textAlign: 'center', marginBottom: 24 },
  button: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, backgroundColor: '#00BCD4' },
  buttonLabel: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});

export default KshopeUnavailable;
```

- [ ] **Step 4: Write the module root**

Create `src/kshope/navigation/KshopeRoot.tsx`:

```tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ensureKshopeSession } from '../api/session';
import KshopeUnavailable from '../screens/KshopeUnavailable';

const Stack = createNativeStackNavigator();

const KshopePlaceholderHome: React.FC = () => <View style={styles.centered} />;

const KshopeRoot: React.FC = () => {
  const [sessionState, setSessionState] = useState<'checking' | 'ready' | 'unavailable'>('checking');

  useEffect(() => {
    let cancelled = false;
    ensureKshopeSession().then(ok => {
      if (!cancelled) setSessionState(ok ? 'ready' : 'unavailable');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (sessionState === 'checking') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (sessionState === 'unavailable') {
    return <KshopeUnavailable />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="KshopeHome" component={KshopePlaceholderHome} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
});

export default KshopeRoot;
```

`KshopePlaceholderHome` is deliberately empty. Phase 2 replaces it with the real Home screen and adds the kshope tab navigator beneath it; nothing else in the app needs to change when that happens.

Create `src/kshope/index.ts`:

```ts
export { default } from './navigation/KshopeRoot';
export { syncKshopeSession, ensureKshopeSession, clearKshopeSession } from './api/session';
```

- [ ] **Step 5: Point the root navigator at the module**

In `src/navigation/RootNavigator.js`, replace line 79:

```js
const KshopeScreen = lazyScreen(() => require('../screens/KshopeScreen'));
```

with:

```js
const KshopeScreen = lazyScreen(() => require('../kshope'));
```

The `<Stack.Screen name="KshopeScreen" component={KshopeScreen} />` line is unchanged.

- [ ] **Step 6: Delete the placeholder**

```bash
git rm src/screens/KshopeScreen.js
```

This deletion is mandatory, not tidying. A leftover `src/screens/KshopeScreen.js` shadows the new module in Metro's resolution, and the migration silently becomes dead code — this exact failure has happened in this repo before.

- [ ] **Step 7: Confirm nothing else imported the placeholder**

```bash
grep -rn "screens/KshopeScreen" src/ __tests__/
```

Expected: no output.

- [ ] **Step 8: Run the test to verify it passes**

Run: `npx jest __tests__/kshopeMount.test.js`
Expected: PASS, 5 tests

- [ ] **Step 9: Run the full suite**

Run: `npm test`
Expected: PASS, no failures.

- [ ] **Step 10: Verify on a device**

```bash
npm start -- --reset-cache
npm run ios
```

Log in, open the service switcher from the Kshope tab, tap **48hrs Deals**. Expected: a brief spinner, then the empty module home — not KapraDaily's home screen, and not the unavailable state. Reaching the unavailable state means the session bridge is not producing a token; go back to Task 1's findings before continuing.

- [ ] **Step 11: Commit**

```bash
git add src/kshope/index.ts src/kshope/navigation/KshopeRoot.tsx src/kshope/screens/KshopeUnavailable.tsx src/navigation/RootNavigator.js __tests__/kshopeMount.test.js
git commit -m "feat: mount the kshope module on the KshopeScreen route and drop the placeholder"
```

---

### Task 10: Close out the remaining assumptions

**Files:**
- Modify: `docs/superpowers/specs/2026-08-22-kshope-module-migration-design.md`

Assumptions 1 and 2 were settled in Task 1. Assumptions 3 and 4 gate phase 3 (checkout) and phases 2-5 respectively, and are cheapest to answer now that a working authenticated client exists.

- [ ] **Step 1: Check whether kshopecore needs its own Razorpay key**

```bash
grep -rn "razorpay\|RAZORPAY\|key_id" ~/kshopeeNew/src --include=*.ts --include=*.tsx
grep -rn "razorpay\|RAZORPAY\|key_id" src/api/paymentService.js src/globals/secrets.js
```

Record whether the key is hardcoded per app, fetched from the backend, or shared. If it is hardcoded and the two differ, phase 3 needs a module-scoped key.

- [ ] **Step 2: Compare response shapes on the shared routes**

With the app running and a kshope session live, call three representative routes through the module client and compare each response against the host's for the same route:

```bash
grep -rn "cart/list\|product/search\|order/mine" ~/kshopeeNew/src/api/services/
grep -rn "cart/list\|product/search\|order/mine" src/api/
```

Compare the response-shape assumptions each app's code makes — field names, nesting under `data` vs `Data`, list vs paged envelope. Record every divergence.

- [ ] **Step 3: Record the findings**

Append the results to the `## Verified` section of the spec, and remove assumptions 3 and 4 from the "Assumptions to verify" list. Any divergence found in Step 2 becomes an explicit note for the phase 2 plan.

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/specs/2026-08-22-kshope-module-migration-design.md
git commit -m "docs: close out kshope migration phase 1 assumptions"
```

---

## Phase 1 Done When

- [ ] `npm test` passes with the six new test files included.
- [ ] The host app logs in, browses, and adds to cart exactly as before the refactor.
- [ ] Tapping **48hrs Deals** opens the empty kshope module, authenticated against `kshopecore`.
- [ ] Logging out and back in as a different account produces a fresh kshope session, and the identity guard wipes the old one.
- [ ] `src/screens/KshopeScreen.js` no longer exists.
- [ ] `src/kshope/assets` holds only referenced assets, and the size reduction is recorded in the commit.
- [ ] All four spec assumptions are recorded as verified, with any divergences noted for phase 2.
