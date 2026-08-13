import React from 'react';
import { StyleSheet } from 'react-native';
import Surface from '@/screens/cart/components/atoms/Surface';
import SectionHeading from '@/screens/cart/components/atoms/SectionHeading';
import { CART_SPACING } from '@/styles/cartTheme';
import PasswordField from '../molecules/PasswordField';

const CurrentPasswordCard = ({ value, error, onChangeText, onSubmitEditing }) => (
  <Surface style={styles.card}>
    <SectionHeading
      title="Confirm it’s you"
      subtitle="Enter the password you use right now"
    />

    <PasswordField
      label="Current Password"
      icon="lock-outline"
      placeholder="Enter current password"
      value={value}
      error={error}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      textContentType="password"
      autoComplete="current-password"
      returnKeyType="next"
    />
  </Surface>
);

export default React.memo(CurrentPasswordCard);

const styles = StyleSheet.create({
  card: {
    padding: CART_SPACING.lg,
    gap: CART_SPACING.lg,
  },
});
