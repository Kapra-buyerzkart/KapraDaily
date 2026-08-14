import React from 'react';
import { View, StyleSheet } from 'react-native';
import CartText from '../../../cart/components/atoms/CartText';
import PrimaryButton from '../atoms/PrimaryButton';
import FormField from '../molecules/FormField';
import PasswordField from '../molecules/PasswordField';
import PhoneEditChip from '../molecules/PhoneEditChip';
import TermsRow from '../molecules/TermsRow';
import AreaSelectCard from './AreaSelectCard';
import { CART_COLORS, CART_SPACING, hp } from '../../../../styles/cartTheme';

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
}) => (
  <View style={styles.sheet}>
    <View style={styles.grabber} />

    <View style={styles.heading}>
      <CartText variant="title">Create your account</CartText>
      <CartText variant="caption" tone="muted">
        Fields marked <CartText style={styles.star}>*</CartText> are mandatory
      </CartText>
    </View>

    <PhoneEditChip phone={phone} onPress={onEditPhone} />

    <View style={styles.fields}>
      <FormField
        label="Name"
        required
        placeholder="Enter your full name"
        value={name}
        onChangeText={onChangeName}
        autoCapitalize="words"
        returnKeyType="next"
      />

      <FormField
        label="Email ID"
        placeholder="Enter your email ID"
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
        placeholder="00 00 00"
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

    <PrimaryButton label="Continue" loading={loading} onPress={onSubmit} />
  </View>
);

export default React.memo(RegistrationForm);

const styles = StyleSheet.create({
  sheet: {
    gap: CART_SPACING.lg,
    paddingHorizontal: CART_SPACING.lg,
    paddingTop: CART_SPACING.md,
    paddingBottom: hp('4%'),
  },
  grabber: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 999,
    backgroundColor: CART_COLORS.graySoftColor,
  },
  heading: {
    gap: CART_SPACING.xs,
  },
  fields: {
    gap: CART_SPACING.md,
  },
  star: {
    color: CART_COLORS.danger,
  },
});
