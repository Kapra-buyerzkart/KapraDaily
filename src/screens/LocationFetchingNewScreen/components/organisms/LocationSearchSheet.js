import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from '@sbaiahmed1/react-native-blur';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { GOOGLE_MAPS_API_KEY } from '@/globals/secrets';

import { sheetStyles } from '../../styles';
import { ICON_BUTTON_SIZE, SEARCH_ICON } from '../../constants';
import {
  COLORS,
  HAIRLINE,
  RADIUS,
  SPACING,
  TYPE,
  WINDOW_HEIGHT,
} from '../../theme';
import { PlaceSuggestionRow, SheetHeader } from '../molecules';

const FIELD_HEIGHT = 52;

const renderSuggestion = rowData => (
  <PlaceSuggestionRow
    title={rowData.structured_formatting?.main_text}
    address={rowData.structured_formatting?.secondary_text}
  />
);

const renderSearchIcon = () => (
  <Image source={SEARCH_ICON} style={styles.searchIcon} />
);

const textInputProps = {
  placeholderTextColor: COLORS.textMuted,
  selectionColor: COLORS.brand,
  returnKeyType: 'search',
  autoCorrect: false,
  autoCapitalize: 'none',
  autoComplete: 'off',
  importantForAutofill: 'no',
};

const query = {
  key: GOOGLE_MAPS_API_KEY,
  language: 'en',
  components: 'country:IN',
};

const LocationSearchSheet = ({ visible, onClose, onPlaceSelected }) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <BlurView
          style={sheetStyles.blur}
          blurType="light"
          blurAmount={1}
          overlayColor={Platform.OS === 'ios' ? undefined : 'transparent'}
          reducedTransparencyFallbackColor="black"
        />

        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            sheetStyles.sheet,
            styles.sheet,
            { paddingBottom: SPACING.md + insets.bottom },
          ]}
        >
          <View style={styles.grabber} />

          <SheetHeader title="Search your area" onClose={onClose} />

          <View style={styles.searchPanel}>
            <GooglePlacesAutocomplete
              placeholder="Search a new location"
              textInputProps={textInputProps}
              styles={styles.autocomplete}
              debounce={200}
              renderRow={renderSuggestion}
              renderLeftButton={renderSearchIcon}
              onPress={onPlaceSelected}
              query={query}
              fetchDetails
              listViewDisplayed="auto"
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default React.memo(LocationSearchSheet);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingTop: SPACING.sm,
    height: WINDOW_HEIGHT * 0.56,
    flexShrink: 1,
  },
  grabber: {
    width: 44,
    height: 4,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.lineStrong,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  searchPanel: {
    flex: 1,
    marginTop: SPACING.lg,
  },
  searchIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: COLORS.textMuted,
    alignSelf: 'center',
    marginLeft: SPACING.lg,
  },
  autocomplete: {
    container: {
      flex: 1,
    },
    textInputContainer: {
      alignItems: 'center',
      height: FIELD_HEIGHT,
      borderRadius: RADIUS.input,
      backgroundColor: COLORS.well,
      borderWidth: HAIRLINE,
      borderColor: COLORS.line,
      overflow: 'hidden',
    },
    textInput: {
      flex: 1,
      height: FIELD_HEIGHT,
      marginBottom: 0,
      borderRadius: 0,
      paddingVertical: 0,
      paddingHorizontal: SPACING.md,
      backgroundColor: 'transparent',
      color: COLORS.textPrimary,
      ...TYPE.bodyStrong,
    },
    listView: {
      marginTop: SPACING.md,
      backgroundColor: 'transparent',
    },
    row: {
      backgroundColor: 'transparent',
      paddingVertical: SPACING.md,
      paddingHorizontal: 0,
      minHeight: 0,
    },
    separator: {
      height: HAIRLINE,
      backgroundColor: COLORS.line,
      marginLeft: ICON_BUTTON_SIZE + SPACING.md,
    },
    poweredContainer: {
      backgroundColor: 'transparent',
      borderTopWidth: HAIRLINE,
      borderColor: COLORS.line,
      paddingVertical: SPACING.sm,
    },
  },
});
