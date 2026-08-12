import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { CART_COLORS, CART_RADIUS, CART_SPACING, hp } from '@/styles/cartTheme';

const FieldWell = ({ focus, error, style, children }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      focus.value,
      [0, 1],
      [CART_COLORS.well, CART_COLORS.card],
    ),
    borderColor: interpolateColor(
      focus.value,
      [0, 1],
      [CART_COLORS.border, CART_COLORS.borderStrong],
    ),
  }));

  return (
    <Animated.View
      style={[styles.well, animatedStyle, !!error && styles.wellError, style]}
    >
      {children}
    </Animated.View>
  );
};

export default React.memo(FieldWell);

const styles = StyleSheet.create({
  well: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: hp('6%'),
    borderRadius: CART_RADIUS.input,
    borderWidth: 1,
    paddingHorizontal: CART_SPACING.md,
  },
  wellError: {
    backgroundColor: CART_COLORS.dangerTint,
    borderColor: CART_COLORS.danger,
  },
});
