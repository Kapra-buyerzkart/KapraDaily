import React from 'react';
import { StyleSheet } from 'react-native';
import AnimatedPressable from '@/components/AnimatedPressable';
import OrderText from './OrderText';
import { COLORS, RADIUS, SPACING, TOUCH_MIN } from '../theme';

const FilterChip = ({ label, count, selected, onPress }) => (
  <AnimatedPressable
    onPress={onPress}
    style={[styles.chip, selected && styles.chipSelected]}
    accessibilityRole="button"
    accessibilityState={{ selected }}
    accessibilityLabel={`${label}${count ? `, ${count} orders` : ''}`}
  >
    <OrderText
      variant={selected ? 'captionStrong' : 'caption'}
      tone={selected ? 'onDark' : 'muted'}
    >
      {label}
      {count > 0 ? `  ${count}` : ''}
    </OrderText>
  </AnimatedPressable>
);

export default React.memo(FilterChip);

const styles = StyleSheet.create({
  chip: {
    minHeight: TOUCH_MIN - 12,
    justifyContent: 'center',
    paddingHorizontal: SPACING.md + 2,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.well,
    marginRight: SPACING.sm,
  },
  chipSelected: {
    backgroundColor: COLORS.ink,
  },
});
