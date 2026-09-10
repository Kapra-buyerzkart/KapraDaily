import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useProductSearch from '../../hooks/useProductSearch';
import { useUser } from '../../context/UserContext';
import ProductCard from '../Category/redesign/sections/ProductCard';
import { mapProductTile } from '../Home/redesign/data/mappers';
import { AppIcons } from '../../assets/icons';
import { useWishlist } from '../../context/WishlistContext';
import { getKshopeAreaId, KSHOPE_KEYS } from '../../globals/storage';
import {
  CARD_GAP,
  GUTTER,
  SECTION_GAP,
  HOME_COLORS,
  HOME_FONTS,
  RADIUS,
  SPACE,
  colWidth,
  fs,
  s,
} from '../Home/redesign/theme';

const SURFACE = {
  page: '#FFFFFF',
  wash: '#EFEFF1',
  hairline: '#EDEDF0',
  ink: '#141414',
  inkMuted: '#7A7A7F',
};

const CONTROL = s(38);

const CARD_WIDTH = colWidth(3);

const truncateText = (text: string, limit = 7) => {
  if (!text) return '';
  if (text.length <= limit) return text;
  return text.substring(0, limit) + '..';
};

const SearchScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { catId, catName, attrValueId, query, id } = route.params || {};
  const { top } = useSafeAreaInsets();

  const { profile } = useUser();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [currentPincodeId, setCurrentPincodeId] = useState<number | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [filters] = useState({
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
    loadMore,
    resultCount,
  } = useProductSearch(
    currentPincodeId,
    catId,
    filters,
    attrValueId,
    query || '',
    id ?? null,
  );

  useEffect(() => {
    const fetchPincode = async () => {
      const stored = await getKshopeAreaId();
      if (stored) setCurrentPincodeId(stored);
      else if (profile?.pincode) setCurrentPincodeId(profile.pincode);
    };
    fetchPincode();
    loadRecentSearches();
  }, [profile]);

  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(KSHOPE_KEYS.RECENT_SEARCHES);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {}
  };

  const saveSearch = async (keyword: string) => {
    if (!keyword || keyword.trim().length < 3) return;
    const clean = keyword.trim();
    try {
      const updated = [clean, ...recentSearches.filter(entry => entry !== clean)].slice(
        0,
        10,
      );
      setRecentSearches(updated);
      await AsyncStorage.setItem(
        KSHOPE_KEYS.RECENT_SEARCHES,
        JSON.stringify(updated),
      );
    } catch {}
  };

  useEffect(() => {
    if (!loading && searchTerm.trim().length >= 3 && resultCount > 0) {
      saveSearch(searchTerm);
    }
  }, [loading, resultCount]);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const tile = mapProductTile(item, index);
    return (
      <ProductCard
        item={tile}
        width={CARD_WIDTH}
        compact
        wishlisted={isInWishlist(item.productId || item.id)}
        onPress={() =>
          navigation.navigate('KshopeProductDetails', {
            productId: item.productId || item.id,
            product: item,
          })
        }
        onToggleWishlist={() => toggleWishlist(item)}
      />
    );
  };

  const ListHeader = () => {
    if (searchTerm.length > 0 || recentSearches.length === 0) return null;
    return (
      <View style={styles.recentBlock}>
        <Text style={styles.recentTitle}>Recent Search</Text>
        <View style={styles.recentContainer}>
          {recentSearches.slice(0, 8).map((item, index) => (
            <TouchableOpacity
              key={index}
              testID={`search-recent-chip-${index}`}
              activeOpacity={0.7}
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

  const EmptyState = () => {
    const isBrowsing = Boolean(catId || attrValueId || query);
    const hasQuery = searchTerm.trim().length > 0;
    if (!hasQuery && !isBrowsing) return null;
    return (
      <View testID="search-empty-state" style={styles.emptyContainer}>
        <View style={styles.emptyDisc}>
          <AppIcons.Search color={SURFACE.inkMuted} size={s(30)} />
        </View>
        <Text style={styles.noResultsText}>No items found</Text>
        <Text style={styles.noResultsText1}>
          {hasQuery
            ? `We couldn't find anything for "${searchTerm.trim()}". Try a different keyword or check the spelling.`
            : 'There is nothing to show here right now. Try browsing another category.'}
        </Text>
        {hasQuery && (
          <TouchableOpacity
            testID="search-empty-clear"
            activeOpacity={0.7}
            onPress={() => setSearchTerm('')}
            style={styles.emptyAction}
          >
            <Text style={styles.emptyActionText}>Clear search</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const ListFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={HOME_COLORS.orange} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer} edges={['left', 'right']}>
      <View style={[styles.headerContainer, { paddingTop: top + SPACE.sm }]}>
        <TouchableOpacity
          testID="search-back-button"
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.control}
        >
          <AppIcons.ArrowBack color={SURFACE.ink} size={s(20)} />
        </TouchableOpacity>
        <Text numberOfLines={1} style={styles.searchText}>
          {catName ? catName : 'Search'}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <AppIcons.Search color={SURFACE.inkMuted} size={s(20)} />
        <TextInput
          testID="search-input"
          placeholder="Search Products"
          placeholderTextColor={SURFACE.inkMuted}
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
          autoFocus={!(catId || attrValueId || query)}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity
            testID="search-clear-button"
            activeOpacity={0.7}
            onPress={() => setSearchTerm('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.clearDisc}
          >
            <AppIcons.Close color={SURFACE.inkMuted} size={s(14)} />
          </TouchableOpacity>
        )}
      </View>

      {searchTerm.trim().length > 0 && (
        <View style={styles.resultRow}>
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
        columnWrapperStyle={styles.column}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={loading ? null : <EmptyState />}
      />
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: SURFACE.page },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    paddingBottom: SPACE.sm,
  },
  control: {
    width: CONTROL,
    height: CONTROL,
    borderRadius: RADIUS.pill,
    backgroundColor: SURFACE.page,
    borderWidth: 1,
    borderColor: SURFACE.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchText: {
    flex: 1,
    color: SURFACE.ink,
    fontSize: fs(18),
    fontFamily: HOME_FONTS.semiBold,
    marginLeft: SPACE.md,
  },
  searchContainer: {
    backgroundColor: SURFACE.page,
    height: s(48),
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: SURFACE.hairline,
    marginHorizontal: GUTTER,
    marginTop: SPACE.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACE.lg,
    shadowColor: SURFACE.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: fs(14),
    fontFamily: HOME_FONTS.regular,
    color: SURFACE.ink,
    marginLeft: SPACE.sm,
    padding: 0,
  },
  clearDisc: {
    width: s(22),
    height: s(22),
    borderRadius: RADIUS.pill,
    backgroundColor: SURFACE.wash,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.xl,
  },
  resultText: {
    color: SURFACE.inkMuted,
    fontSize: fs(12),
    fontFamily: HOME_FONTS.regular,
  },
  recentBlock: {
    paddingTop: SECTION_GAP,
  },
  recentTitle: {
    fontSize: fs(14),
    color: SURFACE.ink,
    fontFamily: HOME_FONTS.semiBold,
  },
  recentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACE.md,
  },
  recentProduct: {
    height: s(34),
    borderRadius: RADIUS.pill,
    backgroundColor: SURFACE.page,
    borderWidth: 1,
    borderColor: SURFACE.hairline,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACE.lg,
    marginRight: SPACE.sm,
    marginBottom: SPACE.sm,
  },
  recentProductText: {
    fontSize: fs(12),
    color: SURFACE.ink,
    fontFamily: HOME_FONTS.regular,
  },
  column: {
    justifyContent: 'flex-start',
    gap: CARD_GAP,
  },
  listContent: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.md,
    paddingBottom: SPACE.xxl,
  },
  footer: {
    paddingVertical: SPACE.xl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: s(72),
    paddingHorizontal: SPACE.xl,
  },
  emptyDisc: {
    width: s(72),
    height: s(72),
    borderRadius: RADIUS.pill,
    backgroundColor: SURFACE.wash,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACE.xl,
  },
  emptyAction: {
    marginTop: SPACE.xl,
    height: s(38),
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: SURFACE.hairline,
    paddingHorizontal: SPACE.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyActionText: {
    fontSize: fs(12),
    color: SURFACE.ink,
    fontFamily: HOME_FONTS.semiBold,
  },
  noResultsText: {
    fontSize: fs(15),
    color: SURFACE.ink,
    textAlign: 'center',
    fontFamily: HOME_FONTS.semiBold,
  },
  noResultsText1: {
    fontSize: fs(12),
    lineHeight: fs(18),
    color: SURFACE.inkMuted,
    textAlign: 'center',
    marginTop: SPACE.md,
    fontFamily: HOME_FONTS.regular,
  },
});
