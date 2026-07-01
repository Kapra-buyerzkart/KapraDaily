import { useCallback, useState } from 'react';

// Reverts to a bundled local asset if a remote image source 404s or
// otherwise fails to load, instead of leaving a blank gap on screen.
export const useFallbackImage = (remoteSource, fallbackSource) => {
  const [failed, setFailed] = useState(false);
  const onError = useCallback(() => setFailed(true), []);
  const source = !remoteSource || failed ? fallbackSource : remoteSource;
  return { source, onError };
};
