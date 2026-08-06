import { View, Text, Image, Platform, ActivityIndicator } from 'react-native';
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
import FilterSortModal from '../../components/FilterSortModal';
import StoreUnavailable from '../../components/StoreUnavailable';
import LocationModal from '../../components/LocationModal';
import SelectedProducts from '../../components/SelectedProducts';
import useRecentSearches from './hooks/useRecentSearches';
import RecentSearches from './components/RecentSearches';
import SearchResultsHeader from './components/SearchResultsHeader';
import SearchHeader from './components/SearchHeader';
import styles from './SearchScreen.styles';
import { BORDER_FADE_RANGE } from '@/styles/motion';

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
    searching,
    resultCount,
    isGlobalFallback,
  } = useProductSearch(currentPincodeId, catId, filters);

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

  useEffect(() => {
    if (!loading && searchTerm.trim().length >= 3 && resultCount > 0) {
      saveSearch(searchTerm);
    }
  }, [loading, resultCount, searchTerm, saveSearch]);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerRuleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      BORDER_FADE_RANGE,
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

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
      <SearchHeader
        title={catName ? catName : staticTitle ? staticTitle : 'Search'}
        searchTerm={searchTerm}
        onChangeText={setSearchTerm}
        onSubmit={submitSearch}
        onClear={() => setSearchTerm('')}
        onBack={() => navigation.goBack()}
        onFilter={() => setIsFilterSortModalVisible(true)}
        ruleStyle={headerRuleStyle}
      />

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
            data={searching ? [] : displayedSuggestions}
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
              searching ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#F25000" />
                </View>
              ) : (
                displayedSuggestions.length === 0 &&
                (isSearchActive || catId || hasStaticProducts) && (
                  <View style={styles.emptyContainer}>
                    <Image
                      source={require('../../assets/images/udendeal.png')}
                      style={styles.emptyImage}
                    />
                    <Text style={styles.noResultsText}>
                      {isSearchActive
                        ? `No products found for "${searchTerm}"`
                        : `No products found in this category`}
                    </Text>
                  </View>
                )
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
