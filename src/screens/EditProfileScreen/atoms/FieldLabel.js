import React from 'react';
import { View, StyleSheet } from 'react-native';
import EditText from '@/screens/cart/components/atoms/CartText';
import { CART_SPACING } from '@/styles/cartTheme';

const FieldLabel = ({ children, optional, style }) => (
  <View style={[styles.row, style]}>
    <EditText variant="micro" tone="muted" style={styles.label}>
      {children}
    </EditText>
    {!!optional && (
      <EditText variant="micro" tone="faint">
        Optional
      </EditText>
    )}
  </View>
);

export default React.memo(FieldLabel);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs + 2,
    marginBottom: CART_SPACING.sm,
  },
  label: {
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
