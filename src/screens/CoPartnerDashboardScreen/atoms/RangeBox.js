import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import CartText from '@/screens/cart/components/atoms/CartText';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
} from '@/styles/cartTheme';

const RangeBox = ({ label, value, placeholder, active, onPress }) => (
  <TouchableOpacity
    style={[styles.box, active && styles.boxActive]}
    onPress={onPress}
    activeOpacity={0.85}
    accessibilityRole="button"
    accessibilityState={{ selected: active }}
  >
    <CartText variant="micro" tone="muted">
      {label}
    </CartText>
    <CartText variant="labelStrong" tone={value ? 'primary' : 'faint'}>
      {value || placeholder}
    </CartText>
  </TouchableOpacity>
);

export default React.memo(RangeBox);

const styles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: 'center',
    gap: 1,
    backgroundColor: CART_COLORS.well,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: CART_RADIUS.input,
    paddingVertical: CART_SPACING.sm,
    paddingHorizontal: CART_SPACING.md,
  },
  boxActive: {
    borderColor: CART_COLORS.borderStrong,
    backgroundColor: CART_COLORS.card,
  },
});
