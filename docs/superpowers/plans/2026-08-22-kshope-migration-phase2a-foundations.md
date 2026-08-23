# Kshope Migration — Phase 2A: Browse Foundations — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port every non-screen dependency the kshope browse screens need — module storage and area-id resolution, theme, services, contexts, shared components, hooks, and the module's own tab navigator — so phase 2B can drop in ~6,200 lines of screens against a foundation that already talks to `kshopecore`.

**Architecture:** Everything lands under `src/kshope/`, ported 1:1 from `~/kshopeeNew/src` with a fixed set of adaptations: imports rewritten to module paths, all API traffic through `src/kshope/api/client`, and — the load-bearing one — every read of the host's `pincodeAreaId` replaced with the module's own area id.

**Tech Stack:** React Native 0.82.1, TypeScript, React Context, axios via the module client, `react-native-ratings`, `lucide-react-native`, `react-native-svg`, `lottie-react-native`.

**Spec:** `docs/superpowers/specs/2026-08-22-kshope-module-migration-design.md`
**Preceded by:** `docs/superpowers/plans/2026-08-22-kshope-migration-phase1-foundations.md` (complete)

## Global Constraints

- **DO NOT COMMIT AND DO NOT PUSH.** The user has withheld commit authority. Leave all work in the working tree. Every task's final step is "report what changed", never "commit". This overrides any habit or skill step that commits by default. The review baseline is commit `f958b71` — diff against it with `git diff f958b71 -- <paths>`.
- **No code comments.** New code is written bare. Ported files arrive from the source app carrying comments — **strip them as you port**. `// src/theme/colors.ts` style header comments are stale path references and must not survive.
- **The module NEVER reads host storage.** Not `pincodeAreaId`, not `profile`, not `selectedAddressId`, not `ACCESS_TOKEN`. Module keys are `KSHOPE_`-prefixed. This rule has been violated by a previous attempt at this integration and is the single most important constraint in this plan.
- All module API traffic goes through `src/kshope/api/client` (already built on `kshopecore.kapradaily.com` with `KSHOPE_` tokens). Never import `src/api/networkUtils`.
- Images resolve against `KSHOPE_CONFIG.image_base_url` (`https://kshadmin.kapradaily.com/`), never the host's.
- Module code is TypeScript. Test command `npx jest <path>`; full suite `npm test`.
- **Baseline suite state: 142 passed, 17 of 19 suites.** `__tests__/App.test.tsx` and `__tests__/tmp/discoveryTabs.test.js` fail on a pre-existing react-native-reanimated transform issue that predates this work — verified against the base commit. Do not try to fix them; confirm you do not make it worse.
- Source app `~/kshopeeNew` is **read-only**. Read from it freely; never write to it.

---

### Task 1: Module storage and area-id resolution

The keystone. Every subsequent task depends on it, and it is where the isolation rule is enforced.

**Files:**
- Create: `src/kshope/globals/storage.ts`
- Create: `src/kshope/hooks/useKshopeAreaId.ts`
- Test: `__tests__/kshopeStorage.test.js`

**Interfaces:**
- Produces: from `globals/storage.ts` — `KSHOPE_KEYS` (frozen map), `getKshopeAreaId(): Promise<number | null>`, `setKshopeAreaId(id: number | null): Promise<void>`, `getCachedProfile()`, `setCachedProfile(p)`, `clearKshopeLocalData(): Promise<void>`. From `hooks/useKshopeAreaId.ts` — `useKshopeAreaId(): { areaId: number | null, isResolving: boolean, refresh: () => Promise<void> }`.

**Background you need.** In `~/kshopeeNew`, screens resolve the delivery area with `AsyncStorage.getItem('pincodeAreaId')` and several fall back to a hardcoded `105` "dummy area" (see `context/WishlistContext.tsx:36-37`). Inside KapraDaily, `pincodeAreaId` belongs to the *host* app and refers to the host backend's area table. Reading it would scope the kshope catalogue, stock and pricing to the wrong area, and is exactly the bug that broke this integration once already.

- [ ] **Step 1: Write the failing test**

Create `__tests__/kshopeStorage.test.js`:

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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx jest __tests__/kshopeStorage.test.js`
Expected: FAIL — `Cannot find module '../src/kshope/globals/storage'`

- [ ] **Step 3: Write `src/kshope/globals/storage.ts`**

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const KSHOPE_KEYS = Object.freeze({
  AREA_ID: 'KSHOPE_PINCODE_AREA_ID',
  PROFILE: 'KSHOPE_PROFILE',
  SELECTED_ADDRESS_ID: 'KSHOPE_SELECTED_ADDRESS_ID',
  RECENT_SEARCHES: 'KSHOPE_RECENT_SEARCHES',
});

export const getKshopeAreaId = async (): Promise<number | null> => {
  const raw = await AsyncStorage.getItem(KSHOPE_KEYS.AREA_ID);
  if (raw === null) return null;
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

export const setKshopeAreaId = async (id: number | null): Promise<void> => {
  if (id === null || id === undefined) {
    await AsyncStorage.removeItem(KSHOPE_KEYS.AREA_ID);
    return;
  }
  await AsyncStorage.setItem(KSHOPE_KEYS.AREA_ID, String(id));
};

export const getCachedProfile = async (): Promise<any | null> => {
  const raw = await AsyncStorage.getItem(KSHOPE_KEYS.PROFILE);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setCachedProfile = async (profile: any): Promise<void> => {
  await AsyncStorage.setItem(KSHOPE_KEYS.PROFILE, JSON.stringify(profile));
};

export const clearKshopeLocalData = async (): Promise<void> => {
  await AsyncStorage.multiRemove(Object.values(KSHOPE_KEYS));
};
```

- [ ] **Step 4: Write `src/kshope/hooks/useKshopeAreaId.ts`**

The hook exposes the stored area id and a refresh. It must never invent a fallback — a null area id is a real state that screens handle by showing whatever the backend returns for an unscoped request. Resolution of *which* area a kshope user is in is a phase 3 concern (it comes from the address flow); phase 2 only reads what is stored.

```ts
import { useCallback, useEffect, useState } from 'react';
import { getKshopeAreaId } from '../globals/storage';

export const useKshopeAreaId = () => {
  const [areaId, setAreaId] = useState<number | null>(null);
  const [isResolving, setIsResolving] = useState(true);

  const refresh = useCallback(async () => {
    setIsResolving(true);
    try {
      setAreaId(await getKshopeAreaId());
    } finally {
      setIsResolving(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { areaId, isResolving, refresh };
};

export default useKshopeAreaId;
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx jest __tests__/kshopeStorage.test.js`
Expected: PASS, 8 tests

- [ ] **Step 6: Run the full suite and report**

Run: `npm test` — expect 150 passed, 17 of 19 suites.
**Do not commit.** Report the files created and the test output.

---

### Task 2: Theme and module types

**Files:**
- Create: `src/kshope/theme/colours.ts`, `src/kshope/theme/fonts.ts`, `src/kshope/theme/typography.ts`
- Create: `src/kshope/types/index.ts`
- Test: `__tests__/kshopeTheme.test.js`

**Interfaces:**
- Produces: default export `colors` from `theme/colours.ts` (the source exports light/dark sets — preserve its exact export shape); named `Fonts` from `theme/fonts.ts`; the source's typography exports from `theme/typography.ts`; and `KshopeStackParamList` from `types/index.ts`.

**Port from:** `~/kshopeeNew/src/assets/theme/colours.ts` (85 lines), `fonts.ts` (28), `typography.ts` (77).

**Adaptations:**
- Strip all comments, including the stale `// src/theme/colors.ts` headers.
- `fonts.ts` maps to `Gilroy-*` and `Poppins-*` family names. **Leave the names exactly as they are.** Gilroy now resolves from the host's `src/assets/fonts` (the kshope duplicates were deleted in phase 1 because 4 of 6 had identical filenames but different bytes). Poppins lives in `src/kshope/assets/fonts` and is registered in `react-native.config.js`, but **is not linked yet** — that needs `npx react-native-asset` plus a native rebuild, which is the user's deferred task. Poppins text will fall back to the system font until then. That is expected; do not work around it.
- **Do not port `~/kshopeeNew/src/types/types.ts` wholesale.** It is a leftover from the POS template it was scaffolded from — `OwnerLogin`, `EmployeeLogin`, `ManageStore`, `OrderTaking`, `Report` and friends do not exist in this app. Write `types/index.ts` fresh, containing only `KshopeStackParamList` with the routes this module actually has:

```ts
export type KshopeStackParamList = {
  KshopeTabs: undefined;
  KshopeHome: undefined;
  KshopeCategory: { categoryId?: string | number; categoryName?: string } | undefined;
  KshopeSearch: undefined;
  KshopeProductDetails: { productId: string | number; product?: any };
  KshopeProductCategoryDetail: { categoryId: string | number; title?: string };
  KshopeWishlist: undefined;
};
```

- [ ] **Step 1: Write the failing test**

Create `__tests__/kshopeTheme.test.js`:

```js
const colours = require('../src/kshope/theme/colours');
const { Fonts } = require('../src/kshope/theme/fonts');

test('the kshope palette is the source app palette, not KapraDaily orange by accident', () => {
  const palette = colours.default || colours.colors || colours;
  expect(palette.themeTeal).toBe('#F25000');
  expect(palette.primary).toBe('#1A72DD');
});

test('font families name real files that ship with the app', () => {
  const gilroy = ['Gilroy-Regular', 'Gilroy-Medium', 'Gilroy-SemiBold', 'Gilroy-Bold', 'Gilroy-ExtraBold', 'Gilroy-Light'];
  gilroy.forEach(family => {
    expect(Object.values(Fonts)).toContain(family);
  });
});

test('theme files carry no ported comments', () => {
  const fs = require('fs');
  const path = require('path');
  ['colours.ts', 'fonts.ts', 'typography.ts'].forEach(file => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'src/kshope/theme', file), 'utf8');
    expect(src).not.toMatch(/^\s*\/\//m);
    expect(src).not.toMatch(/\/\*/);
  });
});

test('the param list has no leftover POS-template routes', () => {
  const fs = require('fs');
  const path = require('path');
  const src = fs.readFileSync(path.join(__dirname, '..', 'src/kshope/types/index.ts'), 'utf8');
  ['OwnerLogin', 'EmployeeLogin', 'ManageStore', 'OrderTaking', 'StoreItemsList'].forEach(dead => {
    expect(src).not.toContain(dead);
  });
});
```

- [ ] **Step 2: Run it, confirm it fails, then port the three theme files and write `types/index.ts`**

Read each source file, copy it, strip comments, adjust only what the adaptations above require.

- [ ] **Step 3: Run the test to verify it passes**

Run: `npx jest __tests__/kshopeTheme.test.js`
Expected: PASS, 4 tests

- [ ] **Step 4: Run the full suite and report. Do not commit.**

---

### Task 3: Browse services

**Files:**
- Create: `src/kshope/api/services/homeService.ts`, `categoryService.ts`, `productService.ts`, `wishlistService.ts`
- Test: `__tests__/kshopeBrowseServices.test.js`

**Interfaces:**
- Produces: `getHomepageApi`, `getCategoryProductsApi` (home); `getCategoriesApi` (category); `getProductDetails`, `searchProductsApi`, `getRelatedProductsApi`, `getProductSuggestionsApi` (product); `addToWishlistApi`, `removeFromWishlistApi`, `getWishlistApi` (wishlist). Match the source's exported names exactly — the screens import them by name.

**Port from:** `~/kshopeeNew/src/api/services/{homeService,categoryService,productService,wishlistService}.ts`.

**Adaptations:**
- Change `import { get, post } from '../networkUtils'` to `from '../client'`. That is the whole of the backend switch — the module client is already bound to `kshopecore` with `KSHOPE_` tokens.
- Preserve every route path and parameter name verbatim. The two backends expose the same routes; the paths are not yours to adjust.
- Preserve the defensive behaviour in `getProductSuggestionsApi`, which swallows `SERVER_ERROR` and returns an empty result set rather than throwing. That is deliberate — search must degrade quietly.

- [ ] **Step 1: Write the failing test**

Create `__tests__/kshopeBrowseServices.test.js`. Mock the module client and assert on the URLs and params, so a wrong route or a wrong backend is caught:

```js
const mockGet = jest.fn(async () => ({ success: true, data: [] }));
const mockPost = jest.fn(async () => ({ success: true, data: [] }));

jest.mock('../src/kshope/api/client', () => ({
  get: (...args) => mockGet(...args),
  post: (...args) => mockPost(...args),
}));

const products = require('../src/kshope/api/services/productService');
const categories = require('../src/kshope/api/services/categoryService');
const wishlist = require('../src/kshope/api/services/wishlistService');

beforeEach(() => {
  mockGet.mockClear();
  mockPost.mockClear();
});

test('product details requests the product route with the area id', async () => {
  await products.getProductDetails(42, 207);
  expect(mockGet).toHaveBeenCalledWith('product/42', { params: { pincodeAreaId: 207 } });
});

test('related products requests the related route', async () => {
  await products.getRelatedProductsApi(42, 207);
  expect(mockGet.mock.calls[0][0]).toBe('product/42/related');
});

test('search posts to product/search', async () => {
  await products.searchProductsApi({ term: 'shoes' });
  expect(mockPost).toHaveBeenCalledWith('product/search', { term: 'shoes' });
});

test('suggestions degrade to an empty result set instead of throwing', async () => {
  mockGet.mockImplementationOnce(async () => ({ status: 'SERVER_ERROR' }));
  const result = await products.getProductSuggestionsApi('shoes', 207);
  expect(result).toEqual({ success: true, data: [] });
});

test('suggestions swallow a rejected request', async () => {
  mockGet.mockImplementationOnce(async () => { throw new Error('network'); });
  await expect(products.getProductSuggestionsApi('shoes', 207)).resolves.toEqual({ success: true, data: [] });
});

test('categories request the list route', async () => {
  await categories.getCategoriesApi('1');
  expect(mockGet).toHaveBeenCalledWith('categories/list', { params: { parentCatId: '1' } });
});

test('no browse service imports the host network layer', () => {
  const fs = require('fs');
  const path = require('path');
  ['homeService.ts', 'categoryService.ts', 'productService.ts', 'wishlistService.ts'].forEach(file => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'src/kshope/api/services', file), 'utf8');
    expect(src).not.toMatch(/api\/networkUtils/);
    expect(src).toMatch(/from '\.\.\/client'/);
  });
});
```

Add equivalent assertions for `wishlistService` and `homeService` once you have read their real signatures — do not guess their parameter shapes, read the source.

- [ ] **Step 2: Run it, confirm failure, port the four services, re-run.**
- [ ] **Step 3: Run the full suite and report. Do not commit.**

---

### Task 4: Contexts

**Files:**
- Create: `src/kshope/context/loaderContext.tsx`, `AlertContext.tsx`, `UserContext.tsx`, `WishlistContext.tsx`, `CartContext.tsx`
- Test: `__tests__/kshopeContexts.test.js`

**Port from:** the same-named files in `~/kshopeeNew/src/context/` (85, 64, 87, 137, 268 lines).

**Adaptations — read every one before you start:**

1. **Area id.** `WishlistContext.tsx:36-37` reads `AsyncStorage.getItem('pincodeAreaId')` and falls back to a hardcoded `105`. Replace with `getKshopeAreaId()` from `../globals/storage`. **Delete the 105 fallback** — pass whatever the module has, including `null`. A hardcoded area silently serves the wrong catalogue and is worse than an unscoped request. Apply the same substitution anywhere else a context reads that key.
2. **`UserContext`.** The source version owns login/logout, calls `NavigationService.reset('Login')`, and clears tokens. The module has **no login screens** — auth comes from the host's session bridge. Strip it back to: profile state, `loadProfile()` via the module's `getProfile`, hydration from `getCachedProfile()`, and nothing else. It must not clear tokens, must not navigate, and must not touch `clearTokens`. Session lifecycle belongs to `src/kshope/api/session.ts`, which already exists.
3. **`CartContext`.** Port in full — `ProductDetails` and `SearchScreen` both need add-to-cart. The Cart *screen* is phase 3. Any cart-summary/checkout method whose screen does not exist yet still ports; it simply has no caller.
4. **Quantity ceiling.** KapraDaily caps cart quantity at the per-order and stock limit, keyed on `maxQtyInOrders` where `0` means unlimited. Check whether the kshope cart applies the same rule; if the source does not enforce it, note that in your report as a phase 3 item. Do not invent the behaviour here.
5. All API calls route through the module services from Task 3.
6. Strip ported comments.

- [ ] **Step 1: Write the failing test**

Create `__tests__/kshopeContexts.test.js` covering, at minimum:
- No context file contains the string `'pincodeAreaId'` (the host key) — grep-style assertion over all five files.
- No context file contains the hardcoded `105` area fallback.
- `UserContext.tsx` does not import `clearTokens`, does not reference `NavigationService`, and contains no `reset('Login')`.
- All five files import from `../api/services/...` or `../globals/storage`, never from `../../api/`.
- A behavioural test of `WishlistContext`'s `isInWishlist` / `toggleWishlist` against a mocked wishlist service, using `@testing-library/react-native` if it is available in this repo — check first; if it is not, assert the reducer-like logic by exercising the exported hook through a minimal test renderer, or state in your report that behavioural coverage is deferred and why.

- [ ] **Step 2: Run it, confirm failure, port the five contexts, re-run.**
- [ ] **Step 3: Run the full suite and report. Do not commit.**

---

### Task 5: Shared components

**Files:**
- Create under `src/kshope/components/`: `FallbackImage.tsx`, `ProductCard.tsx`, `ExploreItem.tsx`, `HomeSearchBar.tsx`, `FloatingCartButton.tsx`, `ClickForMoreButton.tsx`, `CoinCountSVG.tsx`
- Test: `__tests__/kshopeComponents.test.js`

**Port from:** `~/kshopeeNew/src/components/` — `FallbackImage`, `ProductCard`, `ExploreItem/ExploreItem.tsx` (133), `HomeSearchBar/HomeSearchBar.tsx` (38), `FloatingCartButton/FloatingCartButton.tsx` (150), `ClickForMoreButton/ClickForMoreButton.tsx` (35), `CoinCountSVG.js` (93).

**Adaptations:**
- Flatten the one-file-per-directory nesting: `components/ExploreItem/ExploreItem.tsx` becomes `components/ExploreItem.tsx`. Keep the component names identical.
- Convert `CoinCountSVG.js` to `.tsx`. Type its props; if the shape is unclear from usage, type it as narrowly as the call sites allow rather than `any`.
- Image URLs resolve against `KSHOPE_CONFIG.image_base_url`, never the host's config. `FallbackImage` is the place this is most likely to be wrong — check it specifically.
- `FloatingCartButton` reads the **module** `CartContext`. It must never show host cart counts.
- Theme imports point at `../theme/colours` and `../theme/fonts`.
- Strip ported comments.

- [ ] **Step 1: Write the failing test**

`__tests__/kshopeComponents.test.js` asserting: no component imports `src/globals/config` (the host config) or `src/context/` (host contexts); `FallbackImage` composes its URL from `KSHOPE_CONFIG.image_base_url`; every file exists at the flattened path; and a render smoke test for `ProductCard` and `ExploreItem` with minimal props if a renderer is available.

- [ ] **Step 2: Run it, confirm failure, port the seven components, re-run.**
- [ ] **Step 3: Run the full suite and report. Do not commit.**

---

### Task 6: Hooks

**Files:**
- Create: `src/kshope/hooks/useDebounce.ts`, `src/kshope/hooks/useProductSearch.ts`
- Test: `__tests__/kshopeHooks.test.js`

**Port from:** `~/kshopeeNew/src/hooks/useDebounce.ts` (17), `useProductSearch.ts` (244).

**Adaptations:** services from Task 3; area id from `useKshopeAreaId` (Task 1), never the host key; strip comments. `useProductSearch` is the one with real logic — read it carefully and preserve its debounce timing, its minimum-term threshold, and its empty-state handling exactly.

- [ ] **Step 1: Write the failing test** — `useDebounce` with fake timers (a value change does not propagate before the delay, does propagate after, and a rapid second change resets the window); and a `useProductSearch` assertion that it never reads `'pincodeAreaId'`.
- [ ] **Step 2: Run it, confirm failure, port both hooks, re-run.**
- [ ] **Step 3: Run the full suite and report. Do not commit.**

---

### Task 7: The module tab navigator

**Files:**
- Create: `src/kshope/navigation/KshopeTabs.tsx`
- Modify: `src/kshope/navigation/KshopeRoot.tsx`
- Test: `__tests__/kshopeNavigation.test.js`

**Interfaces:**
- Consumes: every provider from Task 4.
- Produces: `KshopeTabs` — the module's own bottom tab bar (Home / Category / Wishlist), rendered inside `KshopeRoot`'s stack, with all module providers composed above it.

**Port from:** `~/kshopeeNew/src/navigation/BottomNavigator.js`, but **only the three real tabs**. The source has a fourth "Kebra" tab whose `tabPress` opens an external App Store / Play Store URL for a different product — **do not port it.** Tab icons come from `src/kshope/assets/images/bottomtab/`.

**Adaptations:**
- `KshopeRoot` currently renders a stack containing an empty `KshopePlaceholderHome`. Replace that placeholder with `KshopeTabs`, and compose the providers around the navigator: Loader → Alert → User → Wishlist → Cart. Keep the existing session gate (`checking` → spinner, `unavailable` → `KshopeUnavailable`, plus the `.catch()`) exactly as it is.
- Screens do not exist yet. Register each tab against a small typed placeholder in this task; phase 2B swaps in the real screens without touching the navigator.
- The host's tab bar must stay hidden while the module is open — that is already handled by the full-screen route in `RootNavigator`. Verify it still holds.

- [ ] **Step 1: Write the failing test** — `KshopeTabs` exists and registers exactly three tabs; no external-store `Linking` call was ported; `KshopeRoot` still renders `KshopeUnavailable` on a false session and still has its `.catch()`; the phase 1 isolation test still passes.
- [ ] **Step 2: Run it, confirm failure, build the navigator and rewire `KshopeRoot`, re-run.**
- [ ] **Step 3: Run the full suite and report. Do not commit.**

---

## Phase 2A Done When

- [ ] `npm test` passes with the new suites, and the 2 pre-existing reanimated failures are still the only failures.
- [ ] `npx tsc --noEmit -p tsconfig.json` is clean.
- [ ] `grep -rn "pincodeAreaId" src/kshope/` returns **only** `KSHOPE_PINCODE_AREA_ID` — no bare host key anywhere in the module.
- [ ] `grep -rn "105" src/kshope/context/` shows no hardcoded area fallback.
- [ ] Nothing under `src/kshope/` imports `src/api/networkUtils`, `src/globals/config`, or `src/context/`.
- [ ] Opening the module shows a three-tab bar with placeholder screens, authenticated against kshopecore.
- [ ] Everything is uncommitted, in the working tree, ready for the user to review.
