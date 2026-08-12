import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { GeocodingBanner } from '../molecules';
import {
  COLORS,
  FIELD_HEIGHT,
  GUTTER,
  HAIRLINE,
  MAX_FONT_SCALE,
  RADIUS,
  SHADOW,
  SPACING,
  TYPE,
  hp,
  wp,
} from '../../theme';

const PlacesSearchBar = ({ searchRef, apiKey, onPlaceSelected, isBusy }) => (
  <View style={styles.layer}>
    <View style={styles.field}>
      <GooglePlacesAutocomplete
        ref={searchRef}
        onFail={error => Alert.alert('Google Places Error', String(error))}
        placeholder="Search for an area, street or landmark"
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
    </View>

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
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.surface,
    ...SHADOW.raised,
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
    top: hp('6%'),
    width: '100%',
    zIndex: 100,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
    ...SHADOW.raised,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: hp('6%'),
    paddingHorizontal: SPACING.md,
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
    zIndex: 999,
    elevation: 10,
  },
  field: {
    width: wp('100%') - GUTTER * 2,
    alignSelf: 'center',
    marginTop: SPACING.md,
    zIndex: 999,
    elevation: 10,
  },
  icon: {
    marginRight: SPACING.sm,
  },
});
