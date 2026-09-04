import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, SectionHeading } from '../../../../../components/atoms';
import { ProfileTextField, InfoNote } from '../fields';
import { UI_SPACING } from '../../../../../theme/tokens';

interface Props {
  email?: string;
  phone?: string;
  onChangeEmail?: () => void;
  onChangePhone?: () => void;
}

const ContactDetailsCard: React.FC<Props> = ({
  email,
  phone,
  onChangeEmail,
  onChangePhone,
}) => (
  <Surface style={styles.card}>
    <SectionHeading
      title="Contact details"
      subtitle="Used to sign you in and send order updates"
    />

    <ProfileTextField
      label="Email ID"
      icon="email-outline"
      placeholder="Not added yet"
      value={email}
      editable={false}
      verified={!!email}
      onChangePress={onChangeEmail}
      changeLabel={email ? 'Change' : 'Add'}
    />

    <ProfileTextField
      label="Phone Number"
      icon="phone-outline"
      placeholder="Not added yet"
      value={phone}
      editable={false}
      verified={!!phone}
      onChangePress={onChangePhone}
      changeLabel={phone ? 'Change' : 'Add'}
    />

    <InfoNote>
      These are verified. Tap Change and we’ll send an OTP to confirm it’s
      you.
    </InfoNote>
  </Surface>
);

export default React.memo(ContactDetailsCard);

const styles = StyleSheet.create({
  card: {
    padding: UI_SPACING.lg,
    gap: UI_SPACING.lg,
  },
});
