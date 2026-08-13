import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CART_SPACING } from '@/styles/cartTheme';
import OtpBox from '../atoms/OtpBox';
import FieldLabel from '../atoms/FieldLabel';
import InlineError from '../atoms/InlineError';
import { OTP_LENGTH } from '../constants';

const OtpGroup = ({
  isPhone,
  otp,
  otpRefs,
  error,
  onChangeDigit,
  onKeyPress,
}) => (
  <View>
    <FieldLabel>
      {isPhone ? 'Code sent to phone & WhatsApp' : 'Code sent to your inbox'}
    </FieldLabel>

    <View style={styles.row}>
      {otp.map((digit, index) => (
        <OtpBox
          key={index}
          ref={el => (otpRefs.current[index] = el)}
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
);

export default React.memo(OtpGroup);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: CART_SPACING.sm,
  },
});
