import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import CustomLoader from '@/components/CustomLoader';

import { AddressSheet, LocationMap, MapOverlay } from './components/organisms';
import useAddLocation from './useAddLocation';
import { COLORS } from './theme';

const AddLocationScreen = () => {
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

      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      <View style={styles.screen}>
        <LocationMap
          mapRef={mapRef}
          region={region}
          isDragging={isDragging}
          onRegionChange={onRegionChange}
          onRegionChangeComplete={onRegionChangeComplete}
          onRecenter={() => getCurrentLocation(true)}
        />

        <MapOverlay
          searchRef={searchRef}
          apiKey={apiKey}
          onPlaceSelected={onPlaceSelected}
          isBusy={status.isGeocoding && !status.isInitialLoading}
          onBack={onBack}
        />

        <AddressSheet
          isEditMode={isEditMode}
          form={form}
          area={area}
          status={status}
          onSave={handleSave}
        />
      </View>
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
