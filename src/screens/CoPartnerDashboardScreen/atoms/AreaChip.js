import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import CartText from '@/screens/cart/components/atoms/CartText';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  hp,
  wp,
} from '@/styles/cartTheme';

const AreaChip = ({ label, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.chip, selected && styles.chipSelected]}
    onPress={onPress}
    activeOpacity={0.85}
    accessibilityRole="button"
    accessibilityState={{ selected }}
  >
    <CartText
      variant={selected ? 'captionStrong' : 'caption'}
      tone={selected ? 'onDark' : 'secondary'}
      numberOfLines={1}
    >
      {label}
    </CartText>
  </TouchableOpacity>
);

export default React.memo(AreaChip);

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('0.7%'),
    borderRadius: CART_RADIUS.pill,
    backgroundColor: CART_COLORS.well,
    borderWidth: 1,
    borderColor: CART_COLORS.border,
    maxWidth: wp('46%'),
  },
  chipSelected: {
    backgroundColor: CART_COLORS.textPrimary,
    borderColor: CART_COLORS.textPrimary,
  },
});
