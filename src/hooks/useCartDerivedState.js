import { useMemo } from 'react';

export const useCartDerivedState = ({
  cartItems,
  cartSummary,
  cartError,
  serviceabilityTrigger,
  chosenSlot,
}) => {
  const totalCartBTokens = cartItems.reduce(
    (sum, item) =>
      sum + (item.totalBtokens || item.bTokenValue || item.bTokens || 0),
    0,
  );

  const hasSoldOutItems = useMemo(
    () =>
      cartItems.some(
        item =>
          item.unavailable === 1 ||
          item.insufficientStock === 1 ||
          item.notAvailableInStore === 1,
      ),
    [cartItems],
  );

  const isCartStoreNotFound =
    serviceabilityTrigger ||
    cartSummary?.status === 'STORE_NOT_FOUND' ||
    cartSummary?.status === 'STORE_CLOSED_FOR_DELIVERY' ||
    (cartError &&
      (String(cartError).toLowerCase().includes('store not found') ||
        String(cartError).toLowerCase().includes('closed for delivery') ||
        String(cartError).toLowerCase().includes('no store') ||
        String(cartError).toLowerCase().includes('not available') ||
        String(cartError).toLowerCase().includes('pincode area') ||
        String(cartError).toLowerCase().includes('no delivery'))) ||
    (!!cartError && (!cartSummary || !cartSummary.grandTotal));

  const isPlaceOrderBlocked = hasSoldOutItems || isCartStoreNotFound;
  const ctaLabel = isCartStoreNotFound
    ? 'Unavailable'
    : hasSoldOutItems
    ? 'Remove Sold Out'
    : 'Pay';

  const scheduleLabel = chosenSlot
    ? `${chosenSlot.dateDisplay} | ${chosenSlot.slotDisplay}`
    : 'Select Slot';

  const tokenLabel =
    totalCartBTokens > 0 ? `${totalCartBTokens} UD Token` : null;

  const firstProductId = cartItems?.[0]?.productId || cartItems?.[0]?.id;

  return {
    totalCartBTokens,
    hasSoldOutItems,
    isCartStoreNotFound,
    isPlaceOrderBlocked,
    ctaLabel,
    scheduleLabel,
    tokenLabel,
    firstProductId,
  };
};
