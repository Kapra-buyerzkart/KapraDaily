import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Resolves the pincode area id (+ stored locality/area for display) used as
// input to the homepage query key. Returns undefined while resolving so
// callers can gate `enabled` on it rather than fire a query with a wrong key.
const useResolvedAreaId = (profilePincode) => {
  const [areaId, setAreaId] = useState(undefined);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const [storedPincodeAreaId, storedLocality, storedArea] = await Promise.all([
        AsyncStorage.getItem('pincodeAreaId'),
        AsyncStorage.getItem('locality'),
        AsyncStorage.getItem('area'),
      ]);

      if (!isMounted) return;

      const resolvedAreaId = storedPincodeAreaId ? parseInt(storedPincodeAreaId, 10) : (profilePincode || null);
      setAreaId(resolvedAreaId);

      if (storedArea) {
        setUserLocation({ locality: storedLocality || '', area: storedArea });
      }
    })();
    return () => { isMounted = false; };
  }, [profilePincode]);

  return { areaId, userLocation };
};

export default useResolvedAreaId;
