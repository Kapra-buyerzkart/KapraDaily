import { useEffect, useRef, useState } from 'react';
import secureStore from '../utils/secureStore';

const toAreaId = value => {
  if (value === null || value === undefined || value === '') return undefined;
  const parsed = typeof value === 'number' ? value : parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const useResolvedAreaId = profilePincode => {
  const [bootstrapAreaId, setBootstrapAreaId] = useState(undefined);
  const [isBootstrapped, setIsBootstrapped] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    (async () => {
      let stored = null;
      try {
        stored = await secureStore.getItem('pincodeAreaId');
      } catch (error) {
        stored = null;
      }
      if (!isMountedRef.current) return;
      setBootstrapAreaId(toAreaId(stored));
      setIsBootstrapped(true);
    })();
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const profileAreaId = toAreaId(profilePincode);
  const hasProfileArea = profileAreaId !== undefined;

  return {
    areaId: hasProfileArea ? profileAreaId : bootstrapAreaId,
    isResolvingArea: !hasProfileArea && !isBootstrapped,
  };
};

export default useResolvedAreaId;
