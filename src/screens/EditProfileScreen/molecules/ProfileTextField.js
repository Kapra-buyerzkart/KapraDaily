import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EditText from '@/screens/cart/components/atoms/CartText';
import FieldLabel from '../atoms/FieldLabel';
import FieldWell from '../atoms/FieldWell';
import InlineError from '../atoms/InlineError';
import VerifiedPill from '../atoms/VerifiedPill';
import { FOCUS_FADE } from '../constants';
import {
  CART_COLORS,
  CART_SPACING,
  CART_TYPE,
  MAX_FONT_SCALE,
  wp,
} from '@/styles/cartTheme';

const ICON_SIZE = wp('4.4%');

const ProfileTextField = React.forwardRef(
  (
    {
      label,
      value,
      icon,
      optional,
      hint,
      error,
      editable = true,
      verified,
      inputStyle,
      onFocus,
      onBlur,
      ...inputProps
    },
    ref,
  ) => {
    const [focused, setFocused] = React.useState(false);
    const focus = useSharedValue(0);

    const handleFocus = event => {
      setFocused(true);
      focus.value = withTiming(1, FOCUS_FADE);
      onFocus?.(event);
    };

    const handleBlur = event => {
      setFocused(false);
      focus.value = withTiming(0, FOCUS_FADE);
      onBlur?.(event);
    };

    const iconColor = error
      ? CART_COLORS.danger
      : !editable
      ? CART_COLORS.textFaint
      : focused
      ? CART_COLORS.textSecondary
      : CART_COLORS.textMuted;

    return (
      <View>
        <FieldLabel optional={optional}>{label}</FieldLabel>

        <FieldWell focus={focus} error={error} locked={!editable}>
          {!!icon && (
            <MaterialCommunityIcons
              name={icon}
              size={ICON_SIZE}
              color={iconColor}
              style={styles.icon}
            />
          )}

          <TextInput
            ref={ref}
            style={[
              styles.input,
              !editable && styles.inputLocked,
              inputStyle,
            ]}
            value={value}
            editable={editable}
            placeholderTextColor={CART_COLORS.textFaint}
            selectionColor={CART_COLORS.textSecondary}
            onFocus={handleFocus}
            onBlur={handleBlur}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
            {...inputProps}
          />

          {!editable &&
            (verified ? (
              <VerifiedPill />
            ) : (
              <MaterialCommunityIcons
                name="lock-outline"
                size={ICON_SIZE}
                color={CART_COLORS.textFaint}
                style={styles.trailing}
              />
            ))}
        </FieldWell>

        {error ? (
          <InlineError message={error} />
        ) : (
          !!hint && (
            <EditText variant="caption" tone="faint" style={styles.hint}>
              {hint}
            </EditText>
          )
        )}
      </View>
    );
  },
);

ProfileTextField.displayName = 'ProfileTextField';

export default React.memo(ProfileTextField);

const styles = StyleSheet.create({
  icon: {
    marginRight: CART_SPACING.md,
  },
  input: {
    flex: 1,
    ...CART_TYPE.bodyStrong,
    color: CART_COLORS.textPrimary,
    paddingVertical: CART_SPACING.md,
    includeFontPadding: false,
  },
  inputLocked: {
    color: CART_COLORS.textMuted,
  },
  trailing: {
    marginLeft: CART_SPACING.sm,
  },
  hint: {
    marginTop: CART_SPACING.sm - 2,
  },
});
