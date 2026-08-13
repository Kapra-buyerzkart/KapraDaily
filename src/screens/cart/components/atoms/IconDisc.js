import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CART_COLORS, CART_RADIUS } from '../../../../styles/cartTheme';

const TONES = {
  brand: CART_COLORS.primaryTint,
  success: CART_COLORS.successTint,
  neutral: CART_COLORS.well,
  pink: CART_COLORS.pinkTint,
  danger: CART_COLORS.dangerTint,
};

const IconDisc = ({ size = 34, tone = 'brand', radius, style, children }) => (
  <View
    style={[
      styles.disc,
      {
        width: size,
        height: size,
        borderRadius: radius ?? CART_RADIUS.icon,
        backgroundColor: TONES[tone] || tone,
      },
      style,
    ]}
  >
    {children}
  </View>
);

export default React.memo(IconDisc);

const styles = StyleSheet.create({
  disc: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
