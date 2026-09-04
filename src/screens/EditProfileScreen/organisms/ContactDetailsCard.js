import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EditText from '@/screens/cart/components/atoms/CartText';
import { Surface, SectionHeading } from '../atoms';
import ProfileTextField from '../molecules/ProfileTextField';
import InfoNote from '../molecules/InfoNote';
import { CART_COLORS, CART_SPACING, hitSlopTo, wp } from '@/styles/cartTheme';

const ChangeLink = ({ label, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    hitSlop={hitSlopTo(20)}
    style={styles.changeLink}
    accessibilityRole="button"
    accessibilityLabel={label}
  >
    <EditText variant="captionStrong" style={styles.changeLinkText}>
      {label}
    </EditText>
    <MaterialCommunityIcons
      name="chevron-right"
      size={wp('4%')}
      color={CART_COLORS.primary}
    />
  </TouchableOpacity>
);

const ContactDetailsCard = ({ email, phone, onChangeEmail, onChangePhone }) => (
  <Surface style={styles.card}>
    <SectionHeading
      title="Contact details"
      subtitle="Used to sign you in and send order updates"
    />

    <View>
      <ProfileTextField
        label="Email ID"
        icon="email-outline"
        placeholder="Not added yet"
        value={email}
        editable={false}
        verified={!!email}
      />
      {!!onChangeEmail && (
        <ChangeLink label="Update email ID" onPress={onChangeEmail} />
      )}
    </View>

    <View>
      <ProfileTextField
        label="Phone Number"
        icon="phone-outline"
        placeholder="Not added yet"
        value={phone}
        editable={false}
        verified={!!phone}
      />
      {!!onChangePhone && (
        <ChangeLink label="Update phone number" onPress={onChangePhone} />
      )}
    </View>

    <InfoNote>
      These are verified. Changing them needs a one-time code so we can confirm
      it’s you.
    </InfoNote>
  </Surface>
);

export default React.memo(ContactDetailsCard);

const styles = StyleSheet.create({
  card: {
    padding: CART_SPACING.lg,
    gap: CART_SPACING.lg,
  },
  changeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: CART_SPACING.xs,
    marginTop: CART_SPACING.sm,
  },
  changeLinkText: {
    color: CART_COLORS.primary,
  },
});
