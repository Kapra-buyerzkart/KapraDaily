import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { FONTS } from '@/styles/typography';
import TokenProductCard from '@/components/TokenProductCard';

const GARDEN_TRIM_IMAGE = require('@/assets/images/garden_produce_trim.jpg');

const RecommendedGridSection = ({
  items = [],
  title = 'Recommended For you',
  navigation,
}) => {
  // Take 4 items for the 2x2 grid
  const gridItems = items.slice(0, 4);

  const handleProductPress = useCallback(
    item => {
      navigation.navigate('ProductDetailsScreen', {
        productId: item.productId || item.id,
        product: item,
      });
    },
    [navigation],
  );

  if (gridItems.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <AntDesign name="hearto" size={18} color="#EA580C" style={styles.headerIcon} />
      </View>

      {/* 2x2 Product Grid */}
      <View style={styles.grid}>
        {gridItems.map((item, index) => (
          <TokenProductCard
            key={item.productId || item.id || index}
            item={item}
            index={index}
            onPress={() => handleProductPress(item)}
            containerStyle={styles.cardContainer}
          />
        ))}
      </View>

      {/* Vegetable Garden Illustration Trim along bottom */}
      <View style={styles.trimContainer}>
        <Image
          source={GARDEN_TRIM_IMAGE}
          style={styles.trimImage}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp('3.5%'),
    marginVertical: hp('1.5%'),
    backgroundColor: '#FFF5EE',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FED7AA',
    overflow: 'hidden',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingTop: hp('1.8%'),
    paddingBottom: hp('0.8%'),
  },
  title: {
    fontSize: wp('4.4%'),
    fontFamily: FONTS.gilroy.bold,
    color: '#111827',
  },
  headerIcon: {
    marginLeft: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: wp('3%'),
    paddingBottom: hp('1%'),
  },
  cardContainer: {
    width: wp('42%'),
    marginHorizontal: 0,
    marginVertical: hp('0.6%'),
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECF2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  trimContainer: {
    width: '100%',
    height: hp('6%'),
    overflow: 'hidden',
    marginTop: hp('0.5%'),
  },
  trimImage: {
    width: '100%',
    height: '100%',
  },
});

export default React.memo(RecommendedGridSection);
