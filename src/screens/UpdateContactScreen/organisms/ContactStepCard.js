import React from 'react';
import { View, StyleSheet } from 'react-native';
import Surface from '@/screens/cart/components/atoms/Surface';
import Divider from '@/screens/cart/components/atoms/Divider';
import SectionHeading from '@/screens/cart/components/atoms/SectionHeading';
import { CART_SPACING } from '@/styles/cartTheme';
import ContactField from '../molecules/ContactField';
import CurrentContactRow from '../molecules/CurrentContactRow';
import InfoNote from '../molecules/InfoNote';

const ContactStepCard = ({
  isPhone,
  value,
  originalValue,
  error,
  onChangeText,
  onSubmitEditing,
}) => (
  <Surface style={styles.card}>
    <SectionHeading
      title={`New ${isPhone ? 'number' : 'email'}`}
      subtitle={`We’ll send a one-time code to confirm it’s yours`}
    />

    {!!originalValue && (
      <>
        <View style={styles.currentBlock}>
          <CurrentContactRow isPhone={isPhone} value={originalValue} />
        </View>
        <Divider />
      </>
    )}

    <View style={styles.fieldBlock}>
      <ContactField
        isPhone={isPhone}
        value={value}
        error={error}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
      />
    </View>

    <InfoNote>
      {isPhone
        ? 'Your new number becomes your login and where order updates are sent.'
        : 'Your new email becomes your login and where receipts are sent.'}
    </InfoNote>
  </Surface>
);

export default React.memo(ContactStepCard);

const styles = StyleSheet.create({
  card: {
    padding: CART_SPACING.lg,
    gap: CART_SPACING.lg,
  },
  currentBlock: {
    marginBottom: CART_SPACING.lg,
  },
  fieldBlock: {
    marginTop: CART_SPACING.xs,
  },
});
