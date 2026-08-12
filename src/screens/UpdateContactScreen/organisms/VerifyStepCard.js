import React from 'react';
import { View, StyleSheet } from 'react-native';
import Surface from '@/screens/cart/components/atoms/Surface';
import Divider from '@/screens/cart/components/atoms/Divider';
import SectionHeading from '@/screens/cart/components/atoms/SectionHeading';
import { CART_SPACING } from '@/styles/cartTheme';
import OtpGroup from '../molecules/OtpGroup';
import ResendRow from '../molecules/ResendRow';
import InfoNote from '../molecules/InfoNote';
import { OTP_LENGTH } from '../constants';

const VerifyStepCard = ({
  isPhone,
  value,
  otp,
  otpRefs,
  error,
  timer,
  canResend,
  onChangeDigit,
  onKeyPress,
  onResend,
  onEdit,
}) => (
  <Surface style={styles.card}>
    <SectionHeading
      title="Verify it’s you"
      subtitle={`Sent to ${isPhone ? `+91 ${value}` : value}`}
    />

    <OtpGroup
      isPhone={isPhone}
      otp={otp}
      otpRefs={otpRefs}
      error={error}
      onChangeDigit={onChangeDigit}
      onKeyPress={onKeyPress}
    />

    <Divider />

    <View style={styles.actions}>
      <ResendRow
        isPhone={isPhone}
        canResend={canResend}
        timer={timer}
        onResend={onResend}
        onEdit={onEdit}
      />
    </View>

    <InfoNote icon="lock-outline">
      Never share this {OTP_LENGTH}-digit code with anyone, including our
      support team.
    </InfoNote>
  </Surface>
);

export default React.memo(VerifyStepCard);

const styles = StyleSheet.create({
  card: {
    padding: CART_SPACING.lg,
    gap: CART_SPACING.lg,
  },
  actions: {
    marginVertical: -CART_SPACING.xs,
  },
});
