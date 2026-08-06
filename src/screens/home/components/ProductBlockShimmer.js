import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ShimmerPlaceholder from '../../../components/ShimmerPlaceholder';
import { SURFACE, RADIUS, SPACE, GUTTER } from '@/styles/homeTheme';

const ProductBlockShimmer = () => (
  <View style={styles.section}>
    <View style={styles.inner}>
      <ShimmerPlaceholder style={styles.title} />
      <ShimmerPlaceholder style={styles.subtitle} />
      <View style={styles.row}>
        {[1, 2, 3].map((_, i) => (
          <View key={i} style={styles.tile}>
            <ShimmerPlaceholder style={styles.fill} />
          </View>
        ))}
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  section: {
    paddingTop: SPACE.xs,
    paddingBottom: SPACE.sm,
  },
  inner: {
    paddingHorizontal: GUTTER,
    paddingTop: hp('2%'),
  },
  title: {
    width: wp('42%'),
    height: hp('2.4%'),
    borderRadius: 6,
  },
  subtitle: {
    width: wp('28%'),
    height: hp('1.4%'),
    borderRadius: 5,
    marginTop: hp('0.8%'),
    marginBottom: hp('1.8%'),
  },
  row: {
    flexDirection: 'row',
  },
  tile: {
    width: wp('35%'),
    height: hp('22%'),
    backgroundColor: SURFACE.sunken,
    borderRadius: RADIUS.md,
    marginRight: wp('3%'),
    overflow: 'hidden',
  },
  fill: {
    width: '100%',
    height: '100%',
  },
});

export default ProductBlockShimmer;
