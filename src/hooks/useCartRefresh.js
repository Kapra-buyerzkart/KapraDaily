import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export const useCartRefresh = ({
  getCartSummary,
  fetchAddresses,
  loadProfile,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchAddresses();
      loadProfile();
    }, [fetchAddresses, loadProfile]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([getCartSummary(), fetchAddresses(), loadProfile()]);
    } finally {
      setRefreshing(false);
    }
  }, [getCartSummary, fetchAddresses, loadProfile]);

  return { refreshing, onRefresh };
};
