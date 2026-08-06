import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import secureStore from '../utils/secureStore';

const useResolvedAreaId = (profilePincode) => {
  const [areaId, setAreaId] = useState(undefined);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const [storedPincodeAreaId, storedLocality, storedArea] = await Promise.all([
        secureStore.getItem('pincodeAreaId'),
        AsyncStorage.getItem('locality'),
        AsyncStorage.getItem('area'),
      ]);

      if (!isMounted) return;

      const resolvedAreaId = storedPincodeAreaId ? parseInt(storedPincodeAreaId, 10) : (profilePincode || undefined);
      console.log('[useResolvedAreaId] stored pincodeAreaId:', storedPincodeAreaId, '| profilePincode:', profilePincode, '| resolved:', resolvedAreaId);
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
