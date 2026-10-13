import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import AnimatedPressable from '../../../../components/AnimatedPressable';
import { FONTS } from '@/styles/typography';
import { CART_COLORS, MAX_FONT_SCALE } from '../../../../styles/cartTheme';

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

  const iconColor = disabled ? CART_COLORS.textFaint : '#3B1011';

  return (
    <View style={styles.wrapper}>
      {/* Black 3D offset shadow layer */}
      <View
        style={[styles.shadowLayer, disabled && styles.shadowDisabled]}
      />

      {/* Main yellow pill */}
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
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 6 }}
          accessibilityRole="button"
          accessibilityLabel={
            quantity === 1
              ? `Remove ${productName} from cart`
              : `Decrease ${productName} quantity`
          }
        >
          <View style={[styles.minusBar, { backgroundColor: iconColor }]} />
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
          hitSlop={{ top: 8, bottom: 8, left: 6, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={
            atMaxQty
              ? `Maximum quantity reached for ${productName}`
              : `Increase ${productName} quantity`
          }
        >
          <View style={styles.plusContainer}>
            <View
              style={[styles.plusHorizontal, { backgroundColor: iconColor }]}
            />
            <View
              style={[styles.plusVertical, { backgroundColor: iconColor }]}
            />
          </View>
        </AnimatedPressable>
      </View>
    </View>
  );
};

export default React.memo(QtyStepper);

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    height: 30,
    width: 86,
  },
  shadowLayer: {
    position: 'absolute',
    top: 2.5,
    left: 2.5,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 999,
  },
  shadowDisabled: {
    backgroundColor: '#9CA3AF',
  },
  shell: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFDD04',
    borderRadius: 999,
    height: 30,
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  shellDisabled: {
    backgroundColor: '#F3F4F6',
  },
  shellUpdating: {
    opacity: 0.5,
  },
  btn: {
    width: 28,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCapped: {
    opacity: 0.35,
  },
  minusBar: {
    width: 10,
    height: 2.4,
    borderRadius: 0.5,
  },
  plusContainer: {
    width: 11,
    height: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusHorizontal: {
    position: 'absolute',
    width: 11,
    height: 2.4,
    borderRadius: 0.5,
  },
  plusVertical: {
    position: 'absolute',
    width: 2.4,
    height: 11,
    borderRadius: 0.5,
  },
  count: {
    fontFamily: FONTS.lexend.bold,
    fontSize: 15,
    color: '#101827',
    minWidth: 20,
    textAlign: 'center',
    includeFontPadding: false,
  },
  countDisabled: {
    color: CART_COLORS.textFaint,
  },
});
