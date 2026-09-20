import React, { forwardRef } from 'react';
import {
  Platform,
  StyleSheet,
  StyleProp,
  Text,
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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { CONTACT_COLORS, CONTACT_FONTS } from './contactTheme';
import { FOCUS_FADE, OTP_LENGTH } from './constants';

export const FieldLabel: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = React.memo(({ children, style }) => (
  <Text style={[styles.label, style]}>
    {children}
  </Text>
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
      [CONTACT_COLORS.well, CONTACT_COLORS.card],
    ),
    borderColor: interpolateColor(
      focus.value,
      [0, 1],
      [CONTACT_COLORS.border, CONTACT_COLORS.gold],
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
          size={wp('3.6%')}
          color={CONTACT_COLORS.danger}
        />
        <Text style={styles.errorText}>
          {message}
        </Text>
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
        [CONTACT_COLORS.well, CONTACT_COLORS.card],
      ),
      borderColor: interpolateColor(
        focus.value,
        [0, 1],
        [CONTACT_COLORS.border, CONTACT_COLORS.gold],
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
          selectionColor={CONTACT_COLORS.gold}
          maxFontSizeMultiplier={1.3}
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
    fontFamily: CONTACT_FONTS.bodyMedium,
    fontSize: wp('2.9%'),
    color: CONTACT_COLORS.textSecondary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: hp('0.8%'),
  },
  well: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: hp('6.2%'),
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: wp('3.5%'),
  },
  wellError: {
    backgroundColor: CONTACT_COLORS.dangerTint,
    borderColor: CONTACT_COLORS.danger,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
    marginTop: hp('0.8%'),
  },
  errorText: {
    flexShrink: 1,
    fontFamily: CONTACT_FONTS.body,
    fontSize: wp('3%'),
    color: CONTACT_COLORS.danger,
  },
  box: {
    flex: 1,
    height: hp('6.8%'),
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxError: {
    backgroundColor: CONTACT_COLORS.dangerTint,
    borderColor: CONTACT_COLORS.danger,
  },
  otpInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontFamily: CONTACT_FONTS.bodyBold,
    fontSize: wp('5.5%'),
    color: CONTACT_COLORS.textPrimary,
    textAlignVertical: 'center',
    padding: 0,
    includeFontPadding: false,
  },
});
