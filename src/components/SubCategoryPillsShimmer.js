import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ShimmerPlaceholder from './ShimmerPlaceholder';
import { RADIUS } from '../styles/homeTheme';
import { PILL_HEIGHT } from './SubCategoryPill';

const PillShimmer = ({ width }) => (
  <ShimmerPlaceholder style={[styles.pill, { width }]} />
);

const SubCategoryPillsShimmer = ({ count = 4 }) => {
  const widths = [wp('22%'), wp('26%'), wp('20%'), wp('24%'), wp('22%')];
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, i) => (
        <PillShimmer key={i} width={widths[i % widths.length]} />
      ))}
    </View>
  );
};

export default SubCategoryPillsShimmer;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingLeft: wp('3%'),
    paddingRight: wp('3%'),
    marginTop: hp('0.8%'),
    paddingBottom: hp('1.5%'),
    gap: wp('2.5%'),
  },
  pill: {
    height: PILL_HEIGHT,
    borderRadius: RADIUS.sm,
  },
});
