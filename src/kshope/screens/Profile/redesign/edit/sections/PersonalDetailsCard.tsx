import React from 'react';
import { StyleSheet, TextInput, View, Text, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { EDIT_COLORS, EDIT_FONTS } from '../editTheme';
import { ProfileTextField, DateOfBirthField, GenderField } from '../fields';

interface Props {
  fullName: string;
  onChangeFullName: (next: string) => void;
  dob: Date;
  onPressDob: () => void;
  gender: string;
  onChangeGender: (next: string) => void;
  pincode: string;
  onChangePincode: (next: string) => void;
  errors: { fullName?: string; pincode?: string };
  pincodeRef?: React.RefObject<TextInput | null>;
}

const PersonalDetailsCard: React.FC<Props> = ({
  fullName,
  onChangeFullName,
  dob,
  onPressDob,
  gender,
  onChangeGender,
  pincode,
  onChangePincode,
  errors,
  pincodeRef,
}) => (
  <View style={styles.card}>
    <View style={styles.headingRow}>
      <View style={styles.headingIcon}>
        <MaterialCommunityIcons
          name="card-account-details-outline"
          size={wp('4.5%')}
          color={EDIT_COLORS.emerald}
        />
      </View>
      <View style={styles.headingTextCol}>
        <Text style={styles.headingTitle}>Personal Details</Text>
        <Text style={styles.headingSubtitle}>
          How we address you across orders and certificates
        </Text>
      </View>
    </View>

    <ProfileTextField
      label="Full Name"
      icon="account-outline"
      placeholder="Enter your full name"
      value={fullName}
      onChangeText={onChangeFullName}
      error={errors.fullName}
      autoCapitalize="words"
      returnKeyType="next"
      onSubmitEditing={() => pincodeRef?.current?.focus()}
    />

    <DateOfBirthField value={dob} onPress={onPressDob} />

    <GenderField value={gender} onChange={onChangeGender} />

    <ProfileTextField
      ref={pincodeRef}
      label="Pin Code"
      icon="map-marker-outline"
      placeholder="000 000"
      value={pincode}
      onChangeText={onChangePincode}
      error={errors.pincode}
      keyboardType="number-pad"
      maxLength={6}
      returnKeyType="done"
    />
  </View>
);

export default React.memo(PersonalDetailsCard);

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
