import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ShimmerPlaceholder from './ShimmerPlaceholder';

const ProductCardShimmer = () => (
  <View style={styles.shimmerCardContainer}>
    <View style={styles.shimmerImageWrapper}>
      <ShimmerPlaceholder
        style={{ width: wp('28%'), height: wp('26%'), borderRadius: 8 }}
      />
    </View>
    <View style={styles.shimmerBottomSection}>
      <ShimmerPlaceholder
        style={{
          width: wp('16%'),
          height: hp('1.8%'),
          borderRadius: 4,
          marginBottom: hp('0.8%'),
        }}
      />
      <ShimmerPlaceholder
        style={{
          width: wp('30%'),
          height: hp('1.6%'),
          borderRadius: 4,
          marginBottom: hp('0.5%'),
        }}
      />
      <ShimmerPlaceholder
        style={{
          width: wp('20%'),
          height: hp('1.6%'),
          borderRadius: 4,
          marginBottom: hp('0.5%'),
        }}
      />
      <ShimmerPlaceholder
        style={{ width: wp('14%'), height: hp('1.4%'), borderRadius: 4 }}
      />
    </View>
  </View>
);

const CategoryProductGridShimmer = ({ rows = 3 }) => (
  <View style={styles.shimmerGrid}>
    {Array.from({ length: rows * 2 }).map((_, i) => (
      <ProductCardShimmer key={i} />
    ))}
  </View>
);

export default CategoryProductGridShimmer;

const styles = StyleSheet.create({
  shimmerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  shimmerCardContainer: {
    width: wp('33%'),
    marginHorizontal: wp('1%'),
    marginVertical: hp('0.8%'),
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  shimmerImageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.2%'),
    paddingTop: hp('1.5%'),
  },
  shimmerBottomSection: {
    padding: hp(1),
  },
});
