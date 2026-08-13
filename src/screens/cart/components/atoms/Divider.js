import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CART_COLORS, CART_SPACING } from '../../../../styles/cartTheme';

const Divider = ({ inset = 0, dashed = false, style }) => (
  <View
    style={[
      dashed ? styles.dashed : styles.solid,
      inset ? { marginHorizontal: inset } : null,
      style,
    ]}
  />
);

export default React.memo(Divider);

const styles = StyleSheet.create({
  solid: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: CART_COLORS.borderStrong,
  },
  dashed: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: CART_COLORS.borderStrong,
    marginVertical: CART_SPACING.xs,
  },
});
