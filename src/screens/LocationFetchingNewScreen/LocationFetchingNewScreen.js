import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthButton from '@/components/AuthButton';
import { useLocationFetching } from '@/hooks/useLocationFetching';

import { BACKGROUND_IMAGE } from './constants';
import { COLORS } from './theme';
import { AddressSummary } from './components/molecules';
import {
  AreaSelectionSheet,
  LocatingView,
  LocationSearchSheet,
  LocationTopBar,
} from './components/organisms';

const LocationFetchingNewScreen = ({ navigation }) => {
  const {
    addressComponent,
    showConfirm,
    confirmLoading,
    applyLoading,
    locationSelectionModal,
    locationSearchModal,
    listOfLocations,
    selectedLocation,
    onSkip,
    onSearchIconPress,
    onConfirmPress,
    onCloseSearchModal,
    onCloseSelectionModal,
    onPlaceSelected,
    onSelectArea,
    onSkipAreaSelection,
    onApplyArea,
  } = useLocationFetching({ navigation });

  if (!addressComponent) {
    return (
      <SafeAreaView style={styles.locatingContainer}>
        <LocatingView />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.background}
        resizeMode="cover"
        source={BACKGROUND_IMAGE}
      >
        <LocationTopBar onSkip={onSkip} onSearchPress={onSearchIconPress} />

        <AddressSummary geocodeResult={addressComponent} />

        {showConfirm && (
          <AuthButton
            FirstColor={COLORS.brand}
            SecondColor={COLORS.brandSoft}
            OnPress={onConfirmPress}
            ButtonText={'Confirm'}
            ButtonWidth={80}
            ButtonHeight={5}
            loading={confirmLoading}
          />
        )}

        <LocationSearchSheet
          visible={locationSearchModal}
          onClose={onCloseSearchModal}
          onPlaceSelected={onPlaceSelected}
        />

        <AreaSelectionSheet
          visible={locationSelectionModal}
          onClose={onCloseSelectionModal}
          listOfLocations={listOfLocations}
          selectedLocation={selectedLocation}
          onSelectArea={onSelectArea}
          onSkip={onSkipAreaSelection}
          onApply={onApplyArea}
          applyLoading={applyLoading}
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locatingContainer: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
});

export default LocationFetchingNewScreen;
