import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

import { AddrText } from '../atoms';
import { COLORS, RADIUS, SPACING, hp } from '../../theme';

const SaveButton = ({ label, isBusy, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.9}
    disabled={isBusy}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityState={{ disabled: isBusy, busy: isBusy }}
    style={[styles.button, isBusy && styles.buttonBusy]}
  >
    {isBusy ? (
      <ActivityIndicator color={COLORS.onDark} />
    ) : (
      <AddrText variant="cta" tone="onDark">
        {label}
      </AddrText>
    )}
  </TouchableOpacity>
);

export default React.memo(SaveButton);

const styles = StyleSheet.create({
  button: {
    height: hp('6.2%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.primary,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  buttonBusy: {
    opacity: 0.7,
  },
});
