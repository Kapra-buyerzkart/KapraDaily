import React, { forwardRef } from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_TYPE,
  MAX_FONT_SCALE,
  hp,
} from '@/styles/cartTheme';
import { FOCUS_FADE, OTP_LENGTH } from '../constants';

const OtpBox = forwardRef(({ value, error, ...rest }, ref) => {
  const focus = useSharedValue(0);

  const boxStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      focus.value,
      [0, 1],
      [CART_COLORS.well, CART_COLORS.card],
    ),
    borderColor: interpolateColor(
      focus.value,
      [0, 1],
      [CART_COLORS.border, CART_COLORS.textSecondary],
    ),
  }));

  return (
    <Animated.View style={[styles.box, boxStyle, !!error && styles.boxError]}>
      <TextInput
        ref={ref}
        style={styles.input}
        value={value}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
        maxLength={OTP_LENGTH}
        selectionColor={CART_COLORS.textSecondary}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        onFocus={() => {
          focus.value = withTiming(1, FOCUS_FADE);
        }}
        onBlur={() => {
          focus.value = withTiming(0, FOCUS_FADE);
        }}
        {...rest}
      />
    </Animated.View>
  );
});

OtpBox.displayName = 'OtpBox';

export default React.memo(OtpBox);

const styles = StyleSheet.create({
  box: {
    flex: 1,
    height: hp('6.4%'),
    borderRadius: CART_RADIUS.input,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxError: {
    backgroundColor: CART_COLORS.dangerTint,
    borderColor: CART_COLORS.danger,
  },
  input: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    ...CART_TYPE.priceLarge,
    color: CART_COLORS.textPrimary,
    padding: 0,
    includeFontPadding: false,
  },
});
