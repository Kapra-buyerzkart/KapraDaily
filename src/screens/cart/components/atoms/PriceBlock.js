import React from 'react';
import { View, StyleSheet } from 'react-native';
import CartText from './CartText';
import { CART_SPACING } from '../../../../styles/cartTheme';

const PriceBlock = ({ price, mrp, align = 'flex-end', variant = 'price' }) => {
  const hasStrike = mrp != null && Number(mrp) > Number(price);

  return (
    <View style={[styles.wrap, { alignItems: align }]}>
      <CartText variant={variant}>₹{price}</CartText>
      {hasStrike ? (
        <CartText variant="micro" tone="faint" style={styles.strike}>
          ₹{mrp}
        </CartText>
      ) : null}
    </View>
  );
};

export default React.memo(PriceBlock);

const styles = StyleSheet.create({
  wrap: {
    gap: 1,
  },
  strike: {
    textDecorationLine: 'line-through',
    marginTop: CART_SPACING.xs / 2,
  },
});
