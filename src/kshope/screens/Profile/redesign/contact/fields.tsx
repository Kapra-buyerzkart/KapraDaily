import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppText, Badge, IconDisc } from '../../../../components/atoms';
import {
  UI_COLORS,
  UI_RADIUS,
  UI_SPACING,
  UI_TYPE,
  MAX_FONT_SCALE,
  hitSlopTo,
  wp,
  hp,
} from '../../../../theme/tokens';
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
      ? UI_COLORS.danger
      : focused
      ? UI_COLORS.textSecondary
      : UI_COLORS.textMuted;

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
              <AppText variant="bodyStrong" tone="secondary">
                +91
              </AppText>
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
            placeholderTextColor={UI_COLORS.textFaint}
            keyboardType={isPhone ? 'phone-pad' : 'email-address'}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={isPhone ? 10 : undefined}
            returnKeyType="done"
            selectionColor={UI_COLORS.textSecondary}
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
  },
);

export const CurrentContactRow = React.memo(
  ({ isPhone, value }: { isPhone: boolean; value: string }) => (
    <View style={styles.currentRow}>
      <IconDisc size={wp('9%')} tone="neutral">
        <MaterialCommunityIcons
          name={isPhone ? 'phone-outline' : 'email-outline'}
          size={wp('4.2%')}
          color={UI_COLORS.textSecondary}
        />
      </IconDisc>

      <View style={styles.currentCopy}>
        <AppText variant="micro" tone="muted">
          {isPhone ? 'CURRENT NUMBER' : 'CURRENT EMAIL'}
        </AppText>
        <AppText variant="labelStrong" numberOfLines={1}>
          {isPhone ? `+91 ${value}` : value}
        </AppText>
      </View>

      <Badge
        tone="success"
        label="Verified"
        icon={
          <MaterialCommunityIcons
            name="check-decagram"
            size={wp('3.2%')}
            color={UI_COLORS.successDeep}
          />
        }
      />
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
        size={wp('3.8%')}
        color={UI_COLORS.textMuted}
        style={styles.noteIcon}
      />
      <AppText variant="micro" tone="muted" style={styles.noteText}>
        {children}
      </AppText>
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
          hitSlop={hitSlopTo(20)}
          style={styles.chip}
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name="refresh"
            size={wp('3.6%')}
            color={UI_COLORS.textSecondary}
          />
          <AppText variant="captionStrong" tone="secondary">
            Resend code
          </AppText>
        </TouchableOpacity>
      ) : (
        <View style={styles.chip}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={wp('3.6%')}
            color={UI_COLORS.textFaint}
          />
          <AppText variant="caption" tone="faint">
            Resend in {timer}s
          </AppText>
        </View>
      )}

      <TouchableOpacity
        onPress={onEdit}
        activeOpacity={0.7}
        hitSlop={hitSlopTo(20)}
        style={styles.chip}
        accessibilityRole="button"
      >
        <MaterialCommunityIcons
          name="pencil-outline"
          size={wp('3.6%')}
          color={UI_COLORS.textSecondary}
        />
        <AppText variant="captionStrong" tone="secondary">
          Edit {isPhone ? 'number' : 'email'}
        </AppText>
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
    gap: UI_SPACING.xs,
  },
  prefixRule: {
    width: StyleSheet.hairlineWidth,
    height: hp('2.2%'),
    backgroundColor: UI_COLORS.borderStrong,
    marginLeft: UI_SPACING.sm,
    marginRight: UI_SPACING.xs,
  },
  icon: {
    marginRight: UI_SPACING.sm,
  },
  input: {
    flex: 1,
    ...UI_TYPE.bodyStrong,
    lineHeight: undefined,
    color: UI_COLORS.textPrimary,
    letterSpacing: 1,
    paddingVertical: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  currentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.md,
  },
  currentCopy: {
    flex: 1,
    gap: 1,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: UI_SPACING.sm,
    padding: UI_SPACING.md,
    borderRadius: UI_RADIUS.sm,
    backgroundColor: UI_COLORS.well,
  },
  noteIcon: {
    marginTop: 1,
  },
  noteText: {
    flex: 1,
    lineHeight: wp('4.4%'),
  },
  otpRow: {
    flexDirection: 'row',
    gap: UI_SPACING.sm,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: UI_SPACING.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.xs,
    backgroundColor: UI_COLORS.well,
    borderRadius: UI_RADIUS.pill,
    paddingHorizontal: UI_SPACING.md,
    paddingVertical: hp('0.7%'),
  },
});
