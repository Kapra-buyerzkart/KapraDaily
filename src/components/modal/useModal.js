import { useCallback, useMemo, useRef } from 'react';

export function useModal() {
  const ref = useRef(null);

  const open = useCallback(() => ref.current?.open(), []);
  const close = useCallback(() => ref.current?.close(), []);
  const toggle = useCallback(() => ref.current?.toggle(), []);

  return useMemo(() => ({ ref, open, close, toggle }), [close, open, toggle]);
}

export default useModal;
