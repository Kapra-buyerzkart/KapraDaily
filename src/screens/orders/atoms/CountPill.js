import React from 'react';
import { View, StyleSheet } from 'react-native';
import OrderText from './OrderText';
import { COLORS, RADIUS, SPACING } from '../theme';

const TONES = {
  neutral: { bg: COLORS.well, fg: 'muted' },
  brand: { bg: COLORS.primaryTint, fg: 'brand' },
  success: { bg: COLORS.successTint, fg: 'success' },
  info: { bg: COLORS.infoTint, fg: 'info' },
};

const CountPill = ({ label, tone = 'neutral', style }) => {
  const palette = TONES[tone] || TONES.neutral;

  return (
    <View style={[styles.pill, { backgroundColor: palette.bg }, style]}>
      <OrderText variant="microStrong" tone={palette.fg} numberOfLines={1}>
        {label}
      </OrderText>
    </View>
  );
};

export default React.memo(CountPill);

const styles = StyleSheet.create({
  pill: {
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
  },
});
