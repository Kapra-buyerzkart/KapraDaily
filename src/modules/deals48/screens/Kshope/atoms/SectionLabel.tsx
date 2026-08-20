import React from 'react';
import { View, StyleSheet } from 'react-native';
import CartText from '@/screens/cart/components/atoms/CartText';
import { CART_SPACING } from '@/styles/cartTheme';
import { GUTTER } from '../styles';

interface SectionLabelProps {
  children: React.ReactNode;
  action?: React.ReactNode;
}

const SectionLabel: React.FC<SectionLabelProps> = ({ children, action }) => (
  <View style={styles.row}>
    <CartText variant="micro" tone="muted" style={styles.label}>
      {children}
    </CartText>
    {action}
  </View>
);

export default React.memo(SectionLabel);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: GUTTER,
    marginBottom: CART_SPACING.md,
  },
  label: {
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
