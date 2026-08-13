import { useCallback, useState } from 'react';

export const useFallbackImage = (remoteSource, fallbackSource) => {
  const [failed, setFailed] = useState(false);
  const onError = useCallback(() => setFailed(true), []);
  const source = !remoteSource || failed ? fallbackSource : remoteSource;
  return { source, onError };
};
