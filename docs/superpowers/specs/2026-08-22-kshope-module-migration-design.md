# Kshope Module Migration — Design

**Date:** 2026-08-22
**Status:** Approved, pending implementation plan

## Goal

Migrate every flow and every piece of logic from the standalone `kshopeeNew`
React Native app (`~/kshopeeNew`, package `pos_rn_app`) into KapraDaily as a
self-contained module, reachable from KapraDaily's existing `Kshope` tab.

## Context

Two apps, one company, two backends.

| | KapraDaily | kshopeeNew |
|---|---|---|
| Language | JavaScript | TypeScript |
| React Native | 0.82.1 | 0.83.1 |
| Size | ~78k LOC | ~32k LOC, 176 files |
| API base | `core.kapradaily.com/api/v1/` | `kshopecore.kapradaily.com/api/v1/` |
| Images | `backend.kapradaily.com` | `kshadmin.kapradaily.com` |
| Domain | grocery/daily, events, tickets, D2C, vouchers, affiliate, co-partner | general e-commerce |

Two findings shaped this design.

**The two backends expose an identical API surface.** `cart/add`, `cart/list`,
`cart/availablecoupons`, `cart/availableslots`, `product/search`,
`product/suggestions`, `order/create`, `order/mine`, `order/cancel`,
`order/itemreturn`, `order/reorder`, `me/address`, `me/addresslist`,
`me/bwallet`, `me/bcoin/redeem`, `general/settings` — both apps call the same
routes, and KapraDaily's service layer is a superset. The genuinely unique part
of kshopee is its UI plus its base URL and tokens.

**Several kshopee screens are not wired up.** `MyOrder.tsx` and
`MyOrderDetails.tsx` render from `dummydata.tsx`; `ShopWithUs.tsx` is entirely
static. `orderService.ts` already defines the endpoints they should be using.
`Home.tsx` (3077 lines) and `Category.tsx` are genuinely API-driven.

KapraDaily currently ships `src/screens/KshopeScreen.js`, a placeholder that
renders KapraDaily's own home data. It is not connected to kshopecore in any way.

## Decisions

| Decision | Choice |
|---|---|
| Shape | Isolated module under `src/kshope/`, own contexts, own client, own theme |
| Auth | Token bridge from KapraDaily's login response; no kshope login screens |
| Duplicate screens | Migrate all of them (Profile, Address, Referral, BCoin, ...) |
| Navigation | Full-screen takeover stack; host tab bar hidden, kshope tab bar shown |
| Network stack | Module owns its services, built on a client factory extracted from the host |
| Dummy-data flows | Wire My Orders / Order Details to the real API; ShopWithUs stays static |
| Visual design | Keep kshopee's design exactly — 1:1 port |
| Assets | Port only referenced assets, then compress |
| Prior port | The archived `archive/deals48-v1` branch is NOT to be reused. Fresh port from `~/kshopeeNew`. |

## Architecture

### Module layout

```
src/kshope/
  index.ts              KshopeRoot — the single export the host mounts
  globals/config.ts     kshopecore base url, kshadmin image base, kshonboarding
  api/
    client.ts           axios instance built by the host factory
    tokenService.ts     KSHOPE_-prefixed keys in Keychain via secureStore
    session.ts          token bridge + identity guard
    services/           address, cart, category, config, home, order, payment,
                        pincode, product, signalR, support, user, wishlist
  context/              Cart, Wishlist, User, Alert, Loader — kshope-scoped
  navigation/           KshopeNavigator (stack) + KshopeTabs (own tab bar)
  screens/              ported 1:1 from kshopeeNew
  components/           ported 1:1
  theme/                kshopee colours, typography
  assets/               referenced images/fonts/icons only, compressed
```

No file outside `src/kshope/` imports from inside it, except the single mount
point in the navigator.

### Host changes — additive only

1. `src/api/networkUtils.js` — extract `createApiClient({ baseUrl, tokenStore })`.
   The existing default client is rebuilt on that factory with its current
   arguments so host behaviour is unchanged. Characterisation tests are written
   before this refactor.
2. `src/api/tokenService.js` — add `createTokenStore(prefix)`. Current exports
   become `createTokenStore('')` and keep their exact key names so existing
   logged-in sessions survive the upgrade.
3. Auth path — call `syncKshopeSession(response)` on login/register success and
   `clearKshopeSession()` on logout.
4. `src/navigation/RootNavigator.js` and `src/navigation/MainTabNavigator.js` —
   the `Kshope` tab pushes `KshopeRoot` as a full-screen route with the host tab
   bar hidden.
5. Delete `src/screens/KshopeScreen.js`. Left in place it shadows the new module
   in Metro's resolution and the migration silently becomes dead code.
6. `package.json` — add `react-native-ratings`, `@react-native-community/netinfo`,
   `react-native-uuid`, `lucide-react-native`,
   `@react-native-community/datetimepicker`, `buffer`. netinfo and
   datetimepicker are native: iOS pod install and an Android rebuild required.

### Session bridge

KapraDaily's login response carries a `kshope` block:

```ts
kshope?: {
  success?: boolean;
  accessToken?: string;
  refreshToken?: string;
  custId?: number | null;
}
```

- `syncKshopeSession(authData)` — writes `accessToken` / `refreshToken` to
  `KSHOPE_ACCESS_TOKEN` / `KSHOPE_REFRESH_TOKEN` in the Keychain. If
  `success === false` or no access token is present, it clears any stored kshope
  session, cached profile, and area id.
- `ensureKshopeSession()` — called on module entry. Decodes the host and module
  JWTs and compares custIds. A mismatch means the account was switched; the
  kshope session is wiped rather than serving another user's cart.
- `clearKshopeSession()` — called from host logout.

Because no kshope login screens are migrated, a missing or unrecoverable session
renders an unavailable state and returns the user to KapraDaily. The module
never prompts for a second login. A 401 inside the module attempts a refresh and
on failure clears the session and exits.

Empty-string values must never be written to the Keychain — that throws on
Android. `secureStore` deletes the key instead, and the bridge relies on that.

### Isolation rules

These exist because violating them has broken this integration before.

- The module reads and writes its own `kshope.pincodeAreaId`. It must never read
  the host's `pincodeAreaId`.
- The kshope cart is a separate context with its own badge. KapraDaily's
  floating cart button never reflects kshope items, and vice versa.
- React Query keys are namespaced `['kshope', ...]`.
- Image URLs resolve against `kshadmin.kapradaily.com`, not the host's image base.

### Data flow

Screen → module context (Cart/Wishlist/User) or React Query hook → module
service → module axios client → kshopecore, with the kshope access token
attached by the shared interceptor and refreshed against the module's own
refresh token.

### Error handling

The module has its own Alert and Loader contexts, so kshope errors surface
inside the kshope UI and never over KapraDaily's screens. Network failures use
netinfo-backed offline handling as in the source app. Auth failures follow the
session bridge rules above. Payment calls keep the host's existing verbose
payment logging, which the shared factory provides.

## Screens

Migrated: Home, Category + FilterModal, ProductDetails, ProductCategoryDetail,
Search, Wishlist, Cart, OrderSuccess, OrderFailed, OrderPending, MyOrder,
MyOrderDetails, Profile, EditProfile, UpdateContact, UpdateContactOtp,
SavedAddress, AddLocation, Referral, BCoin, ShopWithUs, Kshope landing.

Not migrated, superseded by the token bridge: Splash, Login, LoginPwdScreen,
ChangePwdScreen, Otp, Registration.

Built rather than copied, because the source is dummy data: MyOrder and
MyOrderDetails, wired to `order/mine`, `order/cancel`, `order/itemreturn` and
`order/reorder`, modelled on KapraDaily's working orders screens. ShopWithUs is
ported as static content; it has no endpoint.

## Testing

Test-driven throughout, using the repo's existing Jest setup.

- Characterisation tests on the host `networkUtils` and `tokenService` before
  either is refactored, proving behaviour is unchanged afterwards.
- Unit tests for `session.ts`: sync on success, clear on `success: false`, clear
  on absent token, wipe on custId mismatch, no empty-string Keychain writes.
- Unit tests for each migrated service against recorded response fixtures.
- Context tests for the kshope cart, including the per-order and stock quantity
  ceiling behaviour already established in the host cart.
- Isolation tests asserting the module never reads host `pincodeAreaId` and that
  host and module cart badges stay independent.

## Sequence

1. **Foundations** — client factory, token namespace, session bridge, module
   skeleton, navigation mount, dependencies, asset prune and compression.
2. **Browse** — Home, Category, FilterModal, Search, ProductDetails,
   ProductCategoryDetail.
3. **Cart and checkout** — CartContext, Cart, coupons, delivery slots, address
   selection, Razorpay, order outcome screens.
4. **Post-purchase** — MyOrder, MyOrderDetails, cancel, return, reorder.
5. **Account** — Profile, EditProfile, UpdateContact, SavedAddress, AddLocation,
   Wishlist, Referral, BCoin, ShopWithUs.

Every phase ends in a runnable app so the work can be exercised before the next
phase starts.

## Assumptions to verify in phase 1

These are inferred, not confirmed against a live response. Each is verified
before phase 1 closes.

1. The live KapraDaily login response contains the `kshope` block described
   above. Nothing in the current codebase reads it. **If this is false the
   entire auth model changes — stop and re-decide rather than improvise.**
2. The refresh-token field name, and whether kshopecore honours
   `auth/refreshtoken` with it.
3. Whether checkout against kshopecore needs a separate Razorpay key from the
   host's.
4. Whether kshopecore's response *shapes* match KapraDaily's on the
   identically-named routes. Only the paths have been confirmed.

## Out of scope

- Merging the two carts, wishlists, order histories, or wallets.
- Any change to KapraDaily's own commerce, events, tickets, D2C, voucher,
  affiliate or co-partner flows.
- Reuse of any code from `archive/deals48-v1`.
- Restyling kshopee's UI to KapraDaily's design system.
