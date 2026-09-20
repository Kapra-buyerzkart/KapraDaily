import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { PWD_COLORS, PWD_FONTS, PWD_RADIUS } from '../theme';
import PasswordField from '../molecules/PasswordField';

const CurrentPasswordCard = ({
  value,
  error,
  onChangeText,
  onSubmitEditing,
}) => (
  <View style={styles.card}>
    <View style={styles.headingRow}>
      <View style={styles.headingIcon}>
        <MaterialCommunityIcons
          name="lock-outline"
          size={wp('4.5%')}
          color={PWD_COLORS.emerald}
        />
      </View>
      <View style={styles.headingTextCol}>
        <Text style={styles.headingTitle}>Confirm It’s You</Text>
        <Text style={styles.headingSubtitle}>
          Enter the password you currently use to verify your identity
        </Text>
      </View>
    </View>

    <PasswordField
      label="Current Password"
      icon="lock-outline"
      placeholder="Enter current password"
      value={value}
      error={error}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      textContentType="password"
      autoComplete="current-password"
      returnKeyType="next"
    />
  </View>
);

export default React.memo(CurrentPasswordCard);

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
});
