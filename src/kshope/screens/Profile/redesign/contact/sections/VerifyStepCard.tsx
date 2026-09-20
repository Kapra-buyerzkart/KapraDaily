import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { CONTACT_COLORS, CONTACT_FONTS } from '../contactTheme';
import { OtpGroup, ResendRow, InfoNote } from '../fields';
import { OTP_LENGTH } from '../constants';

interface Props {
  isPhone: boolean;
  value: string;
  otp: string[];
  otpRefs: React.MutableRefObject<any[]>;
  error?: string | null;
  timer: number;
  canResend: boolean;
  onChangeDigit: (text: string, index: number) => void;
  onKeyPress: (event: any, index: number) => void;
  onResend: () => void;
  onEdit: () => void;
}

const VerifyStepCard: React.FC<Props> = ({
  isPhone,
  value,
  otp,
  otpRefs,
  error,
  timer,
  canResend,
  onChangeDigit,
  onKeyPress,
  onResend,
  onEdit,
}) => (
  <View style={styles.card}>
    <View style={styles.headingRow}>
      <View style={styles.headingIcon}>
        <MaterialCommunityIcons
          name="shield-check-outline"
          size={wp('4.5%')}
          color={CONTACT_COLORS.emerald}
        />
      </View>
      <View style={styles.headingTextCol}>
        <Text style={styles.headingTitle}>Verify It’s You</Text>
        <Text style={styles.headingSubtitle}>
          Sent to {isPhone ? `+91 ${value}` : value}
        </Text>
      </View>
    </View>

    <OtpGroup
      isPhone={isPhone}
      otp={otp}
      otpRefs={otpRefs}
      error={error}
      onChangeDigit={onChangeDigit}
      onKeyPress={onKeyPress}
    />

    <View style={styles.divider} />

    <View style={styles.actions}>
      <ResendRow
        isPhone={isPhone}
        canResend={canResend}
        timer={timer}
        onResend={onResend}
        onEdit={onEdit}
      />
    </View>

    <InfoNote icon="lock-outline">
      Never share this {OTP_LENGTH}-digit code with anyone, including our customer support team.
    </InfoNote>
  </View>
);

export default React.memo(VerifyStepCard);

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
  },
  divider: {
    height: 1,
    backgroundColor: CONTACT_COLORS.borderLight,
    marginVertical: hp('0.2%'),
  },
  actions: {
    marginVertical: -hp('0.5%'),
  },
});
