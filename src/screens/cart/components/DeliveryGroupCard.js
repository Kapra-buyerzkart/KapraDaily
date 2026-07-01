import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
} from '../../../styles/cartTheme';

const DeliveryGroupCard = ({ position = 'single', children }) => {
  const radiusStyle =
    position === 'top'
      ? styles.topCap
      : position === 'bottom'
      ? styles.bottomCap
      : position === 'middle'
      ? styles.middle
      : styles.singleCap;

  return <View style={[styles.shell, radiusStyle]}>{children}</View>;
};

export default React.memo(DeliveryGroupCard);

const styles = StyleSheet.create({
  shell: {
    backgroundColor: CART_COLORS.card,
    marginHorizontal: CART_SPACING.lg,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E5E7EB',
  },
  topCap: {
    borderTopWidth: 1,
    borderTopLeftRadius: CART_RADIUS.card,
    borderTopRightRadius: CART_RADIUS.card,
  },
  middle: {},
  bottomCap: {
    borderBottomWidth: 1,
    borderBottomLeftRadius: CART_RADIUS.card,
    borderBottomRightRadius: CART_RADIUS.card,
  },
  singleCap: {
    borderWidth: 1,
    borderRadius: CART_RADIUS.card,
  },
});
