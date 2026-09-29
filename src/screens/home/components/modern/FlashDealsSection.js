import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '@/styles/typography';
import TokenProductCard from '@/components/TokenProductCard';

const FlashDealsSection = ({
  items = [],
  title = '50% OFF',
  navigation,
  onSeeAll,
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

  const handleSeeAll = useCallback(() => {
    if (onSeeAll) {
      onSeeAll();
    } else {
      navigation.navigate('SearchScreen', {
        title,
        products: items,
      });
    }
  }, [navigation, onSeeAll, title, items]);

  if (gridItems.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <MaterialIcons name="flash-on" size={wp('4.8%')} color="#F25000" />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* 2x2 Grid */}
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

      {/* View All Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSeeAll}
        style={styles.viewAllButton}
      >
        <Text style={styles.viewAllText}>View All</Text>
        <Feather name="chevron-right" size={16} color="#0D5335" />
      </TouchableOpacity>
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
    padding: wp('3.5%'),
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.2%'),
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFE8DC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  title: {
    fontSize: wp('4.6%'),
    fontFamily: FONTS.gilroy.heavy,
    color: '#F25000',
    letterSpacing: 0.2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0D5335',
    borderRadius: 24,
    paddingVertical: hp('1.1%'),
    marginTop: hp('1.2%'),
  },
  viewAllText: {
    fontSize: wp('3.6%'),
    fontFamily: FONTS.gilroy.bold,
    color: '#0D5335',
    marginRight: 4,
  },
});

export default React.memo(FlashDealsSection);
