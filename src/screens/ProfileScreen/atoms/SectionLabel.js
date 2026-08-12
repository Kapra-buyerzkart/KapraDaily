import React from 'react';
import { StyleSheet } from 'react-native';
import CartText from '../../cart/components/atoms/CartText';
import { CART_SPACING } from '@/styles/cartTheme';

const SectionLabel = ({ children, style }) => (
  <CartText variant="micro" tone="muted" style={[styles.label, style]}>
    {children}
  </CartText>
);

export default React.memo(SectionLabel);

const styles = StyleSheet.create({
  label: {
    paddingHorizontal: CART_SPACING.lg,
    marginBottom: CART_SPACING.sm,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
