import React from 'react';
import { Text, TextInput, View } from 'react-native';
import type { StyleProp, TextInputProps, TextStyle } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import {
  styles,
  FIELD_COLORS,
  FIELD_REST_INK,
  FIELD_FOCUS_INK,
  LOCKED_INK,
  ERROR_INK,
  VERIFIED_TEXT,
} from '../styles';
import { INK, MAX_FONT_SCALE } from '@/styles/homeTheme';

const FOCUS_FADE = { duration: 160 };
const ICON_SIZE = wp('4.6%');
export type ProfileTextFieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  value: string;
  icon?: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  editable?: boolean;
  verified?: boolean;
  inputStyle?: StyleProp<TextStyle>;
};

const ProfileTextField = React.forwardRef<TextInput, ProfileTextFieldProps>(
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

    const wellStyle = useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(
        focus.value,
        [0, 1],
        [FIELD_COLORS.restFill, FIELD_COLORS.focusFill],
      ),
      borderColor: interpolateColor(
        focus.value,
        [0, 1],
        [FIELD_COLORS.restBorder, FIELD_COLORS.focusBorder],
      ),
    }));

    const handleFocus: TextInputProps['onFocus'] = event => {
      setFocused(true);
      focus.value = withTiming(1, FOCUS_FADE);
      onFocus?.(event);
    };

    const handleBlur: TextInputProps['onBlur'] = event => {
      setFocused(false);
      focus.value = withTiming(0, FOCUS_FADE);
      onBlur?.(event);
    };

    const iconColor = error
      ? ERROR_INK
      : !editable
      ? LOCKED_INK
      : focused
      ? FIELD_FOCUS_INK
      : FIELD_REST_INK;

    return (
      <View style={styles.field}>
        <View style={styles.fieldLabelRow}>
          <Text
            style={styles.fieldLabel}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {label}
          </Text>
          {!!optional && (
            <Text
              style={styles.fieldOptional}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              Optional
            </Text>
          )}
        </View>

        <Animated.View
          style={[
            styles.fieldWell,
            editable ? wellStyle : styles.fieldWellLocked,
            !!error && styles.fieldWellError,
          ]}
        >
          {!!icon && (
            <MaterialCommunityIcons
              name={icon}
              size={ICON_SIZE}
              color={iconColor}
              style={styles.fieldIcon}
            />
          )}

          <TextInput
            ref={ref}
            style={[
              styles.fieldInput,
              !editable && styles.fieldInputLocked,
              inputStyle,
            ]}
            value={value}
            editable={editable}
            placeholderTextColor={INK.faint}
            onFocus={handleFocus}
            onBlur={handleBlur}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
            {...inputProps}
          />

          {!editable &&
            (verified ? (
              <View style={styles.verifiedPill}>
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={wp('3.2%')}
                  color={VERIFIED_TEXT}
                />
                <Text
                  style={styles.verifiedPillText}
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                >
                  Verified
                </Text>
              </View>
            ) : (
              <MaterialCommunityIcons
                name="lock-outline"
                size={ICON_SIZE}
                color={LOCKED_INK}
                style={styles.fieldTrailing}
              />
            ))}
        </Animated.View>

        {}
        {error ? (
          <View style={styles.fieldErrorRow}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={wp('3.4%')}
              color={ERROR_INK}
            />
            <Text
              style={styles.fieldErrorText}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {error}
            </Text>
          </View>
        ) : (
          !!hint && (
            <Text
              style={styles.fieldHint}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {hint}
            </Text>
          )
        )}
      </View>
    );
  },
);

ProfileTextField.displayName = 'ProfileTextField';

export default ProfileTextField;
