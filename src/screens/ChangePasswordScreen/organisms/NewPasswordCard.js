import React, { forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Surface from '@/screens/cart/components/atoms/Surface';
import Divider from '@/screens/cart/components/atoms/Divider';
import SectionHeading from '@/screens/cart/components/atoms/SectionHeading';
import { CART_SPACING } from '@/styles/cartTheme';
import PasswordField from '../molecules/PasswordField';
import StrengthPanel from '../molecules/StrengthPanel';
import InfoNote from '../molecules/InfoNote';

const NewPasswordCard = forwardRef(
  (
    {
      newPassword,
      confirmPassword,
      reusedError,
      confirmError,
      confirmMatches,
      checks,
      score,
      onChangeNew,
      onChangeConfirm,
      onSubmitNew,
      onSubmitConfirm,
      confirmRef,
    },
    ref,
  ) => (
    <Surface style={styles.card}>
      <SectionHeading
        title="Set a new password"
        subtitle="Pick something you haven’t used elsewhere"
      />

      <PasswordField
        ref={ref}
        label="New Password"
        icon="lock-reset"
        placeholder="Enter new password"
        value={newPassword}
        error={reusedError}
        onChangeText={onChangeNew}
        onSubmitEditing={onSubmitNew}
        textContentType="newPassword"
        autoComplete="new-password"
        returnKeyType="next"
        footer={
          <StrengthPanel
            visible={newPassword.length > 0}
            score={score}
            checks={checks}
          />
        }
      />

      <Divider />

      <View style={styles.confirmBlock}>
        <PasswordField
          ref={confirmRef}
          label="Confirm New Password"
          icon="lock-check-outline"
          placeholder="Re-enter new password"
          value={confirmPassword}
          error={confirmError}
          success={confirmMatches}
          onChangeText={onChangeConfirm}
          onSubmitEditing={onSubmitConfirm}
          textContentType="newPassword"
          autoComplete="new-password"
          returnKeyType="done"
        />
      </View>

      <InfoNote>
        You’ll stay signed in on this device. Use the new password the next time
        you sign in anywhere else.
      </InfoNote>
    </Surface>
  ),
);

NewPasswordCard.displayName = 'NewPasswordCard';

export default React.memo(NewPasswordCard);

const styles = StyleSheet.create({
  card: {
    padding: CART_SPACING.lg,
    gap: CART_SPACING.lg,
  },
  confirmBlock: {
    marginTop: -CART_SPACING.xs,
  },
});
