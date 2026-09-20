import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { CONTACT_COLORS, CONTACT_FONTS } from '../contactTheme';
import { ContactField, CurrentContactRow, InfoNote } from '../fields';

interface Props {
  isPhone: boolean;
  value: string;
  originalValue?: string;
  error?: string | null;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
}

const ContactStepCard: React.FC<Props> = ({
  isPhone,
  value,
  originalValue,
  error,
  onChangeText,
  onSubmitEditing,
}) => (
  <View style={styles.card}>
    <View style={styles.headingRow}>
      <View style={styles.headingIcon}>
        <MaterialCommunityIcons
          name={isPhone ? 'cellphone-wireless' : 'email-edit-outline'}
          size={wp('4.5%')}
          color={CONTACT_COLORS.emerald}
        />
      </View>
      <View style={styles.headingTextCol}>
        <Text style={styles.headingTitle}>
          New {isPhone ? 'Phone Number' : 'Email Address'}
        </Text>
        <Text style={styles.headingSubtitle}>
          We’ll send a secure one-time code to confirm your ownership
        </Text>
      </View>
    </View>

    {!!originalValue && (
      <>
        <View style={styles.currentBlock}>
          <CurrentContactRow isPhone={isPhone} value={originalValue} />
        </View>
        <View style={styles.divider} />
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
        ? 'Your new mobile number becomes your primary login and receives instant order notifications.'
        : 'Your new email ID becomes your login identifier and receives invoice confirmations.'}
    </InfoNote>
  </View>
);

export default React.memo(ContactStepCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: CONTACT_COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CONTACT_COLORS.border,
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
    backgroundColor: CONTACT_COLORS.emeraldTint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  headingTextCol: {
    flex: 1,
  },
  headingTitle: {
    fontFamily: CONTACT_FONTS.heading,
    fontSize: wp('4.6%'),
    color: CONTACT_COLORS.textPrimary,
  },
  headingSubtitle: {
    fontFamily: CONTACT_FONTS.body,
    fontSize: wp('2.8%'),
    color: CONTACT_COLORS.textMuted,
    marginTop: hp('0.2%'),
    lineHeight: wp('3.8%'),
  },
  currentBlock: {
    marginBottom: hp('0.5%'),
  },
  divider: {
    height: 1,
    backgroundColor: CONTACT_COLORS.borderLight,
    marginVertical: hp('0.5%'),
  },
  fieldBlock: {
    marginTop: hp('0.2%'),
  },
});
