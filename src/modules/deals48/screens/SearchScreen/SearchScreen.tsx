import { DEALS48_ROUTES } from '../../navigation/routes';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import useProductSearch from '../../hooks/useProductSearch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPincodeAreaId } from '../../globals/storage';
import { useUser } from '../../context/UserContext';
import { useCart } from '../../context/CartContext';
import ExploreItem from '../../components/ExploreItem/ExploreItem';
import { AppIcons } from '../../assets/icons';
import { colors } from '../../assets/theme/colours';
import { Fonts } from '../../assets/theme/fonts';
import { useWishlist } from '../../context/WishlistContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const RECENT_SEARCH_KEY = 'DEALS48_recent_searches_list';
const truncateText = (text: string, limit = 7) => {
  if (!text) return '';
  if (text.length <= limit) return text;
  return text.substring(0, limit) + '..';
};

const SearchScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { catId, catName, attrValueId } = route.params || {};

  const { profile } = useUser();
  const { addresses, fetchAddresses } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [currentPincodeId, setCurrentPincodeId] = useState<number | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
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
    isLoadingMore,
    hasMore,
    loadMore,
    resultCount,
  } = useProductSearch(currentPincodeId, catId, filters, attrValueId);

  useEffect(() => {
    const fetchPincode = async () => {
      const stored = await getPincodeAreaId();
      if (stored) setCurrentPincodeId(parseInt(stored));
      else if (profile?.pincode) setCurrentPincodeId(profile.pincode);
    };
    fetchPincode();
    loadRecentSearches();
  }, [profile]);

  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCH_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch (error) {}
  };

  const saveSearch = async (keyword: string) => {
    if (!keyword || keyword.trim().length < 3) return;
    const clean = keyword.trim();
    try {
      const updated = [clean, ...recentSearches.filter(s => s !== clean)].slice(
        0,
        10,
      );
      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
    } catch (error) {}
  };

  useEffect(() => {
    if (!loading && searchTerm.trim().length >= 3 && resultCount > 0) {
      saveSearch(searchTerm);
    }
  }, [loading, resultCount]);

  const renderItem = ({ item }: { item: any }) => {
    return (
      <ExploreItem
        item={item}
        onPress={() =>
          navigation.navigate(DEALS48_ROUTES.PRODUCT_DETAILS, {
            productId: item.productId || item.id,
            product: item,
          })
        }
        toggleWishlist={() => toggleWishlist(item)}
        isInWishlist={() => isInWishlist(item.productId || item.id)}
        style={{
          width: wp('29%'),
          marginBottom: hp('1.5%'),
          image: { height: 80 },
          caption: { fontSize: 9, height: 28 },
          pricePill: {
            minWidth: 45,
            height: 20,
            borderRadius: 6,
            paddingHorizontal: 4,
          },
          pricePillText: { fontSize: 10 },
          originalPriceText: { fontSize: 7 },
        }}
      />
    );
  };

  const ListHeader = () => {
    if (searchTerm.length > 0 || recentSearches.length === 0) return null;
    return (
      <View>
        <Text style={styles.recentTitle}>Recent Search</Text>
        <View style={styles.recentContainer}>
          {recentSearches.slice(0, 8).map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recentProduct}
              onPress={() => setSearchTerm(item)}
            >
              <Text style={styles.recentProductText}>
                {truncateText(item, 10)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const ListFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" color="#F25000" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ paddingHorizontal: 10 }}
          >
            <AppIcons.ArrowBack
              color={(colors.black as any) || '#000'}
              size={24}
            />
          </TouchableOpacity>
          <Text style={styles.searchText}>{catName ? catName : 'Search'}</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <AppIcons.Search color={(colors.black as any) || '#000'} size={24} />
        <TextInput
          placeholder="Search Products"
          placeholderTextColor={(colors as any).gray || '#666'}
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
          autoFocus={!(catId || attrValueId)}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchTerm('')}
            style={{ padding: 5 }}
          >
            <AppIcons.Close color={(colors as any).gray || '#666'} size={20} />
          </TouchableOpacity>
        )}
      </View>

      {searchTerm.trim().length > 0 && (
        <View
          style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}
        >
          <Text style={styles.resultText}>
            {loading ? 'Searching...' : `Results found: ${resultCount}`}
          </Text>
        </View>
      )}

      <FlatList
        data={suggestions}
        keyExtractor={(item, index) =>
          (item.productId || item.id || index).toString()
        }
        renderItem={renderItem}
        numColumns={3}
        key={3}
        columnWrapperStyle={{ justifyContent: 'flex-start', gap: wp('0.1%') }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        // contentContainerStyle={{
        //   // paddingHorizontal: 4,
        //   marginStart: 10,
        //   //marginHorizontal: wp('1%'),
        //   paddingTop: 10,
        //   paddingBottom: 100,
        // }}
        contentContainerStyle={{
          padding: 8,
        }}
        ListEmptyComponent={
          !loading &&
          suggestions.length === 0 &&
          (searchTerm.length > 0 || catId) ? (
            <View style={styles.emptyContainer}>
              <Image
                source={require('../../assets/images/logos/no_res.png')}
                style={styles.noResultsImage}
                resizeMode="contain"
              />
              <Text style={styles.noResultsText}>No Products Found</Text>

              <Text style={styles.noResultsText1}>
                {searchTerm.length > 0
                  ? `No products found for "${searchTerm}"`
                  : `No products found in this category`}
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 10,
  },
  searchText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 15,
  },
  searchContainer: {
    backgroundColor: '#F0F0F0',
    height: 45,
    borderRadius: 8,
    marginHorizontal: 15,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchInput: { flex: 1, fontSize: 16, color: '#222222', marginLeft: 10 },
  resultText: { color: '#000000', fontSize: 14, fontWeight: '500' },
  productWrapper: { flex: 1 / 2, margin: 5 },
  recentTitle: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
    marginLeft: 10,
    marginTop: 20,
  },
  recentProduct: {
    height: 32,
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  recentProductText: { fontSize: 13, color: '#444444' },
  recentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 10,
    marginTop: 15,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  noResultsImage: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  noResultsText: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: (Fonts as any)?.gilroySemiBold || 'System',
  },
  noResultsText1: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 30,
  },
});
