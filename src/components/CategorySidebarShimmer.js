import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ShimmerPlaceholder from './ShimmerPlaceholder';

const SidebarItemShimmer = () => (
  <View style={styles.itemContainer}>
    <ShimmerPlaceholder style={styles.circle} />
    <ShimmerPlaceholder style={styles.label} />
  </View>
);

const CategorySidebarShimmer = ({ count = 8 }) => (
  <View style={styles.list}>
    {Array.from({ length: count }).map((_, i) => (
      <SidebarItemShimmer key={i} />
    ))}
  </View>
);

export default CategorySidebarShimmer;

const styles = StyleSheet.create({
  list: {
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('1.5%'),
  },
  itemContainer: {
    borderRadius: 20,
    paddingVertical: hp('1.3%'),
    marginBottom: hp('1.4%'),
    alignItems: 'center',
  },
  circle: {
    width: wp('11%'),
    height: wp('11%'),
    borderRadius: 14,
    marginBottom: hp('0.8%'),
  },
  label: {
    width: '70%',
    height: hp('1.3%'),
    borderRadius: 4,
  },
});
