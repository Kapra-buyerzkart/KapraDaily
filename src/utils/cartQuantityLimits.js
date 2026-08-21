const positiveCount = value => {
  const count = Number(value);
  return Number.isFinite(count) && count > 0 ? Math.floor(count) : null;
};

const resolveStock = item =>
  positiveCount(item?.stockQty ?? item?.qtyAvailable);

export const resolveQuantityCeiling = item => {
  const perOrder = positiveCount(item?.maxQtyInOrders);
  const inStock = resolveStock(item);

  if (perOrder === null && inStock === null) {
    return { maxQty: null, maxQtyIsStock: false };
  }
  if (perOrder === null) return { maxQty: inStock, maxQtyIsStock: true };
  if (inStock === null) return { maxQty: perOrder, maxQtyIsStock: false };

  return {
    maxQty: Math.min(perOrder, inStock),
    maxQtyIsStock: inStock < perOrder,
  };
};

export const maxQtyMessage = ({ maxQty, maxQtyIsStock }) => {
  const units = maxQty === 1 ? 'unit' : 'units';
  return maxQtyIsStock
    ? `Only ${maxQty} ${units} left in stock`
    : `Only ${maxQty} ${units} allowed per order`;
};

export const clampToCeiling = (quantity, item) => {
  const { maxQty } = resolveQuantityCeiling(item);
  return maxQty === null ? quantity : Math.min(quantity, maxQty);
};

export const isMaxQuantityMessage = message =>
  /max(imum)?\s+(quantity|qty)/i.test(message || '');

export const parseMaxQuantity = message => {
  const match = /\b(?:is|of|limit(?:ed)?\s*(?:to)?)\s*:?\s*(\d+)/i.exec(
    message || '',
  );
  return match ? Number(match[1]) : null;
};

export const resolveRejectedQuantity = ({ message, item, fallback }) => {
  const stated = positiveCount(parseMaxQuantity(message));
  if (stated === null) return fallback;
  return clampToCeiling(stated, item);
};
