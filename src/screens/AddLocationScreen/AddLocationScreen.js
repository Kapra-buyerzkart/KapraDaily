import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import CustomLoader from '@/components/CustomLoader';

import {
  AddressSheet,
  LocationMap,
  PlacesSearchBar,
} from './components/organisms';
import useAddLocation from './useAddLocation';
import { COLORS } from './theme';

const AddLocationScreen = () => {
  const insets = useSafeAreaInsets();
  const {
    apiKey,
    isEditMode,
    mapRef,
    searchRef,
    region,
    isDragging,
    onRegionChange,
    onRegionChangeComplete,
    onPlaceSelected,
    getCurrentLocation,
    form,
    area,
    status,
    onBack,
    handleSave,
  } = useAddLocation();

  return (
    <>
      <CustomLoader
        visible={status.isInitialLoading}
        text="Fetching your location..."
      />

      <SafeAreaView
        edges={['top']}
        style={[
          styles.screen,
          Platform.OS === 'android' && { paddingBottom: insets.bottom },
        ]}
      >
        <LocationMap
          mapRef={mapRef}
          region={region}
          isDragging={isDragging}
          onRegionChange={onRegionChange}
          onRegionChangeComplete={onRegionChangeComplete}
          onRecenter={() => getCurrentLocation(true)}
        />

        <PlacesSearchBar
          searchRef={searchRef}
          apiKey={apiKey}
          onPlaceSelected={onPlaceSelected}
          isBusy={status.isGeocoding && !status.isInitialLoading}
        />

        <AddressSheet
          isEditMode={isEditMode}
          form={form}
          area={area}
          status={status}
          onBack={onBack}
          onSave={handleSave}
        />
      </SafeAreaView>
    </>
  );
};

export default AddLocationScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
});
