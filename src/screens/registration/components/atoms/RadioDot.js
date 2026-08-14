import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CART_COLORS, wp } from '../../../../styles/cartTheme';

const RadioDot = ({ selected = false, size = wp('5.4%') }) => {
  const dimension = { width: size, height: size, borderRadius: size / 2 };

  if (selected) {
    return (
      <View style={[styles.base, styles.selected, dimension]}>
        <Ionicons
          name="checkmark"
          size={size * 0.6}
          color={CART_COLORS.onPrimary}
        />
      </View>
    );
  }

  return <View style={[styles.base, styles.idle, dimension]} />;
};

export default React.memo(RadioDot);

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  idle: {
    borderWidth: 1.5,
    borderColor: CART_COLORS.borderStrong,
    backgroundColor: CART_COLORS.card,
  },
  selected: {
    backgroundColor: CART_COLORS.primary,
  },
});
