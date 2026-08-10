import {
  collectPurchases,
  mergePurchase,
  selectRecentOrders,
} from '../src/queries/transformBuyAgainResponse';
import {
  formatAmount,
  resolveSavings,
} from '../src/components/TokenProductCard/utils';

const order = (id, date, extra = {}) => ({
  orderId: id,
  orderDate: date,
  ...extra,
});

const fulfilled = items => ({
  status: 'fulfilled',
  value: { data: { items } },
});
const rejected = () => ({ status: 'rejected', reason: new Error('boom') });

describe('selectRecentOrders', () => {
  it('keeps the newest uncancelled orders up to the limit', () => {
    const response = {
      data: {
        items: [
          order(1, '2026-08-01T10:00:00Z'),
          order(2, '2026-08-09T10:00:00Z'),
          order(3, '2026-08-05T10:00:00Z', { orderStatusText: 'Cancelled' }),
          order(4, '2026-08-07T10:00:00Z'),
        ],
      },
    };

    expect(selectRecentOrders(response, 2).map(o => o.orderId)).toEqual([2, 4]);
  });

  it('reads a bare data array and skips orders without an id', () => {
    const response = {
      data: [order(7, '2026-08-01T10:00:00Z'), { orderDate: 'x' }],
    };

    expect(selectRecentOrders(response, 5)).toHaveLength(1);
  });

  it('returns an empty list for an unusable response', () => {
    expect(selectRecentOrders(undefined, 3)).toEqual([]);
    expect(selectRecentOrders({ data: { items: null } }, 3)).toEqual([]);
  });
});

describe('collectPurchases', () => {
  const orders = [
    order(2, '2026-08-09T10:00:00Z'),
    order(1, '2026-08-01T10:00:00Z'),
  ];

  it('dedupes across orders and counts repeat purchases', () => {
    const purchases = collectPurchases(orders, [
      fulfilled([{ productId: 11 }, { productId: 22 }]),
      fulfilled([{ productId: 22 }, { productId: 33 }]),
    ]);

    expect(purchases.map(p => p.productId)).toEqual([11, 22, 33]);
    expect(purchases.find(p => p.productId === 22).timesOrdered).toBe(2);
    expect(purchases.find(p => p.productId === 11).timesOrdered).toBe(1);
  });

  it('records the most recent purchase date for a repeat product', () => {
    const [repeat] = collectPurchases(orders, [
      fulfilled([{ productId: 22 }]),
      fulfilled([{ productId: 22 }]),
    ]);

    expect(repeat.lastOrderedAt).toBe(Date.parse('2026-08-09T10:00:00Z'));
  });

  it('skips orders whose detail call failed instead of failing the rail', () => {
    const purchases = collectPurchases(orders, [
      rejected(),
      fulfilled([{ productId: 33 }]),
    ]);

    expect(purchases.map(p => p.productId)).toEqual([33]);
  });

  it('ignores line items with no usable product id', () => {
    const purchases = collectPurchases(orders, [
      fulfilled([{ productId: null }, { id: '' }, { id: 44 }]),
      fulfilled([]),
    ]);

    expect(purchases.map(p => p.productId)).toEqual([44]);
  });
});

describe('mergePurchase', () => {
  const purchase = {
    productId: 11,
    orderItem: { productId: 11, image: 'orders/old.png' },
    timesOrdered: 3,
    lastOrderedAt: 1234,
  };

  it('unwraps the product and carries the purchase counts', () => {
    const merged = mergePurchase(purchase, {
      data: {
        product: { productId: 11, prName: 'Tea', featuredImage: 'live.png' },
      },
    });

    expect(merged).toMatchObject({
      productId: 11,
      prName: 'Tea',
      featuredImage: 'live.png',
      timesOrdered: 3,
      lastOrderedAt: 1234,
    });
  });

  it('falls back through the gallery then the order item for the image', () => {
    const fromGallery = mergePurchase(purchase, {
      data: {
        product: { productId: 11 },
        images: [{ imageUrl: 'gallery.png' }],
      },
    });
    const fromOrder = mergePurchase(purchase, {
      data: { product: { productId: 11 } },
    });

    expect(fromGallery.featuredImage).toBe('gallery.png');
    expect(fromOrder.featuredImage).toBe('orders/old.png');
  });

  it('accepts a product returned bare, without a product wrapper', () => {
    expect(
      mergePurchase(purchase, { data: { id: 11, prName: 'Tea' } }),
    ).toMatchObject({
      productId: 11,
      prName: 'Tea',
    });
  });

  it('drops products that can no longer be bought here', () => {
    expect(
      mergePurchase(purchase, {
        data: { product: { productId: 11, stockQty: 0 } },
      }),
    ).toBeNull();
    expect(
      mergePurchase(purchase, {
        data: { product: { productId: 11, isAvailable: false } },
      }),
    ).toBeNull();
    expect(mergePurchase(purchase, { data: null })).toBeNull();
  });

  it('keeps a product whose stock is simply not reported', () => {
    expect(
      mergePurchase(purchase, { data: { product: { productId: 11 } } }),
    ).not.toBeNull();
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
