import React from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import { getImageUrl } from '../utils/imageUrl';

const CategoryListItem = ({ item, isSelected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={styles.leftMenuItemContainer}
  >
    <View style={isSelected ? styles.activeCard : styles.card}>
      <Image
        source={getImageUrl(item.imageUrl)}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
    <Text
      style={isSelected ? styles.activeTitle : styles.inactiveTitle}
      numberOfLines={2}
    >
      {item.catName || item.name}
    </Text>
  </TouchableOpacity>
);

export default React.memo(CategoryListItem);

const styles = StyleSheet.create({
  leftMenuItemContainer: {
    marginBottom: hp('2%'),
    alignItems: 'center',
    width: wp('22%'),
  },
  card: {
    alignItems: 'center',
    width: wp('16%'),
    height: wp('16%'),
    justifyContent: 'center',
    borderRadius: wp('8%'),
    backgroundColor: '#FFFFFF',
    marginBottom: hp('0.6%'),
    borderColor: '#ECECEC',
  },
  activeCard: {
    alignItems: 'center',
    width: wp('16%'),
    height: wp('16%'),
    justifyContent: 'center',
    borderRadius: wp('8%'),
    borderWidth: 1.5,
    borderColor: '#FF6B00',
    backgroundColor: '#FFFFFF',
    marginBottom: hp('0.6%'),
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: wp('11%'),
    height: wp('11%'),
  },
  activeTitle: {
    fontSize: wp('3%'),
    textAlign: 'center',
    color: '#FF6B00',
    fontFamily: FONTS.poppins.semiBold,
    paddingHorizontal: wp('1%'),
  },
  inactiveTitle: {
    fontSize: wp('3%'),
    textAlign: 'center',
    color: '#6B7280',
    fontFamily: FONTS.poppins.medium,
    paddingHorizontal: wp('1%'),
  },
});
