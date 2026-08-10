import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import React, { useState, useCallback, useContext, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FadeInUp } from 'react-native-reanimated';
import TokenProductCard from '../components/TokenProductCard';
import SelectedProducts from '../components/SelectedProducts';
import { FONTS } from '../styles/typography';
import StoreUnavailable from '../components/StoreUnavailable';
import LocationModal from '../components/LocationModal';
import FilterSortModal from '../components/FilterSortModal';
import AnimatedHeader from '../components/AnimatedHeader';
import { AppContext } from '../context/appContext';
import useProductSearch, { MIN_SEARCH_LENGTH } from '../hooks/useProductSearch';
import secureStore from '../utils/secureStore';
import { getStaggerDelay } from '../utils/staggerDelay';

const ProductListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { title, products } = route.params || {
    title: 'Products',
    products: [],
  };

  const { profile, isStoreUnavailable, storeUnavailableData } =
    useContext(AppContext);

  const [pincodeAreaId, setPincodeAreaId] = useState(null);
  const [activeSearchText, setActiveSearchText] = useState('');
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    sort: 'relevance',
    min: 0,
    max: 5000,
  });

  useEffect(() => {
    const fetchPincode = async () => {
      const stored = await secureStore.getItem('pincodeAreaId');
      if (stored) {
        setPincodeAreaId(parseInt(stored));
      } else if (profile?.pincode) {
        setPincodeAreaId(profile.pincode);
      }
    };
    fetchPincode();
  }, [profile]);

  const { suggestions: searchResults, setSearchTerm } = useProductSearch(
    pincodeAreaId,
    null,
    { sortBy: filters.sort, priceMin: filters.min, priceMax: filters.max },
  );

  const handleSearchChange = useCallback(
    text => {
      setActiveSearchText(text);
      setSearchTerm(text);
    },
    [setSearchTerm],
  );

  const handleFilterApply = useCallback(applied => {
    setFilters(applied);
  }, []);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleFilterPress = useCallback(() => {
    setIsFilterModalVisible(true);
  }, []);

  const displayProducts =
    activeSearchText.trim().length >= MIN_SEARCH_LENGTH ? searchResults : products;

  useEffect(() => {
    console.log(
      `[ProductListScreen] "${title}" — ${displayProducts?.length || 0} items`,
      JSON.stringify(displayProducts, null, 2),
    );
  }, [title, displayProducts]);

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top', 'left', 'right']}>
      <AnimatedHeader
        title={title}
        onBack={handleBack}
        onFilterPress={handleFilterPress}
        onSearchChange={handleSearchChange}
      />

      {isStoreUnavailable ? (
        <StoreUnavailable
          image={storeUnavailableData.image}
          text={storeUnavailableData.text}
          onChangeLocation={() => setIsLocationModalVisible(true)}
        />
      ) : (
        <FlatList
          data={displayProducts}
          keyExtractor={(item, index) =>
            (item.productId || item.id || `product-${index}`).toString()
          }
          renderItem={({ item, index }) => (
            <View style={styles.productWrapper}>
              <TokenProductCard
                isThreeColumn={true}
                item={item}
                index={index}
                entering={FadeInUp.delay(getStaggerDelay(index))}
                onPress={() =>
                  navigation.navigate('ProductDetailsScreen', {
                    productId: item.productId || item.id,
                    product: item,
                  })
                }
              />
            </View>
          )}
          numColumns={3}
          key={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Image
                source={require('../assets/images/noimages/noproductfound.png')}
                style={styles.emptyImage}
              />
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          }
        />
      )}

      <View style={styles.floatingContainer}>
        <SelectedProducts />
      </View>

      <LocationModal
        visible={isLocationModalVisible}
        onClose={() => setIsLocationModalVisible(false)}
      />

      <FilterSortModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={handleFilterApply}
        initialSort={filters.sort}
        initialMin={filters.min}
        initialMax={filters.max}
      />
    </SafeAreaView>
  );
};

export default ProductListScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: wp('2%'),
    paddingTop: hp('1%'),
    paddingBottom: hp('10%'),
  },
  productWrapper: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  emptyContainer: {
    marginTop: hp('20%'),
    alignItems: 'center',
  },
  emptyImage: {
    width: wp('40%'),
    height: wp('40%'),
    resizeMode: 'contain',
  },
  emptyText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('4%'),
    color: '#999999',
    marginTop: hp('2%'),
  },
  floatingContainer: {
    position: 'absolute',
    bottom: hp('1%'),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
