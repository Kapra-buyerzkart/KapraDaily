import {
  clampToCeiling,
  maxQtyMessage,
  isMaxQuantityMessage,
  parseMaxQuantity,
  resolveQuantityCeiling,
  resolveRejectedQuantity,
} from '../src/utils/cartQuantityLimits';

describe('resolveQuantityCeiling', () => {
  it('takes the lower of the per-order limit and the stock on hand', () => {
    expect(resolveQuantityCeiling({ maxQtyInOrders: 5, stockQty: 2 })).toEqual({
      maxQty: 2,
      maxQtyIsStock: true,
    });
    expect(resolveQuantityCeiling({ maxQtyInOrders: 2, stockQty: 5 })).toEqual({
      maxQty: 2,
      maxQtyIsStock: false,
    });
  });

  it('reads stock off a cart line, which spells it qtyAvailable', () => {
    expect(resolveQuantityCeiling({ qtyAvailable: 3 }).maxQty).toBe(3);
    expect(
      resolveQuantityCeiling({ maxQtyInOrders: 9, qtyAvailable: 3 }).maxQty,
    ).toBe(3);
  });

  it('treats zero and junk as unstated on both keys', () => {
    expect(resolveQuantityCeiling({ maxQtyInOrders: 0 }).maxQty).toBeNull();
    expect(
      resolveQuantityCeiling({ maxQtyInOrders: 0, stockQty: 0 }).maxQty,
    ).toBeNull();
    expect(resolveQuantityCeiling({ maxQtyInOrders: 'abc' }).maxQty).toBeNull();
    expect(resolveQuantityCeiling(undefined).maxQty).toBeNull();
  });
});

describe('clampToCeiling', () => {
  it('leaves a quantity alone when no ceiling is known', () => {
    expect(clampToCeiling(9, {})).toBe(9);
    expect(clampToCeiling(9, { maxQtyInOrders: 0 })).toBe(9);
  });

  it('trims a quantity down to the ceiling', () => {
    expect(clampToCeiling(9, { maxQtyInOrders: 3 })).toBe(3);
    expect(clampToCeiling(2, { maxQtyInOrders: 3 })).toBe(2);
    expect(clampToCeiling(9, { maxQtyInOrders: 3, stockQty: 1 })).toBe(1);
  });
});

describe('reading the server rejection', () => {
  it('recognises the messages the cart API sends', () => {
    expect(isMaxQuantityMessage('Maximum quantity is 2')).toBe(true);
    expect(isMaxQuantityMessage('max qty limited to 4')).toBe(true);
    expect(isMaxQuantityMessage('Out of stock')).toBe(false);
    expect(isMaxQuantityMessage(undefined)).toBe(false);
  });

  it('pulls the stated number out of the message', () => {
    expect(parseMaxQuantity('Maximum quantity is 2')).toBe(2);
    expect(parseMaxQuantity('Max qty limited to 4')).toBe(4);
    expect(parseMaxQuantity('Maximum quantity reached')).toBeNull();
  });
});

describe('resolveRejectedQuantity', () => {
  it('restores the limit the server named, not the caller fallback', () => {
    expect(
      resolveRejectedQuantity({
        message: 'Maximum quantity is 2',
        item: { maxQtyInOrders: 2, stockQty: 12 },
        fallback: 1,
      }),
    ).toBe(2);
  });

  it('never restores more than the stock on hand', () => {
    expect(
      resolveRejectedQuantity({
        message: 'Maximum quantity is 5',
        item: { qtyAvailable: 3 },
        fallback: 1,
      }),
    ).toBe(3);
  });

  it('keeps the caller fallback when the message names no number', () => {
    expect(
      resolveRejectedQuantity({
        message: 'Requested qty is not available',
        item: { stockQty: 12 },
        fallback: 4,
      }),
    ).toBe(4);
    expect(
      resolveRejectedQuantity({ message: '', item: undefined, fallback: 4 }),
    ).toBe(4);
  });
});

describe('maxQtyMessage', () => {
  it('names the constraint that actually bound', () => {
    expect(maxQtyMessage({ maxQty: 2, maxQtyIsStock: true })).toBe(
      'Only 2 units left in stock',
    );
    expect(maxQtyMessage({ maxQty: 2, maxQtyIsStock: false })).toBe(
      'Only 2 units allowed per order',
    );
  });

  it('stays singular at one', () => {
    expect(maxQtyMessage({ maxQty: 1, maxQtyIsStock: false })).toBe(
      'Only 1 unit allowed per order',
    );
  });
});
