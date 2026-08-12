export const AVAILABILITY_REASON = {
  NOT_IN_STORE: 'NOT_IN_STORE',
  INSUFFICIENT: 'INSUFFICIENT',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
};

const AVAILABLE = { isSoldOut: false, reason: null, label: null };

export const getCartItemAvailability = item => {
  if (!item) {
    return AVAILABLE;
  }

  if (item.notAvailableInStore === 1) {
    return {
      isSoldOut: true,
      reason: AVAILABILITY_REASON.NOT_IN_STORE,
      label: 'Not at this store',
    };
  }

  if (item.insufficientStock === 1) {
    const left = Number(item.availableQty ?? item.stockQty);
    return {
      isSoldOut: true,
      reason: AVAILABILITY_REASON.INSUFFICIENT,
      label: Number.isFinite(left) && left > 0 ? `Only ${left} left` : 'Low stock',
    };
  }

  if (
    item.unavailable === 1 ||
    item.isAvailable === false ||
    item.stockQty === 0 ||
    item.stockQty === '0'
  ) {
    return {
      isSoldOut: true,
      reason: AVAILABILITY_REASON.OUT_OF_STOCK,
      label: 'Out of stock',
    };
  }

  return AVAILABLE;
};

export const isCartItemSoldOut = item => getCartItemAvailability(item).isSoldOut;
