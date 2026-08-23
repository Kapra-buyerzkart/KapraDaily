import { useCallback, useEffect, useRef, useState } from 'react';
import { getKshopeAreaId } from '../globals/storage';

export const useKshopeAreaId = () => {
  const [areaId, setAreaId] = useState<number | null>(null);
  const [isResolving, setIsResolving] = useState(true);
  const cancelledRef = useRef(false);

  const refresh = useCallback(async () => {
    if (!cancelledRef.current) setIsResolving(true);
    try {
      const resolved = await getKshopeAreaId();
      if (!cancelledRef.current) setAreaId(resolved);
    } finally {
      if (!cancelledRef.current) setIsResolving(false);
    }
  }, []);

  useEffect(() => {
    cancelledRef.current = false;
    refresh();
    return () => {
      cancelledRef.current = true;
    };
  }, [refresh]);

  return { areaId, isResolving, refresh };
};

export default useKshopeAreaId;
