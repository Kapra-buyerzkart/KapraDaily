import React, { forwardRef, memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import CustomBottomModal from '../../components/CustomBottomModal';
import AnimatedPressable from '../../components/AnimatedPressable';
import { LocationIcon } from '../../components/ProfileIcons';
import { LOCATION_COLORS, LOCATION_FONTS, RADII } from './locationTheme';

const COPY = {
  PRIMING: {
    title: 'Enable your location',
    subtitle:
      'Allow location access to discover nearby stores, estimate delivery time, and personalize your shopping experience.',
    primaryLabel: 'Enable Location',
  },
  BLOCKED: {
    title: 'Location access is off',
    subtitle:
      "You've turned off location permission for Kapra Daily. Enable it in Settings to discover nearby stores and delivery times.",
    primaryLabel: 'Open Settings',
  },
  GPS_OFF: {
    title: 'Turn on location services',
    subtitle:
      'Your device location services are off. Turn them on so we can find stores near you.',
    primaryLabel: 'Open Settings',
  },
};

// Premium bottom sheet for the location-permission flow. Built on the
// existing CustomBottomModal primitive (imperative ref API, gorhom bottom
// sheet underneath) rather than a raw Modal+BlurView, matching the app's
// established sheet convention.
const LocationPermissionSheet = forwardRef(
  ({ mode = 'PRIMING', onPrimaryPress, onChooseManually, onClose }, ref) => {
    const copy = COPY[mode] || COPY.PRIMING;

    return (
      <CustomBottomModal
        ref={ref}
        snapPoints={['58%']}
        onClose={onClose}
        backgroundStyle={styles.sheetBackground}
        renderContent={() => (
          <View style={styles.content}>
            <View style={styles.illustrationWrap}>
              <LocationIcon
                width={40}
                height={48}
                color={LOCATION_COLORS.primary}
              />
            </View>
            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.subtitle}>{copy.subtitle}</Text>
            <AnimatedPressable
              style={styles.primaryButton}
              onPress={onPrimaryPress}
            >
              <Text style={styles.primaryButtonText}>
                {copy.primaryLabel}
              </Text>
            </AnimatedPressable>
            {mode === 'PRIMING' && (
              <AnimatedPressable
                style={styles.secondaryButton}
                onPress={onChooseManually}
              >
                <Text style={styles.secondaryButtonText}>
                  Choose Manually
                </Text>
              </AnimatedPressable>
            )}
          </View>
        )}
      />
    );
  },
);

LocationPermissionSheet.displayName = 'LocationPermissionSheet';

const styles = StyleSheet.create({
  sheetBackground: {
    borderTopLeftRadius: RADII.sheet,
    borderTopRightRadius: RADII.sheet,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 8,
  },
  illustrationWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: LOCATION_COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  title: {
    fontFamily: LOCATION_FONTS.bold,
    fontSize: 20,
    color: LOCATION_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: LOCATION_FONTS.regular,
    fontSize: 14,
    lineHeight: 20,
    color: LOCATION_COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 28,
  },
  primaryButton: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    backgroundColor: LOCATION_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontFamily: LOCATION_FONTS.semiBold,
    fontSize: 16,
    color: LOCATION_COLORS.background,
  },
  secondaryButton: {
    paddingVertical: 10,
  },
  secondaryButtonText: {
    fontFamily: LOCATION_FONTS.medium,
    fontSize: 14,
    color: LOCATION_COLORS.textSecondary,
  },
});

export default memo(LocationPermissionSheet);
