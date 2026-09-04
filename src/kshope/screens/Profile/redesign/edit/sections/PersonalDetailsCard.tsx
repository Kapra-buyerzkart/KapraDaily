import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Surface, SectionHeading } from '../../../../../components/atoms';
import {
  ProfileTextField,
  DateOfBirthField,
  GenderField,
} from '../fields';
import { UI_SPACING } from '../../../../../theme/tokens';

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
      onSubmitEditing={() => pincodeRef?.current?.focus()}
    />

    <DateOfBirthField value={dob} onPress={onPressDob} />

    <GenderField value={gender} onChange={onChangeGender} />

    <ProfileTextField
      ref={pincodeRef}
      label="Pin Code"
      icon="map-marker-outline"
      placeholder="00 00 00"
      value={pincode}
      onChangeText={onChangePincode}
      error={errors.pincode}
      keyboardType="number-pad"
      maxLength={6}
      returnKeyType="done"
    />
  </Surface>
);

export default React.memo(PersonalDetailsCard);

const styles = StyleSheet.create({
  card: {
    padding: UI_SPACING.lg,
    gap: UI_SPACING.lg,
  },
});
