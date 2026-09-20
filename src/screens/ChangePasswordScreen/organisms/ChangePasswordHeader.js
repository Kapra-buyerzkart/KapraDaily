import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { PWD_COLORS, PWD_FONTS } from '../theme';

const ChangePasswordHeader = ({ onBack }) => (
  <View style={styles.header}>
    <TouchableOpacity
      onPress={onBack}
      style={styles.backBtn}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Feather name="chevron-left" size={wp('5.5%')} color={PWD_COLORS.emerald} />
    </TouchableOpacity>

    <View style={styles.titleBlock}>
      <Text style={styles.title} numberOfLines={1}>
        Update Password
      </Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        Keep your account safe & secure
      </Text>
    </View>

    <View style={styles.iconCircle}>
      <MaterialCommunityIcons
        name="shield-lock-outline"
        size={wp('4.8%')}
        color={PWD_COLORS.gold}
      />
    </View>
  </View>
);

export default React.memo(ChangePasswordHeader);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.6%'),
    backgroundColor: PWD_COLORS.canvas,
  },
  backBtn: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: PWD_COLORS.card,
    borderWidth: 1,
    borderColor: PWD_COLORS.border,
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
    fontFamily: PWD_FONTS.title,
    fontSize: wp('5.5%'),
    color: PWD_COLORS.emerald,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontFamily: PWD_FONTS.body,
    fontSize: wp('2.8%'),
    color: PWD_COLORS.textMuted,
    marginTop: hp('0.2%'),
  },
  iconCircle: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: PWD_COLORS.goldTint,
    borderWidth: 1,
    borderColor: PWD_COLORS.goldBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
