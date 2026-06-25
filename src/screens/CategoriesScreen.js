import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  clamp,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useContext } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TokenProductCard from '../components/TokenProductCard';
import SelectedProducts from '../components/SelectedProducts';
import { FONTS } from '../styles/typography';
import { getCategoriesApi } from '../api/categoryService';
import { searchProductsApi } from '../api/productService';
import CONFIG from '../globals/config';
import FilterSortModal from '../components/FilterSortModal';
import { useCart } from '../context/CartContext';
import { LoaderContext } from '../context/loaderContext';
import { useDebounce } from '../hooks/useDebounce';
import { AppContext } from '../context/appContext';
import StoreUnavailable from '../components/StoreUnavailable';
import { getGeneralSettingsApi } from '../api/userService';
import LocationModal from '../components/LocationModal';
import useTabBarAnimation from '../hooks/useTabBarAnimation';
import {
  tabBarVisibility,
  getTabBarClearance,
} from '../animations/tabBarVisibility';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const categories = [
  {
    id: '1',
    name: 'Fresh Vegetables',
    image: require('../assets/images/fv.png'),
  },
  { id: '2', name: 'Fresh Fruits', image: require('../assets/images/ff.png') },
  { id: '3', name: 'Exotics', image: require('../assets/images/exotics.png') },
  { id: '4', name: 'Leafy', image: require('../assets/images/leafy.png') },
  {
    id: '5',
    name: 'Flowers & Leaves',
    image: require('../assets/images/fl.png'),
  },
  { id: '6', name: 'Freshly Cut', image: require('../assets/images/fc.png') },
];

const categoryContent = {
  1: [
    {
      id: '1',
      name: 'Tomato',
      img: require('../assets/images/products/tomato.png'),
      price: '₹324',
    },
    {
      id: '2',
      name: 'Green Chilli',
      img: require('../assets/images/products/chilli.png'),
      price: '₹324',
    },
    {
      id: '3',
      name: 'Tomato',
      img: require('../assets/images/products/tomato.png'),
      price: '₹324',
    },
    {
      id: '4',
      name: 'Green Chilli',
      img: require('../assets/images/products/chilli.png'),
      price: '₹324',
    },
    {
      id: '5',
      name: 'Tomato',
      img: require('../assets/images/products/tomato.png'),
      price: '₹324',
    },
  ],
  2: [
    {
      id: '1',
      name: 'Tomato',
      img: require('../assets/images/products/tomato.png'),
      price: '₹324',
    },
    {
      id: '2',
      name: 'Green Chilli',
      img: require('../assets/images/products/chilli.png'),
      price: '₹324',
    },
    {
      id: '3',
      name: 'Tomato',
      img: require('../assets/images/products/tomato.png'),
      price: '₹324',
    },
    {
      id: '4',
      name: 'Green Chilli',
      img: require('../assets/images/products/chilli.png'),
      price: '₹324',
    },
    {
      id: '5',
      name: 'Tomato',
      img: require('../assets/images/products/tomato.png'),
      price: '₹324',
    },
  ],
  3: [
    {
      id: '1',
      name: 'Tomato',
      img: require('../assets/images/products/tomato.png'),
      price: '₹324',
    },
    {
      id: '2',
      name: 'Green Chilli',
      img: require('../assets/images/products/chilli.png'),
      price: '₹324',
    },
    {
      id: '3',
      name: 'Tomato',
      img: require('../assets/images/products/tomato.png'),
      price: '₹324',
    },
    {
      id: '4',
      name: 'Green Chilli',
      img: require('../assets/images/products/chilli.png'),
      price: '₹324',
    },
    {
      id: '5',
      name: 'Tomato',
      img: require('../assets/images/products/tomato.png'),
      price: '₹324',
    },
  ],
};

const selectedProducts = [
  { id: '1', image: require('../assets/images/product1.png') },
  { id: '2', image: require('../assets/images/product2.png') },
  { id: '3', image: require('../assets/images/product3.png') },
  { id: '4', image: require('../assets/images/product1.png') },
  { id: '5', image: require('../assets/images/product2.png') },
  { id: '6', image: require('../assets/images/product3.png') },
];

const dummyProducts = [
  { id: '1', image: require('../assets/images/mango.jpg'), name: 'Mango' },
  { id: '2', image: require('../assets/images/apple.jpg'), name: 'Apple' },
  { id: '3', image: require('../assets/images/mango.jpg'), name: 'Mango' },
  { id: '4', image: require('../assets/images/apple.jpg'), name: 'Apple' },
  { id: '5', image: require('../assets/images/mango.jpg'), name: 'Mango' },
  { id: '6', image: require('../assets/images/apple.jpg'), name: 'Apple' },
];

export default function CategoriesScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { bottom } = useSafeAreaInsets();
  const { catId } = route.params || {};
  const [selectedId, setSelectedId] = useState(catId?.toString() || '1');
  const [selectedSubCatId, setSelectedSubCatId] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  const [subCategoriesList, setSubCategoriesList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const floatingBottomOffset = hp('0.7%') + getTabBarClearance(bottom);

  // Drives the global, UI-thread-only tab bar visibility (see
  // src/animations/tabBarVisibility.js). CategoriesScreen is one of only
  // two screens allowed to control it (the other is HomeScreen).
  const { onScrollWorklet } = useTabBarAnimation();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      // UI THREAD: drives the tab bar's own visibility — no second scroll
      // listener attached to the FlatList, no JS thread hop.
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
            [100, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pincodeAreaId, setPincodeAreaId] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isFilterSortModalVisible, setIsFilterSortModalVisible] =
    useState(false);
  const { showLoader } = useContext(LoaderContext);
  const {
    profile,
    isStoreUnavailable,
    storeUnavailableData,
    setStoreUnavailable,
  } = useContext(AppContext);
  const [isStoreUnavailableLocal, setIsStoreUnavailableLocal] = useState(false); // Kept for safety if needed, but will prioritize global
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

  const [filters, setFilters] = useState({
    sortBy: 'relevance',
    priceMin: 0,
    priceMax: 5000,
  });

  const debouncedSearchText = useDebounce(searchText, 500);

  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  useEffect(() => {
    const initializeLocationAndSettings = async () => {
      try {
        const storedPincodeAreaId = await AsyncStorage.getItem('pincodeAreaId');
        setPincodeAreaId(
          storedPincodeAreaId
            ? parseInt(storedPincodeAreaId)
            : profile?.pincode || null,
        );
      } catch (error) {
        console.error(
          'Error in initializeLocationAndSettings in CategoriesScreen:',
          error,
        );
      }
    };

    initializeLocationAndSettings();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (catId) {
      setSelectedId(catId.toString());
    }
  }, [catId]);

  useEffect(() => {
    if (selectedId) {
      fetchSubCategories(selectedId);
    }
  }, [selectedId]);

  useEffect(() => {
    const catIdToFetch = selectedSubCatId || selectedId;
    if (catIdToFetch) {
      console.log(
        'Fetching products for:',
        catIdToFetch,
        'with search:',
        debouncedSearchText,
      );
      fetchProducts(catIdToFetch, 1);
    }
  }, [selectedSubCatId, debouncedSearchText, selectedId, filters]);

  const fetchProducts = async (catId, page = 1) => {
    try {
      if (page === 1) {
        setProductsList([]); // Clear previous products immediately to show local loader
        setIsFetchingProducts(true);
        setHasMoreData(true);
      } else {
        setIsFetchingMore(true);
      }

      const payload = {
        pincodeAreaId: pincodeAreaId,
        prName: debouncedSearchText,
        catId: parseInt(catId),
        priceMin: filters.priceMin,
        priceMax: filters.priceMax,
        filterValues: null,
        sortBy: filters.sortBy,
        pageNumber: page,
        pageSize: pageSize,
      };
      console.log(
        'Fetching Products Payload:',
        JSON.stringify(payload, null, 2),
      );
      const response = await searchProductsApi(payload);
      console.log('Products Response:', JSON.stringify(response, null, 2));

      if (
        response &&
        response.success &&
        response.data &&
        response.data.items
      ) {
        const newProducts = response.data.items;
        if (page === 1) {
          setProductsList(newProducts);
        } else {
          setProductsList(prev => [...prev, ...newProducts]);
        }

        setPageNumber(page);
        // Check if we have more data based on totalCount or item length
        if (newProducts.length < pageSize) {
          setHasMoreData(false);
        }
      } else {
        if (page === 1) setProductsList([]);
        setHasMoreData(false);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      if (page === 1) setProductsList([]);
      setHasMoreData(false);
    } finally {
      if (page === 1) setIsFetchingProducts(false);
      setIsFetchingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!isFetchingMore && !isFetchingProducts && hasMoreData && !loading) {
      const catIdToFetch = selectedSubCatId || selectedId;
      if (catIdToFetch) {
        fetchProducts(catIdToFetch, pageNumber + 1);
      }
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      showLoader(true);
      const response = await getCategoriesApi(1); // Fetch root categories to find 105
      console.log('Categories Response:', JSON.stringify(response, null, 2));
      if (
        response &&
        response.success &&
        response.data &&
        response.data.items
      ) {
        setStoreUnavailable(false);
        setCategoriesList(response.data.items);

        // Try to find and select 105 as requested
        const targetCat = response.data.items.find(item => item.catId === 105);
        if (targetCat) {
          setSelectedId('105');
        } else if (response.data.items.length > 0) {
          setSelectedId(response.data.items[0]?.catId?.toString());
        }
      } else if (
        response?.status === 'STORE_NOT_FOUND' ||
        response?.data?.status === 'STORE_NOT_FOUND'
      ) {
        setStoreUnavailable(true, response.data);
        setCategoriesList([]);
      } else {
        setCategoriesList([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
      showLoader(false);
    }
  };

  const fetchSubCategories = async parentId => {
    try {
      showLoader(true);
      const response = await getCategoriesApi(parentId);
      console.log('SubCategories Response:', JSON.stringify(response, null, 2));
      if (
        response &&
        response.success &&
        response.data &&
        response.data.items
      ) {
        setSubCategoriesList(response.data.items);
        setSelectedSubCatId(null);
      } else {
        setSubCategoriesList([]);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubCategoriesList([]);
    } finally {
      showLoader(false);
    }
  };

  const getImageUrl = imagePath => {
    if (!imagePath) return require('../assets/images/fv.png');
    if (imagePath.startsWith('http')) return { uri: imagePath };
    return {
      uri: `${CONFIG.image_base_url}/${imagePath}`.replace(
        /([^:]\/)\/+/g,
        '$1',
      ),
    }; // Simple clean of double slashes
  };

  const categoryName =
    categoriesList.find(cat => cat.catId.toString() === selectedId)?.catName ||
    '';

  const renderItem = ({ item }) => {
    const isSelected = item?.catId?.toString() === selectedId;

    return (
      <TouchableOpacity
        onPress={() => setSelectedId(item?.catId?.toString())}
        activeOpacity={0.8}
        style={styles.leftMenuItemContainer}
      >
        {isSelected ? (
          <ImageBackground
            source={require('../assets/images/category.png')}
            style={styles.activeCard}
            imageStyle={{ borderRadius: wp('4%'), opacity: 0.2 }}
            resizeMode="cover"
          >
            <Image
              source={getImageUrl(item.imageUrl)}
              style={styles.image}
              resizeMode="contain"
            />
          </ImageBackground>
        ) : (
          <View style={styles.card}>
            <Image
              source={getImageUrl(item.imageUrl)}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}
        <Text
          style={isSelected ? styles.activeTitle : styles.inactiveTitle}
          numberOfLines={2}
        >
          {item.catName || item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSubCategory = ({ item }) => {
    const isSelected = item?.catId?.toString() === selectedSubCatId;

    return (
      <TouchableOpacity
        onPress={() =>
          setSelectedSubCatId(isSelected ? null : item?.catId?.toString())
        }
        style={isSelected ? styles.subCatPillActive : styles.subCatPillInactive}
      >
        <Image
          style={styles.subCatPillImage}
          source={getImageUrl(item.imageUrl)}
        />
        <Text
          style={
            isSelected
              ? styles.subCatPillTextActive
              : styles.subCatPillTextInactive
          }
        >
          {item.catName}
        </Text>
      </TouchableOpacity>
    );
  };
  const renderHeader = React.useCallback(
    () => (
      <>
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
      </>
    ),
    [subCategoriesList, selectedSubCatId],
  );

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top', 'left', 'right']}>
      <View style={styles.newHeaderContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerIconButton}
          >
            <Ionicons name="chevron-back" size={wp('5.5%')} color="#0F0F0F" />
          </TouchableOpacity>
          <Text style={styles.newCategoryHeaderText} numberOfLines={1}>
            {categoryName}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => setIsSearchVisible(!isSearchVisible)}
            style={[styles.headerIconButton, { marginRight: wp('2.5%') }]}
          >
            <Feather name="search" size={wp('5%')} color="#0F0F0F" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsFilterSortModalVisible(true)}
            style={styles.headerIconButton}
          >
            <Ionicons name="options-outline" size={wp('5%')} color="#0F0F0F" />
          </TouchableOpacity>
        </View>
      </View>

      {isSearchVisible && (
        <View style={styles.toggleSearchContainer}>
          <Feather
            name="search"
            color={'#666666'}
            size={wp('4.5%')}
            style={{ marginLeft: wp('2%') }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search product"
            placeholderTextColor="#999999"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus={true}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText('')}
              style={{ marginRight: wp('2%') }}
            >
              <Ionicons name="close-circle" size={wp('5%')} color="#999999" />
            </TouchableOpacity>
          )}
        </View>
      )}
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
                  // alignItems: "flex-end"
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
                  paddingBottom: hp('8.5%') + getTabBarClearance(bottom),
                  paddingTop: hp('0.5%'),
                }}
                ListHeaderComponent={renderHeader}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                  isFetchingMore ? (
                    <View style={{ paddingVertical: 20 }}>
                      <ActivityIndicator size="small" color="#FF6B00" />
                    </View>
                  ) : null
                }
                ListEmptyComponent={
                  isFetchingProducts ? (
                    <View
                      style={{ marginTop: hp('10%'), alignItems: 'center' }}
                    >
                      <ActivityIndicator size="large" color="#FF6B00" />
                    </View>
                  ) : productsList.length === 0 &&
                    !isFetchingMore &&
                    !loading ? (
                    <View style={styles.emptyContainer}>
                      <Image
                        source={require('../assets/images/noimages/noproductfound.png')}
                        style={styles.emptyImage}
                      />
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
          // AnimatedTabBar now floats with position: absolute over the
          // content instead of reserving flex space, so this container's
          // own `bottom: hp('0.7%')` (anchored to the screen's full-height
          // box) would otherwise sit underneath the tab bar. Push it up by
          // the bar's clearance so it floats above it again.
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
        onApply={({ sort, min, max }) => {
          setFilters({ sortBy: sort, priceMin: min, priceMax: max });
        }}
      />

      <LocationModal
        visible={isLocationModalVisible}
        onClose={() => setIsLocationModalVisible(false)}
      />

      {/* <FilterSortModal
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                onApply={(filters) => {
                    setSortBy(filters.sort);
                    setMinPrice(filters.min);
                    setMaxPrice(filters.max);
                }}
                initialSort={sortBy}
                initialMin={minPrice}
                initialMax={maxPrice}
            /> */}
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
    borderRightWidth: 1,
    borderColor: '#ECECEC',
  },
  rightContent: {
    flex: 1,
    overflow: 'visible',
    // marginEnd: wp('2%')
    // backgroundColor: "red",
    // paddingLeft: wp("3.2%")
    // paddingBottom: 10
  },

  activeIndicator: {
    width: wp('1.86%'),
    backgroundColor: '#F25000',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    marginVertical: hp('2%'),
  },

  bottomCurve: {
    position: 'absolute',
    bottom: -hp('8%'),
    width: '100%',
    height: hp('10%'),
    backgroundColor: '#F6F1EF',
    borderTopRightRadius: wp('7%'),
  },
  newHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('6%'),
    paddingTop: hp('1.8%'),
    paddingBottom: hp('1.4%'),
    backgroundColor: '#FFFFFF',
  },
  headerIconButton: {
    width: wp('9.5%'),
    height: wp('9.5%'),
    borderRadius: wp('4.75%'),
    backgroundColor: '#F7F7F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('2.5%'),
  },
  newCategoryHeaderText: {
    fontFamily: FONTS.poppins.bold,
    fontSize: wp('5.5%'),
    color: '#0F0F0F',
    flexShrink: 1,
  },
  toggleSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffffff',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('3%'),
    height: hp('5.5%'),
    marginHorizontal: wp('3%'),
    marginBottom: hp('1.2%'),
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  searchInput: {
    flex: 1,
    fontSize: wp('3.5%'),
    marginHorizontal: wp('2%'),
    color: '#0F0F0F',
    fontFamily: FONTS.outfit.regular,
  },
  floatingContainer: {
    position: 'absolute',
    bottom: hp('0.7%'),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  categoryHeaderText: {
    fontFamily: FONTS.lexend.semiBold,
    fontSize: wp('5.1%'),
    marginLeft: wp('10%'),
  },
  filterText: {
    fontFamily: FONTS.lexend.medium,
    fontSize: wp('3.48%'),
  },
  categoryBanner: {
    width: wp('64.65%'),
    height: hp('9.12%'),
    borderRadius: wp('3.48%'),
    marginTop: hp('1%'),
  },
  filterView: {
    width: wp('10%'),
    height: hp('4.5%'),
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: wp('1.4%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIconStyle: {
    height: wp('3.25%'),
    width: wp('3.25%'),
  },
  subCatCard: {
    width: wp('16.28%'),
    alignItems: 'center',
  },
  leftMenuItemContainer: {
    marginBottom: hp('2%'),
    alignItems: 'center',
    width: wp('22%'),
  },
  card: {
    alignItems: 'center',
    width: wp('17%'),
    height: wp('17%'),
    justifyContent: 'center',
    borderRadius: wp('4.5%'),
    backgroundColor: '#F7F7F8',
    marginBottom: hp('0.5%'),
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  activeCard: {
    alignItems: 'center',
    width: wp('17%'),
    height: wp('17%'),
    justifyContent: 'center',
    borderRadius: wp('4.5%'),
    borderWidth: 1.2,
    borderColor: '#FF6B00',
    backgroundColor: '#FFF1E8',
    marginBottom: hp('0.5%'),
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
  subCatPillActive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.6%'),
    borderRadius: wp('8%'),
    borderWidth: 1,
    borderColor: '#FF6B00',
    backgroundColor: '#FFF1E8',
  },
  subCatPillInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.6%'),
    borderRadius: wp('8%'),
    borderWidth: 1,
    borderColor: '#ECECEC',
    backgroundColor: '#F7F7F8',
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('5%'),
    paddingHorizontal: wp('10%'),
  },
  emptyImage: {
    width: wp('40%'),
    height: wp('40%'),
    resizeMode: 'contain',
    marginBottom: hp('2%'),
  },
  emptyText: {
    fontFamily: FONTS.lexend.regular,
    fontSize: wp('3.5%'),
    color: '#999',
    textAlign: 'center',
  },
});
