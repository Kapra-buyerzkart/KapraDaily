import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import Entypo from 'react-native-vector-icons/Entypo';
import AnimatedPressable from '../../../../components/AnimatedPressable';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_TYPE,
  MAX_FONT_SCALE,
  wp,
} from '../../../../styles/cartTheme';

const BUMP_SPRING = { damping: 8, stiffness: 260, mass: 0.4 };

const QtyStepper = ({
  quantity,
  onIncrease,
  onDecrease,
  disabled = false,
  updating = false,
  atMaxQty = false,
  productName = 'item',
}) => {
  const bump = useSharedValue(1);

  useEffect(() => {
    bump.value = withSequence(
      withTiming(1.18, { duration: 100 }),
      withSpring(1, BUMP_SPRING),
    );
  }, [quantity, bump]);

  const bumpStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bump.value }],
  }));

  const iconColor = disabled
    ? CART_COLORS.textFaint
    : CART_COLORS.textSecondary;

  return (
    <View
      style={[
        styles.shell,
        disabled && styles.shellDisabled,
        updating && styles.shellUpdating,
      ]}
    >
      <AnimatedPressable
        style={styles.btn}
        onPress={onDecrease}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}
        accessibilityRole="button"
        accessibilityLabel={
          quantity === 1
            ? `Remove ${productName} from cart`
            : `Decrease ${productName} quantity`
        }
      >
        <Entypo name="minus" size={wp('4%')} color={iconColor} />
      </AnimatedPressable>

      <Animated.Text
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        style={[styles.count, disabled && styles.countDisabled, bumpStyle]}
      >
        {quantity}
      </Animated.Text>

      <AnimatedPressable
        style={[styles.btn, atMaxQty && styles.btnCapped]}
        onPress={onIncrease}
        disabled={disabled}
        hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel={
          atMaxQty
            ? `Maximum quantity reached for ${productName}`
            : `Increase ${productName} quantity`
        }
      >
        <Entypo name="plus" size={wp('4%')} color={iconColor} />
      </AnimatedPressable>
    </View>
  );
};

export default React.memo(QtyStepper);

const styles = StyleSheet.create({
  shell: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CART_COLORS.card,
    borderWidth: 1,
    borderColor: CART_COLORS.borderStrong,
    borderRadius: CART_RADIUS.stepper,
    paddingHorizontal: 2,
    minWidth: wp('24%'),
    justifyContent: 'space-between',
  },
  shellDisabled: {
    backgroundColor: CART_COLORS.well,
    borderColor: CART_COLORS.border,
  },
  shellUpdating: {
    opacity: 0.5,
  },
  btn: {
    width: wp('8%'),
    height: wp('8%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCapped: {
    opacity: 0.4,
  },
  count: {
    ...CART_TYPE.labelStrong,
    color: CART_COLORS.textPrimary,
    minWidth: wp('5%'),
    textAlign: 'center',
  },
  countDisabled: {
    color: CART_COLORS.textFaint,
  },
});
