import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  FieldLabel,
  FieldWell,
  GenderChip,
  InlineError,
  VerifiedPill,
} from './atoms';
import { FOCUS_FADE, GENDER_OPTIONS } from './constants';
import { EDIT_COLORS, EDIT_FONTS } from './editTheme';

const ICON_SIZE = wp('4.4%');

export interface ProfileTextFieldProps extends TextInputProps {
  label: string;
  icon?: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  verified?: boolean;
  inputStyle?: StyleProp<TextStyle>;
  onChangePress?: () => void;
  changeLabel?: string;
}

export const ProfileTextField = React.forwardRef<
  TextInput,
  ProfileTextFieldProps
>(
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
      onChangePress,
      changeLabel = 'Change',
      onFocus,
      onBlur,
      ...inputProps
    },
    ref,
  ) => {
    const [focused, setFocused] = React.useState(false);
    const focus = useSharedValue(0);

    const handleFocus = (event: any) => {
      setFocused(true);
      focus.value = withTiming(1, FOCUS_FADE);
      onFocus?.(event);
    };

    const handleBlur = (event: any) => {
      setFocused(false);
      focus.value = withTiming(0, FOCUS_FADE);
      onBlur?.(event);
    };

    const iconColor = error
      ? EDIT_COLORS.danger
      : !editable
      ? EDIT_COLORS.textFaint
      : focused
      ? EDIT_COLORS.gold
      : EDIT_COLORS.textMuted;

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
            style={[styles.input, !editable && styles.inputLocked, inputStyle]}
            value={value}
            editable={editable}
            placeholderTextColor={EDIT_COLORS.textFaint}
            selectionColor={EDIT_COLORS.gold}
            onFocus={handleFocus}
            onBlur={handleBlur}
            maxFontSizeMultiplier={1.3}
            {...inputProps}
          />

          {!editable &&
            (verified ? (
              <VerifiedPill />
            ) : (
              !onChangePress && (
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={ICON_SIZE}
                  color={EDIT_COLORS.textFaint}
                  style={styles.trailing}
                />
              )
            ))}

          {!!onChangePress && (
            <TouchableOpacity
              onPress={onChangePress}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.changeBtn}
              accessibilityRole="button"
              accessibilityLabel={`${changeLabel} ${label}`}
            >
              <Text style={styles.changeBtnText}>
                {changeLabel}
              </Text>
            </TouchableOpacity>
          )}
        </FieldWell>

        {error ? (
          <InlineError message={error} />
        ) : (
          !!hint && (
            <Text style={styles.hint}>
              {hint}
            </Text>
          )
        )}
      </View>
    );
  },
);

ProfileTextField.displayName = 'ProfileTextField';

export const DateOfBirthField: React.FC<{
  value: Date;
  onPress: () => void;
}> = ({ value, onPress }) => (
  <View>
    <FieldLabel optional>Date of Birth</FieldLabel>

    <TouchableOpacity
      style={styles.dateWell}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel="Select date of birth"
    >
      <MaterialCommunityIcons
        name="cake-variant-outline"
        size={ICON_SIZE}
        color={EDIT_COLORS.emerald}
        style={styles.icon}
      />
      <Text style={styles.dateText}>
        {value.toLocaleDateString('en-GB')}
      </Text>
      <MaterialCommunityIcons
        name="chevron-down"
        size={ICON_SIZE}
        color={EDIT_COLORS.textMuted}
      />
    </TouchableOpacity>
  </View>
);

export const GenderField: React.FC<{
  value: string;
  onChange: (next: string) => void;
}> = ({ value, onChange }) => (
  <View>
    <FieldLabel optional>Gender</FieldLabel>

    <View style={styles.genderRow} accessibilityRole="radiogroup">
      {GENDER_OPTIONS.map(item => (
        <GenderChip
          key={item}
          label={item}
          selected={value === item}
          onPress={() => onChange(item)}
        />
      ))}
    </View>
  </View>
);

export const InfoNote: React.FC<{
  icon?: string;
  children: React.ReactNode;
}> = ({ icon = 'shield-check-outline', children }) => (
  <View style={styles.noteRow}>
    <MaterialCommunityIcons
      name={icon}
      size={wp('4.2%')}
      color={EDIT_COLORS.gold}
      style={styles.noteIcon}
    />
    <Text style={styles.noteText}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  icon: {
    marginRight: wp('2.5%'),
  },
  input: {
    flex: 1,
    fontFamily: EDIT_FONTS.bodyMedium,
    fontSize: wp('3.8%'),
    color: EDIT_COLORS.textPrimary,
    paddingVertical: hp('1%'),
    includeFontPadding: false,
  },
  inputLocked: {
    color: EDIT_COLORS.textMuted,
  },
  trailing: {
    marginLeft: wp('2%'),
  },
  changeBtn: {
    backgroundColor: EDIT_COLORS.emeraldTint,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(12, 56, 46, 0.15)',
    marginLeft: wp('2%'),
  },
  changeBtnText: {
    fontFamily: EDIT_FONTS.bodySemiBold,
    fontSize: wp('3%'),
    color: EDIT_COLORS.emerald,
  },
  hint: {
    fontFamily: EDIT_FONTS.body,
    fontSize: wp('2.8%'),
    color: EDIT_COLORS.textFaint,
    marginTop: hp('0.5%'),
  },
  dateWell: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: hp('6.2%'),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: EDIT_COLORS.border,
    backgroundColor: EDIT_COLORS.well,
    paddingHorizontal: wp('3.5%'),
  },
  dateText: {
    flex: 1,
    fontFamily: EDIT_FONTS.bodyMedium,
    fontSize: wp('3.8%'),
    color: EDIT_COLORS.textPrimary,
    letterSpacing: 1.2,
  },
  genderRow: {
    flexDirection: 'row',
    gap: wp('2%'),
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wp('2.5%'),
    padding: wp('3.5%'),
    borderRadius: 12,
    backgroundColor: EDIT_COLORS.goldTint,
    borderWidth: 1,
    borderColor: EDIT_COLORS.goldBorder,
  },
  noteIcon: {
    marginTop: 1,
  },
  noteText: {
    flex: 1,
    fontFamily: EDIT_FONTS.body,
    fontSize: wp('2.9%'),
    color: EDIT_COLORS.textSecondary,
    lineHeight: wp('4.2%'),
  },
});
