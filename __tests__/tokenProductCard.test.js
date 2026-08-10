import {
  deriveProductFields,
  formatAmount,
  resolveSavings,
  resolveTintIndex,
} from '../src/components/TokenProductCard/utils';
import { hasOpaqueBackground } from '../src/utils/imageUrl';

describe('resolveTintIndex', () => {
  it('uses the list index when one is supplied, including zero', () => {
    expect(resolveTintIndex(0, 'p-1')).toBe(0);
    expect(resolveTintIndex(5, 'p-1')).toBe(5);
  });

  it('falls back to a stable hash of the product id', () => {
    expect(resolveTintIndex(undefined, 'p-1')).toBe(
      resolveTintIndex(undefined, 'p-1'),
    );
    expect(resolveTintIndex(undefined, 'p-1')).not.toBe(
      resolveTintIndex(undefined, 'p-2'),
    );
  });

  it('stays a usable number when there is no id either', () => {
    expect(resolveTintIndex(undefined, undefined)).toBe(0);
  });
});

describe('UD token label', () => {
  it('reads the token count from any of the fields the API uses', () => {
    expect(deriveProductFields({ bTokenValue: 4 }).token).toBe('4 UD Tokens');
    expect(deriveProductFields({ btokens: 2 }).token).toBe('2 UD Tokens');
  });

  it('stays singular for one token and defaults to one when unstated', () => {
    expect(deriveProductFields({ token: 1 }).token).toBe('1 UD Token');
    expect(deriveProductFields({}).token).toBe('1 UD Token');
  });
});

describe('price formatting', () => {
  it('shows whole rupees without decimals', () => {
    expect(formatAmount(59)).toBe('59');
    expect(formatAmount('59.00')).toBe('59');
    expect(formatAmount(59.5)).toBe('59.50');
    expect(formatAmount('abc')).toBe('');
  });

  it('reports the saving only when the MRP is genuinely higher', () => {
    expect(resolveSavings(60, 59)).toBe(1);
    expect(resolveSavings('', 59)).toBe(0);
    expect(resolveSavings(59, 59)).toBe(0);
    expect(resolveSavings(undefined, 59)).toBe(0);
  });
});

describe('opaque image detection', () => {
  it('treats alpha-less formats as needing a white well', () => {
    expect(hasOpaqueBackground('uploads/rice.jpg')).toBe(true);
    expect(hasOpaqueBackground('uploads/rice.JPEG')).toBe(true);
    expect(hasOpaqueBackground('https://cdn.test/rice.jpg?w=200')).toBe(true);
  });

  it('keeps the tint for formats that can carry alpha', () => {
    expect(hasOpaqueBackground('uploads/rice.png')).toBe(false);
    expect(hasOpaqueBackground('uploads/rice.webp')).toBe(false);
    expect(hasOpaqueBackground('uploads/rice')).toBe(false);
  });

  it('does not match on a query string that merely mentions a format', () => {
    expect(hasOpaqueBackground('uploads/rice.png?fallback=jpg')).toBe(false);
  });

  it('shrugs off local assets and missing values', () => {
    expect(hasOpaqueBackground(undefined)).toBe(false);
    expect(hasOpaqueBackground(null)).toBe(false);
    expect(hasOpaqueBackground(42)).toBe(false);
  });
});
