import React, { forwardRef, useState } from 'react';
import { View, StyleSheet, TextInput, Platform } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  CART_COLORS,
  CART_SPACING,
  CART_TYPE,
  MAX_FONT_SCALE,
  wp,
  hp,
} from '@/styles/cartTheme';
import FieldLabel from '../atoms/FieldLabel';
import FieldWell from '../atoms/FieldWell';
import InlineError from '../atoms/InlineError';
import RevealToggle from '../atoms/RevealToggle';
import { FOCUS_FADE } from '../constants';

const PasswordField = forwardRef(
  (
    { label, icon, error, success, footer, value, onChangeText, ...rest },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const [revealed, setRevealed] = useState(false);
    const focus = useSharedValue(0);

    const iconColor = error
      ? CART_COLORS.danger
      : success
      ? CART_COLORS.successDeep
      : focused
      ? CART_COLORS.textSecondary
      : CART_COLORS.textMuted;

    return (
      <View>
        <FieldLabel>{label}</FieldLabel>

        <FieldWell focus={focus} error={error} success={success}>
          <MaterialCommunityIcons
            name={success && !error ? 'check-circle-outline' : icon}
            size={wp('4.2%')}
            color={iconColor}
            style={styles.icon}
          />

          <TextInput
            ref={ref}
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor={CART_COLORS.textFaint}
            secureTextEntry={!revealed}
            autoCapitalize="none"
            autoCorrect={false}
            selectionColor={CART_COLORS.textSecondary}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
            onFocus={() => {
              setFocused(true);
              focus.value = withTiming(1, FOCUS_FADE);
            }}
            onBlur={() => {
              setFocused(false);
              focus.value = withTiming(0, FOCUS_FADE);
            }}
            {...rest}
          />

          <RevealToggle
            revealed={revealed}
            active={focused}
            onPress={() => setRevealed(prev => !prev)}
          />
        </FieldWell>

        <InlineError message={error} />

        {footer}
      </View>
    );
  },
);

PasswordField.displayName = 'PasswordField';

export default React.memo(PasswordField);

const styles = StyleSheet.create({
  icon: {
    marginRight: CART_SPACING.sm,
  },
  input: {
    flex: 1,
    ...CART_TYPE.bodyStrong,
    color: CART_COLORS.textPrimary,
    letterSpacing: 1.2,
    paddingVertical: CART_SPACING.sm,
    paddingRight: CART_SPACING.sm,
    bottom: Platform.OS === 'ios' ? hp(0.2) : 0,
    includeFontPadding: false,
  },
});
