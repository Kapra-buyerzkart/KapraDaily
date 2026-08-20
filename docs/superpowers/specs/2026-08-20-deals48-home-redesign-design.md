# Deals48 Home Screen Redesign — Design

**Date:** 2026-08-20
**Branch:** `feature/48hrIntegration`
**Screen:** `src/modules/deals48/screens/Kshope/` (route `DEALS48_ROUTES.HOME`)

## Purpose

Rebuild the deals48 Home Screen so the product's differentiator — **products and offers are
available as limited-time 48-hour deals** — is the organising principle of the screen rather than a
banner bolted onto a generic storefront.

The first viewport must answer three questions without scrolling:

1. What is this app? A marketplace for limited-time deals.
2. Why should I care? Real products at real discounts.
3. Why buy now? The deals expire.

This is a UI/UX redesign. No backend, business-logic, or state-management rewrite.

## Constraints discovered during exploration

### The homepage payload has no deal timing

A search of the whole `deals48` module for `expir|endTime|endDate|validTill|validTo|countdown|
dealEnd|startTime|startDate|remaining` returns only cart-session toast strings. There is no
per-product or per-block deal start/end timestamp in the API response.

Every countdown, "ending soon" ordering, and expiry state in the brief depends on a time the
backend does not currently send.

**Decision:** the countdown is driven by a **global 48-hour drop cycle** derived from a
config-anchored epoch, not by invented per-product timers. This is truthful if the catalogue
genuinely refreshes on a 48-hour cadence. The abstraction reads per-item fields when present, so
per-product timers activate with no UI change the day the backend adds them.

### Available product fields

From `ExploreItem` and the Kshope organisms, home products carry: `productId`, `prName` /
`productName` / `title` / `name`, `specialPrice` / `price` / `currentPrice`, `unitPrice` / `mrp` /
`originalPrice`, `discountPercent` / `discountBadge`, `stockQty`, `stockAvailability`,
`featuredImage` / `productImage` / `imageUrl` / `image`, `brand`.

Field naming is inconsistent and both camelCase and PascalCase variants occur. The existing hook
already tolerates this via `unwrapBlock`, `byPlacement`, and per-field alias chains.

### Available API surface

- `getHomepageData(pincodeAreaId, blocksize)` — the single home fetch.
- `addToCartApi(productId, quantity, pincodeAreaIdOverride)` — simple enough to call directly from
  a home card.
- Recent searches already persist under `DEALS48_recent_searches_list` in `SearchScreen`.

### Out of scope

**Personalised "Deals For You" is deliberately excluded from this pass.** There is no
recommendation endpoint and no browsing history. Revisit when an endpoint exists.

## Approach

Rebuild in place, extending the existing `Kshope/` atoms/molecules/organisms tree, with payload
normalisation added as the first step.

Rejected alternatives:

- **A parallel `Home/` screen swapped in later.** Doubles the surface area and risks a leftover
  screen file shadowing its replacement in Metro. Two homes drifting apart is worse than one home
  mid-refactor.
- **Data-layer-only first pass.** Correct sequencing but produces no visible screen for a full
  cycle of work.

## Architecture

### Layer 1 — Deal model normalisation

The hook currently terminates in raw `any` objects, so every card re-implements the same alias
chains. Normalising once at the hook boundary is what makes lifecycle states possible at all.

New: `screens/Kshope/deal/types.ts`

```
Deal {
  id: string
  name: string
  brand?: string
  image: ImageSource
  price: number
  mrp: number
  discountPercent: number
  savings: number
  stockQty?: number
  inStock: boolean
  window: DealWindow
  raw: any
}
```

`raw` is retained so navigation to Product Details can keep passing the original object, preserving
current behaviour.

New: `screens/Kshope/deal/normalize.ts` — `toDeal(item): Deal | null`. Holds every alias chain in
one place. Returns `null` for items lacking an id, matching the existing
`.filter(i => i && (i.productId || i.id))` guard.

`discountPercent` prefers the server's value and falls back to computing it from `mrp`/`price`;
`savings` is always `mrp - price`, floored at 0.

### Layer 2 — The deal clock

New: `globals/dealCycle.ts`

- `CYCLE_MS = 48 * 60 * 60 * 1000`
- `CYCLE_EPOCH` — a fixed UTC ISO anchor exported from `globals/config`, so cycle boundaries are
  identical on every device regardless of timezone. Cycle boundaries land at fixed 48-hour offsets
  from this anchor; the anchor value itself is a business decision and must be confirmed before
  release rather than left at a development placeholder.
- `currentCycle(now) → { startsAt, endsAt, index }`
- `dealWindowOf(item, now) → DealWindow` — reads `dealStartsAt` / `dealEndsAt` / `DealEndsAt` /
  `offerEndsAt` aliases off the item; falls back to `currentCycle(now)` when absent.

New: `screens/Kshope/deal/clock.ts`

A single module-level `setInterval` driving an external store, with `subscribe` / `getSnapshot`
suitable for `useSyncExternalStore`. Consumers subscribe; the interval starts on first subscriber
and stops on last.

**Two granularities, deliberately:**

- `useDealSeconds(window)` — 1Hz. Used only by the hero.
- `useDealMinutes(window)` — emits only when the displayed minute changes. Used by every card and
  section header.

Twenty cards each running their own `setInterval` at 1Hz is the failure mode this exists to avoid.
Seconds ticking simultaneously on eight cards is also visually noisy, not just expensive.

**Phases:**

| Phase | Condition |
|---|---|
| `upcoming` | `now < startsAt` |
| `active` | `> 6h` remaining |
| `ending` | `<= 6h` remaining |
| `critical` | `<= 1h` remaining |
| `ended` | `now >= endsAt` |

### Layer 3 — Presentation

New atoms/molecules under `screens/Kshope/deal/`:

- `DealCountdown` — variants `hero` (H M S, large), `header` (compact, beside a section title),
  `chip` (card-level, minute granularity). Colour is a function of phase.
- `DealStateChip` — renders the lifecycle label for a `Deal`.
- `DealProductCard` — the card described below.
- `DealHero` — the drop hero.

Existing `PressableScale`, `ShopText`, `Surface`, `SectionLabel`, `PagerDots` are reused. All
spacing, radius, elevation, and type come from the existing `CART_*` tokens in
`src/styles/cartTheme.js`. Motion extends the existing `entrance` and `PressableScale` primitives
from `src/styles/motion.js` — no new animation vocabulary.

## Countdown placement

With a global cycle, every deal ends at the same instant. Stamping an identical `18h 32m left` on
eight cards in a rail is visual noise pretending to be information, and the repetition is the first
thing a user notices.

**Therefore: the countdown renders once per section header, not once per card, while the cycle is
global.** `DealProductCard` accepts a `showCountdown` prop, default `false`. When per-item
`dealEndsAt` values start arriving and genuinely diverge, `DealSection` sets `showCountdown` and
per-card chips activate.

This is the one deliberate departure from the brief's literal layout, made specifically to avoid
manufactured scarcity.

Card-level state chips (`Deal Ended`, `Sold Out`, `Starts in 04h 20m`, `Almost gone`) always render
when they apply — those are per-item facts, not repeated clocks.

## Section order

Every API placement rendered today is still rendered. Nothing is orphaned.

| # | Section | Source | Notes |
|---|---|---|---|
| 1 | Header | `profile`, pincode, cart count | Logo, location, notifications, cart w/ animated badge, avatar |
| 2 | Search | existing `SearchScreen` | Collapses on scroll |
| 3 | 48-hour drop hero | `topBanner` + computed | Seconds countdown, real max discount, live deal count, CTA |
| 4 | Deal category rail | `featuredCategories` + `goatDeals` | Compact, scannable tiles |
| 5 | Closing This Drop | `showcaseSlider` | Section countdown; ranked by discount then scarcity |
| 6 | Trending Deals | `bestSelling` | Scarcity labels only where `stockQty` supports them |
| 7 | Category deal sections | `firstProductBlock`, `secondProductBlock`, `categoryTabShowcase` | Each with View All |
| 8 | Brands | `brands` | Demoted below the fold |
| 9 | Bottom banners | `bottomBanner` | Unchanged |

### Hero figures must be derived, not hardcoded

- "UP TO N% OFF" — `max(discountPercent)` across all normalised deals in the payload.
- Deal count — the count of distinct normalised deals.

If the payload yields no deals, the hero renders without these figures rather than showing zeros.

### Scarcity labels

`Almost gone` renders only when `stockQty` is present and below a threshold. `Selling fast` and
`Trending` require signals that do not exist in the payload and are **not** rendered until they do.
No label is derived from randomness or position in a list.

## Deal product card

Hierarchy: image → discount badge → name → `₹1,499  ₹2,599` → `Save ₹1,100` → state chip →
ADD TO CART.

Add to cart calls `addToCartApi(deal.id, 1, pincodeAreaId)` with an inline pending → success
transition on the button and a cart-badge bump. Failure surfaces a toast and reverts the button,
matching the existing error handling in `ProductDetails`.

### Lifecycle states

| State | Condition | Presentation |
|---|---|---|
| Active | phase `active` | Normal card |
| Ending | phase `ending` / `critical` | Amber/red state chip |
| Ended | phase `ended` | Desaturated image, `Deal Ended`, CTA becomes View similar |
| Sold out | `stockQty <= 0` or `stockAvailability === 'Out Of Stock'` | Existing overlay treatment preserved |
| Upcoming | phase `upcoming` | `Starts in 04h 20m`, CTA disabled |

Sold out takes precedence over ended; ended takes precedence over ending.

Expired deals are **not** hidden. They transition state in place.

`ExploreItem` is left untouched — Search and category screens continue to use it.

## Visual direction

`#F25000` remains the sole brand accent. A second accent colour would read as chaos.

Urgency gets its own narrow ramp used **only** by countdowns and lifecycle badges, so urgency is a
legible system rather than decoration:

| Phase | Treatment |
|---|---|
| `active` | Neutral slate chip, muted text |
| `ending` | Amber |
| `critical` | Red |
| `ended` | Flat grey |

Countdowns sit neutral-dark at rest and warm only as the phase escalates. This avoids
orange-on-orange collision with the brand accent and keeps the premium register.

Exact ramp values are added to `cartTheme` as a `DEAL_URGENCY` group rather than being inlined at
call sites.

## Motion

Fast and subtle. Reuses existing primitives.

- Countdown digit changes: opacity crossfade, no bounce.
- Phase transition (`active` → `ending`): colour interpolation over ~400ms.
- Card press: existing `PressableScale`.
- Add to cart: button label crossfade, cart badge scale bump.
- Section entrance: existing staggered `entrance(index)`.
- Skeleton loading and pull-to-refresh: existing `KshopeSkeleton` and `RefreshControl` behaviour
  preserved.

## Preserved behaviour

Navigation and routes, authentication, cart, wishlist, search, categories, checkout, payment,
profile, pincode/area resolution, the `getHomepageData` fetch and its alias-tolerant parsing,
banner auto-advance, pull-to-refresh, and the loading skeleton all remain as they are.
Normalisation is added on top of the existing parsing, not in place of it.

## Testing

- `toDeal` — alias coverage, discount computation fallback, null on missing id, savings floor.
- `currentCycle` — boundary behaviour at exact cycle edges; monotonic index.
- `dealWindowOf` — per-item override wins over cycle; alias coverage; malformed date falls back.
- Phase derivation — each threshold boundary, including exactly 6h and exactly 1h.
- Clock store — interval starts on first subscriber and stops on last; minute selector does not
  emit within the same displayed minute.
- Card state precedence — sold out over ended over ending.
- Hero derived figures — empty payload renders no figures rather than zeros.

## Open items for a later pass

- Per-product `dealEndsAt` from the backend, which activates per-card countdowns.
- A recommendation endpoint, which unblocks "Deals For You".
- `Selling fast` / `Trending` signals.
