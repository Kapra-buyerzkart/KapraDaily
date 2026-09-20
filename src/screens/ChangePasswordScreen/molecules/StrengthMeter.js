import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { PWD_COLORS, PWD_FONTS } from '../theme';
import MeterSegment from '../atoms/MeterSegment';
import { METER_SEGMENTS, STRENGTH_COPY } from '../constants';

export const strengthInk = score =>
  score <= 1
    ? PWD_COLORS.danger
    : score === 2
    ? PWD_COLORS.gold
    : PWD_COLORS.emerald;

const StrengthMeter = ({ score }) => {
  const ink = strengthInk(score);

  return (
    <View style={styles.row}>
      {Array.from({ length: METER_SEGMENTS }).map((_, index) => (
        <MeterSegment key={index} filled={index < score} ink={ink} />
      ))}

      <Text style={[styles.label, { color: ink }]}>
        {STRENGTH_COPY[score]}
      </Text>
    </View>
  );
};

export default React.memo(StrengthMeter);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    width: wp('18%'),
    textAlign: 'right',
    marginLeft: wp('1%'),
    fontFamily: PWD_FONTS.bodyMedium,
    fontSize: wp('2.8%'),
  },
});
