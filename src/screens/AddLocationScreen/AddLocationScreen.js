import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import CustomLoader from '@/components/CustomLoader';
import useKeyboardVisible from '@/hooks/useKeyboardVisible';

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

  const isKeyboardVisible = useKeyboardVisible();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const onSearchFocus = useCallback(() => setIsSearchFocused(true), []);
  const onSearchBlur = useCallback(() => setIsSearchFocused(false), []);
  const isFormFocused = isKeyboardVisible && !isSearchFocused;

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
          isHidden={isFormFocused}
        />

        <MapOverlay
          searchRef={searchRef}
          apiKey={apiKey}
          onPlaceSelected={onPlaceSelected}
          isBusy={status.isGeocoding && !status.isInitialLoading}
          onBack={onBack}
          isHidden={isFormFocused}
          onSearchFocus={onSearchFocus}
          onSearchBlur={onSearchBlur}
        />

        <AddressSheet
          isEditMode={isEditMode}
          form={form}
          area={area}
          status={status}
          onSave={handleSave}
          isExpanded={isFormFocused}
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
