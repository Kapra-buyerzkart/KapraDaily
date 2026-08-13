import { View, StatusBar } from 'react-native';
import React from 'react';
import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import AddressConfirmationModal from '@/components/AddressConfirmationModal';
import { useSavedAddressScreen } from './useSavedAddressScreen';
import { styles } from './styles';
import { BORDER_FADE_RANGE } from './motion';
import AddressTopBar from './components/organisms/AddressTopBar';
import AddressList from './components/organisms/AddressList';

export default function SavedAddressScreen() {
  const {
    navigation,
    addresses,
    isLoading,
    isFirstLoad,
    refreshAddresses,
    handleAdd,
    handleEdit,
    handleSelect,
    handleDelete,
    addressConfirmationData,
    setAddressConfirmationData,
  } = useSavedAddressScreen();

  const scrollY = useSharedValue(0);

  const topBarBorderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      BORDER_FADE_RANGE,
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <View style={styles.screen}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <AddressTopBar
        title="Select delivery address"
        onBack={() => navigation.goBack()}
        borderStyle={topBarBorderStyle}
      />

      <AddressList
        addresses={addresses}
        isLoading={isLoading}
        isFirstLoad={isFirstLoad}
        onRefresh={refreshAddresses}
        onAdd={handleAdd}
        onSelect={handleSelect}
        onEdit={handleEdit}
        onDelete={handleDelete}
        scrollY={scrollY}
      />

      <AddressConfirmationModal
        visible={!!addressConfirmationData}
        pincode={addressConfirmationData?.pincode}
        areaName={addressConfirmationData?.areaName}
        onClose={() => setAddressConfirmationData(null)}
      />
    </View>
  );
}
