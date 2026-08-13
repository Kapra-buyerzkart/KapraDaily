import { useState, useEffect, useCallback } from 'react';
import { getReferralNetworkLevelsApi } from '../../api/userService';

export const useMyAffilateScreen = () => {
  const [networkLevels, setNetworkLevels] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNetworkLevels = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getReferralNetworkLevelsApi();
      console.log('Referral Network Levels Response:', response);
      setNetworkLevels(response?.data ?? response);
    } catch (err) {
      console.log('Fetch Referral Network Levels Error:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNetworkLevels();
  }, [fetchNetworkLevels]);

  return {
    networkLevels,
    isLoading,
    error,
    fetchNetworkLevels,
  };
};
