import React, { forwardRef, memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { LocationIcon } from '../../components/ProfileIcons';
import CustomBottomModal from '../../components/CustomBottomModal';
import { GOOGLE_MAPS_API_KEY } from '../../globals/secrets';
import { LOCATION_COLORS, LOCATION_FONTS, RADII } from './locationTheme';

// Restyled replacement for the old inline "Search your area" Modal. Same
// GooglePlacesAutocomplete wiring (owned by useLocationOnboarding), premium
// chrome. CustomBottomModal already handles keyboard avoidance internally,
// so the old manual KeyboardAvoidingView wrapper is dropped.
const LocationSearchSheet = forwardRef(({ onPlaceSelected, onClose }, ref) => (
  <CustomBottomModal
    ref={ref}
    snapPoints={['75%']}
    onClose={onClose}
    backgroundStyle={styles.sheetBackground}
    renderContent={() => (
      <View style={styles.content}>
        <Text style={styles.title}>Search your area</Text>
        <GooglePlacesAutocomplete
          placeholder="Search a new location"
          debounce={200}
          fetchDetails
          textInputProps={{
            placeholderTextColor: LOCATION_COLORS.textSecondary,
            returnKeyType: 'search',
          }}
          styles={{
            container: styles.autocompleteContainer,
            textInputContainer: styles.textInputContainer,
            textInput: styles.textInput,
            listView: styles.listView,
            row: styles.row,
          }}
          renderRow={rowData => {
            const title = rowData.structured_formatting.main_text;
            const address = rowData.structured_formatting.secondary_text;
            return (
              <View style={styles.rowContent}>
                <View style={styles.rowIcon}>
                  <LocationIcon
                    width={12}
                    height={14}
                    color={LOCATION_COLORS.primary}
                  />
                </View>
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>{title}</Text>
                  {!!address && (
                    <Text style={styles.rowAddress}>{address}</Text>
                  )}
                </View>
              </View>
            );
          }}
          onPress={(data, details = null) => onPlaceSelected?.(data, details)}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: 'en',
            components: 'country:IN',
          }}
        />
      </View>
    )}
  />
));

LocationSearchSheet.displayName = 'LocationSearchSheet';

const styles = StyleSheet.create({
  sheetBackground: {
    borderTopLeftRadius: RADII.sheet,
    borderTopRightRadius: RADII.sheet,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  title: {
    fontFamily: LOCATION_FONTS.bold,
    fontSize: 18,
    color: LOCATION_COLORS.textPrimary,
    marginBottom: 14,
  },
  autocompleteContainer: {
    flex: 0,
  },
  textInputContainer: {
    backgroundColor: 'transparent',
  },
  textInput: {
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: LOCATION_COLORS.secondaryBackground,
    color: LOCATION_COLORS.textPrimary,
    fontFamily: LOCATION_FONTS.medium,
    fontSize: 15,
  },
  listView: {
    marginTop: 8,
  },
  row: {
    borderRadius: 12,
    paddingVertical: 4,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: LOCATION_COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontFamily: LOCATION_FONTS.medium,
    fontSize: 14,
    color: LOCATION_COLORS.textPrimary,
  },
  rowAddress: {
    fontFamily: LOCATION_FONTS.regular,
    fontSize: 12,
    color: LOCATION_COLORS.textSecondary,
    marginTop: 2,
  },
});

export default memo(LocationSearchSheet);
