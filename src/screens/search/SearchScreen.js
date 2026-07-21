import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  FadeInUp,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import React, { useState, useEffect, useContext } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import useProductSearch from '../../hooks/useProductSearch';
import secureStore from '../../utils/secureStore';
import { getStaggerDelay } from '../../utils/staggerDelay';
import { AppContext } from '../../context/appContext';
import TokenProductCard from '../../components/TokenProductCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FilterSortModal from '../../components/FilterSortModal';
import StoreUnavailable from '../../components/StoreUnavailable';
import LocationModal from '../../components/LocationModal';
import SelectedProducts from '../../components/SelectedProducts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useRecentSearches from './hooks/useRecentSearches';
import RecentSearches from './components/RecentSearches';
import SearchResultsHeader from './components/SearchResultsHeader';
import styles from './SearchScreen.styles';
import icons from '@/assets/icons';

const SearchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    catId,
    catName,
    products: staticProducts,
    title: staticTitle,
  } = route.params || {};
  const { profile, isStoreUnavailable, storeUnavailableData } =
    useContext(AppContext);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

  const [currentPincodeId, setCurrentPincodeId] = useState(null);
  const { recentSearches, saveSearch } = useRecentSearches();

  // Filter & Sort state
  const [isFilterSortModalVisible, setIsFilterSortModalVisible] =
    useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'relevance',
    priceMin: 0,
    priceMax: 5000,
  });

  const {
    searchTerm,
    setSearchTerm,
    submitSearch,
    isSearchActive,
    suggestions,
    loading,
    resultCount,
    isGlobalFallback,
  } = useProductSearch(currentPincodeId, catId, filters);

  // "View All" from a home product block passes its already-fetched items
  // directly (those blocks are curated lists with no catId to query by), so
  // show them as-is until the user actually starts typing/searching by category.
  const hasStaticProducts =
    Array.isArray(staticProducts) && staticProducts.length > 0;
  const isBrowsingStaticList = hasStaticProducts && !catId && !isSearchActive;
  const displayedSuggestions = isBrowsingStaticList
    ? staticProducts
    : suggestions;

  useEffect(() => {
    const fetchPincode = async () => {
      const stored = await secureStore.getItem('pincodeAreaId');
      if (stored) {
        setCurrentPincodeId(parseInt(stored, 10));
      } else if (profile?.pincode) {
        setCurrentPincodeId(profile.pincode);
      }
    };
    fetchPincode();
  }, [profile]);

  // Save search term if results are found
  useEffect(() => {
    if (!loading && searchTerm.trim().length >= 3 && resultCount > 0) {
      saveSearch(searchTerm);
    }
  }, [loading, resultCount, searchTerm, saveSearch]);

  const STICKY_SHADOW_RANGE = 24;
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const stickyShadowAnimStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      scrollY.value,
      [0, STICKY_SHADOW_RANGE],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      shadowOpacity: interpolate(progress, [0, 1], [0, 0.12]),
      elevation: interpolate(progress, [0, 1], [0, 4]),
    };
  });

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.productWrapper}>
        <TokenProductCard
          isThreeColumn={true}
          item={item}
          hideWishlist={false}
          entering={FadeInUp.delay(getStaggerDelay(index))}
          onPress={() =>
            navigation.navigate('ProductDetailsScreen', {
              productId: item.productId || item.id,
              product: item,
            })
          }
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity hitSlop={40} onPress={() => navigation.goBack()}>
            <Image
              source={icons.backArrowNew}
              style={{
                resizeMode: 'contain',
                tintColor: 'black',
              }}
            />
          </TouchableOpacity>
          <Text style={styles.searchText}>
            {catName ? catName : staticTitle ? staticTitle : 'Search'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setIsFilterSortModalVisible(true)}
          style={styles.filterButton}
        >
          <Image source={icons.filter} />
        </TouchableOpacity>
      </View>
      <Animated.View style={[styles.searchContainer, stickyShadowAnimStyle]}>
        <TouchableOpacity hitSlop={12} onPress={() => submitSearch()}>
          <Feather name="search" size={20} color="#F25000" />
        </TouchableOpacity>
        <TextInput
          placeholder="What are you looking for ?"
          placeholderTextColor={'#222222'}
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
          autoFocus={true}
          returnKeyType="search"
          onSubmitEditing={() => submitSearch()}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchTerm('')}
            style={{ marginRight: wp('2%') }}
          >
            <Ionicons name="close-circle" size={wp('5%')} color="#CCCCCC" />
          </TouchableOpacity>
        )}
        <View style={styles.divider} />
        <Feather
          name="clipboard"
          color={'black'}
          size={wp('5%')}
          style={styles.clipboardIcon}
        />
      </Animated.View>

      {isStoreUnavailable ? (
        <StoreUnavailable
          image={storeUnavailableData.image}
          text={storeUnavailableData.text}
          onChangeLocation={() => setIsLocationModalVisible(true)}
        />
      ) : (
        <>
          {isSearchActive && (
            <SearchResultsHeader
              loading={loading}
              resultCount={resultCount}
              isGlobalFallback={isGlobalFallback}
            />
          )}

          <Animated.FlatList
            data={loading ? [] : displayedSuggestions}
            keyExtractor={(item, index) =>
              (item.productId || item.id || index).toString()
            }
            renderItem={renderItem}
            numColumns={3}
            key={3}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            initialNumToRender={9}
            maxToRenderPerBatch={9}
            windowSize={5}
            removeClippedSubviews={Platform.OS === 'android'}
            ListHeaderComponent={
              <RecentSearches
                searchTerm={searchTerm}
                recentSearches={recentSearches}
                onSelect={term => {
                  setSearchTerm(term);
                  submitSearch(term);
                }}
              />
            }
            contentContainerStyle={{
              paddingHorizontal: wp('2%'),
              paddingTop: hp('1%'),
              paddingBottom: hp('10%'),
            }}
            ListEmptyComponent={
              !loading &&
              displayedSuggestions.length === 0 &&
              (isSearchActive || catId || hasStaticProducts) && (
                <View style={styles.emptyContainer}>
                  <Image
                    source={require('../../assets/images/noimages/noproductfound.png')}
                    style={styles.emptyImage}
                  />
                  <Text style={styles.noResultsText}>
                    {isSearchActive
                      ? `No products found for "${searchTerm}"`
                      : `No products found in this category`}
                  </Text>
                </View>
              )
            }
          />
        </>
      )}

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
      <KeyboardStickyView style={styles.floatingContainer}>
        <SelectedProducts />
      </KeyboardStickyView>
    </SafeAreaView>
  );
};

export default SearchScreen;
