import { useCallback, useMemo, useRef } from 'react';

/**
 * useModal
 *
 * Small convenience hook around the ref pattern <CustomModal /> expects.
 * Saves every call site from repeating `useRef(null)` plus the optional
 * chaining on every call:
 *
 *   const modal = useModal();
 *   <CustomModal ref={modal.ref}>...</CustomModal>
 *   <Button onPress={modal.open} />
 *
 * `open`/`close`/`toggle` are stable across re-renders, so they're safe to
 * pass directly as onPress handlers without re-creating callbacks.
 */
export function useModal() {
  const ref = useRef(null);

  const open = useCallback(() => ref.current?.open(), []);
  const close = useCallback(() => ref.current?.close(), []);
  const toggle = useCallback(() => ref.current?.toggle(), []);

  return useMemo(() => ({ ref, open, close, toggle }), [close, open, toggle]);
}

export default useModal;
