import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { CONTACT_COLORS, CONTACT_FONTS } from './contactTheme';
import { FieldLabel, FieldWell, InlineError, OtpBox } from './atoms';
import { FOCUS_FADE, OTP_LENGTH } from './constants';

interface ContactFieldProps extends TextInputProps {
  isPhone: boolean;
  value: string;
  error?: string | null;
  onChangeText: (text: string) => void;
}

export const ContactField = React.memo(
  ({ isPhone, value, onChangeText, error, ...rest }: ContactFieldProps) => {
    const [focused, setFocused] = useState(false);
    const focus = useSharedValue(0);

    const iconColor = error
      ? CONTACT_COLORS.danger
      : focused
      ? CONTACT_COLORS.gold
      : CONTACT_COLORS.textMuted;

    return (
      <View>
        <FieldLabel>New {isPhone ? 'Phone Number' : 'Email Address'}</FieldLabel>

        <FieldWell focus={focus} error={error}>
          {isPhone ? (
            <View style={styles.prefix}>
              <MaterialCommunityIcons
                name="cellphone"
                size={wp('4.2%')}
                color={iconColor}
              />
              <Text style={styles.prefixText}>+91</Text>
              <View style={styles.prefixRule} />
            </View>
          ) : (
            <MaterialCommunityIcons
              name="email-outline"
              size={wp('4.5%')}
              color={iconColor}
              style={styles.icon}
            />
          )}

          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={isPhone ? '00000 00000' : 'name@example.com'}
            placeholderTextColor={CONTACT_COLORS.textFaint}
            keyboardType={isPhone ? 'phone-pad' : 'email-address'}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={isPhone ? 10 : undefined}
            returnKeyType="done"
            selectionColor={CONTACT_COLORS.gold}
            maxFontSizeMultiplier={1.3}
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
  },
);

export const CurrentContactRow = React.memo(
  ({ isPhone, value }: { isPhone: boolean; value: string }) => (
    <View style={styles.currentRow}>
      <View style={styles.currentIconDisc}>
        <MaterialCommunityIcons
          name={isPhone ? 'phone-outline' : 'email-outline'}
          size={wp('4.5%')}
          color={CONTACT_COLORS.emerald}
        />
      </View>

      <View style={styles.currentCopy}>
        <Text style={styles.currentLabel}>
          {isPhone ? 'CURRENT NUMBER' : 'CURRENT EMAIL'}
        </Text>
        <Text style={styles.currentValue} numberOfLines={1}>
          {isPhone ? `+91 ${value}` : value}
        </Text>
      </View>

      <View style={styles.verifiedBadge}>
        <MaterialCommunityIcons
          name="check-decagram"
          size={wp('3.4%')}
          color={CONTACT_COLORS.emerald}
        />
        <Text style={styles.verifiedText}>Verified</Text>
      </View>
    </View>
  ),
);

export const InfoNote = React.memo(
  ({
    icon = 'shield-check-outline',
    children,
  }: {
    icon?: string;
    children: React.ReactNode;
  }) => (
    <View style={styles.noteRow}>
      <MaterialCommunityIcons
        name={icon}
        size={wp('4.2%')}
        color={CONTACT_COLORS.gold}
        style={styles.noteIcon}
      />
      <Text style={styles.noteText}>{children}</Text>
    </View>
  ),
);

interface OtpGroupProps {
  isPhone: boolean;
  otp: string[];
  otpRefs: React.MutableRefObject<any[]>;
  error?: string | null;
  onChangeDigit: (text: string, index: number) => void;
  onKeyPress: (event: any, index: number) => void;
}

export const OtpGroup = React.memo(
  ({
    isPhone,
    otp,
    otpRefs,
    error,
    onChangeDigit,
    onKeyPress,
  }: OtpGroupProps) => (
    <View>
      <FieldLabel>
        {isPhone ? 'Code sent to phone & WhatsApp' : 'Code sent to your inbox'}
      </FieldLabel>

      <View style={styles.otpRow}>
        {otp.map((digit, index) => (
          <OtpBox
            key={index}
            ref={el => {
              otpRefs.current[index] = el;
            }}
            value={digit}
            error={!!error}
            onChangeText={text => onChangeDigit(text, index)}
            onKeyPress={event => onKeyPress(event, index)}
            accessibilityLabel={`Digit ${index + 1} of ${OTP_LENGTH}`}
          />
        ))}
      </View>

      <InlineError message={error} />
    </View>
  ),
);

interface ResendRowProps {
  isPhone: boolean;
  canResend: boolean;
  timer: number;
  onResend: () => void;
  onEdit: () => void;
}

export const ResendRow = React.memo(
  ({ isPhone, canResend, timer, onResend, onEdit }: ResendRowProps) => (
    <View style={styles.resendRow}>
      {canResend ? (
        <TouchableOpacity
          onPress={onResend}
          activeOpacity={0.7}
          style={styles.chip}
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name="refresh"
            size={wp('3.8%')}
            color={CONTACT_COLORS.emerald}
          />
          <Text style={styles.chipTextActive}>Resend code</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.chip}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={wp('3.8%')}
            color={CONTACT_COLORS.textFaint}
          />
          <Text style={styles.chipTextMuted}>Resend in {timer}s</Text>
        </View>
      )}

      <TouchableOpacity
        onPress={onEdit}
        activeOpacity={0.7}
        style={styles.chip}
        accessibilityRole="button"
      >
        <MaterialCommunityIcons
          name="pencil-outline"
          size={wp('3.8%')}
          color={CONTACT_COLORS.emerald}
        />
        <Text style={styles.chipTextActive}>Edit</Text>
      </TouchableOpacity>
    </View>
  ),
);

ContactField.displayName = 'ContactField';
CurrentContactRow.displayName = 'CurrentContactRow';
InfoNote.displayName = 'InfoNote';
OtpGroup.displayName = 'OtpGroup';
ResendRow.displayName = 'ResendRow';

const styles = StyleSheet.create({
  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: wp('2.5%'),
    gap: wp('1.5%'),
  },
  prefixText: {
    fontFamily: CONTACT_FONTS.bodySemiBold,
    fontSize: wp('3.8%'),
    color: CONTACT_COLORS.textPrimary,
  },
  prefixRule: {
    width: 1,
    height: hp('2.5%'),
    backgroundColor: CONTACT_COLORS.border,
    marginLeft: wp('1.5%'),
  },
  icon: {
    marginRight: wp('2.5%'),
  },
  input: {
    flex: 1,
    fontFamily: CONTACT_FONTS.bodyMedium,
    fontSize: wp('3.8%'),
    color: CONTACT_COLORS.textPrimary,
    paddingVertical: hp('1%'),
  },
  currentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('3.5%'),
    backgroundColor: CONTACT_COLORS.well,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CONTACT_COLORS.borderLight,
    gap: wp('3%'),
  },
  currentIconDisc: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: CONTACT_COLORS.emeraldTint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentCopy: {
    flex: 1,
  },
  currentLabel: {
    fontFamily: CONTACT_FONTS.bodyMedium,
    fontSize: wp('2.6%'),
    color: CONTACT_COLORS.textMuted,
    letterSpacing: 0.6,
  },
  currentValue: {
    fontFamily: CONTACT_FONTS.bodySemiBold,
    fontSize: wp('3.6%'),
    color: CONTACT_COLORS.textPrimary,
    marginTop: hp('0.2%'),
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CONTACT_COLORS.emeraldTint,
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.4%'),
    borderRadius: 999,
    gap: wp('1%'),
  },
  verifiedText: {
    fontFamily: CONTACT_FONTS.bodyMedium,
    fontSize: wp('2.8%'),
    color: CONTACT_COLORS.emerald,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wp('2.5%'),
    padding: wp('3.5%'),
    borderRadius: 12,
    backgroundColor: CONTACT_COLORS.goldTint,
    borderWidth: 1,
    borderColor: CONTACT_COLORS.goldBorder,
  },
  noteIcon: {
    marginTop: 1,
  },
  noteText: {
    flex: 1,
    fontFamily: CONTACT_FONTS.body,
    fontSize: wp('2.9%'),
    color: CONTACT_COLORS.textSecondary,
    lineHeight: wp('4.2%'),
  },
  otpRow: {
    flexDirection: 'row',
    gap: wp('2.5%'),
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('0.5%'),
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.7%'),
    backgroundColor: CONTACT_COLORS.well,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CONTACT_COLORS.borderLight,
    gap: wp('1.5%'),
  },
  chipTextActive: {
    fontFamily: CONTACT_FONTS.bodyMedium,
    fontSize: wp('3%'),
    color: CONTACT_COLORS.emerald,
  },
  chipTextMuted: {
    fontFamily: CONTACT_FONTS.body,
    fontSize: wp('3%'),
    color: CONTACT_COLORS.textFaint,
  },
});
