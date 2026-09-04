import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppText } from '../../../../components/atoms';
import {
  FieldLabel,
  FieldWell,
  GenderChip,
  InlineError,
  VerifiedPill,
} from './atoms';
import { FOCUS_FADE, GENDER_OPTIONS } from './constants';
import {
  UI_COLORS,
  UI_RADIUS,
  UI_SPACING,
  UI_TYPE,
  MAX_FONT_SCALE,
  hitSlopTo,
  wp,
} from '../../../../theme/tokens';

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
      ? UI_COLORS.danger
      : !editable
      ? UI_COLORS.textFaint
      : focused
      ? UI_COLORS.textSecondary
      : UI_COLORS.textMuted;

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
            placeholderTextColor={UI_COLORS.textFaint}
            selectionColor={UI_COLORS.textSecondary}
            onFocus={handleFocus}
            onBlur={handleBlur}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
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
                  color={UI_COLORS.textFaint}
                  style={styles.trailing}
                />
              )
            ))}

          {!!onChangePress && (
            <TouchableOpacity
              onPress={onChangePress}
              activeOpacity={0.7}
              hitSlop={hitSlopTo(24)}
              style={styles.changeBtn}
              accessibilityRole="button"
              accessibilityLabel={`${changeLabel} ${label}`}
            >
              <AppText variant="captionStrong" tone="brand">
                {changeLabel}
              </AppText>
            </TouchableOpacity>
          )}
        </FieldWell>

        {error ? (
          <InlineError message={error} />
        ) : (
          !!hint && (
            <AppText variant="caption" tone="faint" style={styles.hint}>
              {hint}
            </AppText>
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
        color={UI_COLORS.textMuted}
        style={styles.icon}
      />
      <AppText variant="bodyStrong" style={styles.dateText}>
        {value.toLocaleDateString('en-GB')}
      </AppText>
      <MaterialCommunityIcons
        name="chevron-down"
        size={ICON_SIZE}
        color={UI_COLORS.textFaint}
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
      size={wp('3.8%')}
      color={UI_COLORS.textMuted}
      style={styles.noteIcon}
    />
    <AppText variant="micro" tone="muted" style={styles.noteText}>
      {children}
    </AppText>
  </View>
);

const styles = StyleSheet.create({
  icon: {
    marginRight: UI_SPACING.md,
  },
  input: {
    flex: 1,
    ...UI_TYPE.bodyStrong,
    color: UI_COLORS.textPrimary,
    paddingVertical: UI_SPACING.md,
    includeFontPadding: false,
  },
  inputLocked: {
    color: UI_COLORS.textMuted,
  },
  trailing: {
    marginLeft: UI_SPACING.sm,
  },
  changeBtn: {
    marginLeft: UI_SPACING.sm,
  },
  hint: {
    marginTop: UI_SPACING.sm - 2,
  },
  dateWell: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: wp('12%'),
    borderRadius: UI_RADIUS.input,
    borderWidth: 1,
    borderColor: UI_COLORS.border,
    backgroundColor: UI_COLORS.well,
    paddingHorizontal: UI_SPACING.md,
    paddingVertical: UI_SPACING.md,
  },
  dateText: {
    flex: 1,
    letterSpacing: 1.2,
  },
  genderRow: {
    flexDirection: 'row',
    gap: UI_SPACING.sm,
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
});
