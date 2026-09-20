import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { PWD_COLORS, PWD_FONTS, PWD_RADIUS } from '../theme';

const InfoNote = ({ icon = 'shield-check-outline', children }) => (
  <View style={styles.row}>
    <MaterialCommunityIcons
      name={icon}
      size={wp('4.2%')}
      color={PWD_COLORS.gold}
      style={styles.icon}
    />
    <Text style={styles.text}>{children}</Text>
  </View>
);

export default React.memo(InfoNote);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wp('2.5%'),
    padding: wp('3.5%'),
    borderRadius: PWD_RADIUS.sm,
    backgroundColor: PWD_COLORS.goldTint,
    borderWidth: 1,
    borderColor: PWD_COLORS.goldBorder,
  },
  icon: {
    marginTop: 1,
  },
  text: {
    flex: 1,
    fontFamily: PWD_FONTS.body,
    fontSize: wp('2.9%'),
    color: PWD_COLORS.textSecondary,
    lineHeight: wp('4.2%'),
  },
});
