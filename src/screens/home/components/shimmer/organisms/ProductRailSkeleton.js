import React from 'react';
import { View, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ProductCardBone } from '../molecules';

const CARDS = [0, 1, 2];

const ProductRailSkeleton = ({ style }) => (
  <View style={[styles.row, style]}>
    {CARDS.map(i => (
      <ProductCardBone key={i} />
    ))}
  </View>
);

export default React.memo(ProductRailSkeleton);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingLeft: wp('3.2%'),
    overflow: 'hidden',
  },
});
