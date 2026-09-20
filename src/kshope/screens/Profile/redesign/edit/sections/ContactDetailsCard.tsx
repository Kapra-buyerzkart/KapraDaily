import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { EDIT_COLORS, EDIT_FONTS } from '../editTheme';
import { ProfileTextField, InfoNote } from '../fields';

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
  <View style={styles.card}>
    <View style={styles.headingRow}>
      <View style={styles.headingIcon}>
        <MaterialCommunityIcons
          name="shield-account-outline"
          size={wp('4.5%')}
          color={EDIT_COLORS.emerald}
        />
      </View>
      <View style={styles.headingTextCol}>
        <Text style={styles.headingTitle}>Contact Details</Text>
        <Text style={styles.headingSubtitle}>
          Used to sign you in and deliver insured order updates
        </Text>
      </View>
    </View>

    <ProfileTextField
      label="Email Address"
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
      value={phone ? `+91 ${phone}` : ''}
      editable={false}
      verified={!!phone}
      onChangePress={onChangePhone}
      changeLabel={phone ? 'Change' : 'Add'}
    />

    <InfoNote>
      These contact details are verified for your security. Tap Change to update with an OTP.
    </InfoNote>
  </View>
);

export default React.memo(ContactDetailsCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: EDIT_COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: EDIT_COLORS.border,
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
    backgroundColor: EDIT_COLORS.emeraldTint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  headingTextCol: {
    flex: 1,
  },
  headingTitle: {
    fontFamily: EDIT_FONTS.heading,
    fontSize: wp('4.6%'),
    color: EDIT_COLORS.textPrimary,
  },
  headingSubtitle: {
    fontFamily: EDIT_FONTS.body,
    fontSize: wp('2.8%'),
    color: EDIT_COLORS.textMuted,
    marginTop: hp('0.2%'),
  },
});
