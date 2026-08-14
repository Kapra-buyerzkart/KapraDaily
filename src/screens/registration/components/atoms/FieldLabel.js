import React from 'react';
import { StyleSheet } from 'react-native';
import CartText from '../../../cart/components/atoms/CartText';
import { CART_COLORS } from '../../../../styles/cartTheme';

const FieldLabel = ({ children, required = false, style }) => (
  <CartText variant="micro" tone="muted" style={[styles.label, style]}>
    {children}
    {required ? <CartText style={styles.star}>{' *'}</CartText> : null}
  </CartText>
);

export default React.memo(FieldLabel);

const styles = StyleSheet.create({
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  star: {
    color: CART_COLORS.danger,
  },
});
