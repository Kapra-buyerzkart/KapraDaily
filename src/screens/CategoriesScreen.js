import React, { useState, useContext, useCallback, useRef } from 'react';
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
  useAnimatedRef,
  useAnimatedReaction,
  useSharedValue,
  scrollTo,
  withTiming,
  Easing,
  interpolate,
  Extrapolation,
  clamp,
  FadeInUp,
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
import CategorySidebarShimmer from '../components/CategorySidebarShimmer';
import SubCategoryPillsShimmer from '../components/SubCategoryPillsShimmer';

import { AppContext } from '../context/appContext';
import { useDebounce } from '../hooks/useDebounce';
import useTabBarAnimation from '../hooks/useTabBarAnimation';
import useCategoriesData from '../hooks/useCategoriesData';
import { getStaggerDelay } from '../utils/staggerDelay';
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
    isFetchingSubCategories,
    isFetchingProducts,
    isFetchingMore,
    handleLoadMore,
  } = useCategoriesData(catId, debouncedSearchText, filters);

  const { onScrollWorklet } = useTabBarAnimation();

  // Sidebar auto-scroll-to-center: tapping a category scrolls the sidebar so
  // the selected item eases toward the vertical center.
  // Two shared values on purpose: `sidebarScrollY` mirrors the live native
  // scroll position; `sidebarAutoScrollY` drives the programmatic scrollTo, so
  // a user's manual drag never fights the imperative scroll from a tap.
  const sidebarListRef = useAnimatedRef();
  const sidebarScrollY = useSharedValue(0);
  const sidebarAutoScrollY = useSharedValue(0);
  const sidebarContentHeight = useSharedValue(0);
  const sidebarViewportHeight = useSharedValue(0);
  const itemLayoutsRef = useRef({});

  useAnimatedReaction(
    () => sidebarAutoScrollY.value,
    current => {
      scrollTo(sidebarListRef, 0, current, false);
    },
  );

  const sidebarScrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      sidebarScrollY.value = event.contentOffset.y;
    },
  });

  const scrollSidebarToCenter = useCallback(
    targetCatId => {
      const layout = itemLayoutsRef.current[targetCatId];
      if (!layout) return;
      const viewportH = sidebarViewportHeight.value;
      const contentH = sidebarContentHeight.value;
      const maxScroll = Math.max(contentH - viewportH, 0);
      const rawTarget = layout.y + layout.height / 2 - viewportH / 2;
      const target = Math.max(0, Math.min(rawTarget, maxScroll));
      sidebarAutoScrollY.value = sidebarScrollY.value;
      sidebarAutoScrollY.value = withTiming(target, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
    },
    [
      sidebarContentHeight,
      sidebarViewportHeight,
      sidebarScrollY,
      sidebarAutoScrollY,
    ],
  );

  // Memoized values
  const tabBarClearance = getTabBarClearance(bottom);
  const floatingBottomOffset = hp('0.2%') + tabBarClearance;

  const categoryName =
    categoriesList.find(cat => cat.catId.toString() === selectedId)?.catName ||
    '';

  // Animated styles / scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      onScrollWorklet(event.contentOffset.y);
    },
  });

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
      const itemCatId = item?.catId?.toString();
      return (
        <CategoryListItem
          item={item}
          isSelected={isSelected}
          onLayout={e => {
            itemLayoutsRef.current[itemCatId] = {
              y: e.nativeEvent.layout.y,
              height: e.nativeEvent.layout.height,
            };
          }}
          onPress={() => {
            setSelectedId(itemCatId);
            scrollSidebarToCenter(itemCatId);
          }}
        />
      );
    },
    [selectedId, setSelectedId, scrollSidebarToCenter],
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

  const renderHeader = useCallback(() => {
    if (loading || isFetchingSubCategories) {
      return <SubCategoryPillsShimmer />;
    }
    return (
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
    );
  }, [subCategoriesList, renderSubCategory, isFetchingSubCategories, loading]);

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
              {loading ? (
                <CategorySidebarShimmer />
              ) : (
                <Animated.FlatList
                  ref={sidebarListRef}
                  data={categoriesList}
                  keyExtractor={(item, index) =>
                    (item?.catId || index).toString()
                  }
                  renderItem={renderItem}
                  showsVerticalScrollIndicator={false}
                  onScroll={sidebarScrollHandler}
                  scrollEventThrottle={16}
                  onContentSizeChange={(w, h) => {
                    sidebarContentHeight.value = h;
                  }}
                  onLayout={e => {
                    sidebarViewportHeight.value = e.nativeEvent.layout.height;
                  }}
                  contentContainerStyle={{
                    paddingVertical: hp('2%'),
                    paddingHorizontal: wp('1.5%'),
                    paddingBottom: hp('6%'),
                  }}
                />
              )}
            </View>

            {/* RIGHT CONTENT */}
            <View style={styles.rightContent}>
              <Animated.FlatList
                data={productsList}
                keyExtractor={(item, index) =>
                  (item?.productId || item?.id || index).toString()
                }
                renderItem={({ item, index }) => (
                  <TokenProductCard
                    isThreeColumn={false}
                    item={item}
                    entering={FadeInUp.delay(getStaggerDelay(index))}
                    containerStyle={{
                      width: wp('33%'),
                      marginHorizontal: wp('1%'),
                      marginVertical: hp('1%'),
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
                  paddingLeft: wp('1.5%'),
                  paddingRight: wp('1.5%'),
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
                  loading || isFetchingProducts ? (
                    <CategoryProductGridShimmer rows={3} />
                  ) : productsList.length === 0 && !isFetchingMore ? (
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
    backgroundColor: '#FFF',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFF',
  },
  leftMenu: {
    width: wp('23%'),
    marginTop: hp('1.5%'),
    marginBottom: hp('1.5%'),
    marginLeft: wp('1.5%'),
    marginRight: wp('1.2%'),
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  rightContent: {
    flex: 1,
    overflow: 'visible',
    backgroundColor: '#FFF',
  },
  newHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('6%'),
    paddingTop: hp('2.2%'),
    paddingBottom: hp('1.8%'),
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
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
