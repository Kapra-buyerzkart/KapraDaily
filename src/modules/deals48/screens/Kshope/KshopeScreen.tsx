import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  FlatList,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import { useWishlist } from '../../context/WishlistContext';
import { getHomepageData } from '../../api/services/homeService';
import { AppIcons } from '../../assets/icons';
import CONFIG from '../../globals/config';
import ProductCard from '../../components/ProductCard';
import ExploreItem from '../../components/ExploreItem/ExploreItem';
import ClickForMoreButton from '../../components/ClickForMoreButton/ClickForMoreButton';

import { getPincodeAreaId } from '../../globals/storage';
import { Fonts } from '../../assets/theme/fonts';
import { colors } from '../../assets/theme/colours';
import HomeSearchBar from '../../components/HomeSearchBar/HomeSearchBar';
import { DEALS48_ROUTES } from '../../navigation/routes';

const { width } = Dimensions.get('window');

const KshopeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { profile } = useUser();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [refreshing, setRefreshing] = useState(false);
  const [homeData, setHomeData] = useState<any>(null);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [midBannerIndex, setMidBannerIndex] = useState(0);
  const [bestSellingIndex, setBestSellingIndex] = useState(0);
  const [selectedAccessorize, setSelectedAccessorize] = useState<string | null>(
    null,
  );
  const bannerRef = useRef<FlatList>(null);

  const userName =
    profile?.custName || profile?.name || profile?.firstName || 'Guest';

  const fetchData = async () => {
    try {
      const storedPincodeAreaId = await getPincodeAreaId();
      const areaId = storedPincodeAreaId
        ? parseInt(storedPincodeAreaId)
        : profile?.pincode || null;

      const data = await getHomepageData(areaId, 100);
      setHomeData(data?.data || data);
    } catch (e) {
      console.error('Error fetching home data for K-shope', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  const topBanner =
    homeData?.banners?.filter(
      (b: any) =>
        b.placementKey === 'app_home_top_banner' ||
        b.PlacementKey === 'app_home_top_banner',
    ) || [];

  const midBanner =
    homeData?.banners?.filter(
      (b: any) =>
        b.placementKey === 'app_home_mid_banner' ||
        b.PlacementKey === 'app_home_mid_banner',
    ) || [];

  const bottomBanner =
    homeData?.banners?.filter(
      (b: any) =>
        b.placementKey === 'app_home_bottom' ||
        b.PlacementKey === 'app_home_bottom',
    ) || [];

  const topBrands =
    (homeData?.brands && homeData.brands.length > 0)
      ? homeData.brands
      : (homeData?.topBrands && homeData.topBrands.length > 0)
      ? homeData.topBrands
      : (homeData?.banners?.filter(
          (b: any) =>
            b.placementKey === 'app_top_brands' ||
            b.PlacementKey === 'app_top_brands',
        ) || []);

  const gShockMainBanner = homeData?.banners?.find(
    (b: any) =>
      b.placementKey === 'app_home_bottom_showcase_banner_image' ||
      b.PlacementKey === 'app_home_bottom_showcase_banner_image',
  );
  const activeGShockItems =
    homeData?.banners?.filter(
      (b: any) =>
        b.placementKey === 'app_home_bottom_showcase_product_image' ||
        b.PlacementKey === 'app_home_bottom_showcase_product_image',
    ) || [];

  const bestSelling = homeData?.showcaseSlider || [];

  const categories =
    homeData?.featuredCategories || homeData?.FeaturedCategories || [];

  const unwrapBlock = (block: any): any => {
    if (!block) return null;
    let current = block;
    for (let i = 0; i < 3; i++) {
      if (
        typeof current === 'string' &&
        (current.trim().startsWith('{') || current.trim().startsWith('['))
      ) {
        try {
          current = JSON.parse(current);
        } catch (e) {
          break;
        }
      } else {
        break;
      }
    }
    if (current && typeof current === 'object') {
      if (current.firstProductBlock) current = current.firstProductBlock;
      else if (current.FirstProductBlock) current = current.FirstProductBlock;
      else if (current.secondProductBlock) current = current.secondProductBlock;
      else if (current.SecondProductBlock) current = current.SecondProductBlock;
      else if (current.data && !current.items && !current.Items)
        current = current.data;
      if (
        typeof current === 'string' &&
        (current.trim().startsWith('{') || current.trim().startsWith('['))
      ) {
        try {
          current = JSON.parse(current);
        } catch (e) {}
      }
    }
    return current;
  };

  const getItems = (block: any) => {
    if (!block) return [];
    if (Array.isArray(block)) return block;
    if (block.items && Array.isArray(block.items)) return block.items;
    if (block.Items && Array.isArray(block.Items)) return block.Items;
    if (block.data && Array.isArray(block.data)) return block.data;
    return [];
  };

  const parsedFirstBlock = unwrapBlock(
    homeData?.firstProductBlock || homeData?.firstproductblock,
  );
  const parsedSecondBlock = unwrapBlock(
    homeData?.secondProductBlock || homeData?.secondproductblock,
  );

  const activeGoatDeals =
    homeData?.banners?.filter(
      (b: any) => b.placementKey === 'app_home_cat_top_sidebyside_four',
    ) || [];

  const activeFirstProducts = getItems(parsedFirstBlock).filter(
    (i: any) => i && (i.productId || i.id),
  );
  const activeSecondProducts = getItems(parsedSecondBlock).filter(
    (i: any) => i && (i.productId || i.id),
  );

  // Auto-scroll banners
  useEffect(() => {
    if (!topBanner || topBanner.length <= 1) return;
    const timer = setInterval(() => {
      setBannerIndex(prev => {
        const next = (prev + 1) % topBanner.length;
        bannerRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [topBanner]);

  const getImageSource = (imgPath: any) => {
    if (!imgPath) return require('../../assets/images/logo.png'); // fallback
    if (typeof imgPath === 'object' && imgPath.uri) return imgPath;
    if (typeof imgPath === 'string') {
      const trimmedPath = imgPath.trim();
      if (trimmedPath.startsWith('http')) return { uri: trimmedPath };
      const base = CONFIG.image_base_url.replace(/\/$/, '');
      const path = trimmedPath.startsWith('/')
        ? trimmedPath
        : `/${trimmedPath}`;
      return { uri: `${base}${path}` };
    }
    return imgPath;
  };

  const handleBannerPress = (banner: any) => {
    if (!banner) return;
    const linkType = (banner.linkType || banner.LinkType || '').toLowerCase();
    const linkValue = banner.linkValue || banner.LinkValue;
    if (linkType === 'product') {
      navigation.navigate(DEALS48_ROUTES.PRODUCT_DETAILS, { productId: linkValue });
    } else if (linkType === 'category') {
      navigation.navigate(DEALS48_ROUTES.SEARCH, {
        catId: linkValue,
        catName: 'Category',
      });
    }
  };

  const handleCategoryPress = (cat: any) => {
    navigation.navigate(DEALS48_ROUTES.SEARCH, {
      catId: cat.catId || cat.id,
      catName: cat.catName || cat.name,
    });
  };

  const displayCategories = categories.slice(0, 8);
  let rawTabShowcase =
    homeData?.categoryTabShowcase ||
    homeData?.CategoryTabShowcase ||
    homeData?.categorytabshowcase;

  if (!rawTabShowcase && homeData?.data) {
    rawTabShowcase =
      homeData.data.categoryTabShowcase ||
      homeData.data.CategoryTabShowcase ||
      homeData.data.categorytabshowcase;
  }

  let parsedTabShowcase = unwrapBlock(rawTabShowcase);

  if (parsedTabShowcase && !Array.isArray(parsedTabShowcase)) {
    parsedTabShowcase =
      parsedTabShowcase.categoryTabShowcase ||
      parsedTabShowcase.CategoryTabShowcase ||
      parsedTabShowcase.categorytabshowcase ||
      parsedTabShowcase.data ||
      parsedTabShowcase.items ||
      parsedTabShowcase.Items ||
      parsedTabShowcase;
    parsedTabShowcase = unwrapBlock(parsedTabShowcase); // Unwrap again in case of double-stringified payload
  }

  const accessorizeCategories = Array.isArray(parsedTabShowcase)
    ? parsedTabShowcase
    : [];

  useEffect(() => {
    if (accessorizeCategories.length > 0) {
      const exists = accessorizeCategories.some((t: any) => {
        const tId = t.tabId || t.TabId || t.catId || t.CatId || t.id || t.Id;
        return String(tId) === String(selectedAccessorize);
      });
      if (!exists || !selectedAccessorize) {
        const firstItem = accessorizeCategories[0];
        const firstId =
          firstItem.tabId ||
          firstItem.TabId ||
          firstItem.catId ||
          firstItem.CatId ||
          firstItem.id ||
          firstItem.Id;
        setSelectedAccessorize(firstId);
      }
    }
  }, [accessorizeCategories]);

  const renderBannerItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => handleBannerPress(item)}
      style={styles.bannerSlide}
    >
      <Image
        source={getImageSource(item.imageUrl || item.ImageUrl)}
        style={styles.bannerImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: any }) => {
    const imgSrc =
      item.image || item.imageUrl
        ? getImageSource(item.imageUrl || item.image)
        : require('../../assets/images/logo.png');
    return (
      <TouchableOpacity
        style={styles.categoryItem}
        onPress={() => handleCategoryPress(item)}
      >
        <LinearGradient
          colors={['#F25000', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.categoryCircle}
        >
          <Image
            source={imgSrc}
            style={styles.categoryImage}
            resizeMode="contain"
          />
        </LinearGradient>
        <Text style={styles.categoryLabel} numberOfLines={2}>
          {item.catName || item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderAccessorizeItem = ({ item }: { item: any }) => {
    const tabImage =
      item.tabImageUrl ||
      item.TabImageUrl ||
      item.imageUrl ||
      item.ImageUrl ||
      item.image ||
      item.Image;
    const imgSrc = tabImage
      ? getImageSource(tabImage)
      : require('../../assets/images/logo.png');

    const itemId =
      item.tabId ||
      item.TabId ||
      item.catId ||
      item.CatId ||
      item.id ||
      item.Id;
    const isSelected = String(selectedAccessorize) === String(itemId);
    const title =
      item.tabName ||
      item.TabName ||
      item.catName ||
      item.CatName ||
      item.name ||
      item.Name;

    return (
      <TouchableOpacity
        style={[
          styles.accessorizeCard,
          isSelected && styles.accessorizeCardActive,
        ]}
        onPress={() => setSelectedAccessorize(itemId)}
      >
        <View style={styles.accessorizeImageContainer}>
          <Image
            source={imgSrc}
            style={styles.accessorizeImage}
            resizeMode="cover"
          />
        </View>
        <Text
          style={[
            styles.accessorizeLabel,
            isSelected && { color: colors.themeWhite },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMidBanner = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => handleBannerPress(item)}
      style={styles.midBannerCard}
    >
      <Image
        source={getImageSource(item.imageUrl || item.ImageUrl)}
        style={styles.midBannerImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderBrandItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.brandCard}
      onPress={() => {
        if (item.attrValueId !== undefined && item.attrValueId !== null) {
          navigation.navigate(DEALS48_ROUTES.SEARCH, {
            attrValueId: item.attrValueId,
            catName: item.brandName || 'Brand',
          });
        } else {
          handleBannerPress(item);
        }
      }}
    >
      <Image
        source={getImageSource(item.brandImage || item.imageUrl || item.ImageUrl || item.image || item.logo)}
        style={styles.brandImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  const renderGShockCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.gShockCard}
      onPress={() => handleBannerPress(item)}
    >
      <Image
        source={getImageSource(item.imageUrl || item.ImageUrl)}
        style={styles.gShockCardImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  const renderGoatDeal = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.goatDealCard}
      onPress={() => handleBannerPress(item)}
    >
      <Image
        source={getImageSource(item.imageUrl || item.ImageUrl)}
        style={styles.goatDealBg}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <LinearGradient
        colors={[colors.themeTeal, colors.themeDarkTeal]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.profileArea}
            onPress={() => navigation.navigate(DEALS48_ROUTES.PROFILE)}
          >
            <View style={styles.profileImageReal}>
              <AppIcons.User size={20} color={colors.themeTeal} />
            </View>
            <Text style={styles.userName}>
              {profile?.custName
                ? profile.custName.length > 15
                  ? `${profile.custName.substring(0, 15)}...`
                  : profile.custName
                : 'Guest User'}
            </Text>
          </TouchableOpacity>

          <View style={styles.actionsPill}>
            <TouchableOpacity
              style={styles.actionIcon}
              onPress={() => navigation.navigate(DEALS48_ROUTES.CART)}
            >
              <AppIcons.Bag color={colors.black} size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionIcon}>
              <AppIcons.Bell color={colors.black} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SEARCH BAR */}
        <View style={{ paddingHorizontal: 16, paddingBottom: hp('2.5%') }}>
          <HomeSearchBar placeholder="Search product" />
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00BCD4"
          />
        }
        contentContainerStyle={{ paddingBottom: hp('12%') }}
      >
        {/* FLASH SALE BANNER CAROUSEL */}
        {topBanner && topBanner.length > 0 && (
          <View style={styles.bannerContainer}>
            <FlatList
              ref={bannerRef}
              data={topBanner}
              renderItem={renderBannerItem}
              keyExtractor={(_, i) => i.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={e => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / width);
                setBannerIndex(idx);
              }}
            />
            {topBanner.length > 1 && (
              <View style={styles.dotsRow}>
                {topBanner.map((_: any, i: number) => (
                  <View
                    key={i}
                    style={[styles.dot, bannerIndex === i && styles.activeDot]}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* OUR CATEGORIES */}
        {displayCategories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>OUR CATEGORIES</Text>
            <FlatList
              data={displayCategories}
              renderItem={renderCategoryItem}
              keyExtractor={(item, i) => (item.catId || i).toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesGrid}
            />
          </View>
        )}

        {/* ACCESSORIZE */}
        {accessorizeCategories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ACCESSORIZE</Text>
            <FlatList
              data={accessorizeCategories}
              renderItem={renderAccessorizeItem}
              keyExtractor={(item, i) => `acc_${item.catId || i}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: wp('4%') }}
            />
            {/* Dynamic accessorize banner below the list */}
            {(() => {
              const activeTab = accessorizeCategories.find((t: any) => {
                const tId =
                  t.tabId || t.TabId || t.catId || t.CatId || t.id || t.Id;
                return String(tId) === String(selectedAccessorize);
              });
              const activeTabItems = activeTab?.items || activeTab?.Items || [];
              if (activeTabItems.length === 0) return null;

              return (
                <LinearGradient
                  colors={['#F25000', '#FFFFFF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.dummyAccessorizeContainer}
                >
                  <FlatList
                    data={activeTabItems}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: wp('4%') }}
                    keyExtractor={(item, idx) => `tabItem_${item.catId || idx}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.accessorizeBannerCard}
                        onPress={() => {
                          navigation.navigate(DEALS48_ROUTES.PRODUCT_CATEGORY, {
                            catId: item.catId,
                            title: item.displayTitle || item.name || 'Category',
                          });
                        }}
                      >
                        <Image
                          source={getImageSource(
                            item.imageUrl ||
                              item.ImageUrl ||
                              item.image ||
                              item.Image,
                          )}
                          style={styles.dummyAccessorizeImage}
                          resizeMode="contain"
                        />
                        {/* <View style={styles.bannerTextOverlay}>
                          <Text style={styles.bannerTitleText}>
                            {item.displayTitle || item.catName || item.name}
                          </Text>
                        </View> */}
                      </TouchableOpacity>
                    )}
                  />
                </LinearGradient>
              );
            })()}
          </View>
        )}

        {/* TOP BRANDS */}
        {topBrands && topBrands.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TOP BRANDS</Text>
            <FlatList
              data={topBrands}
              renderItem={renderBrandItem}
              keyExtractor={(_, i) => `brand_${i}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: wp('3%') }}
            />
          </View>
        )}

        {/* G-SHOCK SHOWCASE */}
        {activeGShockItems?.length > 0 && gShockMainBanner && (
          <View style={styles.section}>
            <ImageBackground
              source={{
                uri: CONFIG.image_base_url + gShockMainBanner.imageUrl,
              }}
              style={styles.gShockTopBanner}
              resizeMode="cover"
            >
              <View
                style={{
                  paddingHorizontal: 16,
                  position: 'absolute',
                  bottom: 40,
                  left: 0,
                  right: 0,
                }}
              >
                <FlatList
                  data={activeGShockItems}
                  renderItem={renderGShockCard}
                  keyExtractor={(item, index) =>
                    item.bannerId?.toString() ||
                    item.id?.toString() ||
                    index.toString()
                  }
                  numColumns={2}
                  columnWrapperStyle={{
                    justifyContent: 'space-between',
                  }}
                  scrollEnabled={false}
                />
              </View>
            </ImageBackground>
          </View>
        )}

        {/* BEST SELLING */}
        {bestSelling && bestSelling.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>BEST SELLING</Text>
            <View style={styles.bestSellingCard}>
              {/* Side peeking images */}
              {bestSellingIndex > 0 && (
                <Image
                  source={getImageSource(
                    bestSelling[bestSellingIndex - 1].imageUrl ||
                      bestSelling[bestSellingIndex - 1].image,
                  )}
                  style={[styles.sideImage, styles.sideImageLeft]}
                  resizeMode="contain"
                />
              )}
              {bestSellingIndex < bestSelling.length - 1 && (
                <Image
                  source={getImageSource(
                    bestSelling[bestSellingIndex + 1].imageUrl ||
                      bestSelling[bestSellingIndex + 1].image,
                  )}
                  style={[styles.sideImage, styles.sideImageRight]}
                  resizeMode="contain"
                />
              )}

              {/* Main active image */}
              <View style={styles.centerImageContainer}>
                <Image
                  source={getImageSource(
                    bestSelling[bestSellingIndex].imageUrl ||
                      bestSelling[bestSellingIndex].image,
                  )}
                  style={styles.centerImage}
                  resizeMode="contain"
                />
              </View>

              {/* Navigation Arrows */}
              <View style={styles.arrowRow}>
                {bestSellingIndex > 0 ? (
                  <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => setBestSellingIndex(prev => prev - 1)}
                  >
                    <Ionicons name="chevron-back" size={24} color="#FFF" />
                  </TouchableOpacity>
                ) : (
                  <View style={{ width: wp('10%') }} />
                )}
                <View style={{ flex: 1 }} />
                {bestSellingIndex < bestSelling.length - 1 ? (
                  <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => setBestSellingIndex(prev => prev + 1)}
                  >
                    <Ionicons name="chevron-forward" size={24} color="#FFF" />
                  </TouchableOpacity>
                ) : (
                  <View style={{ width: wp('10%') }} />
                )}
              </View>

              {/* Top Text Info */}
              <View style={styles.bestSellingTextOverlay}>
                <Text style={styles.bestSellingTitleText}>
                  {bestSelling[bestSellingIndex].brand ||
                    bestSelling[bestSellingIndex].prName ||
                    'Product'}
                </Text>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.bestSellingPriceText}>
                    ₹
                    {bestSelling[bestSellingIndex].specialPrice ||
                      bestSelling[bestSellingIndex].price ||
                      '0'}
                  </Text>
                  <Text style={styles.bestSellingMrpText}>
                    MRP ₹
                    {bestSelling[bestSellingIndex].unitPrice ||
                      bestSelling[bestSellingIndex].originalPrice ||
                      '0'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Footer Button */}
            <View style={{ marginTop: 16 }}>
              <ClickForMoreButton
                onPress={() => {
                  navigation.navigate(DEALS48_ROUTES.PRODUCT_CATEGORY, {
                    title: 'Best Selling',
                    products: bestSelling,
                  });
                }}
                title="Click for more offers"
              />
            </View>
          </View>
        )}

        {/* FIRST PRODUCT BLOCK */}
        {activeFirstProducts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {parsedFirstBlock?.title ||
                parsedFirstBlock?.Title ||
                'Top Deals'}
            </Text>
            <FlatList
              data={activeFirstProducts}
              renderItem={({ item }) => (
                <ExploreItem
                  item={item}
                  onPress={() =>
                    navigation.navigate(DEALS48_ROUTES.PRODUCT_DETAILS, {
                      productId: item.productId,
                      product: item,
                    })
                  }
                  toggleWishlist={toggleWishlist}
                  isInWishlist={id => isInWishlist(id)}
                />
              )}
              keyExtractor={(item, i) => `first_${item.productId || i}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: wp('4%') }}
            />
            <View style={{ marginTop: 16 }}>
              <ClickForMoreButton
                onPress={() => {
                  const id =
                    parsedFirstBlock?.catId ||
                    parsedFirstBlock?.CatId ||
                    parsedFirstBlock?.id ||
                    parsedFirstBlock?.Id ||
                    parsedFirstBlock?.categoryId ||
                    parsedFirstBlock?.CategoryId;
                  navigation.navigate(DEALS48_ROUTES.PRODUCT_CATEGORY, {
                    catId: id?.toString(),
                    title: parsedFirstBlock?.title || 'Top Deals',
                  });
                }}
                title={`Click for more ${parsedFirstBlock?.title || 'Deals'}`}
              />
            </View>
          </View>
        )}

        {/* MID BANNERS */}
        {midBanner && midBanner.length > 0 && (
          <View style={styles.section}>
            <FlatList
              data={midBanner}
              renderItem={renderMidBanner}
              keyExtractor={(_, i) => `mid_${i}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={wp('93%')}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: wp('4%') }}
              onMomentumScrollEnd={e => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.x / wp('93%'),
                );
                setMidBannerIndex(index);
              }}
            />
            <View style={styles.indicatorContainer}>
              {midBanner.map((_: any, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.indicatorPill,
                    midBannerIndex === index && styles.indicatorPillActive,
                  ]}
                />
              ))}
            </View>
          </View>
        )}
        {/* GOAT DEALS */}
        {activeGoatDeals && activeGoatDeals.length > 0 && (
          <View style={[styles.section, { paddingHorizontal: 16 }]}>
            <Text style={styles.sectionTitle}>GOAT DEALS</Text>
            <FlatList
              data={activeGoatDeals}
              renderItem={renderGoatDeal}
              keyExtractor={(item, index) =>
                item.bannerId?.toString() ||
                item.id?.toString() ||
                index.toString()
              }
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              scrollEnabled={false}
            />
          </View>
        )}
        {/* SECOND PRODUCT BLOCK */}
        {activeSecondProducts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {parsedSecondBlock?.title ||
                parsedSecondBlock?.Title ||
                'Featured Products'}
            </Text>
            <FlatList
              data={activeSecondProducts}
              renderItem={({ item }) => (
                <ExploreItem
                  item={item}
                  onPress={() =>
                    navigation.navigate(DEALS48_ROUTES.PRODUCT_DETAILS, {
                      productId: item.productId,
                      product: item,
                    })
                  }
                  toggleWishlist={toggleWishlist}
                  isInWishlist={id => isInWishlist(id)}
                />
              )}
              keyExtractor={(item, i) => `second_${item.productId || i}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: wp('4%') }}
            />
            <View style={{ marginTop: 16 }}>
              <ClickForMoreButton
                onPress={() => {
                  const id =
                    parsedSecondBlock?.catId ||
                    parsedSecondBlock?.CatId ||
                    parsedSecondBlock?.id ||
                    parsedSecondBlock?.Id ||
                    parsedSecondBlock?.categoryId ||
                    parsedSecondBlock?.CategoryId;
                  navigation.navigate(DEALS48_ROUTES.PRODUCT_CATEGORY, {
                    catId: id?.toString(),
                    title: parsedSecondBlock?.title || 'Featured Products',
                  });
                }}
                title={`Click for more ${
                  parsedSecondBlock?.title || 'Featured'
                }`}
              />
            </View>
          </View>
        )}

        {/* BOTTOM BANNERS */}
        {bottomBanner && bottomBanner.length > 0 && (
          <View style={styles.section}>
            <FlatList
              data={bottomBanner}
              renderItem={renderMidBanner}
              keyExtractor={(_, i) => `bottom_${i}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={wp('48%')}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: wp('4%') }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    // paddingHorizontal: wp('4%'),
    paddingTop: hp('1%'),
    // paddingBottom: hp('2%'),
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: hp('0.5%'),
  },
  profileArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageReal: {
    width: 32,
    height: 32,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontFamily: Fonts.gilroyMedium,
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  actionsPill: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 20,
    width: 101,
    height: 34,
    paddingHorizontal: 10,
  },
  actionIcon: {
    position: 'relative',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('4%'),
  },
  headerIcon: {
    padding: wp('1%'),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: wp('6%'),
    paddingHorizontal: wp('4%'),
    height: hp('5.5%'),
    marginTop: hp('0.5%'),
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: wp('2%'),
    fontSize: wp('3.5%'),
    color: '#999999',
  },
  bannerContainer: {
    marginTop: hp('0.5%'),
    backgroundColor: colors.themeDarkTeal,
  },
  bannerSlide: {
    width: width,
    height: hp('22%'),
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('1%'),
    marginBottom: hp('0.5%'),
  },
  dot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    backgroundColor: '#CCCCCC',
    marginHorizontal: wp('0.8%'),
  },
  activeDot: {
    backgroundColor: '#00BCD4',
    width: wp('2.5%'),
    height: wp('2.5%'),
  },
  section: {
    marginTop: hp('3%'),
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    color: '#222222',
    textAlign: 'center',
    marginBottom: hp('1.5%'),
    letterSpacing: 1,
    fontWeight: '600',
  },
  categoriesGrid: {
    paddingHorizontal: wp('4%'),
  },
  categoryItem: {
    width: (width - wp('8%')) / 4,
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  categoryCircle: {
    width: wp('18%'),
    height: wp('18%'),
    borderRadius: wp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  categoryImage: {
    width: wp('11%'),
    height: wp('11%'),
  },
  categoryLabel: {
    fontSize: wp('3%'),
    color: colors.black1,
    fontFamily: Fonts.gilroyBold,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: hp('0.5%'),
    width: wp('18%'),
  },
  accessorizeCard: {
    width: wp('22%'),
    // borderRadius: wp('4%'),
    // backgroundColor: '#F8F8F8',

    paddingVertical: hp('1.5%'),
    marginRight: wp('2%'),
    alignItems: 'center',
    // marginRight: wp('1%'),
    paddingTop: hp('1%'),
    paddingBottom: hp('1.5%'),
    borderTopLeftRadius: wp('3%'),
    borderTopRightRadius: wp('3%'),
  },
  accessorizeCardActive: {
    backgroundColor: '#F25000',
    borderColor: '#F25000',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  accessorizeImageContainer: {
    width: wp('16%'),
    height: wp('16%'),
    borderWidth: 0.5,
    borderColor: '#EEE',
    borderRadius: wp('3%'),
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('0.5%'),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  accessorizeImage: {
    width: '100%',
    height: '100%',
  },
  accessorizeLabel: {
    fontSize: wp('3.2%'),
    color: '#8A8A8A', // Grey for inactive
    fontFamily: Fonts.gilroyBold,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: hp('0.5%'),
    paddingBottom: 2,
  },
  dummyAccessorizeContainer: {
    paddingTop: hp('2%'),
    paddingBottom: hp('2%'),
    // marginTop: -hp('2%'),
    zIndex: -1,
  },
  accessorizeBannerCard: {
    width: wp('42%'),
    height: hp('32%'),
    marginRight: wp('4%'),
    borderRadius: wp('5%'),
    overflow: 'hidden',
    backgroundColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dummyAccessorizeImage: {
    width: '100%',
    height: '100%',
  },
  bannerTextOverlay: {
    position: 'absolute',
    top: hp('2%'),
    left: wp('4%'),
    right: wp('4%'),
  },
  bannerTitleText: {
    fontSize: wp('5%'),
    fontFamily: Fonts.gilroyBold,
    color: '#000',
    fontWeight: '800',
  },
  midBannerCard: {
    width: wp('90%'),
    height: hp('20%'),
    borderRadius: wp('2%'),
    overflow: 'hidden',
    marginRight: wp('3%'),
  },
  midBannerImage: {
    width: '100%',
    height: '100%',
  },
  brandCard: {
    width: wp('28%'),
    height: hp('12%'),
    borderRadius: wp('4%'),
    backgroundColor: '#F4F1EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
    borderWidth: 1,
    borderColor: '#EEE',
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
  },
  brandImage: {
    width: '80%',
    height: '70%',
  },
  gShockSectionWrapper: {
    marginTop: 10,
    width: '100%',
    overflow: 'hidden',
  },
  gShockTopBanner: {
    width: width,
    height: hp('60%'),
    alignSelf: 'center',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  gShockCard: {
    width: (width - 32 - 16) / 2,
    height: 90,
    borderRadius: 20,
    overflow: 'hidden',
    borderColor: colors.themeTeal,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  gShockCardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('1.5%'),
  },
  indicatorPill: {
    width: wp('6%'),
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: wp('1%'),
  },
  indicatorPillActive: {
    backgroundColor: '#F25000',
    width: wp('10%'),
  },
  bestSellingCard: {
    marginHorizontal: wp('4%'),
    backgroundColor: '#E0F7F9',
    borderRadius: wp('8%'),
    height: hp('38%'),
    overflow: 'hidden',
    position: 'relative',
    padding: wp('4%'),
    borderWidth: 1,
    borderColor: '#B2EBF2',
  },
  sideImage: {
    position: 'absolute',
    width: wp('40%'),
    height: hp('28%'),
    top: hp('6%'),
    opacity: 0.25,
  },
  sideImageLeft: {
    left: -wp('18%'),
  },
  sideImageRight: {
    right: -wp('18%'),
  },
  centerImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  centerImage: {
    width: '75%',
    height: '75%',
  },
  arrowRow: {
    position: 'absolute',
    left: wp('4%'),
    right: wp('4%'),
    top: '55%',
    flexDirection: 'row',
    zIndex: 10,
  },
  arrowButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: '#F25000',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  bestSellingTextOverlay: {
    position: 'absolute',
    top: wp('5%'),
    left: wp('6%'),
    right: wp('6%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  bestSellingTitleText: {
    fontSize: wp('6%'),
    fontFamily: Fonts.gilroyBold,
    color: '#263238',
    fontWeight: '800',
    maxWidth: '50%',
  },
  bestSellingPriceText: {
    fontSize: wp('6%'),
    fontFamily: Fonts.gilroyBold,
    color: '#263238',
    fontWeight: '800',
  },
  bestSellingMrpText: {
    fontSize: wp('3.5%'),
    color: '#546E7A',
    textDecorationLine: 'line-through',
    fontFamily: Fonts.gilroyMedium,
  },
  goatDealCard: {
    width: (width - 32 - 16) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    marginBottom: 10,
    // borderWidth: 0.8,
    // borderColor: colors.themeTeal,
    height: 140,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  goatDealBg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    //borderRadius: 26,
  },
});

export default KshopeScreen;
