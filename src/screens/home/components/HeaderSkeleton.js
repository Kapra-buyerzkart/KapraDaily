import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ShimmerPlaceholder from '../../../components/ShimmerPlaceholder';
import { SEARCH_FIELD, SPACE } from '@/styles/homeTheme';
import { SEARCH_MARGIN_START, SEARCH_HEIGHT } from '../hooks/useHomeAnimations';

const SEARCH_INSET = wp('4.7%');

const HeaderSkeleton = ({ top }) => (
  <View style={[styles.surface, { paddingTop: top }]}>
    <View style={styles.row}>
      <View>
        <ShimmerPlaceholder style={styles.eta} />
        <ShimmerPlaceholder style={styles.address} />
      </View>
      <View style={styles.right}>
        <ShimmerPlaceholder style={styles.coin} />
        <ShimmerPlaceholder style={styles.avatar} />
      </View>
    </View>
    <ShimmerPlaceholder style={styles.search} />
  </View>
);

const styles = StyleSheet.create({
  surface: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    paddingBottom: hp('1%'),
  },
  row: {
    flexDirection: 'row',
    marginLeft: wp('6.9%'),
    marginRight: SEARCH_INSET,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 0 : 5,
  },
  eta: {
    width: wp('22%'),
    height: hp('2.4%'),
    borderRadius: 6,
  },
  address: {
    width: wp('40%'),
    height: hp('1.8%'),
    borderRadius: 6,
    marginTop: hp('0.8%'),
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },
  coin: {
    width: wp('16%'),
    height: hp('3.6%'),
    borderRadius: 20,
  },
  avatar: {
    width: Math.min(wp('14%'), 56),
    height: Math.min(wp('14%'), 56),
    borderRadius: Math.min(wp('14%'), 56) / 2,
  },
  search: {
    marginTop: SEARCH_MARGIN_START,
    height: SEARCH_HEIGHT,
    borderRadius: SEARCH_FIELD.radius,
    marginHorizontal: SEARCH_INSET,
    paddingHorizontal: SPACE.base,
  },
});

export default React.memo(HeaderSkeleton);
