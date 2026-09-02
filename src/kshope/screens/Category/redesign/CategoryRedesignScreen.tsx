import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useWishlist } from '../../../context/WishlistContext';
import FloatingCartButton from '../../../components/FloatingCartButton';
import type { ProductTile } from '../../Home/redesign/content';
import {
  GUTTER,
  HOME_COLORS,
  HOME_FONTS,
  SPACE,
  fs,
} from '../../Home/redesign/theme';
import FilterSheet from './sections/FilterSheet';
import CategoryHeader from './sections/CategoryHeader';
import CategoryChipRow from './sections/CategoryChipRow';
import SubCategoryRow from './sections/SubCategoryRow';
import PromoBanner from './sections/PromoBanner';
import ProductCard from './sections/ProductCard';
import { useCategoryData } from './data/useCategoryData';
import type { Filters } from './data/useCategoryData';

const CategoryStatusBar: React.FC = () => {
  const isFocused = useIsFocused();

  if (!isFocused) {
    return null;
  }

  return (
    <StatusBar
      translucent
      backgroundColor="transparent"
      barStyle="dark-content"
    />
  );
};

const CategoryRedesignScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { catId } = ((route.params as any) || {}) as { catId?: string };

  const { toggleWishlist, isInWishlist } = useWishlist();

  const [filterVisible, setFilterVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const listRef = useRef<FlatList>(null);

  const {
    loading,
    isLoadingMore,
    categoryTiles,
    subCategoryTiles,
    productCards,
    activeCategory,
    categoryName,
    banner,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedSubCategoryId,
    selectSubCategory,
    searchText,
    setSearchText,
    clearSearch,
    activeSearchTerm,
    resultCount,
    filters,
    setFilters,
    filtersActive,
    loadMore,
  } = useCategoryData(catId);

  const openProduct = useCallback(
    (item: ProductTile) => {
      const product = item.raw;
      navigation.navigate('KshopeProductDetails', {
        productId: product?.productId ?? product?.id,
        product,
      });
    },
    [navigation],
  );

  const onSelectCategory = useCallback(
    (id: string) => {
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
      setSelectedCategoryId(id);
    },
    [setSelectedCategoryId],
  );

  const onSelectSubCategory = useCallback(
    (id: string) => {
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
      selectSubCategory(id);
    },
    [selectSubCategory],
  );

  const toggleSearch = useCallback(() => {
    setSearchOpen(open => {
      if (open) {
        clearSearch();
      }
      return !open;
    });
  }, [clearSearch]);

  const applyFilters = useCallback(
    (applied: Filters) => {
      setFilterVisible(false);
      setFilters(applied);
    },
    [setFilters],
  );

  return (
    <View style={styles.container}>
      <CategoryStatusBar />

      <CategoryHeader
        title={categoryName}
        subtitle={activeCategory?.shortDescription}
        searchOpen={searchOpen}
        searchText={searchText}
        onToggleSearch={toggleSearch}
        onChangeSearch={setSearchText}
        onClearSearch={clearSearch}
        onFilterPress={() => setFilterVisible(true)}
        onBack={
          navigation.canGoBack?.() ? () => navigation.goBack() : undefined
        }
        filtersActive={filtersActive}
      />

      <PromoBanner source={banner} />

      <FlatList
        ref={listRef}
        data={productCards}
        keyExtractor={item => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            wishlisted={isInWishlist(item.raw?.productId ?? item.id)}
            onPress={openProduct}
            onToggleWishlist={product => toggleWishlist(product.raw)}
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <CategoryChipRow
              items={categoryTiles}
              activeId={selectedCategoryId}
              onPress={onSelectCategory}
            />
            <SubCategoryRow
              items={subCategoryTiles}
              activeId={selectedSubCategoryId}
              onPress={onSelectSubCategory}
            />
            {activeSearchTerm && resultCount > 0 ? (
              <Text style={styles.resultCount}>
                {`${resultCount} result${
                  resultCount === 1 ? '' : 's'
                } for "${activeSearchTerm}"`}
              </Text>
            ) : null}
          </View>
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore ? (
            <ActivityIndicator
              size="small"
              color={HOME_COLORS.orange}
              style={styles.footerLoader}
            />
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                {activeSearchTerm
                  ? `No products match "${activeSearchTerm}"`
                  : 'No products found'}
              </Text>
            </View>
          ) : null
        }
      />

      <FilterSheet
        visible={filterVisible}
        filters={filters}
        categoryName={categoryName}
        onClose={() => setFilterVisible(false)}
        onApply={applyFilters}
      />
      <FloatingCartButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HOME_COLORS.white,
  },
  header: {
    marginHorizontal: -GUTTER,
  },
  listContent: {
    paddingHorizontal: GUTTER,
    paddingBottom: SPACE.xxl * 2,
  },
  column: {
    justifyContent: 'space-between',
  },
  footerLoader: {
    marginVertical: SPACE.xl,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACE.xxl * 2,
  },
  resultCount: {
    marginTop: SPACE.md,
    paddingHorizontal: GUTTER,
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(11),
    color: HOME_COLORS.muted,
  },
  emptyText: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(13),
    color: HOME_COLORS.muted,
  },
});

export default CategoryRedesignScreen;
