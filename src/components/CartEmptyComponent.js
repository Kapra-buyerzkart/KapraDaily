import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import { useNavigation } from '@react-navigation/native';
import images from '../assets/images';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CartHeader from '../screens/cart/components/CartHeader';

const CartEmptyComponent = ({
  showHeader = true,
  itemCount = 0,
  onBack,
  onClearAll,
  showShopNow = false,
  onShopNow,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'Home' });
    }
  };

  const handleShopNow = () => {
    if (onShopNow) {
      onShopNow();
    } else {
      navigation.navigate('MainTabs', { screen: 'Home' });
    }
  };

  return (
    <View style={styles.screenContainer}>
      {showHeader && (
        <View style={{ paddingTop: insets.top, backgroundColor: '#FFFFFF' }}>
          <CartHeader
            onBack={handleBack}
            onClearAll={onClearAll}
            itemCount={itemCount}
          />
        </View>
      )}

      <View style={styles.mainContainer}>
        <Image
          style={styles.imageStyle}
          source={images.no_CART}
          resizeMode="contain"
        />
        <Text style={styles.titleText}>Your cart is empty</Text>
        <Text style={styles.subtitleText}>
          Add groceries and essentials to get them delivered fast
        </Text>

        {showShopNow && (
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={handleShopNow}
          >
            <Text style={styles.shopNowText}>Shop Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CartEmptyComponent;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('8%'),
    marginTop: -hp('4%'),
  },
  imageStyle: {
    width: wp('78%'),
    aspectRatio: 353 / 267,
    marginBottom: hp('3%'),
  },
  titleText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('5.8%'),
    color: '#000000',
    textAlign: 'center',
    marginBottom: hp('1%'),
    letterSpacing: -0.2,
  },
  subtitleText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.8%'),
    color: '#71717A',
    textAlign: 'center',
    lineHeight: wp('5.4%'),
    paddingHorizontal: wp('4%'),
  },
  shopNowButton: {
    marginTop: hp('3.5%'),
    backgroundColor: '#F25000',
    paddingHorizontal: wp('10%'),
    paddingVertical: hp('1.5%'),
    borderRadius: 12,
    shadowColor: '#F25000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  shopNowText: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.2%'),
  },
});
