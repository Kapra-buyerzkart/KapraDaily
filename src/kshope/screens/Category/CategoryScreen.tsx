import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { styles } from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme/colours';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppIcons } from '../../assets/icons';
import FilterModal from './FilterModal';
import { getCategoriesApi } from '../../api/services/categoryService';
import { searchProductsApi } from '../../api/services/productService';
import { LoaderContext } from '../../context/loaderContext';
import { useDebounce } from '../../hooks/useDebounce';
import CONFIG from '../../globals/config';
import {
  addToWishlistApi,
  removeFromWishlistApi,
} from '../../api/services/wishlistService';
import { useWishlist } from '../../context/WishlistContext';
import { SORT_OPTIONS } from './constants';
import FloatingCartButton from '../../components/FloatingCartButton';
import FallbackImage from '../../components/FallbackImage';
import { getKshopeAreaId } from '../../globals/storage';

const CategoryScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { catId } = (route.params as any) || {};
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    catId?.toString() || null,
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    string | null
  >(null);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [subCategoriesList, setSubCategoriesList] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [pincodeAreaId, setPincodeAreaId] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { showLoader } = useContext(LoaderContext) || { showLoader: () => {} };
  const { toggleWishlist, isInWishlist, loadWishlist } = useWishlist();
  const productListRef = useRef<FlatList>(null);

  const [filters, setFilters] = useState({
    sortBy: 'relevance',
    priceMin: 0,
    priceMax: 5000,
  });

  const debouncedSearchText = useDebounce(searchText, 500);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return require('../../assets/images/logos/noimage.png');
    if (imagePath.startsWith('http')) return { uri: imagePath };
    return {
      uri: `${CONFIG.image_base_url}/${imagePath}`.replace(
        /([^:]\/)\/+/g,
        '$1',
      ),
    };
  };

  useEffect(() => {
    const initializeLocationAndSettings = async () => {
      try {
        const storedPincodeAreaId = await getKshopeAreaId();
        setPincodeAreaId(storedPincodeAreaId);
      } catch (error) {
        console.error('Error in initializeLocationAndSettings:', error);
      }
    };

    initializeLocationAndSettings();
    fetchCategories();
    loadWishlist();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchSubCategories(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    const catIdToFetch = selectedSubCategoryId || selectedCategoryId;
    if (catIdToFetch) {
      productListRef.current?.scrollToOffset({ offset: 0, animated: false });
      fetchProducts(catIdToFetch);
    }
  }, [selectedSubCategoryId, selectedCategoryId, debouncedSearchText, filters]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      showLoader(true);
      const response = await getCategoriesApi('1');
      if (
        response &&
        response.success &&
        response.data &&
        response.data.items
      ) {
        setCategoriesList(response.data.items);

        let targetCatId = catId?.toString();
        if (!targetCatId && response.data.items.length > 0) {
          targetCatId = response.data.items[0].catId.toString();
        }

        if (targetCatId) {
          setSelectedCategoryId(targetCatId);
        }
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

  const fetchSubCategories = async (parentId: string) => {
    try {
      showLoader(true);
      const response = await getCategoriesApi(parentId);
      if (
        response &&
        response.success &&
        response.data &&
        response.data.items
      ) {
        setSubCategoriesList(response.data.items);
        setSelectedSubCategoryId(null);
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

  const fetchProducts = async (categoryId: string, page = 1) => {
    try {
      if (page === 1) {
        showLoader(true);
      } else {
        setIsLoadingMore(true);
      }

      const payload = {
        pincodeAreaId: pincodeAreaId,
        prName: debouncedSearchText.trim(),
        catId: parseInt(categoryId),
        priceMin: filters.priceMin,
        priceMax: filters.priceMax,
        filterValues: null,
        sortBy: filters.sortBy,
        pageNumber: page,
        pageSize: pageSize,
      };
      const response = await searchProductsApi(payload);

      if (
        response &&
        response.success &&
        response.data &&
        response.data.items
      ) {
        const newItems = response.data.items;
        if (page === 1) {
          setProductsList(newItems);
        } else {
          setProductsList(prev => [...prev, ...newItems]);
        }
        setPageNumber(page);
        setHasMore(newItems.length === pageSize);
      } else {
        if (page === 1) setProductsList([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      if (page === 1) setProductsList([]);
    } finally {
      showLoader(false);
      setIsLoadingMore(false);
    }
  };

  const loadMoreProducts = () => {
    const catIdToFetch = selectedSubCategoryId || selectedCategoryId;
    if (!isLoadingMore && hasMore && catIdToFetch) {
      fetchProducts(catIdToFetch, pageNumber + 1);
    }
  };

  const imageSource = (item: any) => {
    const img = item?.imageUrl || item?.featuredImage;
    if (!img) {
      return require('../../assets/images/logos/noimage.png');
    }
    if (typeof img === 'string') {
      if (img.startsWith('http')) return { uri: img };
      return {
        uri: `${CONFIG.image_base_url}/${img}`.replace(/([^:]\/)\/+/g, '$1'),
      };
    }
    return img;
  };

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.exploreItemCard}
      onPress={() => {
        navigation.navigate('KshopeProductDetails', {
          productId: item?.productId,
          product: item,
        });
      }}
    >
      <View style={styles.exploreTopBadgesRow}>
        <View
          style={[
            styles.discountCircle,
            { opacity: item.discountPercent ? 1 : 0 },
          ]}
        >
          <Text style={[styles.discountCircleText]}>
            {item.discountPercent
              ? `${parseFloat(item.discountPercent).toFixed(1)}%`
              : item.discount}
          </Text>
        </View>

        {isInWishlist(item.productId || item.id) ? (
          <TouchableOpacity onPress={() => toggleWishlist(item)}>
            <AppIcons.BookmarkFilled color={colors.tealIconFont} size={22} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => toggleWishlist(item)}>
            <AppIcons.BookmarkOutline color={colors.greyborder} size={22} />
          </TouchableOpacity>
        )}
      </View>

      <View style={{ position: 'relative' }}>
        <FallbackImage
          source={imageSource(item)}
          style={styles.exploreItemImage}
          resizeMode="contain"
        />
        {(item.stockQty <= 0 || item.stockAvailability === 'Out Of Stock') && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255,255,255,0.6)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: colors.black,
                fontFamily: 'Gilroy-Bold',
                fontSize: 10,
                backgroundColor: 'rgba(255,255,255,0.9)',
                paddingHorizontal: 6,
                paddingVertical: 3,
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              OUT OF STOCK
            </Text>
          </View>
        )}
      </View>

      <View style={{ padding: 8, flex: 1, justifyContent: 'space-between' }}>
        <View>
          <Text style={[styles.caption]} numberOfLines={3}>
            {item.prName || item.title || item.name}
          </Text>
        </View>

        <View>
          <View style={{ height: 20 }} />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 4,
              gap: 4,
            }}
          >
            <View style={styles.pricePill}>
              <Text style={styles.pricePillText}>
                {item.specialPrice?.toString().startsWith('₹')
                  ? item.specialPrice
                  : `₹${item.specialPrice || 0.0}`}
              </Text>
            </View>
            {item.unitPrice ? (
              <Text style={styles.originalPriceText}>
                {item.unitPrice?.toString().includes('MRP')
                  ? item.unitPrice
                  : `MRP ₹${item.unitPrice || item.price}`}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const categoryName =
    categoriesList.find(c => c.catId?.toString() === selectedCategoryId)
      ?.catName || 'Categories';

  const renderSubCategories = React.useCallback(() => {
    if (!subCategoriesList || subCategoriesList.length === 0) return null;
    return (
      <FlatList
        data={subCategoriesList}
        keyExtractor={(item, index) => (item?.catId || index).toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subCatListContainer}
        renderItem={({ item }) => {
          const isActive = selectedSubCategoryId === item.catId?.toString();
          return (
            <TouchableOpacity
              onPress={() =>
                setSelectedSubCategoryId(
                  isActive ? null : item.catId?.toString(),
                )
              }
              style={
                isActive ? styles.subCatPillActive : styles.subCatPillInactive
              }
            >
              <FallbackImage
                style={styles.subCatPillImage}
                source={getImageUrl(item.imageUrl)}
              />
              <Text
                style={
                  isActive
                    ? styles.subCatPillTextActive
                    : styles.subCatPillTextInactive
                }
              >
                {item.catName}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  }, [subCategoriesList, selectedSubCategoryId]);

  return (
    <View style={styles.container}>
      <View style={styles.newHeaderContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color={colors.themeBlack} />
          </TouchableOpacity>
          <Text style={styles.newCategoryHeaderText}>{categoryName}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              if (isSearchVisible) {
                setSearchText('');
              }
              setIsSearchVisible(!isSearchVisible);
            }}
            style={{ marginRight: 15 }}
          >
            <Ionicons
              name={isSearchVisible ? 'close-outline' : 'search-outline'}
              size={24}
              color={colors.themeBlack}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsFilterModalVisible(true)}>
            <Ionicons
              name="options-outline"
              size={24}
              color={colors.themeBlack}
            />
          </TouchableOpacity>
        </View>
      </View>

      {isSearchVisible && (
        <View style={styles.toggleSearchContainer}>
          <Ionicons name="search-outline" size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search product"
            placeholderTextColor="#999999"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#999999" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {categoriesList.map((cat: any, index: number) => {
        const isActive = selectedCategoryId === cat.catId?.toString();
        return (
          isActive && (
            <View
              key={cat.catId?.toString() || index}
              style={styles.bannerContainer}
            >
              <ImageBackground
                source={getImageUrl(cat.mobBannerImgUrl)}
                style={styles.bannerBg}
                resizeMode="cover"
              />
            </View>
          )
        );
      })}

      <View style={styles.mainContent}>
        <View style={styles.sidebarContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {categoriesList.map((cat: any, index: number) => {
              const isActive = selectedCategoryId === cat.catId?.toString();
              return (
                <TouchableOpacity
                  key={cat.catId?.toString() + index}
                  style={styles.sidebarItem}
                  onPress={() => setSelectedCategoryId(cat.catId?.toString())}
                >
                  {isActive ? (
                    <LinearGradient
                      colors={[colors.themeTeal, '#FFB28C', '#FFFFFF']}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={styles.sidebarIconActiveBg}
                    >
                      <View style={styles.sidebarIconWrapperActive}>
                        <FallbackImage
                          source={getImageUrl(cat.imageUrl)}
                          style={styles.sidebarIconImage}
                        />
                      </View>
                    </LinearGradient>
                  ) : (
                    <View style={styles.sidebarIconInactiveBg}>
                      <View style={styles.sidebarIconWrapper}>
                        <FallbackImage
                          source={getImageUrl(cat.imageUrl)}
                          style={styles.sidebarIconImage}
                        />
                      </View>
                    </View>
                  )}
                  <Text
                    style={[
                      styles.sidebarItemText,
                      isActive && styles.sidebarItemTextActive,
                    ]}
                  >
                    {cat.catName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.productsGrid}>
          <FlatList
            ref={productListRef}
            data={productsList}
            keyExtractor={(item, index) =>
              (item.productId || item.id || index).toString()
            }
            numColumns={2}
            showsVerticalScrollIndicator={false}
            renderItem={renderProduct}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            ListHeaderComponent={renderSubCategories}
            onEndReached={loadMoreProducts}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() =>
              isLoadingMore ? (
                <ActivityIndicator
                  size="small"
                  color="#F25000"
                  style={{ marginVertical: 20 }}
                />
              ) : null
            }
            ListEmptyComponent={
              !loading ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 50,
                  }}
                >
                  <Text style={{ fontFamily: 'Outfit-Regular', color: '#999' }}>
                    No products found
                  </Text>
                </View>
              ) : null
            }
          />
        </View>
      </View>

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={(appliedFilters: Record<string, string[]>) => {
          let min = 0,
            max = 50000;
          let sortBy = 'relevance';

          if (appliedFilters['Prize'] && appliedFilters['Prize'].length > 0) {
            const priceOpt = appliedFilters['Prize'][0];
            if (priceOpt === 'Below ₹500') {
              max = 500;
            } else if (priceOpt === '₹500 - ₹1000') {
              min = 500;
              max = 1000;
            } else if (priceOpt === '₹1000 - ₹2000') {
              min = 1000;
              max = 2000;
            } else if (priceOpt === 'Above ₹2000') {
              min = 2000;
              max = 50000;
            }
          }

          if (
            appliedFilters['Sort by'] &&
            appliedFilters['Sort by'].length > 0
          ) {
            sortBy = appliedFilters['Sort by'][0];
          }

          setIsFilterModalVisible(false);

          setTimeout(() => {
            setFilters({ sortBy, priceMin: min, priceMax: max });
          }, 400);
        }}
        categoryName={categoryName}
        categoryImage={
          categoriesList.find(c => c.catId?.toString() === selectedCategoryId)
            ?.imageUrl
        }
      />
      <FloatingCartButton />
    </View>
  );
};

export default CategoryScreen;
