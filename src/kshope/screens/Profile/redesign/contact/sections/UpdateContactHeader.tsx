import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Platform } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { CONTACT_COLORS, CONTACT_FONTS } from '../contactTheme';

interface Props {
  isPhone: boolean;
  step: number;
  totalSteps: number;
  onBack: () => void;
}

const UpdateContactHeader: React.FC<Props> = ({
  isPhone,
  step,
  totalSteps,
  onBack,
}) => (
  <View style={styles.header}>
    <TouchableOpacity
      onPress={onBack}
      style={styles.backBtn}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Feather name="chevron-left" size={wp('5.5%')} color={CONTACT_COLORS.emerald} />
    </TouchableOpacity>

    <View style={styles.titleBlock}>
      <Text style={styles.title} numberOfLines={1}>
        {isPhone ? 'Update Phone' : 'Update Email'}
      </Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {step === 1 ? 'Enter new contact details' : 'Verify with one-time code'}
      </Text>
    </View>

    <View style={styles.stepChip}>
      <Text style={styles.stepChipText}>
        {step}/{totalSteps}
      </Text>
    </View>
  </View>
);

export default React.memo(UpdateContactHeader);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.6%'),
    backgroundColor: CONTACT_COLORS.canvas,
  },
  backBtn: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: CONTACT_COLORS.card,
    borderWidth: 1,
    borderColor: CONTACT_COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp('2%'),
  },
  title: {
    fontFamily: CONTACT_FONTS.title,
    fontSize: wp('5.5%'),
    color: CONTACT_COLORS.emerald,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontFamily: CONTACT_FONTS.body,
    fontSize: wp('2.8%'),
    color: CONTACT_COLORS.textMuted,
    marginTop: hp('0.2%'),
  },
  stepChip: {
    backgroundColor: CONTACT_COLORS.goldTint,
    borderWidth: 1,
    borderColor: CONTACT_COLORS.goldBorder,
    borderRadius: 999,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
  },
  stepChipText: {
    fontFamily: CONTACT_FONTS.bodySemiBold,
    fontSize: wp('2.8%'),
    color: CONTACT_COLORS.gold,
    letterSpacing: 0.5,
  },
});
