import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { COLORS, MAX_FONT_SCALE, SPACING, TYPE, hp } from '../../theme';

const FieldLabel = ({ label, required, isActive, hasError, style }) => (
  <Text
    maxFontSizeMultiplier={MAX_FONT_SCALE}
    numberOfLines={1}
    style={[
      styles.label,
      isActive && styles.labelActive,
      hasError && styles.labelError,
      style,
    ]}
  >
    {label}
    {required ? <Text style={styles.required}> *</Text> : null}
  </Text>
);

export default React.memo(FieldLabel);

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    top: -hp('0.95%'),
    left: SPACING.md,
    zIndex: 1,
    paddingHorizontal: SPACING.xs,
    backgroundColor: COLORS.surface,
    ...TYPE.micro,
    color: COLORS.textMuted,
  },
  labelActive: {
    color: COLORS.textPrimary,
  },
  labelError: {
    color: COLORS.danger,
  },
  required: {
    color: COLORS.danger,
  },
});
