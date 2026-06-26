import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import { getImageUrl } from '../utils/imageUrl';

const SubCategoryPill = ({ item, isSelected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={isSelected ? styles.subCatPillActive : styles.subCatPillInactive}
  >
    <Image style={styles.subCatPillImage} source={getImageUrl(item.imageUrl)} />
    <Text
      style={
        isSelected ? styles.subCatPillTextActive : styles.subCatPillTextInactive
      }
    >
      {item.catName}
    </Text>
  </TouchableOpacity>
);

export default React.memo(SubCategoryPill);

const styles = StyleSheet.create({
  subCatPillActive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.6%'),
    borderRadius: wp('8%'),
    borderWidth: 1,
    borderColor: '#F25000',
    backgroundColor: 'white',
  },
  subCatPillInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.6%'),
    borderRadius: wp('8%'),
    borderWidth: 1,
    borderColor: '#ECECEC',
    backgroundColor: 'white',
  },
  subCatPillImage: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    marginRight: wp('2%'),
    resizeMode: 'cover',
  },
  subCatPillTextActive: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: wp('3.5%'),
    color: '#FF6B00',
    marginRight: wp('2%'),
  },
  subCatPillTextInactive: {
    fontFamily: FONTS.poppins.medium,
    fontSize: wp('3.5%'),
    color: '#6B7280',
    marginRight: wp('2%'),
  },
});
