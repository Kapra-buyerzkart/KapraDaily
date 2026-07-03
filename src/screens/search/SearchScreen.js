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
  withTiming,
  clamp,
} from 'react-native-reanimated';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import React, { useState, useEffect, useContext } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import useProductSearch, {
  MIN_SEARCH_LENGTH,
} from '../../hooks/useProductSearch';
import secureStore from '../../utils/secureStore';
import { AppContext } from '../../context/appContext';
import TokenProductCard from '../../components/TokenProductCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FilterSortModal from '../../components/FilterSortModal';
import StoreUnavailable from '../../components/StoreUnavailable';
import LocationModal from '../../components/LocationModal';
import SelectedProducts from '../../components/SelectedProducts';
import {
  SCROLL_HIDE_THRESHOLD,
  TAB_BAR_ANIM_DURATION,
  getTabBarClearance,
} from '../../animations/tabBarVisibility';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useRecentSearches from './hooks/useRecentSearches';
import RecentSearches from './components/RecentSearches';
import SearchResultsHeader from './components/SearchResultsHeader';
import styles from './SearchScreen.styles';
import icons from '@/assets/icons';

const SearchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bottom } = useSafeAreaInsets();
  const tabBarClearance = getTabBarClearance(bottom);
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
  const isBrowsingStaticList =
    hasStaticProducts && !catId && searchTerm.trim().length < MIN_SEARCH_LENGTH;
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

  // ── Sticky header elevation ─────────────────────────────────────────────
  // The search bar already sits outside the list (always pinned); this just
  // fades in a subtle shadow once content scrolls beneath it, signaling the
  // fixed header is "elevated" above the list. Shadows/elevation render
  // outside the box model in RN, so this adds zero layout footprint — no
  // height/margin change, no shift to the content below. UI-thread only.
  const STICKY_SHADOW_RANGE = 24;
  const scrollY = useSharedValue(0);

  // SearchScreen sits outside the tab navigator, so there's no real tab bar
  // here to ride — but the cart should still nudge down on scroll-down (and
  // back up on scroll-up) like it does on Home/Categories. This tracks that
  // locally instead of touching the global `tabBarVisibility`.
  const cartVisibility = useSharedValue(1);
  const scrollAnchor = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const y = event.contentOffset.y;
      scrollY.value = y;

      if (y <= 0) {
        scrollAnchor.value = 0;
        if (cartVisibility.value !== 1) {
          cartVisibility.value = withTiming(1, {
            duration: TAB_BAR_ANIM_DURATION,
          });
        }
        return;
      }

      const diff = y - scrollAnchor.value;
      if (diff > SCROLL_HIDE_THRESHOLD) {
        scrollAnchor.value = y;
        if (cartVisibility.value !== 0) {
          cartVisibility.value = withTiming(0, {
            duration: TAB_BAR_ANIM_DURATION,
          });
        }
      } else if (diff < -SCROLL_HIDE_THRESHOLD) {
        scrollAnchor.value = y;
        if (cartVisibility.value !== 1) {
          cartVisibility.value = withTiming(1, {
            duration: TAB_BAR_ANIM_DURATION,
          });
        }
      }
    },
  });

  const cartAnimatedStyle = useAnimatedStyle(() => {
    const progress = clamp(cartVisibility.value, 0, 1);
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

  const renderItem = ({ item }) => {
    return (
      <View style={styles.productWrapper}>
        <TokenProductCard
          isThreeColumn={true}
          item={item}
          hideWishlist={false}
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
            <AntDesign name="left" size={wp('5%')} color="black" />
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
        {/* <Image
          style={
            Platform.OS === 'ios'
              ? styles.searchIcon
              : [styles.searchIcon, { bottom: hp('0.1%') }]
          }
          tintColor={'#F25000'}
          source={require('../../assets/images/search_icon.png')}
        /> */}

        <Feather name="search" size={20} color="#F25000" />
        <TextInput
          placeholder="What are you looking for ?"
          placeholderTextColor={'#222222'}
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
          autoFocus={true}
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
          {searchTerm.trim().length >= MIN_SEARCH_LENGTH && (
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
                onSelect={setSearchTerm}
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
              (searchTerm.trim().length >= MIN_SEARCH_LENGTH ||
                catId ||
                hasStaticProducts) && (
                <View style={styles.emptyContainer}>
                  <Image
                    source={require('../../assets/images/noimages/noproductfound.png')}
                    style={styles.emptyImage}
                  />
                  <Text style={styles.noResultsText}>
                    {searchTerm.trim().length >= MIN_SEARCH_LENGTH
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
      <Animated.View style={[styles.floatingContainer, cartAnimatedStyle]}>
        <SelectedProducts />
      </Animated.View>
    </SafeAreaView>
  );
};

export default SearchScreen;
