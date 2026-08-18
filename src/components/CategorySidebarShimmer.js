import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ShimmerPlaceholder from './ShimmerPlaceholder';
import { RADIUS, SPACE, TYPE } from '../styles/homeTheme';

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
    borderRadius: RADIUS.md,
    paddingVertical: SPACE.sm,
    marginBottom: hp('0.6%'),
    alignItems: 'center',
  },
  circle: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: RADIUS.sm,
    marginBottom: SPACE.xs + 2,
  },
  label: {
    width: '74%',
    height: TYPE.micro.lineHeight,
    borderRadius: RADIUS.xxs,
  },
});
