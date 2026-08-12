import React from 'react';
import { StyleSheet } from 'react-native';
import CartText from '@/screens/cart/components/atoms/CartText';
import { CART_SPACING } from '@/styles/cartTheme';

const FieldLabel = ({ children, style }) => (
  <CartText variant="micro" tone="muted" style={[styles.label, style]}>
    {children}
  </CartText>
);

export default React.memo(FieldLabel);

const styles = StyleSheet.create({
  label: {
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: CART_SPACING.sm,
  },
});
