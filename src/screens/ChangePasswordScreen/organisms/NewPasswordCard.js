import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { PWD_COLORS, PWD_FONTS, PWD_RADIUS } from '../theme';
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
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <View style={styles.headingIcon}>
          <MaterialCommunityIcons
            name="shield-key-outline"
            size={wp('4.5%')}
            color={PWD_COLORS.emerald}
          />
        </View>
        <View style={styles.headingTextCol}>
          <Text style={styles.headingTitle}>Set a New Password</Text>
          <Text style={styles.headingSubtitle}>
            Choose a unique combination of letters, numbers, and symbols
          </Text>
        </View>
      </View>

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

      <View style={styles.divider} />

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
        You’ll stay signed in on this device. Use your new password the next time
        you sign in anywhere else.
      </InfoNote>
    </View>
  ),
);

NewPasswordCard.displayName = 'NewPasswordCard';

export default React.memo(NewPasswordCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: PWD_COLORS.card,
    borderRadius: PWD_RADIUS.card,
    borderWidth: 1,
    borderColor: PWD_COLORS.border,
    padding: wp('4.5%'),
    gap: hp('1.8%'),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 5,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('0.5%'),
  },
  headingIcon: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    backgroundColor: PWD_COLORS.emeraldTint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  headingTextCol: {
    flex: 1,
  },
  headingTitle: {
    fontFamily: PWD_FONTS.heading,
    fontSize: wp('4.6%'),
    color: PWD_COLORS.textPrimary,
  },
  headingSubtitle: {
    fontFamily: PWD_FONTS.body,
    fontSize: wp('2.8%'),
    color: PWD_COLORS.textMuted,
    marginTop: hp('0.2%'),
    lineHeight: wp('3.8%'),
  },
  divider: {
    height: 1,
    backgroundColor: PWD_COLORS.borderLight,
    marginVertical: hp('0.5%'),
  },
  confirmBlock: {
    marginTop: -hp('0.5%'),
  },
});
