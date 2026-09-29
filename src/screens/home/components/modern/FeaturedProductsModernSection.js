import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '@/styles/typography';
import ProductRail from '../ProductRail';

const FeaturedProductsModernSection = ({
  items = [],
  title = 'Featured Products',
  navigation,
}) => {
  if (!items || items.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <ProductRail
        items={items}
        navigation={navigation}
        contentContainerStyle={styles.railContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp('1.5%'),
  },
  headerRow: {
    paddingHorizontal: wp('4%'),
    marginBottom: hp('1%'),
  },
  title: {
    fontSize: wp('4.4%'),
    fontFamily: FONTS.gilroy.bold,
    color: '#111827',
  },
  railContent: {
    paddingLeft: wp('3.5%'),
    paddingRight: wp('2%'),
  },
});

export default React.memo(FeaturedProductsModernSection);
