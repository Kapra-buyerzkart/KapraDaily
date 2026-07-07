import React, { useState, useContext, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  clamp,
} from 'react-native-reanimated';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FONTS } from '../styles/typography';

import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import HeaderSearch from '../components/HeaderSearch';
import TokenProductCard from '../components/TokenProductCard';
import SelectedProducts from '../components/SelectedProducts';
import FilterSortModal from '../components/FilterSortModal';
import StoreUnavailable from '../components/StoreUnavailable';
import LocationModal from '../components/LocationModal';
import CategoryListItem from '../components/CategoryListItem';
import SubCategoryPill from '../components/SubCategoryPill';
import CategoryProductGridShimmer from '../components/CategoryProductGridShimmer';

import { AppContext } from '../context/appContext';
import { useDebounce } from '../hooks/useDebounce';
import useTabBarAnimation from '../hooks/useTabBarAnimation';
import useCategoriesData from '../hooks/useCategoriesData';
import {
  tabBarVisibility,
  getTabBarClearance,
} from '../animations/tabBarVisibility';

const selectedProducts = [
  { id: '1', image: require('../assets/images/product1.png') },
  { id: '2', image: require('../assets/images/product2.png') },
  { id: '3', image: require('../assets/images/product3.png') },
  { id: '4', image: require('../assets/images/product1.png') },
  { id: '5', image: require('../assets/images/product2.png') },
  { id: '6', image: require('../assets/images/product3.png') },
];

export default function CategoriesScreen() {
  // Navigation
  const navigation = useNavigation();

  // Route
  const route = useRoute();
  const { catId } = route.params || {};

  // Context selectors
  const { isStoreUnavailable, storeUnavailableData } = useContext(AppContext);

  // Safe area / layout
  const { bottom } = useSafeAreaInsets();

  // State
  const [searchText, setSearchText] = useState('');
  const [isFilterSortModalVisible, setIsFilterSortModalVisible] =
    useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'relevance',
    priceMin: 0,
    priceMax: 5000,
  });

  const debouncedSearchText = useDebounce(searchText, 500);

  const {
    selectedId,
    setSelectedId,
    selectedSubCatId,
    setSelectedSubCatId,
    categoriesList,
    subCategoriesList,
    productsList,
    loading,
    isFetchingProducts,
    isFetchingMore,
    handleLoadMore,
  } = useCategoriesData(catId, debouncedSearchText, filters);

  const { onScrollWorklet } = useTabBarAnimation();

  // Memoized values
  const tabBarClearance = getTabBarClearance(bottom);
  const floatingBottomOffset = hp('0.2%') + tabBarClearance;

  const categoryName =
    categoriesList.find(cat => cat.catId.toString() === selectedId)?.catName ||
    '';

  // Animated styles / scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      // UI THREAD: drives the tab bar's own visibility — no second scroll
      // listener attached to the FlatList, no JS thread hop.
      onScrollWorklet(event.contentOffset.y);
    },
  });

  // Nudges the floating cart down by exactly the space the tab bar frees up
  // when it hides, and back to its resting place when the tab bar reappears.
  // `tabBarClearance` is device/platform-aware (see getTabBarClearance), so
  // the cart always lands flush with the screen bottom instead of overshooting
  // or leaving a gap on a given device.
  const cartAnimatedStyle = useAnimatedStyle(() => {
    const progress = clamp(tabBarVisibility.value, 0, 1);
    return {
      transform: [
        {
          translateY: interpolate(
            progress,
            [0, 1],
            [tabBarClearance, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  // Event handlers
  const handleApplyFilters = ({ sort, min, max }) => {
    setFilters({ sortBy: sort, priceMin: min, priceMax: max });
  };

  // Render helpers
  const renderItem = useCallback(
    ({ item }) => {
      const isSelected = item?.catId?.toString() === selectedId;
      return (
        <CategoryListItem
          item={item}
          isSelected={isSelected}
          onPress={() => setSelectedId(item?.catId?.toString())}
        />
      );
    },
    [selectedId, setSelectedId],
  );

  const renderSubCategory = useCallback(
    ({ item }) => {
      const isSelected = item?.catId?.toString() === selectedSubCatId;
      return (
        <SubCategoryPill
          item={item}
          isSelected={isSelected}
          onPress={() =>
            setSelectedSubCatId(isSelected ? null : item?.catId?.toString())
          }
        />
      );
    },
    [selectedSubCatId, setSelectedSubCatId],
  );

  const renderHeader = useCallback(
    () => (
      <FlatList
        data={subCategoriesList}
        keyExtractor={(item, index) => (item?.catId || index).toString()}
        renderItem={renderSubCategory}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: wp('3%'),
          paddingRight: wp('3%'),
          marginTop: hp('0.8%'),
          paddingBottom: hp('1.5%'),
          gap: wp('2.5%'),
        }}
      />
    ),
    [subCategoriesList, renderSubCategory],
  );

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top', 'left', 'right']}>
      <View style={styles.newHeaderContainer}>
        <HeaderSearch
          title={categoryName}
          searchText={searchText}
          onChangeText={setSearchText}
          onFilterPress={() => setIsFilterSortModalVisible(true)}
        />
      </View>
      <View style={styles.row}>
        {isStoreUnavailable ? (
          <StoreUnavailable
            image={storeUnavailableData.image}
            text={storeUnavailableData.text}
            onChangeLocation={() => setIsLocationModalVisible(true)}
          />
        ) : (
          <>
            {/* LEFT MENU */}
            <View style={styles.leftMenu}>
              <FlatList
                data={categoriesList}
                keyExtractor={(item, index) =>
                  (item?.catId || index).toString()
                }
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: hp('6%'),
                }}
              />
            </View>

            {/* RIGHT CONTENT */}
            <View style={styles.rightContent}>
              <Animated.FlatList
                data={productsList}
                keyExtractor={(item, index) =>
                  (item?.productId || item?.id || index).toString()
                }
                renderItem={({ item }) => (
                  <TokenProductCard
                    isThreeColumn={false}
                    item={item}
                    containerStyle={{
                      width: wp('36.5%'),
                      marginHorizontal: wp('0.4%'),
                      marginVertical: hp('0.8%'),
                    }}
                    onPress={() =>
                      navigation.navigate('ProductDetailsScreen', {
                        productId: item.productId || item.id,
                        product: item,
                      })
                    }
                  />
                )}
                numColumns={2}
                key={2}
                showsVerticalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                contentContainerStyle={{
                  paddingLeft: wp('1%'),
                  paddingRight: wp('1%'),
                  // The custom AnimatedTabBar floats over the content
                  // (position: absolute) instead of reserving its own flex
                  // space, so this padding keeps products from rendering
                  // underneath it.
                  paddingBottom: hp('8.5%') + tabBarClearance,
                  paddingTop: hp('0.5%'),
                }}
                ListHeaderComponent={renderHeader}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                  isFetchingMore ? (
                    <CategoryProductGridShimmer rows={1} />
                  ) : null
                }
                ListEmptyComponent={
                  isFetchingProducts ? (
                    <CategoryProductGridShimmer rows={3} />
                  ) : productsList.length === 0 &&
                    !isFetchingMore &&
                    !loading ? (
                    <View style={styles.emptyContainer}>
                      <Image
                        source={require('../assets/images/udenDealNotfound.png')}
                        style={styles.emptyImage}
                      />

                      <Text style={styles.emptyText}>
                        Uh-oh! We couldn't find any products in this category.
                        Check back later for new additions.
                      </Text>
                    </View>
                  ) : null
                }
              />
            </View>
          </>
        )}
      </View>
      <Animated.View
        style={[
          styles.floatingContainer,
          { bottom: floatingBottomOffset },
          cartAnimatedStyle,
        ]}
      >
        <SelectedProducts selectedProducts={selectedProducts} />
      </Animated.View>
      <FilterSortModal
        visible={isFilterSortModalVisible}
        onClose={() => setIsFilterSortModalVisible(false)}
        initialSort={filters.sortBy}
        initialMin={filters.priceMin}
        initialMax={filters.priceMax}
        onApply={handleApplyFilters}
      />

      <LocationModal
        visible={isLocationModalVisible}
        onClose={() => setIsLocationModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  leftMenu: {
    width: wp('22%'),
    paddingTop: hp('2%'),
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderColor: '#ECECEC',
  },
  rightContent: {
    flex: 1,
    overflow: 'visible',
  },
  newHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('6%'),
    paddingTop: hp('1.8%'),
    paddingBottom: hp('1.4%'),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  floatingContainer: {
    position: 'absolute',
    bottom: hp('0.7%'),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('8%'),
    paddingHorizontal: wp('10%'),
  },
  emptyImage: {
    width: wp('40%'),
    height: wp('40%'),
    resizeMode: 'contain',
    marginBottom: hp('2%'),
  },
  emptyText: {
    fontSize: wp('3.5%'),
    color: '#000000',
    fontFamily: FONTS.gilroy.medium,
    textAlign: 'center',
    lineHeight: hp('2.5%'),
  },
});
