import React, { forwardRef, useState } from 'react';
import { View, StyleSheet, TextInput, Platform } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { PWD_COLORS, PWD_FONTS } from '../theme';
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
      ? PWD_COLORS.danger
      : success
      ? PWD_COLORS.emerald
      : focused
      ? PWD_COLORS.gold
      : PWD_COLORS.textMuted;

    return (
      <View>
        <FieldLabel>{label}</FieldLabel>

        <FieldWell focus={focus} error={error} success={success}>
          <MaterialCommunityIcons
            name={success && !error ? 'check-circle-outline' : icon}
            size={wp('4.5%')}
            color={iconColor}
            style={styles.icon}
          />

          <TextInput
            ref={ref}
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor={PWD_COLORS.textFaint}
            secureTextEntry={!revealed}
            autoCapitalize="none"
            autoCorrect={false}
            selectionColor={PWD_COLORS.gold}
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
    marginRight: wp('2.5%'),
  },
  input: {
    flex: 1,
    fontFamily: PWD_FONTS.bodyMedium,
    fontSize: wp('3.8%'),
    color: PWD_COLORS.textPrimary,
    letterSpacing: 1.2,
    paddingVertical: hp('1%'),
    paddingRight: wp('2%'),
    bottom: Platform.OS === 'ios' ? hp('0.2%') : 0,
    includeFontPadding: false,
  },
});
