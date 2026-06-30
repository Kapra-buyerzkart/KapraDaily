import { useRef } from 'react';

/**
 * Provides the cart FlatList ref and a scroll-offset tracker. Payment-mode
 * selection now lives in the PaymentBottomSheet, so the old "scroll to the
 * payment section" affordance was removed.
 */
export const useScrollToPayment = () => {
  const listRef = useRef(null);
  const scrollOffsetRef = useRef(0);

  return {
    listRef,
    scrollOffsetRef,
  };
};
