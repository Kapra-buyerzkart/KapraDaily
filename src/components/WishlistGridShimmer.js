import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ShimmerPlaceholder from './ShimmerPlaceholder';

const WishlistCardShimmer = () => (
  <View style={styles.cardContainer}>
    <View style={styles.cardSurface}>
      <View style={styles.topCardBox}>
        <View style={styles.topRow}>
          <ShimmerPlaceholder style={styles.heartPlaceholder} />
        </View>
      </View>

      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          <ShimmerPlaceholder style={styles.imagePlaceholder} />
          <ShimmerPlaceholder style={styles.actionPlaceholder} />
        </View>

        <View style={styles.bottomSection}>
          <ShimmerPlaceholder style={styles.pricePlaceholder} />
          <ShimmerPlaceholder style={styles.offerPlaceholder} />
          <ShimmerPlaceholder style={styles.nameLinePlaceholder} />
          <ShimmerPlaceholder style={styles.nameLineShortPlaceholder} />
          <ShimmerPlaceholder style={styles.weightPlaceholder} />
        </View>
      </View>
    </View>
  </View>
);

const WishlistGridShimmer = ({ rows = 3 }) => (
  <View style={styles.grid}>
    {Array.from({ length: rows * 3 }).map((_, i) => (
      <WishlistCardShimmer key={i} />
    ))}
  </View>
);

export default WishlistGridShimmer;

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: wp('1%'),
  },
  cardContainer: {
    width: wp('29%'),
    marginHorizontal: wp('1%'),
    marginVertical: hp('1%'),
  },
  cardSurface: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  topCardBox: {
    paddingVertical: hp('0.5%'),
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: wp('2%'),
  },
  heartPlaceholder: {
    width: wp('4.6%'),
    height: wp('4.6%'),
    borderRadius: wp('2.3%'),
  },
  imageContainer: {
    marginTop: hp('0.5%'),
    paddingHorizontal: wp('2%'),
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.2%'),
  },
  imagePlaceholder: {
    width: wp('22%'),
    height: wp('20%'),
    borderRadius: 10,
  },
  actionPlaceholder: {
    position: 'absolute',
    right: 3,
    bottom: 0,
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: 8,
  },
  bottomSection: {
    padding: hp(1),
  },
  pricePlaceholder: {
    width: wp('12%'),
    height: hp('1.8%'),
    borderRadius: 4,
    marginBottom: hp('0.6%'),
  },
  offerPlaceholder: {
    width: wp('16%'),
    height: hp('1.4%'),
    borderRadius: 4,
    marginBottom: hp('0.6%'),
  },
  nameLinePlaceholder: {
    width: '100%',
    height: hp('1.4%'),
    borderRadius: 4,
    marginBottom: hp('0.4%'),
  },
  nameLineShortPlaceholder: {
    width: '70%',
    height: hp('1.4%'),
    borderRadius: 4,
    marginBottom: hp('0.6%'),
  },
  weightPlaceholder: {
    width: wp('14%'),
    height: hp('1.2%'),
    borderRadius: 4,
  },
});
