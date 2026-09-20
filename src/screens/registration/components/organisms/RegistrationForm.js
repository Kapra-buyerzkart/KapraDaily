import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import PrimaryButton from '../atoms/PrimaryButton';
import FormField from '../molecules/FormField';
import PasswordField from '../molecules/PasswordField';
import PhoneEditChip from '../molecules/PhoneEditChip';
import TermsRow from '../molecules/TermsRow';
import AreaSelectCard from './AreaSelectCard';

const RegistrationForm = ({
  phone,
  onEditPhone,
  name,
  onChangeName,
  email,
  onChangeEmail,
  password,
  onChangePassword,
  pincode,
  onChangePincode,
  areas,
  selectedArea,
  onSelectArea,
  termsAccepted,
  onToggleTerms,
  onPressTerms,
  loading,
  onSubmit,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.sheet}>
      <Text style={styles.welcomeText}>Welcome to</Text>
      <Text style={styles.brandTitleText}>Kapra Gold & Diamonds</Text>
      <Text style={styles.subHeaderText}>CREATE YOUR ACCOUNT</Text>

      <View style={styles.titleDivider} />

      <View style={styles.loginRow}>
        <Text style={styles.alreadyHaveText}>Already have an account? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('LoginScreen')}
          activeOpacity={0.7}
        >
          <Text style={styles.loginLinkText}>Log in</Text>
        </TouchableOpacity>
      </View>

      {phone ? <PhoneEditChip phone={phone} onPress={onEditPhone} /> : null}

      <Text style={styles.mandatoryNotice}>
        Fields marked <Text style={styles.star}>*</Text> are mandatory
      </Text>

      <View style={styles.fields}>
        <FormField
          label="Full Name"
          required
          placeholder="Enter your full name"
          value={name}
          onChangeText={onChangeName}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <FormField
          label="Email ID"
          placeholder="Enter your email address"
          value={email}
          onChangeText={onChangeEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />

        <PasswordField
          label="Password"
          required
          placeholder="Create a password"
          value={password}
          onChangeText={onChangePassword}
          returnKeyType="next"
        />

        <FormField
          label="Pincode"
          required
          placeholder="Enter 6-digit pincode"
          value={pincode}
          onChangeText={onChangePincode}
          keyboardType="number-pad"
          maxLength={6}
          returnKeyType="done"
        />

        {areas.length > 0 ? (
          <AreaSelectCard
            areas={areas}
            selectedArea={selectedArea}
            onSelect={onSelectArea}
          />
        ) : null}
      </View>

      <TermsRow
        checked={termsAccepted}
        onToggle={onToggleTerms}
        onPressTerms={onPressTerms}
      />

      <PrimaryButton
        label="Create Account"
        loading={loading}
        onPress={onSubmit}
      />
    </View>
  );
};

export default React.memo(RegistrationForm);

const styles = StyleSheet.create({
  sheet: {
    paddingHorizontal: wp('7%'),
    paddingTop: 8,
    paddingBottom: 36,
  },
  welcomeText: {
    fontFamily: 'CormorantGaramond-Italic',
    fontSize: wp('6.5%'),
    lineHeight: wp('7.8%'),
    color: '#12372A',
    textAlign: 'center',
    marginTop: 4,
  },
  brandTitleText: {
    fontFamily: 'CormorantGaramond-SemiBold',
    fontSize: wp('7.6%'),
    lineHeight: wp('9.2%'),
    color: '#12372A',
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: -0.2,
  },
  subHeaderText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3%'),
    letterSpacing: 2,
    color: '#262626',
    textAlign: 'center',
    marginTop: 12,
  },
  titleDivider: {
    width: wp('44%'),
    height: 1.5,
    backgroundColor: '#1E3E30',
    alignSelf: 'center',
    marginTop: 14,
    marginBottom: 20,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  alreadyHaveText: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.6%'),
    color: '#262626',
  },
  loginLinkText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: wp('3.6%'),
    color: '#165A42',
  },
  mandatoryNotice: {
    fontFamily: 'Lexend-Regular',
    fontSize: 12,
    color: '#666666',
    marginBottom: 14,
  },
  star: {
    color: '#D93025',
  },
  fields: {
    gap: 14,
  },
});
