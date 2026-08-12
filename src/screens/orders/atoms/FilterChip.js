import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { FONTS } from '@/styles/typography';
import {
  HAIRLINE,
  INK,
  RADIUS,
  SPACE,
  SURFACE,
  TYPE,
  TOUCH_MIN,
  MAX_FONT_SCALE,
} from '@/styles/homeTheme';
import AnimatedPressable from '@/components/AnimatedPressable';

const FilterChip = ({ label, count, selected, onPress }) => (
  <AnimatedPressable
    onPress={onPress}
    style={[styles.chip, selected && styles.chipSelected]}
    accessibilityRole="button"
    accessibilityState={{ selected }}
    accessibilityLabel={`${label}${count ? `, ${count} orders` : ''}`}
  >
    <Text
      style={[styles.label, selected && styles.labelSelected]}
      maxFontSizeMultiplier={MAX_FONT_SCALE}
    >
      {label}
      {count > 0 ? `  ${count}` : ''}
    </Text>
  </AnimatedPressable>
);

const styles = StyleSheet.create({
  chip: {
    minHeight: TOUCH_MIN - 12,
    justifyContent: 'center',
    paddingHorizontal: SPACE.md + 2,
    borderRadius: RADIUS.pill,
    backgroundColor: SURFACE.base,
    borderWidth: 1,
    borderColor: HAIRLINE,
    marginRight: SPACE.sm,
  },
  chipSelected: {
    backgroundColor: INK.strong,
    borderColor: INK.strong,
  },
  label: {
    ...TYPE.label,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.muted,
    letterSpacing: -0.1,
  },
  labelSelected: {
    color: INK.onDark,
    fontFamily: FONTS.gilroy.bold,
  },
});

export default React.memo(FilterChip);
