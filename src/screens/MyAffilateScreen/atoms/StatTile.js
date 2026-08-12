import React from 'react';
import { View, StyleSheet } from 'react-native';
import CartText from '@/screens/cart/components/atoms/CartText';
import { CART_SPACING } from '@/styles/cartTheme';

const StatTile = ({ label, value, tone = 'primary' }) => (
  <View style={styles.tile}>
    <CartText variant="micro" tone="muted" numberOfLines={1}>
      {label}
    </CartText>
    <CartText variant="priceLarge" tone={tone} numberOfLines={1}>
      {value}
    </CartText>
  </View>
);

export default React.memo(StatTile);

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: 'flex-start',
    gap: CART_SPACING.xs,
  },
});
