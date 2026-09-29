import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ProductRail from '../ProductRail';

const OFFER_SALE_IMAGE = require('@/assets/images/offerSale.png');

const OfferSaleSection = ({ items = [], navigation }) => {
  if (!items || items.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={OFFER_SALE_IMAGE}
          style={styles.headerImage}
          resizeMode="contain"
        />
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
    marginVertical: hp('1.2%'),
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp('0.8%'),
    paddingHorizontal: wp('4%'),
  },
  headerImage: {
    width: wp('82%'),
    height: wp('82%') * (91 / 366),
  },
  railContent: {
    paddingLeft: wp('3.5%'),
    paddingRight: wp('2%'),
  },
});

export default React.memo(OfferSaleSection);
