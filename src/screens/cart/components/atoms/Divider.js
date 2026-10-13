import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CART_COLORS, CART_SPACING } from '../../../../styles/cartTheme';
import DottedDivider from './DottedDivider';

const Divider = ({ inset = 0, dashed = false, style }) => {
  if (dashed) {
    return (
      <DottedDivider
        color={CART_COLORS.borderStrong}
        strokeWidth={1}
        dashLength={4}
        gapLength={4}
        style={[
          { marginVertical: CART_SPACING.xs },
          inset ? { marginHorizontal: inset } : null,
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.solid,
        inset ? { marginHorizontal: inset } : null,
        style,
      ]}
    />
  );
};

export default React.memo(Divider);

const styles = StyleSheet.create({
  solid: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: CART_COLORS.borderStrong,
  },
});
