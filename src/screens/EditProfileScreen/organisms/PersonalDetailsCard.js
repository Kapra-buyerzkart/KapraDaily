import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, SectionHeading } from '../atoms';
import ProfileTextField from '../molecules/ProfileTextField';
import DateOfBirthField from '../molecules/DateOfBirthField';
import GenderField from '../molecules/GenderField';
import { CART_SPACING } from '@/styles/cartTheme';

const PersonalDetailsCard = ({
  fullName,
  onChangeFullName,
  dob,
  onChangeDob,
  gender,
  onChangeGender,
  skId,
  onChangeSkId,
  errors,
  dobRef,
  skIdRef,
}) => (
  <Surface style={styles.card}>
    <SectionHeading
      title="Personal details"
      subtitle="How we address you across orders and offers"
    />

    <ProfileTextField
      label="Full Name"
      icon="account-outline"
      placeholder="Enter your name"
      value={fullName}
      onChangeText={onChangeFullName}
      error={errors.fullName}
      autoCapitalize="words"
      returnKeyType="next"
      onSubmitEditing={() => dobRef?.current?.focus()}
    />

    <DateOfBirthField
      ref={dobRef}
      value={dob}
      onChange={onChangeDob}
      error={errors.dob}
    />

    <GenderField value={gender} onChange={onChangeGender} />

    <ProfileTextField
      ref={skIdRef}
      label="SK Id"
      icon="card-account-details-outline"
      optional
      placeholder="Enter SK Id"
      value={skId}
      onChangeText={onChangeSkId}
      autoCapitalize="characters"
      returnKeyType="done"
    />
  </Surface>
);

export default React.memo(PersonalDetailsCard);

const styles = StyleSheet.create({
  card: {
    padding: CART_SPACING.lg,
    gap: CART_SPACING.lg,
  },
});
