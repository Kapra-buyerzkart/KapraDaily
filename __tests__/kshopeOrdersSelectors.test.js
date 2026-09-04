const {
  parseItems,
  statusBucket,
  trackerStep,
  bucketOrders,
  formatOrderDate,
  formatAmount,
  formatOrderNumber,
  itemCountLabel,
  detailParams,
} = require('../src/kshope/screens/Order/redesign/data/selectors');

describe('parseItems', () => {
  it('returns an array untouched', () => {
    const items = [{ productName: 'A' }];
    expect(parseItems({ items })).toBe(items);
  });

  it('parses a json string payload', () => {
    expect(parseItems({ items: '[{"productName":"A"}]' })).toEqual([
      { productName: 'A' },
    ]);
  });

  it('falls back to an empty list on bad input', () => {
    expect(parseItems({ items: 'not json' })).toEqual([]);
    expect(parseItems({})).toEqual([]);
    expect(parseItems(undefined)).toEqual([]);
  });
});

describe('statusBucket', () => {
  it('buckets cancelled and rejected orders', () => {
    expect(statusBucket({ orderStatusText: 'Cancelled' })).toBe('cancelled');
    expect(statusBucket({ orderStatusText: 'Rejected' })).toBe('cancelled');
  });

  it('buckets delivered and returned orders', () => {
    expect(statusBucket({ orderStatusText: 'Delivered' })).toBe('delivered');
    expect(statusBucket({ orderStatusText: 'Returned' })).toBe('delivered');
  });

  it('keeps in-flight orders active', () => {
    expect(statusBucket({ orderStatusText: 'Order Placed' })).toBe('active');
    expect(statusBucket({ orderStatusText: 'Out for Delivery' })).toBe('active');
    expect(statusBucket({ orderStatusText: 'Delivery Agent Assigned' })).toBe(
      'active',
    );
  });

  it('treats an unknown status as active', () => {
    expect(statusBucket({ orderStatusText: 'Something New' })).toBe('active');
    expect(statusBucket({})).toBe('active');
  });
});

describe('trackerStep', () => {
  it('maps each status onto its step', () => {
    expect(trackerStep({ orderStatusText: 'Order Placed' })).toBe(0);
    expect(trackerStep({ orderStatusText: 'Order Pending' })).toBe(0);
    expect(trackerStep({ orderStatusText: 'Shipped' })).toBe(1);
    expect(trackerStep({ orderStatusText: 'Your Order is Being Shipped' })).toBe(1);
    expect(trackerStep({ orderStatusText: 'Out for Delivery' })).toBe(2);
    expect(trackerStep({ orderStatusText: 'Delivery Agent Assigned' })).toBe(2);
    expect(trackerStep({ orderStatusText: 'Delivered' })).toBe(3);
  });

  it('falls back to the first step for an unknown status', () => {
    expect(trackerStep({ orderStatusText: 'Whatever' })).toBe(0);
    expect(trackerStep(undefined)).toBe(0);
  });
});

describe('bucketOrders', () => {
  const orders = [
    { orderId: 1, orderStatusText: 'Delivered', orderDate: '2025-05-18' },
    { orderId: 2, orderStatusText: 'Order Placed', orderDate: '2026-06-01' },
    { orderId: 3, orderStatusText: 'Cancelled', orderDate: '2025-01-02' },
    { orderId: 4, orderStatusText: 'Shipped', orderDate: '2026-06-05' },
  ];

  it('partitions every order into exactly one bucket', () => {
    const grouped = bucketOrders(orders);
    expect(grouped.active.map(o => o.orderId)).toEqual([4, 2]);
    expect(grouped.delivered.map(o => o.orderId)).toEqual([1]);
    expect(grouped.cancelled.map(o => o.orderId)).toEqual([3]);
  });

  it('sorts each bucket newest first', () => {
    expect(bucketOrders(orders).active[0].orderId).toBe(4);
  });

  it('survives a missing list', () => {
    expect(bucketOrders(null)).toEqual({
      active: [],
      delivered: [],
      cancelled: [],
    });
  });
});

describe('formatters', () => {
  it('formats an order date', () => {
    expect(formatOrderDate('2026-06-01T10:00:00')).toBe('01 jun 2026');
    expect(formatOrderDate('nonsense')).toBe('');
    expect(formatOrderDate(undefined)).toBe('');
  });

  it('groups the amount and appends the suffix', () => {
    expect(formatAmount(30249)).toBe('₹30,249/-');
    expect(formatAmount(2899.5)).toBe('₹2,899.50/-');
    expect(formatAmount(undefined)).toBe('₹0/-');
  });

  it('prefixes the order number once', () => {
    expect(formatOrderNumber('ORD - 978 098')).toBe('#ORD - 978 098');
    expect(formatOrderNumber('#ORD1')).toBe('#ORD1');
    expect(formatOrderNumber(undefined)).toBe('');
  });

  it('pluralises the item count', () => {
    expect(itemCountLabel(1)).toBe('1 Item');
    expect(itemCountLabel(3)).toBe('3 Items');
  });
});

describe('detailParams', () => {
  it('passes the order plus a stamped first line item', () => {
    const order = {
      orderId: 7,
      orderNumber: 'ORD7',
      items: [{ productName: 'A', productId: 3 }],
    };
    expect(detailParams(order)).toEqual({
      order,
      selectedItem: {
        productName: 'A',
        productId: 3,
        orderId: 7,
        orderNumber: 'ORD7',
      },
    });
  });

  it('sends an empty selection when the order has no items', () => {
    const order = { orderId: 7 };
    expect(detailParams(order)).toEqual({ order, selectedItem: {} });
  });
});
