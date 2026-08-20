# Deals48 48-Hour Home Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the deals48 Home Screen so the 48-hour deal lifecycle — countdowns, urgency phases, and expiry states — is the organising structure of the screen rather than decoration.

**Architecture:** A pure logic layer (cycle maths, phase derivation, payload normalisation, a single shared clock store) is built and unit-tested first. Presentation is then rebuilt on top of that layer inside the existing `screens/Kshope/` atoms/molecules/organisms tree, reusing the app's `CART_*` design tokens. No API, navigation, cart, or auth behaviour changes.

**Tech Stack:** React Native 0.82, React 19.1, TypeScript 5.8, react-native-reanimated, jest (`react-native` preset), react-native-responsive-screen.

**Spec:** `docs/superpowers/specs/2026-08-20-deals48-home-redesign-design.md`

## Global Constraints

- **No code comments.** Write the code bare. The surrounding repo has comments in places; do not follow that. Reasoning belongs in commit messages, not `//` blocks.
- **Brand accent is `#F25000` (`CART_COLORS.primary`) and is the only accent.** Urgency colours come from the new `DEAL_URGENCY` group and are used *only* by countdowns and lifecycle chips.
- **All spacing, radius, elevation, and type come from `src/styles/cartTheme.js`** (`CART_COLORS`, `CART_SPACING`, `CART_RADIUS`, `CART_TYPE`, `CART_ELEVATION`, `wp`, `hp`). Do not inline hex values or magic numbers at call sites.
- **No manufactured scarcity.** A label renders only when payload data supports it. `Almost gone` requires `stockQty`. `Selling fast` and `Trending` have no supporting signal and must not be rendered.
- **Countdowns render once per section header, not per card,** while the deal cycle is global. `DealProductCard` takes `showCountdown` defaulting to `false`.
- **Do not modify `src/modules/deals48/components/ExploreItem/ExploreItem.tsx`.** Search and category screens depend on it.
- **Preserve existing behaviour:** `getHomepageData` fetch and its alias-tolerant parsing, banner auto-advance, pull-to-refresh, loading skeleton, all navigation routes, wishlist, cart, auth, pincode/area resolution.
- **Test convention:** pure logic modules get jest tests in `__tests__/<name>.test.js` using ESM imports, matching `__tests__/homeHeaderPhase.test.js`. There is no `@testing-library/react-native` in this project, so components are verified with `npx tsc --noEmit` and `npm run lint`, not unit tests.
- **Verification commands:** `npm test`, `npm run lint`, `npx tsc --noEmit`.

---

### Task 1: Deal cycle maths

The 48-hour cycle every countdown derives from. Anchored to a fixed UTC epoch so boundaries are identical on every device regardless of timezone.

**Files:**
- Create: `src/modules/deals48/globals/dealCycle.ts`
- Modify: `src/modules/deals48/globals/config.ts`
- Test: `__tests__/dealCycle.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `CYCLE_MS: number`
  - `DealWindow = { startsAt: number; endsAt: number }`
  - `currentCycle(now: number): DealWindow & { index: number }`
  - `dealWindowOf(item: any, now: number): DealWindow`

- [ ] **Step 1: Write the failing test**

Create `__tests__/dealCycle.test.js`:

```js
import {
  CYCLE_MS,
  currentCycle,
  dealWindowOf,
} from '../src/modules/deals48/globals/dealCycle';
import CONFIG from '../src/modules/deals48/globals/config';

const EPOCH = Date.parse(CONFIG.deal_cycle_epoch);
const HOUR = 60 * 60 * 1000;

describe('currentCycle', () => {
  it('spans 48 hours', () => {
    expect(CYCLE_MS).toBe(48 * HOUR);
  });

  it('starts exactly at the epoch for a time inside the first cycle', () => {
    const cycle = currentCycle(EPOCH + HOUR);
    expect(cycle.startsAt).toBe(EPOCH);
    expect(cycle.endsAt).toBe(EPOCH + CYCLE_MS);
    expect(cycle.index).toBe(0);
  });

  it('treats the exact cycle boundary as the start of the next cycle', () => {
    const cycle = currentCycle(EPOCH + CYCLE_MS);
    expect(cycle.startsAt).toBe(EPOCH + CYCLE_MS);
    expect(cycle.index).toBe(1);
  });

  it('increases the index monotonically across cycles', () => {
    expect(currentCycle(EPOCH + CYCLE_MS * 5 + HOUR).index).toBe(5);
    expect(currentCycle(EPOCH + CYCLE_MS * 6 + HOUR).index).toBe(6);
  });

  it('handles times before the epoch without producing a window that excludes now', () => {
    const cycle = currentCycle(EPOCH - HOUR);
    expect(cycle.startsAt).toBeLessThanOrEqual(EPOCH - HOUR);
    expect(cycle.endsAt).toBeGreaterThan(EPOCH - HOUR);
  });
});

describe('dealWindowOf', () => {
  const now = EPOCH + HOUR;

  it('falls back to the global cycle when the item has no timing fields', () => {
    expect(dealWindowOf({ productId: 1 }, now)).toEqual({
      startsAt: EPOCH,
      endsAt: EPOCH + CYCLE_MS,
    });
  });

  it('prefers an explicit dealEndsAt on the item', () => {
    const endsAt = EPOCH + 10 * HOUR;
    const window = dealWindowOf(
      { dealEndsAt: new Date(endsAt).toISOString() },
      now,
    );
    expect(window.endsAt).toBe(endsAt);
  });

  it('reads PascalCase and offer-prefixed aliases', () => {
    const endsAt = EPOCH + 12 * HOUR;
    const iso = new Date(endsAt).toISOString();
    expect(dealWindowOf({ DealEndsAt: iso }, now).endsAt).toBe(endsAt);
    expect(dealWindowOf({ offerEndsAt: iso }, now).endsAt).toBe(endsAt);
  });

  it('reads an explicit start time', () => {
    const startsAt = EPOCH + 2 * HOUR;
    const window = dealWindowOf(
      { dealStartsAt: new Date(startsAt).toISOString() },
      now,
    );
    expect(window.startsAt).toBe(startsAt);
  });

  it('accepts epoch-millisecond numbers as well as ISO strings', () => {
    const endsAt = EPOCH + 8 * HOUR;
    expect(dealWindowOf({ dealEndsAt: endsAt }, now).endsAt).toBe(endsAt);
  });

  it('falls back to the cycle when the date is unparseable', () => {
    const window = dealWindowOf({ dealEndsAt: 'not a date' }, now);
    expect(window.endsAt).toBe(EPOCH + CYCLE_MS);
  });

  it('falls back to the cycle when the item is null', () => {
    expect(dealWindowOf(null, now)).toEqual({
      startsAt: EPOCH,
      endsAt: EPOCH + CYCLE_MS,
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest __tests__/dealCycle.test.js`
Expected: FAIL — cannot resolve `../src/modules/deals48/globals/dealCycle`.

- [ ] **Step 3: Add the cycle epoch to config**

Open `src/modules/deals48/globals/config.ts` and add a `deal_cycle_epoch` key to the exported config object, alongside the existing keys such as `image_base_url`:

```ts
deal_cycle_epoch: '2026-01-01T00:00:00.000Z',
```

This anchor is a business decision. It is a development placeholder and must be confirmed against the real drop schedule before release.

- [ ] **Step 4: Write the implementation**

Create `src/modules/deals48/globals/dealCycle.ts`:

```ts
import CONFIG from './config';

export const CYCLE_MS = 48 * 60 * 60 * 1000;

export interface DealWindow {
  startsAt: number;
  endsAt: number;
}

export interface DealCycle extends DealWindow {
  index: number;
}

const EPOCH = Date.parse(CONFIG.deal_cycle_epoch);

const END_KEYS = ['dealEndsAt', 'DealEndsAt', 'offerEndsAt', 'OfferEndsAt'];
const START_KEYS = [
  'dealStartsAt',
  'DealStartsAt',
  'offerStartsAt',
  'OfferStartsAt',
];

const parseTime = (value: any): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const parsed = Date.parse(String(value));
  return Number.isNaN(parsed) ? null : parsed;
};

const firstTime = (item: any, keys: string[]): number | null => {
  for (const key of keys) {
    const parsed = parseTime(item[key]);
    if (parsed !== null) return parsed;
  }
  return null;
};

export const currentCycle = (now: number): DealCycle => {
  const index = Math.floor((now - EPOCH) / CYCLE_MS);
  const startsAt = EPOCH + index * CYCLE_MS;
  return { startsAt, endsAt: startsAt + CYCLE_MS, index };
};

export const dealWindowOf = (item: any, now: number): DealWindow => {
  const cycle = currentCycle(now);
  if (!item || typeof item !== 'object') {
    return { startsAt: cycle.startsAt, endsAt: cycle.endsAt };
  }
  return {
    startsAt: firstTime(item, START_KEYS) ?? cycle.startsAt,
    endsAt: firstTime(item, END_KEYS) ?? cycle.endsAt,
  };
};
```

`Math.floor` on a negative quotient rounds toward negative infinity, which is what makes the pre-epoch case produce a window that still contains `now`.

- [ ] **Step 5: Run test to verify it passes**

Run: `npx jest __tests__/dealCycle.test.js`
Expected: PASS, 12 tests.

- [ ] **Step 6: Commit**

```bash
git add __tests__/dealCycle.test.js src/modules/deals48/globals/dealCycle.ts src/modules/deals48/globals/config.ts
git commit -m "feat(deals48): add 48-hour deal cycle and per-item window resolution"
```

---

### Task 2: Deal phase derivation and countdown formatting

Turns a window plus a timestamp into the phase and the human-readable remaining time that every countdown renders.

**Files:**
- Create: `src/modules/deals48/screens/Kshope/deal/phase.ts`
- Test: `__tests__/dealPhase.test.js`

**Interfaces:**
- Consumes: `DealWindow` from `src/modules/deals48/globals/dealCycle`.
- Produces:
  - `DealPhase = 'upcoming' | 'active' | 'ending' | 'critical' | 'ended'`
  - `ENDING_MS: number`, `CRITICAL_MS: number`
  - `remainingMs(window: DealWindow, now: number): number`
  - `phaseOf(window: DealWindow, now: number): DealPhase`
  - `formatRemaining(ms: number, withSeconds?: boolean): string`

- [ ] **Step 1: Write the failing test**

Create `__tests__/dealPhase.test.js`:

```js
import {
  ENDING_MS,
  CRITICAL_MS,
  remainingMs,
  phaseOf,
  formatRemaining,
} from '../src/modules/deals48/screens/Kshope/deal/phase';

const HOUR = 60 * 60 * 1000;
const MINUTE = 60 * 1000;
const START = 1_000_000_000_000;

const windowEndingIn = ms => ({ startsAt: START, endsAt: START + ms });

describe('remainingMs', () => {
  it('reports the milliseconds left', () => {
    expect(remainingMs(windowEndingIn(3 * HOUR), START)).toBe(3 * HOUR);
  });

  it('clamps to zero once the window has passed', () => {
    expect(remainingMs(windowEndingIn(HOUR), START + 5 * HOUR)).toBe(0);
  });
});

describe('phaseOf', () => {
  it('is upcoming before the window opens', () => {
    expect(phaseOf(windowEndingIn(HOUR), START - MINUTE)).toBe('upcoming');
  });

  it('is active with more than six hours left', () => {
    expect(phaseOf(windowEndingIn(20 * HOUR), START)).toBe('active');
  });

  it('is ending at exactly six hours left', () => {
    expect(phaseOf(windowEndingIn(ENDING_MS), START)).toBe('ending');
  });

  it('is ending just above one hour left', () => {
    expect(phaseOf(windowEndingIn(CRITICAL_MS + MINUTE), START)).toBe('ending');
  });

  it('is critical at exactly one hour left', () => {
    expect(phaseOf(windowEndingIn(CRITICAL_MS), START)).toBe('critical');
  });

  it('is ended at exactly the end instant', () => {
    expect(phaseOf(windowEndingIn(HOUR), START + HOUR)).toBe('ended');
  });

  it('is active at the exact opening instant of a long window', () => {
    expect(phaseOf(windowEndingIn(40 * HOUR), START)).toBe('active');
  });
});

describe('formatRemaining', () => {
  it('renders hours, minutes and seconds for the hero', () => {
    expect(formatRemaining(32 * HOUR + 18 * MINUTE + 42_000, true)).toBe(
      '32h 18m 42s',
    );
  });

  it('drops the hour segment when under an hour, with seconds', () => {
    expect(formatRemaining(18 * MINUTE + 42_000, true)).toBe('18m 42s');
  });

  it('renders hours and minutes without seconds for cards', () => {
    expect(formatRemaining(18 * HOUR + 32 * MINUTE)).toBe('18h 32m');
  });

  it('drops the hour segment when under an hour, without seconds', () => {
    expect(formatRemaining(42 * MINUTE)).toBe('42m');
  });

  it('pads minutes when an hour segment is present', () => {
    expect(formatRemaining(5 * HOUR + 7 * MINUTE)).toBe('5h 07m');
  });

  it('renders zero as 0m', () => {
    expect(formatRemaining(0)).toBe('0m');
  });

  it('never renders a negative duration', () => {
    expect(formatRemaining(-5000)).toBe('0m');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest __tests__/dealPhase.test.js`
Expected: FAIL — cannot resolve the `deal/phase` module.

- [ ] **Step 3: Write the implementation**

Create `src/modules/deals48/screens/Kshope/deal/phase.ts`:

```ts
import { DealWindow } from '../../../globals/dealCycle';

export type DealPhase =
  | 'upcoming'
  | 'active'
  | 'ending'
  | 'critical'
  | 'ended';

export const ENDING_MS = 6 * 60 * 60 * 1000;
export const CRITICAL_MS = 60 * 60 * 1000;

const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

export const remainingMs = (window: DealWindow, now: number): number =>
  Math.max(0, window.endsAt - now);

export const phaseOf = (window: DealWindow, now: number): DealPhase => {
  if (now < window.startsAt) return 'upcoming';
  const left = window.endsAt - now;
  if (left <= 0) return 'ended';
  if (left <= CRITICAL_MS) return 'critical';
  if (left <= ENDING_MS) return 'ending';
  return 'active';
};

const pad = (value: number) => String(value).padStart(2, '0');

export const formatRemaining = (ms: number, withSeconds = false): string => {
  const safe = Math.max(0, ms);
  const hours = Math.floor(safe / HOUR_MS);
  const minutes = Math.floor((safe % HOUR_MS) / MINUTE_MS);
  const seconds = Math.floor((safe % MINUTE_MS) / 1000);

  if (withSeconds) {
    if (hours > 0) return `${hours}h ${pad(minutes)}m ${pad(seconds)}s`;
    return `${minutes}m ${pad(seconds)}s`;
  }
  if (hours > 0) return `${hours}h ${pad(minutes)}m`;
  return `${minutes}m`;
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest __tests__/dealPhase.test.js`
Expected: PASS, 17 tests.

- [ ] **Step 5: Commit**

```bash
git add __tests__/dealPhase.test.js src/modules/deals48/screens/Kshope/deal/phase.ts
git commit -m "feat(deals48): derive deal phase and format countdown durations"
```

---

### Task 3: Deal normalisation

The homepage payload uses inconsistent camelCase/PascalCase field names and several aliases per value, so today every card re-implements the same alias chains. This collapses that into one function so lifecycle states have a single typed shape to work from.

**Files:**
- Create: `src/modules/deals48/screens/Kshope/deal/types.ts`
- Create: `src/modules/deals48/screens/Kshope/deal/normalize.ts`
- Test: `__tests__/dealNormalize.test.js`

**Interfaces:**
- Consumes: `DealWindow`, `dealWindowOf` from `globals/dealCycle`; `getImageSource` from `screens/Kshope/useKshopeScreen`.
- Produces:
  - `Deal` interface (fields listed in the implementation below)
  - `DealCardState = 'active' | 'ending' | 'ended' | 'soldOut' | 'upcoming'`
  - `toDeal(item: any, now: number): Deal | null`
  - `toDeals(items: any[], now: number): Deal[]`
  - `cardStateOf(deal: Deal, now: number): DealCardState`

- [ ] **Step 1: Write the failing test**

Create `__tests__/dealNormalize.test.js`:

```js
import {
  toDeal,
  toDeals,
  cardStateOf,
} from '../src/modules/deals48/screens/Kshope/deal/normalize';
import { CYCLE_MS } from '../src/modules/deals48/globals/dealCycle';

const NOW = Date.parse('2026-03-01T00:00:00.000Z');
const HOUR = 60 * 60 * 1000;

const baseItem = {
  productId: 42,
  prName: 'Wireless Earbuds',
  brand: 'Acme',
  specialPrice: 1499,
  unitPrice: 2599,
  featuredImage: '/img/earbuds.jpg',
  stockQty: 8,
};

describe('toDeal', () => {
  it('maps the canonical field names', () => {
    const deal = toDeal(baseItem, NOW);
    expect(deal.id).toBe('42');
    expect(deal.name).toBe('Wireless Earbuds');
    expect(deal.brand).toBe('Acme');
    expect(deal.price).toBe(1499);
    expect(deal.mrp).toBe(2599);
    expect(deal.stockQty).toBe(8);
    expect(deal.inStock).toBe(true);
  });

  it('computes savings as mrp minus price', () => {
    expect(toDeal(baseItem, NOW).savings).toBe(1100);
  });

  it('floors savings at zero when price exceeds mrp', () => {
    const deal = toDeal({ ...baseItem, specialPrice: 3000 }, NOW);
    expect(deal.savings).toBe(0);
  });

  it('prefers the server discount percent', () => {
    const deal = toDeal({ ...baseItem, discountPercent: 37 }, NOW);
    expect(deal.discountPercent).toBe(37);
  });

  it('computes discount percent from prices when the server omits it', () => {
    expect(toDeal(baseItem, NOW).discountPercent).toBe(42);
  });

  it('reports zero discount when mrp is missing or zero', () => {
    const deal = toDeal({ ...baseItem, unitPrice: 0 }, NOW);
    expect(deal.discountPercent).toBe(0);
    expect(deal.savings).toBe(0);
  });

  it('reads alternate name and price aliases', () => {
    const deal = toDeal(
      {
        id: 7,
        productName: 'Kettle',
        price: 800,
        mrp: 1000,
        imageUrl: '/img/kettle.jpg',
      },
      NOW,
    );
    expect(deal.id).toBe('7');
    expect(deal.name).toBe('Kettle');
    expect(deal.price).toBe(800);
    expect(deal.mrp).toBe(1000);
  });

  it('parses numeric strings from the payload', () => {
    const deal = toDeal({ ...baseItem, specialPrice: '1499' }, NOW);
    expect(deal.price).toBe(1499);
  });

  it('returns null when the item has no id', () => {
    expect(toDeal({ prName: 'Ghost' }, NOW)).toBeNull();
  });

  it('returns null for null input', () => {
    expect(toDeal(null, NOW)).toBeNull();
  });

  it('marks an item out of stock from stockQty', () => {
    expect(toDeal({ ...baseItem, stockQty: 0 }, NOW).inStock).toBe(false);
  });

  it('marks an item out of stock from stockAvailability', () => {
    const deal = toDeal(
      { ...baseItem, stockAvailability: 'Out Of Stock' },
      NOW,
    );
    expect(deal.inStock).toBe(false);
  });

  it('treats a missing stockQty as in stock', () => {
    const { stockQty, ...withoutStock } = baseItem;
    const deal = toDeal(withoutStock, NOW);
    expect(deal.inStock).toBe(true);
    expect(deal.stockQty).toBeUndefined();
  });

  it('falls back to the global cycle window', () => {
    const deal = toDeal(baseItem, NOW);
    expect(deal.window.endsAt - deal.window.startsAt).toBe(CYCLE_MS);
  });

  it('retains the original object for navigation', () => {
    expect(toDeal(baseItem, NOW).raw).toBe(baseItem);
  });
});

describe('toDeals', () => {
  it('drops items that cannot be normalised', () => {
    const deals = toDeals([baseItem, { prName: 'Ghost' }, null], NOW);
    expect(deals).toHaveLength(1);
    expect(deals[0].id).toBe('42');
  });

  it('returns an empty array for a non-array input', () => {
    expect(toDeals(undefined, NOW)).toEqual([]);
  });
});

describe('cardStateOf', () => {
  const dealWith = overrides => ({
    ...toDeal(baseItem, NOW),
    ...overrides,
  });

  it('is active well inside the window', () => {
    const deal = dealWith({
      window: { startsAt: NOW - HOUR, endsAt: NOW + 30 * HOUR },
    });
    expect(cardStateOf(deal, NOW)).toBe('active');
  });

  it('is ending inside the final six hours', () => {
    const deal = dealWith({
      window: { startsAt: NOW - HOUR, endsAt: NOW + 3 * HOUR },
    });
    expect(cardStateOf(deal, NOW)).toBe('ending');
  });

  it('collapses the critical phase into ending for card display', () => {
    const deal = dealWith({
      window: { startsAt: NOW - HOUR, endsAt: NOW + 30 * 60 * 1000 },
    });
    expect(cardStateOf(deal, NOW)).toBe('ending');
  });

  it('is upcoming before the window opens', () => {
    const deal = dealWith({
      window: { startsAt: NOW + 4 * HOUR, endsAt: NOW + 52 * HOUR },
    });
    expect(cardStateOf(deal, NOW)).toBe('upcoming');
  });

  it('is ended after the window closes', () => {
    const deal = dealWith({
      window: { startsAt: NOW - 50 * HOUR, endsAt: NOW - HOUR },
    });
    expect(cardStateOf(deal, NOW)).toBe('ended');
  });

  it('prefers sold out over ended', () => {
    const deal = dealWith({
      inStock: false,
      window: { startsAt: NOW - 50 * HOUR, endsAt: NOW - HOUR },
    });
    expect(cardStateOf(deal, NOW)).toBe('soldOut');
  });

  it('prefers ended over ending', () => {
    const deal = dealWith({
      window: { startsAt: NOW - 50 * HOUR, endsAt: NOW },
    });
    expect(cardStateOf(deal, NOW)).toBe('ended');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest __tests__/dealNormalize.test.js`
Expected: FAIL — cannot resolve the `deal/normalize` module.

- [ ] **Step 3: Write the types**

Create `src/modules/deals48/screens/Kshope/deal/types.ts`:

```ts
import { DealWindow } from '../../../globals/dealCycle';

export interface Deal {
  id: string;
  name: string;
  brand?: string;
  image: any;
  price: number;
  mrp: number;
  discountPercent: number;
  savings: number;
  stockQty?: number;
  inStock: boolean;
  window: DealWindow;
  raw: any;
}

export type DealCardState =
  | 'active'
  | 'ending'
  | 'ended'
  | 'soldOut'
  | 'upcoming';
```

- [ ] **Step 4: Write the implementation**

Create `src/modules/deals48/screens/Kshope/deal/normalize.ts`:

```ts
import { dealWindowOf } from '../../../globals/dealCycle';
import { getImageSource } from '../useKshopeScreen';
import { phaseOf } from './phase';
import { Deal, DealCardState } from './types';

const pick = (item: any, keys: string[]) => {
  for (const key of keys) {
    const value = item[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return undefined;
};

const toNumber = (value: any): number => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const parsed = parseFloat(String(value));
  return Number.isNaN(parsed) ? 0 : parsed;
};

const ID_KEYS = ['productId', 'ProductId', 'id', 'Id'];
const NAME_KEYS = ['prName', 'productName', 'title', 'name', 'PrName'];
const BRAND_KEYS = ['brand', 'Brand', 'brandName', 'BrandName'];
const PRICE_KEYS = ['specialPrice', 'SpecialPrice', 'price', 'currentPrice'];
const MRP_KEYS = ['unitPrice', 'UnitPrice', 'mrp', 'originalPrice'];
const IMAGE_KEYS = ['featuredImage', 'productImage', 'imageUrl', 'image'];
const DISCOUNT_KEYS = ['discountPercent', 'DiscountPercent'];

export const toDeal = (item: any, now: number): Deal | null => {
  if (!item || typeof item !== 'object') return null;

  const rawId = pick(item, ID_KEYS);
  if (rawId === undefined) return null;

  const price = toNumber(pick(item, PRICE_KEYS));
  const mrp = toNumber(pick(item, MRP_KEYS));
  const savings = mrp > price ? mrp - price : 0;

  const serverDiscount = pick(item, DISCOUNT_KEYS);
  const discountPercent =
    serverDiscount !== undefined
      ? Math.round(toNumber(serverDiscount))
      : mrp > 0
      ? Math.round((savings / mrp) * 100)
      : 0;

  const rawStock = pick(item, ['stockQty', 'StockQty']);
  const stockQty = rawStock === undefined ? undefined : toNumber(rawStock);
  const availability = pick(item, ['stockAvailability', 'StockAvailability']);
  const inStock =
    availability !== 'Out Of Stock' && (stockQty === undefined || stockQty > 0);

  return {
    id: String(rawId),
    name: String(pick(item, NAME_KEYS) ?? ''),
    brand: pick(item, BRAND_KEYS),
    image: getImageSource(pick(item, IMAGE_KEYS)),
    price,
    mrp,
    discountPercent,
    savings,
    stockQty,
    inStock,
    window: dealWindowOf(item, now),
    raw: item,
  };
};

export const toDeals = (items: any[], now: number): Deal[] => {
  if (!Array.isArray(items)) return [];
  return items
    .map(item => toDeal(item, now))
    .filter((deal): deal is Deal => deal !== null);
};

export const cardStateOf = (deal: Deal, now: number): DealCardState => {
  if (!deal.inStock) return 'soldOut';
  const phase = phaseOf(deal.window, now);
  if (phase === 'ended') return 'ended';
  if (phase === 'upcoming') return 'upcoming';
  if (phase === 'ending' || phase === 'critical') return 'ending';
  return 'active';
};
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx jest __tests__/dealNormalize.test.js`
Expected: PASS, 24 tests.

- [ ] **Step 6: Commit**

```bash
git add __tests__/dealNormalize.test.js src/modules/deals48/screens/Kshope/deal/types.ts src/modules/deals48/screens/Kshope/deal/normalize.ts
git commit -m "feat(deals48): normalise homepage payload items into a typed Deal model"
```

---

### Task 4: Shared clock store

Twenty cards each running their own `setInterval` at 1Hz is the failure mode this task exists to prevent. One module-level interval drives an external store; the hero subscribes at second granularity and everything else at minute granularity, so cards re-render sixty times less often.

**Files:**
- Create: `src/modules/deals48/screens/Kshope/deal/clock.ts`
- Test: `__tests__/dealClock.test.js`

**Interfaces:**
- Consumes: `DealWindow` from `globals/dealCycle`; `phaseOf`, `remainingMs` from `deal/phase`.
- Produces:
  - `subscribe(listener: () => void): () => void`
  - `getSnapshot(): number`
  - `getMinuteSnapshot(): number`
  - `subscriberCount(): number`
  - `useNow(): number`
  - `useNowByMinute(): number`
  - `useDealSeconds(window: DealWindow): { remaining: number; phase: DealPhase }`
  - `useDealMinutes(window: DealWindow): { remaining: number; phase: DealPhase }`

- [ ] **Step 1: Write the failing test**

Create `__tests__/dealClock.test.js`:

```js
import {
  subscribe,
  getSnapshot,
  getMinuteSnapshot,
  subscriberCount,
} from '../src/modules/deals48/screens/Kshope/deal/clock';

describe('clock store', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(Date.parse('2026-03-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('reports no subscribers at rest', () => {
    expect(subscriberCount()).toBe(0);
  });

  it('advances the snapshot once per second while subscribed', () => {
    const unsubscribe = subscribe(() => {});
    const before = getSnapshot();
    jest.advanceTimersByTime(1000);
    expect(getSnapshot()).toBeGreaterThan(before);
    unsubscribe();
  });

  it('notifies every subscriber on each tick', () => {
    const a = jest.fn();
    const b = jest.fn();
    const unsubA = subscribe(a);
    const unsubB = subscribe(b);
    jest.advanceTimersByTime(1000);
    expect(a).toHaveBeenCalled();
    expect(b).toHaveBeenCalled();
    unsubA();
    unsubB();
  });

  it('stops ticking once the last subscriber leaves', () => {
    const unsubscribe = subscribe(() => {});
    unsubscribe();
    expect(subscriberCount()).toBe(0);
    const frozen = getSnapshot();
    jest.advanceTimersByTime(5000);
    expect(getSnapshot()).toBe(frozen);
  });

  it('keeps ticking while at least one subscriber remains', () => {
    const unsubA = subscribe(() => {});
    const unsubB = subscribe(() => {});
    unsubA();
    const before = getSnapshot();
    jest.advanceTimersByTime(1000);
    expect(getSnapshot()).toBeGreaterThan(before);
    unsubB();
  });

  it('holds the minute snapshot steady within the same minute', () => {
    const unsubscribe = subscribe(() => {});
    const first = getMinuteSnapshot();
    jest.advanceTimersByTime(30_000);
    expect(getMinuteSnapshot()).toBe(first);
    unsubscribe();
  });

  it('advances the minute snapshot when the minute rolls over', () => {
    const unsubscribe = subscribe(() => {});
    const first = getMinuteSnapshot();
    jest.advanceTimersByTime(61_000);
    expect(getMinuteSnapshot()).toBe(first + 60_000);
    unsubscribe();
  });

  it('is safe to unsubscribe twice', () => {
    const unsubscribe = subscribe(() => {});
    unsubscribe();
    expect(() => unsubscribe()).not.toThrow();
    expect(subscriberCount()).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest __tests__/dealClock.test.js`
Expected: FAIL — cannot resolve the `deal/clock` module.

- [ ] **Step 3: Write the implementation**

Create `src/modules/deals48/screens/Kshope/deal/clock.ts`:

```ts
import { useSyncExternalStore } from 'react';
import { DealWindow } from '../../../globals/dealCycle';
import { DealPhase, phaseOf, remainingMs } from './phase';

const TICK_MS = 1000;
const MINUTE_MS = 60 * 1000;

let now = Date.now();
let minuteNow = Math.floor(now / MINUTE_MS) * MINUTE_MS;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

const tick = () => {
  now = Date.now();
  minuteNow = Math.floor(now / MINUTE_MS) * MINUTE_MS;
  listeners.forEach(listener => listener());
};

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  if (timer === null) {
    timer = setInterval(tick, TICK_MS);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  };
};

export const getSnapshot = () => now;
export const getMinuteSnapshot = () => minuteNow;
export const subscriberCount = () => listeners.size;

export const useNow = () => useSyncExternalStore(subscribe, getSnapshot);

export const useNowByMinute = () =>
  useSyncExternalStore(subscribe, getMinuteSnapshot);

export const useDealSeconds = (
  window: DealWindow,
): { remaining: number; phase: DealPhase } => {
  const current = useNow();
  return {
    remaining: remainingMs(window, current),
    phase: phaseOf(window, current),
  };
};

export const useDealMinutes = (
  window: DealWindow,
): { remaining: number; phase: DealPhase } => {
  const current = useNowByMinute();
  return {
    remaining: remainingMs(window, current),
    phase: phaseOf(window, current),
  };
};
```

`getMinuteSnapshot` returns an identical number for every tick inside the same minute, so `useSyncExternalStore` bails out of re-rendering minute-granularity consumers.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest __tests__/dealClock.test.js`
Expected: PASS, 8 tests.

- [ ] **Step 5: Run the whole logic suite together**

Run: `npx jest __tests__/dealCycle.test.js __tests__/dealPhase.test.js __tests__/dealNormalize.test.js __tests__/dealClock.test.js`
Expected: PASS, 4 suites.

- [ ] **Step 6: Commit**

```bash
git add __tests__/dealClock.test.js src/modules/deals48/screens/Kshope/deal/clock.ts
git commit -m "feat(deals48): add shared deal clock with second and minute granularity"
```

---

### Task 5: Deal statistics for the hero

The hero's headline figures must be derived from the payload, never hardcoded. An empty payload renders no figures rather than a confident zero.

**Files:**
- Create: `src/modules/deals48/screens/Kshope/deal/stats.ts`
- Test: `__tests__/dealStats.test.js`

**Interfaces:**
- Consumes: `Deal` from `deal/types`.
- Produces: `dealStats(dealGroups: Deal[][]): { maxDiscountPercent: number | null; total: number }`

Takes groups because the screen holds several separate deal arrays and the hero summarises all of them, deduplicating by id.

- [ ] **Step 1: Write the failing test**

Create `__tests__/dealStats.test.js`:

```js
import { dealStats } from '../src/modules/deals48/screens/Kshope/deal/stats';

const deal = (id, discountPercent) => ({ id, discountPercent });

describe('dealStats', () => {
  it('reports the deepest discount across all groups', () => {
    const stats = dealStats([
      [deal('1', 20), deal('2', 45)],
      [deal('3', 70)],
    ]);
    expect(stats.maxDiscountPercent).toBe(70);
  });

  it('counts distinct deals across groups', () => {
    const stats = dealStats([[deal('1', 20), deal('2', 45)], [deal('3', 70)]]);
    expect(stats.total).toBe(3);
  });

  it('deduplicates a deal appearing in more than one group', () => {
    const stats = dealStats([[deal('1', 20)], [deal('1', 20), deal('2', 45)]]);
    expect(stats.total).toBe(2);
  });

  it('returns a null discount when there are no deals', () => {
    expect(dealStats([[], []])).toEqual({
      maxDiscountPercent: null,
      total: 0,
    });
  });

  it('returns a null discount when every deal is at zero percent', () => {
    expect(dealStats([[deal('1', 0)]]).maxDiscountPercent).toBeNull();
  });

  it('ignores empty and missing groups', () => {
    const stats = dealStats([[deal('1', 30)], undefined, []]);
    expect(stats.total).toBe(1);
    expect(stats.maxDiscountPercent).toBe(30);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest __tests__/dealStats.test.js`
Expected: FAIL — cannot resolve the `deal/stats` module.

- [ ] **Step 3: Write the implementation**

Create `src/modules/deals48/screens/Kshope/deal/stats.ts`:

```ts
import { Deal } from './types';

export interface DealStats {
  maxDiscountPercent: number | null;
  total: number;
}

export const dealStats = (dealGroups: (Deal[] | undefined)[]): DealStats => {
  const seen = new Set<string>();
  let deepest = 0;

  dealGroups.forEach(group => {
    if (!Array.isArray(group)) return;
    group.forEach(deal => {
      seen.add(deal.id);
      if (deal.discountPercent > deepest) deepest = deal.discountPercent;
    });
  });

  return {
    maxDiscountPercent: deepest > 0 ? deepest : null,
    total: seen.size,
  };
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest __tests__/dealStats.test.js`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add __tests__/dealStats.test.js src/modules/deals48/screens/Kshope/deal/stats.ts
git commit -m "feat(deals48): derive hero deal statistics from the payload"
```

---

### Task 6: Urgency colour tokens

Urgency needs its own narrow ramp so it reads as a system rather than decoration, and so it never collides with the brand orange.

**Files:**
- Modify: `src/styles/cartTheme.js`

**Interfaces:**
- Produces: `DEAL_URGENCY` export with keys `active`, `ending`, `critical`, `ended`, `upcoming`, each `{ bg, border, text }`.

- [ ] **Step 1: Add the token group**

In `src/styles/cartTheme.js`, after the `CART_COLORS` export, add:

```js
export const DEAL_URGENCY = {
  active: {
    bg: '#EEF0F4',
    border: 'rgba(17,19,26,0.10)',
    text: '#2B2D36',
  },
  ending: {
    bg: '#FFF4E5',
    border: 'rgba(178,106,0,0.24)',
    text: '#B26A00',
  },
  critical: {
    bg: '#FEF1F0',
    border: 'rgba(217,48,37,0.26)',
    text: '#D93025',
  },
  ended: {
    bg: '#F1F2F4',
    border: 'rgba(17,19,26,0.08)',
    text: '#9CA3AF',
  },
  upcoming: {
    bg: '#EEF0FF',
    border: 'rgba(49,46,129,0.18)',
    text: '#312E81',
  },
};
```

Countdowns sit neutral at rest and warm only as the phase escalates. No key in this group is the brand orange.

- [ ] **Step 2: Verify the module still parses**

Run: `npx jest __tests__/tokenProductCard.test.js`
Expected: PASS — this existing suite imports the theme, so it catches a syntax error in the edit.

- [ ] **Step 3: Commit**

```bash
git add src/styles/cartTheme.js
git commit -m "feat(styles): add deal urgency colour ramp"
```

---

### Task 7: Countdown and state chip atoms

**Files:**
- Create: `src/modules/deals48/screens/Kshope/deal/DealCountdown.tsx`
- Create: `src/modules/deals48/screens/Kshope/deal/DealStateChip.tsx`

**Interfaces:**
- Consumes: `useDealSeconds`, `useDealMinutes` from `deal/clock`; `formatRemaining` from `deal/phase`; `DealWindow` from `globals/dealCycle`; `Deal`, `DealCardState` from `deal/types`; `cardStateOf` from `deal/normalize`; `useNowByMinute` from `deal/clock`; `DEAL_URGENCY` from `@/styles/cartTheme`.
- Produces:
  - `DealCountdown({ window, variant })` where `variant: 'hero' | 'header' | 'chip'`
  - `DealStateChip({ deal })`

- [ ] **Step 1: Write DealCountdown**

Create `src/modules/deals48/screens/Kshope/deal/DealCountdown.tsx`:

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DealWindow } from '../../../globals/dealCycle';
import { ShopText } from '../atoms';
import { useDealMinutes, useDealSeconds } from './clock';
import { DealPhase, formatRemaining } from './phase';
import {
  DEAL_URGENCY,
  CART_RADIUS,
  CART_SPACING,
} from '@/styles/cartTheme';

type Variant = 'hero' | 'header' | 'chip';

interface DealCountdownProps {
  window: DealWindow;
  variant?: Variant;
}

const labelFor = (
  phase: DealPhase,
  remaining: number,
  startsIn: number,
  withSeconds: boolean,
) => {
  if (phase === 'ended') return 'Deal ended';
  if (phase === 'upcoming')
    return `Starts in ${formatRemaining(Math.max(0, startsIn))}`;
  return `${formatRemaining(remaining, withSeconds)} left`;
};

const HeroCountdown: React.FC<{ window: DealWindow }> = ({ window }) => {
  const { remaining, phase } = useDealSeconds(window);
  const tone = DEAL_URGENCY[phase] || DEAL_URGENCY.active;
  return (
    <View style={styles.hero}>
      <ShopText variant="display" style={{ color: tone.text }}>
        {labelFor(phase, remaining, window.startsAt - Date.now(), true)}
      </ShopText>
    </View>
  );
};

const ChipCountdown: React.FC<{ window: DealWindow; wide: boolean }> = ({
  window,
  wide,
}) => {
  const { remaining, phase } = useDealMinutes(window);
  const tone = DEAL_URGENCY[phase] || DEAL_URGENCY.active;
  return (
    <View
      style={[
        styles.chip,
        wide && styles.header,
        { backgroundColor: tone.bg, borderColor: tone.border },
      ]}
    >
      <ShopText variant="captionStrong" style={{ color: tone.text }}>
        {labelFor(phase, remaining, window.startsAt - Date.now(), false)}
      </ShopText>
    </View>
  );
};

const DealCountdown: React.FC<DealCountdownProps> = ({
  window,
  variant = 'chip',
}) =>
  variant === 'hero' ? (
    <HeroCountdown window={window} />
  ) : (
    <ChipCountdown window={window} wide={variant === 'header'} />
  );

export default React.memo(DealCountdown);

const styles = StyleSheet.create({
  hero: {
    alignSelf: 'flex-start',
  },
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: CART_SPACING.sm,
    paddingVertical: CART_SPACING.xs,
    borderRadius: CART_RADIUS.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  header: {
    paddingHorizontal: CART_SPACING.md,
  },
});
```

**The two-component split is load-bearing, not stylistic.** Hooks cannot be called conditionally, so a single component calling both `useDealSeconds` and `useDealMinutes` would subscribe every chip at 1Hz and destroy the entire point of the minute granularity built in Task 4. Each component must call exactly one of the two hooks. Do not merge them back together.

- [ ] **Step 2: Write DealStateChip**

Create `src/modules/deals48/screens/Kshope/deal/DealStateChip.tsx`:

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ShopText } from '../atoms';
import { useNowByMinute } from './clock';
import { cardStateOf } from './normalize';
import { formatRemaining } from './phase';
import { Deal } from './types';
import {
  DEAL_URGENCY,
  CART_RADIUS,
  CART_SPACING,
} from '@/styles/cartTheme';

const LOW_STOCK_THRESHOLD = 5;

interface DealStateChipProps {
  deal: Deal;
}

const DealStateChip: React.FC<DealStateChipProps> = ({ deal }) => {
  const now = useNowByMinute();
  const state = cardStateOf(deal, now);

  if (state === 'active') {
    if (deal.stockQty !== undefined && deal.stockQty <= LOW_STOCK_THRESHOLD) {
      return (
        <View
          style={[
            styles.chip,
            {
              backgroundColor: DEAL_URGENCY.ending.bg,
              borderColor: DEAL_URGENCY.ending.border,
            },
          ]}
        >
          <ShopText
            variant="micro"
            style={{ color: DEAL_URGENCY.ending.text }}
          >
            Almost gone
          </ShopText>
        </View>
      );
    }
    return null;
  }

  const tone =
    state === 'soldOut'
      ? DEAL_URGENCY.ended
      : state === 'ended'
      ? DEAL_URGENCY.ended
      : state === 'upcoming'
      ? DEAL_URGENCY.upcoming
      : DEAL_URGENCY.ending;

  const label =
    state === 'soldOut'
      ? 'Sold Out'
      : state === 'ended'
      ? 'Deal Ended'
      : state === 'upcoming'
      ? `Starts in ${formatRemaining(
          Math.max(0, deal.window.startsAt - now),
        )}`
      : `${formatRemaining(Math.max(0, deal.window.endsAt - now))} left`;

  return (
    <View
      style={[
        styles.chip,
        { backgroundColor: tone.bg, borderColor: tone.border },
      ]}
    >
      <ShopText variant="micro" style={{ color: tone.text }}>
        {label}
      </ShopText>
    </View>
  );
};

export default React.memo(DealStateChip);

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: CART_SPACING.sm,
    paddingVertical: 2,
    borderRadius: CART_RADIUS.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
```

`Almost gone` is the only scarcity label, and it renders only when `stockQty` is actually present. No `Selling fast` or `Trending` — there is no payload signal for either.

- [ ] **Step 3: Verify types and lint**

Run: `npx tsc --noEmit`
Expected: no errors in the new files.

Run: `npm run lint`
Expected: no new errors.

If `ShopText` rejects the `variant="display"` value, check the variant union in `src/modules/deals48/screens/Kshope/atoms/ShopText.tsx` and use the largest variant it does accept.

- [ ] **Step 4: Commit**

```bash
git add src/modules/deals48/screens/Kshope/deal/DealCountdown.tsx src/modules/deals48/screens/Kshope/deal/DealStateChip.tsx
git commit -m "feat(deals48): add countdown and lifecycle state chip components"
```

---

### Task 8: Deal product card

**Files:**
- Create: `src/modules/deals48/screens/Kshope/deal/DealProductCard.tsx`

**Interfaces:**
- Consumes: `Deal` from `deal/types`; `cardStateOf` from `deal/normalize`; `useNowByMinute` from `deal/clock`; `DealStateChip`, `DealCountdown`; `PressableScale`, `ShopText`, `Surface` from `../atoms`; `addToCartApi` from `../../../api/services`; `getPincodeAreaId` from `../../../globals/storage`.
- Produces: `DealProductCard({ deal, onPress, onAddToCart, toggleWishlist, isInWishlist, showCountdown })`

- [ ] **Step 1: Write the component**

Create `src/modules/deals48/screens/Kshope/deal/DealProductCard.tsx`:

```tsx
import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { AppIcons } from '../../../assets/icons';
import FallbackImage from '../../../components/FallbackImage';
import { PressableScale, ShopText, Surface } from '../atoms';
import DealCountdown from './DealCountdown';
import DealStateChip from './DealStateChip';
import { useNowByMinute } from './clock';
import { cardStateOf } from './normalize';
import { Deal } from './types';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  hp,
  wp,
} from '@/styles/cartTheme';

const CARD_W = wp('44%');

type AddState = 'idle' | 'pending' | 'added';

interface DealProductCardProps {
  deal: Deal;
  onPress: (deal: Deal) => void;
  onAddToCart: (deal: Deal) => Promise<boolean>;
  toggleWishlist: (item: any) => void;
  isInWishlist: (id: any) => boolean;
  showCountdown?: boolean;
}

const DealProductCard: React.FC<DealProductCardProps> = ({
  deal,
  onPress,
  onAddToCart,
  toggleWishlist,
  isInWishlist,
  showCountdown = false,
}) => {
  const now = useNowByMinute();
  const state = cardStateOf(deal, now);
  const [addState, setAddState] = useState<AddState>('idle');

  const disabled = state === 'ended' || state === 'soldOut' || state === 'upcoming';

  const handleAdd = useCallback(async () => {
    if (disabled || addState === 'pending') return;
    setAddState('pending');
    const ok = await onAddToCart(deal);
    setAddState(ok ? 'added' : 'idle');
    if (ok) setTimeout(() => setAddState('idle'), 1600);
  }, [deal, disabled, addState, onAddToCart]);

  const ctaLabel =
    state === 'ended'
      ? 'VIEW SIMILAR'
      : state === 'soldOut'
      ? 'SOLD OUT'
      : state === 'upcoming'
      ? 'COMING SOON'
      : addState === 'added'
      ? 'ADDED'
      : 'ADD TO CART';

  return (
    <Surface style={styles.card}>
      <PressableScale to={0.98} onPress={() => onPress(deal)}>
        <View style={styles.media}>
          <FallbackImage
            source={deal.image}
            style={[styles.image, state === 'ended' && styles.faded]}
            resizeMode="contain"
          />
          {deal.discountPercent > 0 && (
            <View style={styles.discount}>
              <ShopText variant="captionStrong" style={styles.discountText}>
                -{deal.discountPercent}%
              </ShopText>
            </View>
          )}
          <PressableScale
            to={0.85}
            onPress={() => toggleWishlist(deal.raw)}
            style={styles.wishlist}
          >
            {isInWishlist(deal.id) ? (
              <AppIcons.BookmarkFilled
                color={CART_COLORS.primary}
                size={wp('5%')}
              />
            ) : (
              <AppIcons.BookmarkOutline
                color={CART_COLORS.textMuted}
                size={wp('5%')}
              />
            )}
          </PressableScale>
        </View>
      </PressableScale>

      <View style={styles.body}>
        <ShopText variant="label" numberOfLines={2} style={styles.name}>
          {deal.name}
        </ShopText>

        <View style={styles.priceRow}>
          <ShopText variant="price">₹{deal.price}</ShopText>
          {deal.mrp > deal.price && (
            <ShopText variant="caption" tone="faint" style={styles.mrp}>
              ₹{deal.mrp}
            </ShopText>
          )}
        </View>

        {deal.savings > 0 && (
          <ShopText variant="micro" style={styles.savings}>
            Save ₹{deal.savings}
          </ShopText>
        )}

        {showCountdown && state !== 'soldOut' ? (
          <DealCountdown window={deal.window} variant="chip" />
        ) : (
          <DealStateChip deal={deal} />
        )}

        <PressableScale
          to={0.97}
          onPress={state === 'ended' ? () => onPress(deal) : handleAdd}
          style={[styles.cta, disabled && state !== 'ended' && styles.ctaMuted]}
          contentStyle={styles.ctaContent}
        >
          {addState === 'pending' ? (
            <ActivityIndicator size="small" color={CART_COLORS.onPrimary} />
          ) : (
            <ShopText variant="cta" style={styles.ctaText}>
              {ctaLabel}
            </ShopText>
          )}
        </PressableScale>
      </View>
    </Surface>
  );
};

export default React.memo(DealProductCard);

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    borderRadius: CART_RADIUS.productCard,
    overflow: 'hidden',
  },
  media: {
    height: hp('16%'),
    backgroundColor: CART_COLORS.well,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '78%',
    height: '82%',
  },
  faded: {
    opacity: 0.35,
  },
  discount: {
    position: 'absolute',
    top: CART_SPACING.sm,
    left: CART_SPACING.sm,
    backgroundColor: CART_COLORS.primary,
    paddingHorizontal: CART_SPACING.sm,
    paddingVertical: 2,
    borderRadius: CART_RADIUS.xs,
  },
  discountText: {
    color: CART_COLORS.onPrimary,
  },
  wishlist: {
    position: 'absolute',
    top: CART_SPACING.sm,
    right: CART_SPACING.sm,
  },
  body: {
    padding: CART_SPACING.md,
    gap: CART_SPACING.xs,
  },
  name: {
    minHeight: hp('4.4%'),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: CART_SPACING.sm,
  },
  mrp: {
    textDecorationLine: 'line-through',
  },
  savings: {
    color: CART_COLORS.success,
  },
  cta: {
    marginTop: CART_SPACING.xs,
    height: hp('4.6%'),
    borderRadius: CART_RADIUS.button,
    backgroundColor: CART_COLORS.primary,
  },
  ctaMuted: {
    backgroundColor: CART_COLORS.textFaint,
  },
  ctaContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

- [ ] **Step 2: Verify types and lint**

Run: `npx tsc --noEmit`
Expected: no errors in the new file.

Run: `npm run lint`
Expected: no new errors.

If `FallbackImage` does not accept a style array, wrap the conditional style into a single object before passing it.

- [ ] **Step 3: Commit**

```bash
git add src/modules/deals48/screens/Kshope/deal/DealProductCard.tsx
git commit -m "feat(deals48): add deal product card with lifecycle states and add to cart"
```

---

### Task 9: Deal section organism

One consistent section shell: title, subtitle, optional header countdown, horizontal rail, View All.

**Files:**
- Create: `src/modules/deals48/screens/Kshope/organisms/DealSection.tsx`

**Interfaces:**
- Consumes: `Deal` from `deal/types`; `DealProductCard`; `DealCountdown`; `PressableScale`, `ShopText` from `../atoms`; `GUTTER`, `styles as shared` from `../styles`.
- Produces: `DealSection({ title, subtitle, deals, window, onOpenDeal, onAddToCart, onSeeAll, toggleWishlist, isInWishlist, showCountdown, keyPrefix })`

- [ ] **Step 1: Write the component**

Create `src/modules/deals48/screens/Kshope/organisms/DealSection.tsx`:

```tsx
import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { DealWindow } from '../../../globals/dealCycle';
import { PressableScale, ShopText } from '../atoms';
import DealCountdown from '../deal/DealCountdown';
import DealProductCard from '../deal/DealProductCard';
import { Deal } from '../deal/types';
import { GUTTER, styles as shared } from '../styles';
import { CART_COLORS, CART_SPACING } from '@/styles/cartTheme';

interface DealSectionProps {
  title: string;
  subtitle?: string;
  deals: Deal[];
  window?: DealWindow;
  keyPrefix: string;
  onOpenDeal: (deal: Deal) => void;
  onAddToCart: (deal: Deal) => Promise<boolean>;
  onSeeAll?: () => void;
  toggleWishlist: (item: any) => void;
  isInWishlist: (id: any) => boolean;
  showCountdown?: boolean;
}

const DealSection: React.FC<DealSectionProps> = ({
  title,
  subtitle,
  deals,
  window,
  keyPrefix,
  onOpenDeal,
  onAddToCart,
  onSeeAll,
  toggleWishlist,
  isInWishlist,
  showCountdown = false,
}) => {
  const renderItem = useCallback(
    ({ item }: { item: Deal }) => (
      <DealProductCard
        deal={item}
        onPress={onOpenDeal}
        onAddToCart={onAddToCart}
        toggleWishlist={toggleWishlist}
        isInWishlist={isInWishlist}
        showCountdown={showCountdown}
      />
    ),
    [onOpenDeal, onAddToCart, toggleWishlist, isInWishlist, showCountdown],
  );

  if (deals.length === 0) return null;

  return (
    <View style={shared.section}>
      <View style={styles.head}>
        <View style={styles.copy}>
          <ShopText variant="heading">{title}</ShopText>
          {subtitle ? (
            <ShopText variant="caption" tone="muted">
              {subtitle}
            </ShopText>
          ) : null}
        </View>
        {window ? <DealCountdown window={window} variant="header" /> : null}
      </View>

      <FlatList
        data={deals}
        renderItem={renderItem}
        keyExtractor={item => `${keyPrefix}_${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
        decelerationRate="fast"
      />

      {onSeeAll ? (
        <PressableScale
          to={0.97}
          onPress={onSeeAll}
          style={styles.seeAll}
          contentStyle={styles.seeAllContent}
        >
          <ShopText variant="labelStrong" style={styles.seeAllText}>
            View All →
          </ShopText>
        </PressableScale>
      ) : null}
    </View>
  );
};

export default React.memo(DealSection);

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: GUTTER,
    marginBottom: CART_SPACING.md,
    gap: CART_SPACING.md,
  },
  copy: {
    flex: 1,
  },
  rail: {
    paddingHorizontal: GUTTER,
    gap: CART_SPACING.md,
  },
  seeAll: {
    marginTop: CART_SPACING.md,
    marginHorizontal: GUTTER,
  },
  seeAllContent: {
    alignItems: 'center',
    paddingVertical: CART_SPACING.md,
  },
  seeAllText: {
    color: CART_COLORS.primary,
  },
});
```

The header countdown is what makes an identical global timer legible instead of repetitive.

- [ ] **Step 2: Verify types and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/modules/deals48/screens/Kshope/organisms/DealSection.tsx
git commit -m "feat(deals48): add reusable deal section with header countdown"
```

---

### Task 10: The 48-hour drop hero

The visual centrepiece and the first thing the user sees. All figures derived.

**Files:**
- Create: `src/modules/deals48/screens/Kshope/organisms/DealHero.tsx`

**Interfaces:**
- Consumes: `DealWindow` from `globals/dealCycle`; `DealStats` from `deal/stats`; `DealCountdown`; `PressableScale`, `ShopText` from `../atoms`; `GUTTER` from `../styles`.
- Produces: `DealHero({ window, stats, onShopDeals })`

- [ ] **Step 1: Write the component**

Create `src/modules/deals48/screens/Kshope/organisms/DealHero.tsx`:

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DealWindow } from '../../../globals/dealCycle';
import { PressableScale, ShopText } from '../atoms';
import DealCountdown from '../deal/DealCountdown';
import { DealStats } from '../deal/stats';
import { GUTTER } from '../styles';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  hp,
} from '@/styles/cartTheme';

interface DealHeroProps {
  window: DealWindow;
  stats: DealStats;
  onShopDeals: () => void;
}

const DealHero: React.FC<DealHeroProps> = ({ window, stats, onShopDeals }) => (
  <View style={styles.wrap}>
    <View style={styles.card}>
      <ShopText variant="micro" style={styles.eyebrow}>
        48-HOUR DEALS
      </ShopText>

      <DealCountdown window={window} variant="hero" />

      {stats.maxDiscountPercent !== null && (
        <ShopText variant="title" style={styles.headline}>
          Up to {stats.maxDiscountPercent}% off
        </ShopText>
      )}

      {stats.total > 0 && (
        <ShopText variant="caption" style={styles.meta}>
          {stats.total} deals live right now
        </ShopText>
      )}

      <PressableScale
        to={0.97}
        onPress={onShopDeals}
        style={styles.cta}
        contentStyle={styles.ctaContent}
      >
        <ShopText variant="cta" style={styles.ctaText}>
          Shop Deals →
        </ShopText>
      </PressableScale>
    </View>
  </View>
);

export default React.memo(DealHero);

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: GUTTER,
    marginTop: CART_SPACING.md,
  },
  card: {
    borderRadius: CART_RADIUS.card,
    backgroundColor: CART_COLORS.textPrimary,
    padding: CART_SPACING.xl,
    gap: CART_SPACING.sm,
    minHeight: hp('24%'),
    justifyContent: 'center',
  },
  eyebrow: {
    color: CART_COLORS.primary,
    letterSpacing: 1.2,
  },
  headline: {
    color: CART_COLORS.onPrimary,
  },
  meta: {
    color: 'rgba(255,255,255,0.72)',
  },
  cta: {
    marginTop: CART_SPACING.md,
    alignSelf: 'flex-start',
    borderRadius: CART_RADIUS.button,
    backgroundColor: CART_COLORS.primary,
  },
  ctaContent: {
    paddingHorizontal: CART_SPACING.xl,
    paddingVertical: CART_SPACING.md,
  },
  ctaText: {
    color: CART_COLORS.onPrimary,
  },
});
```

The dark card is what lets the countdown carry urgency without the whole screen shouting.

- [ ] **Step 2: Verify types and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no new errors.

If `DealCountdown`'s hero variant renders in `DEAL_URGENCY.active.text` (a dark slate) it will be invisible on this dark card. Confirm visually in Task 15 and, if needed, pass an explicit light colour for the hero variant rather than changing the shared ramp.

- [ ] **Step 3: Commit**

```bash
git add src/modules/deals48/screens/Kshope/organisms/DealHero.tsx
git commit -m "feat(deals48): add 48-hour drop hero with derived figures"
```

---

### Task 11: Hook integration

Add normalisation, the cycle window, stats, and add-to-cart to the hook without disturbing the existing fetch and parsing.

**Files:**
- Modify: `src/modules/deals48/screens/Kshope/useKshopeScreen.ts`

**Interfaces:**
- Consumes: `toDeals` from `deal/normalize`; `dealStats` from `deal/stats`; `currentCycle` from `globals/dealCycle`; `addToCartApi` from `../../api/services`.
- Produces, added to the existing return object:
  - `dealWindow: DealWindow`
  - `dealStatsSummary: DealStats`
  - `closingDeals: Deal[]`, `trendingDeals: Deal[]`, `firstDeals: Deal[]`, `secondDeals: Deal[]`
  - `addDealToCart(deal: Deal): Promise<boolean>`
  - `openDeal(deal: Deal): void`

- [ ] **Step 1: Add the imports**

At the top of `src/modules/deals48/screens/Kshope/useKshopeScreen.ts`, alongside the existing imports:

```ts
import { currentCycle } from '../../globals/dealCycle';
import { addToCartApi } from '../../api/services';
import { toDeals } from './deal/normalize';
import { dealStats } from './deal/stats';
import { Deal } from './deal/types';
```

- [ ] **Step 2: Derive the window and the deal groups**

After the existing `secondProducts` memo, add:

```ts
const dealWindow = useMemo(() => {
  const cycle = currentCycle(Date.now());
  return { startsAt: cycle.startsAt, endsAt: cycle.endsAt };
}, [homeData]);

const normalizedAt = useMemo(() => Date.now(), [homeData]);

const closingDeals = useMemo(
  () =>
    toDeals(bestSelling, normalizedAt).sort((a, b) => {
      if (b.discountPercent !== a.discountPercent) {
        return b.discountPercent - a.discountPercent;
      }
      return (a.stockQty ?? Infinity) - (b.stockQty ?? Infinity);
    }),
  [bestSelling, normalizedAt],
);

const trendingDeals = useMemo(
  () => toDeals(showcaseItems, normalizedAt),
  [showcaseItems, normalizedAt],
);

const firstDeals = useMemo(
  () => toDeals(firstProducts, normalizedAt),
  [firstProducts, normalizedAt],
);

const secondDeals = useMemo(
  () => toDeals(secondProducts, normalizedAt),
  [secondProducts, normalizedAt],
);

const dealStatsSummary = useMemo(
  () => dealStats([closingDeals, trendingDeals, firstDeals, secondDeals]),
  [closingDeals, trendingDeals, firstDeals, secondDeals],
);
```

`normalizedAt` is recomputed only when `homeData` changes, so deal windows are stable between fetches rather than churning on every render.

Ordering `closingDeals` by discount depth then by scarcity is the honest substitute for per-item timers: it ranks by signals the payload actually carries.

- [ ] **Step 3: Add add-to-cart and deal navigation**

After the existing `openProduct` callback, add:

```ts
const addDealToCart = useCallback(async (deal: Deal) => {
  try {
    const storedPincodeAreaId = await getPincodeAreaId();
    const areaId = storedPincodeAreaId
      ? parseInt(storedPincodeAreaId, 10)
      : profile?.pincode || null;
    const response = await addToCartApi(deal.id, 1, areaId);
    return Boolean(response?.success ?? response?.data);
  } catch (e) {
    console.error('Error adding deal to cart', e);
    return false;
  }
}, [profile?.pincode]);

const openDeal = useCallback(
  (deal: Deal) => {
    navigation.navigate(DEALS48_ROUTES.PRODUCT_DETAILS, {
      productId: deal.id,
      product: deal.raw,
    });
  },
  [navigation],
);
```

Passing `deal.raw` preserves exactly what Product Details receives today.

- [ ] **Step 4: Export the new values**

Add to the returned object at the end of the hook, keeping every existing key:

```ts
dealWindow,
dealStatsSummary,
closingDeals,
trendingDeals,
firstDeals,
secondDeals,
addDealToCart,
openDeal,
```

- [ ] **Step 5: Verify types and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no new errors.

Run: `npm test`
Expected: all suites pass — this change must not break existing tests.

- [ ] **Step 6: Commit**

```bash
git add src/modules/deals48/screens/Kshope/useKshopeScreen.ts
git commit -m "feat(deals48): expose normalised deals, cycle window and add to cart from the home hook"
```

---

### Task 12: Header with location and cart badge

**Files:**
- Modify: `src/modules/deals48/screens/Kshope/organisms/KshopeHeader.tsx`

**Interfaces:**
- Consumes: `useCart` from `../../../context/CartContext` for `cartCount`.
- Produces: `KshopeHeader` gains `location?: string` and `onLocation: () => void` props; existing props unchanged.

- [ ] **Step 1: Add the cart badge and location**

In `KshopeHeader.tsx`:

1. Import `useCart` from `'../../../context/CartContext'` and read `const { cartCount } = useCart();`.
2. Add `location?: string` and `onLocation: () => void` to `KshopeHeaderProps`.
3. Replace the `identity` `PressableScale` with an avatar wired to `onProfile` plus a separate location control wired to `onLocation`:

```tsx
<View style={styles.identity}>
  <PressableScale
    to={0.94}
    onPress={onProfile}
    style={styles.avatar}
    contentStyle={styles.avatarContent}
    accessibilityRole="button"
    accessibilityLabel="Open profile"
  >
    <AppIcons.User size={wp('4.6%')} color={CART_COLORS.primary} />
  </PressableScale>

  <PressableScale
    to={0.97}
    onPress={onLocation}
    contentStyle={styles.locationContent}
    accessibilityRole="button"
    accessibilityLabel="Change location"
  >
    <ShopText variant="micro" tone="muted">
      Delivering to
    </ShopText>
    <View style={styles.locationRow}>
      <ShopText variant="labelStrong" numberOfLines={1}>
        {location || 'Set location'}
      </ShopText>
      <AppIcons.ChevronDown
        size={wp('3.4%')}
        color={CART_COLORS.textMuted}
      />
    </View>
  </PressableScale>
</View>
```

Add the supporting styles:

```tsx
avatarContent: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
},
locationContent: {
  maxWidth: wp('45%'),
},
locationRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: CART_SPACING.xs,
},
```

If `AppIcons` has no `ChevronDown`, check `src/modules/deals48/assets/icons` for the available names and use the nearest downward chevron, or drop the icon rather than inventing an export.

4. Wrap the cart `PressableScale` in a `View` with `position: 'relative'` and render a badge when `cartCount > 0`:

```tsx
{cartCount > 0 && (
  <View style={styles.badge}>
    <ShopText variant="micro" style={styles.badgeText}>
      {cartCount > 99 ? '99+' : cartCount}
    </ShopText>
  </View>
)}
```

5. Add the badge styles:

```tsx
badge: {
  position: 'absolute',
  top: -2,
  right: -2,
  minWidth: wp('4.4%'),
  height: wp('4.4%'),
  paddingHorizontal: 3,
  borderRadius: CART_RADIUS.pill,
  backgroundColor: CART_COLORS.primary,
  alignItems: 'center',
  justifyContent: 'center',
},
badgeText: {
  color: CART_COLORS.onPrimary,
},
```

Keep the existing animated background and border behaviour and the `SearchField` row untouched.

- [ ] **Step 2: Update the search placeholder**

Change the `SearchField` placeholder from `"Search product"` to `"Search products, brands & deals"`.

- [ ] **Step 3: Verify types and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/modules/deals48/screens/Kshope/organisms/KshopeHeader.tsx
git commit -m "feat(deals48): add location control and cart badge to the home header"
```

---

### Task 13: Screen assembly

Reorder the screen around the deal lifecycle. Every API placement rendered today still renders.

**Files:**
- Modify: `src/modules/deals48/screens/Kshope/KshopeScreen.tsx`

**Interfaces:**
- Consumes: everything produced by Tasks 9, 10, 11, 12.
- Produces: the redesigned Home Screen.

- [ ] **Step 1: Pull the new values from the hook**

Add to the destructuring of `useKshopeScreen()`, keeping every existing key:

```ts
dealWindow,
dealStatsSummary,
closingDeals,
trendingDeals,
firstDeals,
secondDeals,
addDealToCart,
openDeal,
```

- [ ] **Step 2: Wire the new header props**

```tsx
onLocation={() => navigation.navigate(DEALS48_ROUTES.ADD_LOCATION)}
```

- [ ] **Step 3: Reorder the scroll content**

Replace the body of the `Animated.ScrollView` with this order, keeping every existing conditional guard:

1. `{isLoading && <KshopeSkeleton />}`
2. `DealHero` — rendered when `dealStatsSummary.total > 0`, inside `entrance(0)`:

```tsx
{dealStatsSummary.total > 0 && (
  <Animated.View entering={entrance(0)}>
    <DealHero
      window={dealWindow}
      stats={dealStatsSummary}
      onShopDeals={() =>
        openCollection({ title: '48-Hour Deals', products: closingDeals.map(d => d.raw) })
      }
    />
  </Animated.View>
)}
```

3. `BannerCarousel` — unchanged, moved below the hero, `entrance(1)`.
4. `CategoryRail` — unchanged, `entrance(2)`.
5. Closing This Drop:

```tsx
<DealSection
  title="Closing This Drop"
  subtitle="Grab it before the timer runs out"
  deals={closingDeals}
  window={dealWindow}
  keyPrefix="closing"
  onOpenDeal={openDeal}
  onAddToCart={addDealToCart}
  onSeeAll={() =>
    openCollection({ title: 'Closing This Drop', products: closingDeals.map(d => d.raw) })
  }
  toggleWishlist={toggleWishlist}
  isInWishlist={isInWishlist}
/>
```

6. Trending deals:

```tsx
<DealSection
  title="Popular Right Now"
  deals={trendingDeals}
  keyPrefix="trending"
  onOpenDeal={openDeal}
  onAddToCart={addDealToCart}
  toggleWishlist={toggleWishlist}
  isInWishlist={isInWishlist}
/>
```

7. First category block — `DealSection` with `title={firstTitle}`, `deals={firstDeals}`, `keyPrefix="first"`, `window={dealWindow}`, and the existing `onSeeAll` using `blockCatId(firstBlock)`.
8. `BannerRail` for `midBanner` — unchanged.
9. `GoatDealsGrid` — unchanged.
10. Second category block — `DealSection` with `title={secondTitle}`, `deals={secondDeals}`, `keyPrefix="second"`, and the existing `onSeeAll` using `blockCatId(secondBlock)`.
11. `AccessorizeSection` — unchanged, moved here.
12. `ShowcaseBanner` — unchanged.
13. `BestSellingCard` block — unchanged.
14. `BrandRail` — unchanged, demoted to here.
15. `BannerRail` for `bottomBanner` — unchanged.

Remove the two `ProductRail` usages, which `DealSection` replaces. Leave `ProductRail.tsx` on disk; it is not imported elsewhere but deleting it is a separate cleanup.

- [ ] **Step 4: Refresh when the drop rolls over**

Deal windows are computed at fetch time, so a cycle that ends while the app is open would otherwise stay stuck at "Deal ended". Add, after the scroll handler:

```tsx
const { phase } = useDealMinutes(dealWindow);

React.useEffect(() => {
  if (phase === 'ended') onRefresh();
}, [phase, onRefresh]);
```

Import `useDealMinutes` from `'./deal/clock'`.

- [ ] **Step 5: Verify types and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no new errors.

Run: `npm test`
Expected: all suites pass.

- [ ] **Step 6: Commit**

```bash
git add src/modules/deals48/screens/Kshope/KshopeScreen.tsx
git commit -m "feat(deals48): reorder home screen around the 48-hour deal lifecycle"
```

---

### Task 14: Countdown motion

The spec calls for the countdown to crossfade rather than snap, and for the phase change to interpolate rather than jump. Fast and subtle — no bouncing.

**Files:**
- Modify: `src/modules/deals48/screens/Kshope/deal/DealCountdown.tsx`
- Modify: `src/modules/deals48/screens/Kshope/motion.ts`

**Interfaces:**
- Consumes: `DEAL_URGENCY` from `@/styles/cartTheme`.
- Produces: `COUNTDOWN_FADE`, `PHASE_TRANSITION` exported from `motion.ts`.

- [ ] **Step 1: Add the motion constants**

Append to `src/modules/deals48/screens/Kshope/motion.ts`:

```ts
export const COUNTDOWN_FADE = 140;
export const PHASE_TRANSITION = 400;
```

- [ ] **Step 2: Animate the phase colour in ChipCountdown**

In `DealCountdown.tsx`, import from reanimated and animate the chip's background and border across the phase change rather than swapping instantly:

```tsx
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { PHASE_TRANSITION } from '../motion';
```

Inside `ChipCountdown`, drive a shared value from the phase and interpolate:

```tsx
const progress = useSharedValue(0);
const target = phase === 'critical' ? 2 : phase === 'ending' ? 1 : 0;

React.useEffect(() => {
  progress.value = withTiming(target, { duration: PHASE_TRANSITION });
}, [target, progress]);

const animatedStyle = useAnimatedStyle(() => ({
  backgroundColor: interpolateColor(
    progress.value,
    [0, 1, 2],
    [DEAL_URGENCY.active.bg, DEAL_URGENCY.ending.bg, DEAL_URGENCY.critical.bg],
  ),
}));
```

Add `interpolateColor` to the reanimated import, change the chip's outer `View` to `Animated.View`, and put `animatedStyle` last in its style array so it wins over the static `tone` background. Leave `tone.text` and `tone.border` as they are — animating three properties at once reads as flickering rather than escalation.

The `ended` and `upcoming` phases keep their instant static tone; they are state changes, not escalation, so interpolating them is wrong.

- [ ] **Step 3: Crossfade the hero digits**

In `HeroCountdown`, wrap the `ShopText` in an `Animated.View` keyed on the rendered label so each new value fades in:

```tsx
<Animated.View key={label} entering={FadeIn.duration(COUNTDOWN_FADE)}>
```

Import `FadeIn` from reanimated and `COUNTDOWN_FADE` from `../motion`. Hoist the label into a `const label = labelFor(...)` so it can be used as both the key and the content.

- [ ] **Step 4: Verify types and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add src/modules/deals48/screens/Kshope/deal/DealCountdown.tsx src/modules/deals48/screens/Kshope/motion.ts
git commit -m "feat(deals48): crossfade countdown digits and interpolate urgency phase"
```

---

### Task 15: Run the app and verify on device

No amount of type checking substitutes for looking at it.

**Files:** none.

- [ ] **Step 1: Run the full suite**

Run: `npm test`
Expected: all suites pass.

Run: `npx tsc --noEmit`
Expected: clean.

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 2: Launch the app**

Run: `npm start` in one terminal, then `npm run ios` (or `npm run android`).

- [ ] **Step 3: Verify against this checklist**

- [ ] The hero countdown ticks every second and the seconds digit is legible against the dark card. If the countdown text is invisible, apply the fix noted in Task 10.
- [ ] Card chips show minutes, not seconds, and do not visibly re-render every second.
- [ ] The hero's discount figure and deal count match the payload — cross-check against the network response.
- [ ] Every section that had data before still has data: banners, categories, accessorize tabs, brands, showcase, goat deals, best selling.
- [ ] Add to cart from a card increments the header cart badge.
- [ ] Wishlist toggle on a card still works and persists.
- [ ] Tapping a card opens Product Details with the correct product.
- [ ] Pull-to-refresh works and the skeleton shows on cold load.
- [ ] Scroll is smooth through the whole screen with no dropped frames.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix(deals48): device verification fixes for the home redesign"
```

---

## Deferred

Not in this plan, by decision during brainstorming:

- **Per-product `dealEndsAt` from the backend.** `dealWindowOf` already reads it. When it lands, set `showCountdown` on `DealSection` and per-card chips activate.
- **"Deals For You".** No recommendation endpoint and no browsing history exist.
- **`Selling fast` / `Trending` labels.** No supporting payload signal.
- **Confirming `deal_cycle_epoch`.** A development placeholder ships in Task 1; the real drop anchor is a business decision and must be set before release.
