import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../../../styles/typography';
import ShimmerPlaceholder from '../../../components/ShimmerPlaceholder';
import CategoryItem from './CategoryItem';

export const CategoryShimmer = () => (
  <View style={styles.categoryMainView}>
    <Text style={styles.categoryHeaderText}>Category</Text>
    <View style={styles.categoriesContainer}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
        <View key={i} style={styles.item}>
          <View style={styles.categoryItemContainer}>
            <ShimmerPlaceholder
              style={{ width: wp('17%'), height: wp('17%'), borderRadius: 15 }}
            />
          </View>
          <ShimmerPlaceholder
            style={{
              marginTop: hp('1%'),
              width: wp('15%'),
              height: hp('1.5%'),
              borderRadius: 4,
            }}
          />
        </View>
      ))}
    </View>
  </View>
);

const CategoryGrid = ({ categories }) => (
  <View style={styles.categoryMainView}>
    <Text style={styles.categoryHeaderText}>Category</Text>
    <View style={styles.categoriesContainer}>
      {categories.map((item, index) => (
        <CategoryItem key={(item.catId || item.id || index).toString()} item={item} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  categoryMainView: {
    marginHorizontal: wp('4.6%'),
    marginTop: hp('1.5%'),
  },
  categoryHeaderText: {
    fontFamily: FONTS.outfit.regular,
    fontSize: wp('4.2%'),
    marginBottom: hp('1%'),
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  // Used only by the shimmer's placeholder grid items (matches categoryChipStyles
  // shapes so the loading state lines up with the real grid).
  item: {
    width: wp('22%'),
    alignItems: 'center',
    marginBottom: hp('.5%'),
  },
  categoryItemContainer: {
    borderColor: '#F3F4F6',
    borderRadius: 15,
    borderWidth: 1,
  },
});

export default CategoryGrid;
