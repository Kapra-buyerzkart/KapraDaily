import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CART_COLORS, CART_RADIUS, wp } from '../../../../styles/cartTheme';

const CheckBox = ({ checked = false, size = wp('5%') }) => (
  <View
    style={[
      styles.box,
      { width: size, height: size },
      checked ? styles.checked : styles.idle,
    ]}
  >
    {checked ? (
      <Ionicons
        name="checkmark"
        size={size * 0.68}
        color={CART_COLORS.onPrimary}
      />
    ) : null}
  </View>
);

export default React.memo(CheckBox);

const styles = StyleSheet.create({
  box: {
    borderRadius: CART_RADIUS.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idle: {
    borderWidth: 1.5,
    borderColor: CART_COLORS.borderStrong,
    backgroundColor: CART_COLORS.card,
  },
  checked: {
    backgroundColor: CART_COLORS.primary,
  },
});
