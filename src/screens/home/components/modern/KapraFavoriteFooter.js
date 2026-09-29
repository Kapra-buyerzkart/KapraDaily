import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '@/styles/typography';

const BASKET_IMAGE = require('@/assets/images/basket_produce.jpg');

const KapraFavoriteFooter = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={BASKET_IMAGE}
            style={styles.basketImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>
          No products in <Text style={styles.titleHighlight}>&apos;Kapra Favorite&apos;</Text>
        </Text>
        <Text style={styles.subtitle}>
          Explore all the exciting deals and order now!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp('4%'),
    marginVertical: hp('2%'),
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFF8F4',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('5%'),
    alignItems: 'center',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    width: wp('26%'),
    height: wp('26%'),
    borderRadius: wp('13%'),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginBottom: hp('1.4%'),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  basketImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: wp('3.8%'),
    fontFamily: FONTS.gilroy.bold,
    color: '#D9531E',
    textAlign: 'center',
    marginBottom: 4,
  },
  titleHighlight: {
    fontFamily: FONTS.gilroy.heavy,
  },
  subtitle: {
    fontSize: wp('3.2%'),
    fontFamily: FONTS.gilroy.medium,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default React.memo(KapraFavoriteFooter);
