import { useRef } from 'react';

export const useScrollToPayment = () => {
  const listRef = useRef(null);
  const scrollOffsetRef = useRef(0);

  return {
    listRef,
    scrollOffsetRef,
  };
};
