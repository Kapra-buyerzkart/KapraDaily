import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  CART_COLORS,
  CART_ELEVATION,
  CART_GUTTER,
  CART_RADIUS,
} from '../../../../styles/cartTheme';

const CAPS = {
  single: styles => styles.capSingle,
  top: styles => styles.capTop,
  middle: styles => styles.capMiddle,
  bottom: styles => styles.capBottom,
};

const Surface = ({
  position = 'single',
  elevated = true,
  inset = true,
  style,
  children,
  ...rest
}) => (
  <View
    {...rest}
    style={[
      styles.shell,
      inset && styles.inset,
      (CAPS[position] || CAPS.single)(styles),
      elevated && CART_ELEVATION.card,
      style,
    ]}
  >
    {children}
  </View>
);

export default React.memo(Surface);

const styles = StyleSheet.create({
  shell: {
    backgroundColor: CART_COLORS.card,
  },
  inset: {
    marginHorizontal: CART_GUTTER,
  },
  capSingle: {
    borderRadius: CART_RADIUS.card,
  },
  capTop: {
    borderTopLeftRadius: CART_RADIUS.card,
    borderTopRightRadius: CART_RADIUS.card,
  },
  capMiddle: {},
  capBottom: {
    borderBottomLeftRadius: CART_RADIUS.card,
    borderBottomRightRadius: CART_RADIUS.card,
  },
});
