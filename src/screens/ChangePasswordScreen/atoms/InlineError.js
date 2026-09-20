import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { PWD_COLORS, PWD_FONTS } from '../theme';

const InlineError = ({ message }) => {
  if (!message) return null;

  return (
    <View style={styles.row}>
      <MaterialCommunityIcons
        name="alert-circle-outline"
        size={wp('3.6%')}
        color={PWD_COLORS.danger}
      />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

export default React.memo(InlineError);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
    marginTop: hp('0.8%'),
  },
  text: {
    flexShrink: 1,
    fontFamily: PWD_FONTS.body,
    fontSize: wp('3%'),
    color: PWD_COLORS.danger,
  },
});
