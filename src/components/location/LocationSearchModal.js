import React from 'react';
import {
  Modal,
  KeyboardAvoidingView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { BlurView } from '@sbaiahmed1/react-native-blur';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { getFontontSize } from '../../globals/GroFunctions';
import { GOOGLE_MAPS_API_KEY } from '../../globals/secrets';
import {
  sharedLocationStyles,
  windowWidth,
  windowHeight,
} from './sharedLocationStyles';

const LocationSearchModal = ({ visible, onClose, onPlaceSelected }) => (
  <Modal animationType="slide" visible={visible} transparent>
    <KeyboardAvoidingView behavior="position" enabled>
      <BlurView
        style={sharedLocationStyles.blurStyle}
        blurType="light"
        blurAmount={1}
        overlayColor={Platform.OS == 'ios' ? undefined : 'transparent'}
        reducedTransparencyFallbackColor="black"
      />
      <View
        style={[
          sharedLocationStyles.updateModalView1,
          {
            height: windowHeight * 0.37,
            marginTop: windowHeight * 0.63,
            paddingTop: 0,
          },
        ]}
      >
        <View style={sharedLocationStyles.modalHeader}>
          <Text style={sharedLocationStyles.fontStyle1}>Search your area</Text>
          <TouchableOpacity style={sharedLocationStyles.iconCmnCon} onPress={onClose}>
            <Image
              source={require('../../assets/icons/close.png')}
              style={{
                height: windowWidth * 0.05,
                width: windowWidth * 0.05,
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.locationSearch2}>
          <GooglePlacesAutocomplete
            placeholder={'Search a new location'}
            textInputProps={styles.searchTextCon}
            styles={styles.searchTextIn}
            debounce={200}
            renderRow={rowData => {
              const title = rowData.structured_formatting.main_text;
              const address = rowData.structured_formatting.secondary_text;
              return (
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={sharedLocationStyles.iconCmnCon}>
                      <Image
                        tintColor={'#F04B1B'}
                        source={require('../../assets/icons/address.png')}
                        style={{
                          height: 15,
                          width: 15,
                        }}
                      />
                    </View>
                    <View style={{ marginLeft: 10 }}>
                      <Text style={[styles.fontStyle3, { paddingBottom: 2 }]}>
                        {title}
                      </Text>
                      <Text style={[styles.fontStyle5, { color: '#151515' }]}>
                        {address}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }}
            onPress={onPlaceSelected}
            query={{
              key: GOOGLE_MAPS_API_KEY,
              language: 'en',
              components: 'country:IN',
            }}
            fetchDetails={true}
            listViewDisplayed={false}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  </Modal>
);

const styles = StyleSheet.create({
  locationSearch2: {
    width: windowWidth,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    height: windowHeight * (30 / 100),

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 3,

    elevation: 5,
  },
  searchTextCon: {
    placeholderTextColor: '#626262',
    returnKeyType: 'search',
    color: '#000000',
    fontFamily: 'Gilroy-Bold',
    backgroundColor: '#F5F5F5',
  },
  searchTextIn: {
    textInput: {
      height: windowHeight * (6 / 100),
      width: windowWidth * (90 / 100),
      color: '#626262',
      fontFamily: 'Gilroy-Bold',
      fontSize: getFontontSize(13),
    },
    listView: {
      borderRadius: 5,
      backgroundColor: '#ffffff',
      height: windowHeight * (20 / 100),
      width: windowWidth,
    },
    row: {
      borderRadius: 5,
    },
  },
  fontStyle3: {
    fontFamily: 'Gilroy-Regular',
    fontSize: getFontontSize(15),
    color: '#525252',
  },
  fontStyle5: {
    fontFamily: 'Gilroy-Regular',
    fontSize: getFontontSize(12),
    color: '#626262',
  },
});

export default LocationSearchModal;
