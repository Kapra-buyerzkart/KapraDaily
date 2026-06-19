import { useState, useEffect, useCallback } from 'react';
import { getReferralNetworkLevelMembersApi } from '../../api/userService';

export const useReferralLevelMembersScreen = levelNumber => {
  const [members, setMembers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getReferralNetworkLevelMembersApi(levelNumber);
      console.log('Referral Level Members Response:', response);
      setMembers(response?.data ?? response);
    } catch (err) {
      console.log('Fetch Referral Level Members Error:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [levelNumber]);

  useEffect(() => {
    if (levelNumber != null) {
      fetchMembers();
    }
  }, [levelNumber, fetchMembers]);

  return {
    members,
    isLoading,
    error,
    fetchMembers,
  };
};
