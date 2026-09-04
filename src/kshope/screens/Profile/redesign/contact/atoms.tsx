import React, { forwardRef } from 'react';
import {
  Platform,
  StyleSheet,
  StyleProp,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppText } from '../../../../components/atoms';
import {
  UI_COLORS,
  UI_RADIUS,
  UI_SPACING,
  UI_TYPE,
  MAX_FONT_SCALE,
  wp,
  hp,
} from '../../../../theme/tokens';
import { FOCUS_FADE, OTP_LENGTH } from './constants';

export const FieldLabel: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = React.memo(({ children, style }) => (
  <AppText variant="micro" tone="muted" style={[styles.label, style]}>
    {children}
  </AppText>
));

export const FieldWell: React.FC<{
  focus: SharedValue<number>;
  error?: string | null;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}> = React.memo(({ focus, error, style, children }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      focus.value,
      [0, 1],
      [UI_COLORS.well, UI_COLORS.card],
    ),
    borderColor: interpolateColor(
      focus.value,
      [0, 1],
      [UI_COLORS.border, UI_COLORS.borderStrong],
    ),
  }));

  return (
    <Animated.View
      style={[styles.well, animatedStyle, !!error && styles.wellError, style]}
    >
      {children}
    </Animated.View>
  );
});

export const InlineError: React.FC<{ message?: string | null }> = React.memo(
  ({ message }) => {
    if (!message) return null;

    return (
      <View style={styles.errorRow}>
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={wp('3.4%')}
          color={UI_COLORS.danger}
        />
        <AppText variant="caption" tone="danger" style={styles.errorText}>
          {message}
        </AppText>
      </View>
    );
  },
);

interface OtpBoxProps extends TextInputProps {
  value: string;
  error?: boolean;
}

export const OtpBox = React.memo(
  forwardRef<TextInput, OtpBoxProps>(({ value, error, ...rest }, ref) => {
    const focus = useSharedValue(0);

    const boxStyle = useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(
        focus.value,
        [0, 1],
        [UI_COLORS.well, UI_COLORS.card],
      ),
      borderColor: interpolateColor(
        focus.value,
        [0, 1],
        [UI_COLORS.border, UI_COLORS.textSecondary],
      ),
    }));

    return (
      <Animated.View style={[styles.box, boxStyle, !!error && styles.boxError]}>
        <TextInput
          ref={ref}
          style={styles.otpInput}
          value={value}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
          maxLength={OTP_LENGTH}
          selectionColor={UI_COLORS.textSecondary}
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
  }),
);

FieldLabel.displayName = 'FieldLabel';
FieldWell.displayName = 'FieldWell';
InlineError.displayName = 'InlineError';
OtpBox.displayName = 'OtpBox';

const styles = StyleSheet.create({
  label: {
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: UI_SPACING.sm,
  },
  well: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: hp('6%'),
    borderRadius: UI_RADIUS.input,
    borderWidth: 1,
    paddingHorizontal: UI_SPACING.md,
  },
  wellError: {
    backgroundColor: UI_COLORS.dangerTint,
    borderColor: UI_COLORS.danger,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.xs,
    marginTop: UI_SPACING.sm,
  },
  errorText: {
    flexShrink: 1,
  },
  box: {
    flex: 1,
    height: hp('6.4%'),
    borderRadius: UI_RADIUS.input,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxError: {
    backgroundColor: UI_COLORS.dangerTint,
    borderColor: UI_COLORS.danger,
  },
  otpInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    ...UI_TYPE.priceLarge,
    lineHeight: undefined,
    color: UI_COLORS.textPrimary,
    textAlignVertical: 'center',
    padding: 0,
    includeFontPadding: false,
  },
});
