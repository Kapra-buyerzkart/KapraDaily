import React from 'react';
import { TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { PWD_COLORS, PWD_FONTS, PWD_RADIUS } from '../theme';

const ChangePasswordActionBar = ({ enabled, label, hint, onPress }) => (
  <SafeAreaView edges={['bottom']} style={styles.footer}>
    <TouchableOpacity
      activeOpacity={0.88}
      style={[styles.btn, !enabled && styles.btnDisabled]}
      onPress={onPress}
      disabled={!enabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !enabled }}
      accessibilityHint={enabled ? undefined : hint}
    >
      <MaterialCommunityIcons
        name={enabled ? 'lock-check-outline' : 'lock-outline'}
        size={wp('4.8%')}
        color={enabled ? PWD_COLORS.goldMetallic : PWD_COLORS.textFaint}
      />
      <Text
        style={[styles.btnText, !enabled && styles.btnTextDisabled]}
        numberOfLines={1}
      >
        {enabled ? label : hint}
      </Text>
    </TouchableOpacity>
  </SafeAreaView>
);

export default React.memo(ChangePasswordActionBar);

const styles = StyleSheet.create({
  footer: {
    backgroundColor: PWD_COLORS.card,
    paddingHorizontal: wp('5%'),
    paddingTop: hp('1.5%'),
    borderTopWidth: 1,
    borderTopColor: PWD_COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PWD_COLORS.emerald,
    borderRadius: PWD_RADIUS.button,
    paddingVertical: hp('1.8%'),
    marginBottom: hp('1%'),
    borderWidth: 1,
    borderColor: 'rgba(182, 141, 64, 0.35)',
    ...Platform.select({
      ios: {
        shadowColor: PWD_COLORS.emerald,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  btnDisabled: {
    backgroundColor: PWD_COLORS.well,
    borderColor: PWD_COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnText: {
    fontFamily: PWD_FONTS.bodySemiBold,
    fontSize: wp('4%'),
    color: PWD_COLORS.white,
    marginLeft: wp('2%'),
    letterSpacing: 0.3,
  },
  btnTextDisabled: {
    color: PWD_COLORS.textFaint,
  },
});
