import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { PWD_COLORS, PWD_FONTS } from '../theme';

const RuleChecklist = ({ checks }) => (
  <View style={styles.list}>
    {checks.map(check => (
      <View key={check.key} style={styles.row}>
        <MaterialCommunityIcons
          name={check.passed ? 'check-circle' : 'circle-outline'}
          size={wp('3.6%')}
          color={check.passed ? PWD_COLORS.emerald : PWD_COLORS.textFaint}
        />
        <Text
          style={[
            styles.label,
            {
              color: check.passed ? PWD_COLORS.emerald : PWD_COLORS.textMuted,
              fontFamily: check.passed ? PWD_FONTS.bodyMedium : PWD_FONTS.body,
            },
          ]}
        >
          {check.label}
        </Text>
      </View>
    ))}
  </View>
);

export default React.memo(RuleChecklist);

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('3%'),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
  },
  label: {
    fontSize: wp('2.8%'),
  },
});
