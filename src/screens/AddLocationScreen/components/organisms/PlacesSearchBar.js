import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { GeocodingBanner } from '../molecules';
import {
  COLORS,
  FIELD_HEIGHT,
  HAIRLINE,
  MAX_FONT_SCALE,
  RADIUS,
  SHADOW,
  SPACING,
  TYPE,
  hp,
  wp,
} from '../../theme';

const PlacesSearchBar = ({
  searchRef,
  apiKey,
  onPlaceSelected,
  isBusy,
  style,
}) => (
  <View style={[styles.layer, style]}>
    <GooglePlacesAutocomplete
      ref={searchRef}
      onFail={error => Alert.alert('Google Places Error', String(error))}
      placeholder="Search area, street or landmark"
      textInputProps={{
        placeholderTextColor: COLORS.textFaint,
        returnKeyType: 'search',
        maxFontSizeMultiplier: MAX_FONT_SCALE,
      }}
      renderLeftButton={() => (
        <Ionicons
          name="search"
          size={wp('4.4%')}
          color={COLORS.textMuted}
          style={styles.icon}
        />
      )}
      fetchDetails
      onPress={onPlaceSelected}
      query={{ key: apiKey, language: 'en', components: 'country:in' }}
      styles={AUTOCOMPLETE_STYLES}
    />

    {isBusy ? <GeocodingBanner /> : null}
  </View>
);

export default React.memo(PlacesSearchBar);

const AUTOCOMPLETE_STYLES = {
  container: { flex: 0 },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: FIELD_HEIGHT,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.button,
    borderWidth: HAIRLINE,
    borderColor: COLORS.line,
    backgroundColor: COLORS.surface,
    ...SHADOW.float,
  },
  textInput: {
    ...TYPE.label,
    color: COLORS.textPrimary,
    height: FIELD_HEIGHT,
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  description: {
    ...TYPE.label,
    color: COLORS.textSecondary,
  },
  predefinedPlacesDescription: { color: COLORS.textSecondary },
  listView: {
    position: 'absolute',
    top: FIELD_HEIGHT,
    width: '100%',
    zIndex: 100,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
    ...SHADOW.float,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: hp('6%'),
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  separator: {
    height: HAIRLINE,
    backgroundColor: COLORS.line,
  },
  loader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 20,
  },
};

const styles = StyleSheet.create({
  layer: {
    flex: 1,
    zIndex: 999,
    elevation: 10,
  },
  icon: {
    marginRight: SPACING.sm,
  },
});
