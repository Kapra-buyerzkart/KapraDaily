import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ShimmerPlaceholder from '../../../components/ShimmerPlaceholder';
import { RADIUS, SPACE, GUTTER } from '@/styles/homeTheme';

const SeasonalBannerShimmer = () => (
  <View style={styles.container}>
    <View style={styles.header}>
      <ShimmerPlaceholder style={styles.title} />
    </View>
    <View style={styles.row}>
      {[0, 1].map(i => (
        <ShimmerPlaceholder key={i} style={styles.banner} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACE.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SPACE.sm,
  },
  title: {
    width: wp('40%'),
    height: hp('2.5%'),
    borderRadius: 6,
    marginLeft: GUTTER,
  },
  row: {
    flexDirection: 'row',
    marginLeft: GUTTER,
  },
  banner: {
    width: wp('74.88%'),
    height: hp('19.35%'),
    borderRadius: RADIUS.lg,
    marginRight: wp('5%'),
  },
});

export default SeasonalBannerShimmer;
