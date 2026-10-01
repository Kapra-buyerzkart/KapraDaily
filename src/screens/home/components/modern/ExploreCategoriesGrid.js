import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '@/styles/typography';
import CachedImage from '@/components/CachedImage';
import CONFIG from '@/globals/config';
import getCategoryPlaceholder from '../getCategoryPlaceholder';

const ExploreCategoriesGrid = ({ categories = [], navigation }) => {
  const handleViewAll = () => {
    navigation.navigate('Categories');
  };

  const handleCategoryPress = useCallback(
    item => {
      navigation.navigate('SearchScreen', {
        catId: item.catId || item.id,
        catName: item.catName || item.name,
      });
    },
    [navigation],
  );

  // Take up to 8 categories to make a clean 4x2 grid
  const gridCategories = categories.slice(0, 8);

  if (gridCategories.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Explore by Category</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleViewAll}
          style={styles.viewAllButton}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Feather name="chevron-right" size={14} color="#16A34A" />
        </TouchableOpacity>
      </View>

      {/* 4x2 Grid */}
      <View style={styles.grid}>
        {gridCategories.map((item, index) => {
          const label = item.catName || item.name || '';
          let imageSource;
          if (item.image) {
            imageSource = item.image;
          } else if (item.imageUrl) {
            imageSource = { uri: `${CONFIG.image_base_url}${item.imageUrl}` };
          } else {
            imageSource = getCategoryPlaceholder(label);
          }

          return (
            <TouchableOpacity
              key={item.catId || index}
              activeOpacity={0.8}
              onPress={() => handleCategoryPress(item)}
              style={styles.cardItem}
            >
              <View style={styles.cardImageContainer}>
                <CachedImage
                  source={imageSource}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.label} numberOfLines={2}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp('1.8%'),
    paddingHorizontal: wp('4%'),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('1.4%'),
  },
  title: {
    fontSize: wp('4.4%'),
    fontFamily: FONTS.gilroy.bold,
    color: '#111827',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: wp('3.3%'),
    fontFamily: FONTS.gilroy.semiBold,
    color: '#16A34A',
    marginRight: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: hp('1.6%'),
  },
  cardItem: {
    width: wp('21%'),
    alignItems: 'center',
  },
  cardImageContainer: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontSize: wp('3%'),
    fontFamily: FONTS.gilroy.semiBold,
    color: '#2B2D36',
    textAlign: 'center',
    lineHeight: wp('3.8%'),
  },
});

export default React.memo(ExploreCategoriesGrid);
