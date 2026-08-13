import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, SectionHeading } from '../atoms';
import ProfileTextField from '../molecules/ProfileTextField';
import InfoNote from '../molecules/InfoNote';
import { CART_SPACING } from '@/styles/cartTheme';

const ContactDetailsCard = ({ email, phone }) => (
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
    />

    <ProfileTextField
      label="Phone Number"
      icon="phone-outline"
      placeholder="Not added yet"
      value={phone}
      editable={false}
      verified={!!phone}
    />

    <InfoNote>
      These are verified. Change them from Security settings so we can confirm
      it’s you.
    </InfoNote>
  </Surface>
);

export default React.memo(ContactDetailsCard);

const styles = StyleSheet.create({
  card: {
    padding: CART_SPACING.lg,
    gap: CART_SPACING.lg,
  },
});
