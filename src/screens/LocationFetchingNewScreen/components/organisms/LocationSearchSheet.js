import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { BlurView } from '@sbaiahmed1/react-native-blur';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { getFontontSize } from '@/globals/GroFunctions';
import { GOOGLE_MAPS_API_KEY } from '@/globals/secrets';

import { sheetStyles } from '../../styles';
import { COLORS, RADIUS, WINDOW_HEIGHT, WINDOW_WIDTH } from '../../theme';
import { PlaceSuggestionRow, SheetHeader } from '../molecules';

const renderSuggestion = rowData => (
  <PlaceSuggestionRow
    title={rowData.structured_formatting.main_text}
    address={rowData.structured_formatting.secondary_text}
  />
);

const LocationSearchSheet = ({ visible, onClose, onPlaceSelected }) => (
  <Modal animationType="slide" visible={visible} transparent>
    <KeyboardAvoidingView behavior="position" enabled>
      <BlurView
        style={sheetStyles.blur}
        blurType="light"
        blurAmount={1}
        overlayColor={Platform.OS === 'ios' ? undefined : 'transparent'}
        reducedTransparencyFallbackColor="black"
      />
      <View style={[sheetStyles.sheet, styles.sheet]}>
        <SheetHeader title="Search your area" onClose={onClose} />

        <View style={styles.searchPanel}>
          <GooglePlacesAutocomplete
            placeholder={'Search a new location'}
            textInputProps={styles.searchTextProps}
            styles={styles.autocomplete}
            debounce={200}
            renderRow={renderSuggestion}
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

export default React.memo(LocationSearchSheet);

const styles = StyleSheet.create({
  sheet: {
    height: WINDOW_HEIGHT * 0.37,
    marginTop: WINDOW_HEIGHT * 0.63,
    paddingTop: 0,
  },
  searchPanel: {
    width: WINDOW_WIDTH,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    height: WINDOW_HEIGHT * 0.3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  searchTextProps: {
    placeholderTextColor: '#626262',
    returnKeyType: 'search',
    color: '#000000',
    fontFamily: 'Gilroy-Bold',
    backgroundColor: '#F5F5F5',
  },
  autocomplete: {
    textInput: {
      height: WINDOW_HEIGHT * 0.06,
      width: WINDOW_WIDTH * 0.9,
      color: '#626262',
      fontFamily: 'Gilroy-Bold',
      fontSize: getFontontSize(13),
    },
    listView: {
      borderRadius: RADIUS.xs,
      backgroundColor: COLORS.surface,
      height: WINDOW_HEIGHT * 0.2,
      width: WINDOW_WIDTH,
    },
    row: {
      borderRadius: RADIUS.xs,
    },
  },
});
