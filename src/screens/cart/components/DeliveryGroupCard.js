import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  CART_SHADOW,
} from '../../../styles/cartTheme';

const DeliveryGroupCard = ({ position = 'single', children }) => {
  const radiusStyle =
    position === 'top'
      ? styles.topCap
      : position === 'bottom'
      ? styles.bottomCap
      : styles.singleCap;

  return <View style={[styles.shell, radiusStyle]}>{children}</View>;
};

export default React.memo(DeliveryGroupCard);

const styles = StyleSheet.create({
  shell: {
    backgroundColor: CART_COLORS.card,
    marginHorizontal: CART_SPACING.lg,
  },
  topCap: {},
  bottomCap: {
    borderBottomLeftRadius: CART_RADIUS.card,
    borderBottomRightRadius: CART_RADIUS.card,
    ...CART_SHADOW,
  },
  singleCap: {
    borderRadius: CART_RADIUS.card,
    ...CART_SHADOW,
  },
});
