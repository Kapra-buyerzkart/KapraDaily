import React from 'react';
import { View } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ShimmerPlaceholder from '../../../components/ShimmerPlaceholder';
import sectionCardStyles from './sectionCardStyles';

const ProductBlockShimmer = () => (
  <View style={sectionCardStyles.headerBackgroundbg}>
    <View style={{ paddingHorizontal: wp('5%'), paddingTop: hp('2%') }}>
      <ShimmerPlaceholder
        style={{
          width: wp('40%'),
          height: hp('3%'),
          borderRadius: 5,
          marginBottom: hp('2%'),
        }}
      />
      <View style={{ flexDirection: 'row' }}>
        {[1, 2, 3].map((_, i) => (
          <View
            key={i}
            style={{
              width: wp('35%'),
              height: hp('22%'),
              backgroundColor: '#F3F4F6',
              borderRadius: 20,
              marginRight: wp('4%'),
              overflow: 'hidden',
            }}
          >
            <ShimmerPlaceholder style={{ width: '100%', height: '100%' }} />
          </View>
        ))}
      </View>
    </View>
  </View>
);

export default ProductBlockShimmer;
