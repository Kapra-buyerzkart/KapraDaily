import React from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { PWD_COLORS, PWD_FONTS } from '../theme';

const FieldLabel = ({ children, style }) => (
  <Text style={[styles.label, style]}>
    {children}
  </Text>
);

export default React.memo(FieldLabel);

const styles = StyleSheet.create({
  label: {
    fontFamily: PWD_FONTS.bodyMedium,
    fontSize: wp('3%'),
    color: PWD_COLORS.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: hp('0.8%'),
  },
});
