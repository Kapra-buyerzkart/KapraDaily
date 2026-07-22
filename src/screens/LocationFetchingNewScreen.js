import React from 'react';
import { StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';

import AuthButton from '../components/AuthButton';
import LocationHeaderActions from '../components/location/LocationHeaderActions';
import LocationAddressInfo from '../components/location/LocationAddressInfo';
import LocationSearchModal from '../components/location/LocationSearchModal';
import LocationSelectionModal from '../components/location/LocationSelectionModal';
import { useLocationFetching } from '../hooks/useLocationFetching';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
      <SafeAreaView style={styles.loaderContainer}>
        <FastImage
          source={require('../assets/gifs/location-fetching.gif')}
          style={styles.loaderGif}
          resizeMode={FastImage.resizeMode.cover}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.maninContainer}>
      <ImageBackground
        style={styles.backgroundImage}
        resizeMode="cover"
        source={require('../assets/images/location-background.png')}
      >
        <LocationHeaderActions onSkip={onSkip} onSearchPress={onSearchIconPress} />

        <LocationAddressInfo geocodeResult={addressComponent} />

        {showConfirm && (
          <AuthButton
            FirstColor={'#F04B1B'}
            SecondColor={'#FF7148'}
            OnPress={onConfirmPress}
            ButtonText={'Confirm'}
            ButtonWidth={80}
            ButtonHeight={5}
            loading={confirmLoading}
          />
        )}

        <LocationSearchModal
          visible={locationSearchModal}
          onClose={onCloseSearchModal}
          onPlaceSelected={onPlaceSelected}
        />

        <LocationSelectionModal
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
  maninContainer: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: windowWidth,
    height: windowHeight,
  },
  loaderGif: {
    width: windowWidth,
    height: windowHeight,
  },
});

export default LocationFetchingNewScreen;
