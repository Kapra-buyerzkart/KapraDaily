import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Divider, SectionHeading } from '../../../../../components/atoms';
import { UI_SPACING } from '../../../../../theme/tokens';
import { OtpGroup, ResendRow, InfoNote } from '../fields';
import { OTP_LENGTH } from '../constants';

interface Props {
  isPhone: boolean;
  value: string;
  otp: string[];
  otpRefs: React.MutableRefObject<any[]>;
  error?: string | null;
  timer: number;
  canResend: boolean;
  onChangeDigit: (text: string, index: number) => void;
  onKeyPress: (event: any, index: number) => void;
  onResend: () => void;
  onEdit: () => void;
}

const VerifyStepCard: React.FC<Props> = ({
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
    padding: UI_SPACING.lg,
    gap: UI_SPACING.lg,
  },
  actions: {
    marginVertical: -UI_SPACING.xs,
  },
});
