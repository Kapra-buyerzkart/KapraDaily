import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAddresses } from '@/hooks/useAddresses';

export const useSavedAddressScreen = () => {
  const navigation = useNavigation();
  const {
    addresses,
    isLoading,
    refreshAddresses,
    onSelectAddress,
    onDeleteClicked,
    addressConfirmationData,
    setAddressConfirmationData,
  } = useAddresses();

  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const settled = useRef(false);

  useEffect(() => {
    if (!isLoading && !settled.current) {
      settled.current = true;
      setHasLoadedOnce(true);
    }
  }, [isLoading]);

  useFocusEffect(
    useCallback(() => {
      refreshAddresses();
    }, [refreshAddresses]),
  );

  const goToEditor = useCallback(
    address =>
      navigation.navigate(
        'AddLocationScreen',
        address ? { address } : undefined,
      ),
    [navigation],
  );

  const handleAdd = useCallback(() => goToEditor(), [goToEditor]);

  const handleEdit = useCallback(raw => goToEditor(raw), [goToEditor]);

  const handleSelect = useCallback(
    id => onSelectAddress(id, false),
    [onSelectAddress],
  );

  const handleDelete = useCallback(
    id => onDeleteClicked(id),
    [onDeleteClicked],
  );

  return {
    navigation,
    addresses,
    isLoading,
    isFirstLoad: !hasLoadedOnce && addresses.length === 0,
    refreshAddresses,
    handleAdd,
    handleEdit,
    handleSelect,
    handleDelete,
    addressConfirmationData,
    setAddressConfirmationData,
  };
};
