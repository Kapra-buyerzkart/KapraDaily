import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartText from '@/screens/cart/components/atoms/CartText';
import {
  CART_COLORS,
  CART_SPACING,
  CART_TYPE,
  MAX_FONT_SCALE,
  wp,
  hp,
} from '@/styles/cartTheme';
import FieldWell from '../atoms/FieldWell';
import FieldLabel from '../atoms/FieldLabel';
import InlineError from '../atoms/InlineError';
import { FOCUS_FADE } from '../constants';

const ContactField = ({ isPhone, value, onChangeText, error, ...rest }) => {
  const [focused, setFocused] = useState(false);
  const focus = useSharedValue(0);

  const iconColor = error
    ? CART_COLORS.danger
    : focused
    ? CART_COLORS.textSecondary
    : CART_COLORS.textMuted;

  return (
    <View>
      <FieldLabel>New {isPhone ? 'Phone Number' : 'Email ID'}</FieldLabel>

      <FieldWell focus={focus} error={error}>
        {isPhone ? (
          <View style={styles.prefix}>
            <MaterialCommunityIcons
              name="cellphone"
              size={wp('4%')}
              color={iconColor}
            />
            <CartText variant="bodyStrong" tone="secondary">
              +91
            </CartText>
            <View style={styles.prefixRule} />
          </View>
        ) : (
          <MaterialCommunityIcons
            name="email-outline"
            size={wp('4.2%')}
            color={iconColor}
            style={styles.icon}
          />
        )}

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={isPhone ? '00000 00000' : 'name@example.com'}
          placeholderTextColor={CART_COLORS.textFaint}
          keyboardType={isPhone ? 'phone-pad' : 'email-address'}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={isPhone ? 10 : undefined}
          returnKeyType="done"
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
      </FieldWell>

      <InlineError message={error} />
    </View>
  );
};

export default React.memo(ContactField);

const styles = StyleSheet.create({
  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs,
  },
  prefixRule: {
    width: StyleSheet.hairlineWidth,
    height: hp('2.2%'),
    backgroundColor: CART_COLORS.borderStrong,
    marginLeft: CART_SPACING.sm,
    marginRight: CART_SPACING.xs,
  },
  icon: {
    marginRight: CART_SPACING.sm,
  },
  input: {
    flex: 1,
    ...CART_TYPE.bodyStrong,
    lineHeight: undefined,
    color: CART_COLORS.textPrimary,
    letterSpacing: 1,
    paddingVertical: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});
