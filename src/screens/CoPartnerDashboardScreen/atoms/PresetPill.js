import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import CartText from '@/screens/cart/components/atoms/CartText';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  hp,
} from '@/styles/cartTheme';

const PresetPill = ({ label, onPress }) => (
  <TouchableOpacity
    style={styles.pill}
    onPress={onPress}
    activeOpacity={0.8}
    accessibilityRole="button"
  >
    <CartText variant="caption" tone="secondary">
      {label}
    </CartText>
  </TouchableOpacity>
);

export default React.memo(PresetPill);

const styles = StyleSheet.create({
  pill: {
    backgroundColor: CART_COLORS.well,
    borderWidth: 1,
    borderColor: CART_COLORS.border,
    borderRadius: CART_RADIUS.pill,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('0.8%'),
    marginRight: CART_SPACING.sm,
  },
});
