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
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import { useWishlist } from '../../context/WishlistContext';
import { getHomepageData } from '../../api/services/homeService';
import CONFIG from '../../globals/config';
import ExploreItem from '../../components/ExploreItem';
import ClickForMoreButton from '../../components/ClickForMoreButton';
import HomeSearchBar from '../../components/HomeSearchBar';
import FloatingCartButton from '../../components/FloatingCartButton';
import { getKshopeAreaId } from '../../globals/storage';
import { Fonts } from '../../theme/fonts';
import { colors } from '../../theme/colours';

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { profile } = useUser();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState<any>(null);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [midBannerIndex, setMidBannerIndex] = useState(0);
  const [bestSellingIndex, setBestSellingIndex] = useState(1);
  const [selectedAccessorize, setSelectedAccessorize] = useState<string | null>(
    null,
  );
  const bannerRef = useRef<FlatList>(null);
  const featuredBannerRef = useRef<FlatList>(null);
  const accessorizeSubListRef = useRef<FlatList>(null);

  const userName =
    profile?.custName || profile?.name || profile?.firstName || 'Guest';

  const fetchData = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const storedAreaId = await getKshopeAreaId();
      const areaId = storedAreaId ?? profile?.pincode ?? null;

      const data = await getHomepageData(areaId, 100);
      setHomeData(data?.data || data);
    } catch (e) {
      console.error('Error fetching home data for K-shope', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData(true);
    setRefreshing(false);
  }, []);

  const topBanner =
    homeData?.banners?.filter(
      (b: any) =>
        b.placementKey === 'app_home_top_banner' ||
        b.PlacementKey === 'app_home_top_banner',
    ) || [];

  const topSectionBanner = homeData?.banners?.find(
    (b: any) =>
      b.placementKey === 'app_home_top_banner_top_section' ||
      b.PlacementKey === 'app_home_top_banner_top_section',
  );

  const firstProductBlockBanners =
    homeData?.banners?.filter(
      (b: any) =>
        b.placementKey === 'app_home_top_banner' ||
        b.PlacementKey === 'app_home_top_banner',
    ) || [];

  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    if (!firstProductBlockBanners || firstProductBlockBanners.length <= 1)
      return;
    const timer = setInterval(() => {
      setFeaturedIndex(prev => {
        const next = (prev + 1) % firstProductBlockBanners.length;
        featuredBannerRef.current?.scrollToIndex({
          index: next,
          animated: true,
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [firstProductBlockBanners]);

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

  const midBannerBottom =
    homeData?.banners?.filter(
      (b: any) =>
        b.placementKey === 'app_home_mid_banner_bottom' ||
        b.PlacementKey === 'app_home_mid_banner_bottom',
    ) || [];

  const topBrands =
    homeData?.brands && homeData.brands.length > 0
      ? homeData.brands
      : homeData?.topBrands && homeData.topBrands.length > 0
      ? homeData.topBrands
      : homeData?.banners?.filter(
          (b: any) =>
            b.placementKey === 'app_top_brands' ||
            b.PlacementKey === 'app_top_brands',
        ) || [];

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
  const gShockMainBanner2 = homeData?.banners?.find(
    (b: any) =>
      b.placementKey === 'app_home_bottom_showcase_banner_image2' ||
      b.PlacementKey === 'app_home_bottom_showcase_banner_image2',
  );
  const bottomShowcaseItems2 =
    homeData?.banners?.filter(
      (b: any) =>
        b.placementKey === 'app_home_bottom_showcase_product_image2' ||
        b.PlacementKey === 'app_home_bottom_showcase_product_image2',
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

  const getSectionTitle = (sectionKey: string, fallback: string) => {
    const titles = homeData?.titles || homeData?.Titles || [];
    const found = titles.find(
      (t: any) =>
        (t.section || t.id || t.key || '').toLowerCase() ===
        sectionKey.toLowerCase(),
    );
    return found?.title || found?.Title || fallback;
  };

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
    if (!imgPath) return require('../../assets/images/logo.png');
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
      navigation.navigate('KshopeProductDetails', { productId: linkValue });
    } else if (linkType === 'category') {
      navigation.navigate('KshopeSearch', {
        catId: linkValue,
        catName: 'Category',
      });
    }
  };

  const handleCategoryPress = (cat: any) => {
    navigation.navigate('KshopeSearch', {
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
    parsedTabShowcase = unwrapBlock(parsedTabShowcase);
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

  useEffect(() => {
    if (accessorizeSubListRef.current) {
      try {
        accessorizeSubListRef.current.scrollToOffset({
          offset: 0,
          animated: false,
        });
      } catch (err) {
        console.warn('Failed to scroll accessorize sublist:', err);
      }
    }
  }, [selectedAccessorize]);

  const renderBannerItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => handleBannerPress(item)}
      style={styles.bannerSlide}
    >
      <Image
        source={getImageSource(item.imageUrl || item.ImageUrl || item.image)}
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
        <ImageBackground
          source={require('../../assets/images/profile/backimg.png')}
          style={styles.categoryCircle}
          resizeMode="contain"
        >
          <Image
            source={imgSrc}
            style={styles.categoryImage}
            resizeMode="contain"
          />
        </ImageBackground>
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
        <View style={{ height: 6 }} />
        <Text
          style={[
            styles.accessorizeLabel,
            isSelected && { color: colors.black },
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
        source={getImageSource(item.imageUrl || item.ImageUrl || item.image)}
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
          navigation.navigate('KshopeSearch', {
            attrValueId: item.attrValueId,
            catName: item.brandName || 'Brand',
          });
        } else {
          handleBannerPress(item);
        }
      }}
    >
      <Image
        source={getImageSource(
          item.brandImage ||
            item.imageUrl ||
            item.ImageUrl ||
            item.image ||
            item.logo,
        )}
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
        source={getImageSource(item.imageUrl || item.ImageUrl || item.image)}
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
        source={getImageSource(item.imageUrl || item.ImageUrl || item.image)}
        style={styles.goatDealBg}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.figmaTeal,
          }}
        >
          <ActivityIndicator size="large" color="#F25000" />
          <Text
            style={{
              marginTop: 16,
              fontFamily: Fonts.gilroyMedium,
              fontSize: 14,
              color: '#999999',
            }}
          >
            Loading...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!topSectionBanner && <View style={{ height: insets.top }} />}
      {topSectionBanner && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleBannerPress(topSectionBanner)}
          style={styles.topSectionContainer}
        >
          <ImageBackground
            source={getImageSource(
              topSectionBanner.imageUrl ||
                topSectionBanner.ImageUrl ||
                topSectionBanner.image,
            )}
            style={styles.topSectionImage}
            resizeMode="cover"
          >
            <View style={[styles.topBarRow, { paddingTop: insets.top + 10 }]}>
              <HomeSearchBar
                placeholder="Search product"
                style={styles.headerSearchBar}
              />

              <TouchableOpacity
                onPress={() => navigation.navigate('KshopeBCoin')}
                style={styles.bcoinContainer}
              >
                <ImageBackground
                  source={require('../../assets/images/profile/homebcoin.png')}
                  style={styles.bcoinBackground}
                  resizeMode="contain"
                >
                  <Text style={styles.tokenText}>
                    {profile?.bTokens || profile?.totalBCoins || '0'} B
                  </Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('KshopeProfile')}
                style={styles.profileIconMainView}
              >
                <Image
                  source={require('../../assets/images/profile/profilei.png')}
                  style={styles.profileIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#F25000"
          />
        }
        contentContainerStyle={{ paddingBottom: 0 }}
      >
        {firstProductBlockBanners.length > 0 && (
          <View style={styles.featuredBannerContainer}>
            <FlatList
              data={firstProductBlockBanners}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handleBannerPress(item)}
                >
                  <Image
                    source={getImageSource(
                      item.imageUrl || item.ImageUrl || item.image,
                    )}
                    style={styles.featuredBannerImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
              ref={featuredBannerRef}
              keyExtractor={(_, i) => `feat_${i}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={e => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / width);
                setFeaturedIndex(idx);
              }}
              onScrollToIndexFailed={info => {
                const offset = info.index * width;
                featuredBannerRef.current?.scrollToOffset({
                  offset,
                  animated: true,
                });
              }}
            />
          </View>
        )}
        {displayCategories.length > 0 && (
          <View style={{ paddingBottom: 10, marginTop: hp('2%') }}>
            <FlatList
              data={displayCategories.reduce(
                (rows: any[][], item: any, index: number) => {
                  if (index % 2 === 0) rows.push([item]);
                  else rows[rows.length - 1].push(item);
                  return rows;
                },
                [],
              )}
              keyExtractor={(_, i) => `cat_col_${i}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesGrid}
              renderItem={({ item: pair }) => (
                <View style={{ flexDirection: 'column' }}>
                  {pair.map((catItem: any, idx: number) => (
                    <React.Fragment key={catItem.catId || catItem.id || idx}>
                      {renderCategoryItem({ item: catItem })}
                    </React.Fragment>
                  ))}
                </View>
              )}
            />
          </View>
        )}

        {activeGShockItems?.length > 0 && gShockMainBanner && (
          <View style={{ ...styles.section, marginTop: hp('0%') }}>
            <ImageBackground
              source={{
                uri: CONFIG.image_base_url + gShockMainBanner.imageUrl,
              }}
              style={styles.gShockTopBanner}
              resizeMode="stretch"
            >
              <View
                style={{
                  paddingHorizontal: 16,
                  position: 'absolute',
                  bottom: 20,
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

        {topBrands && topBrands.length > 0 && (
          <View style={[styles.section, { marginTop: hp('2%') }]}>
            <Text style={[styles.sectionTitle, { marginTop: hp('2%') }]}>
              {getSectionTitle('top_brands', 'TOP BRANDS')}
            </Text>
            <FlatList
              data={topBrands}
              renderItem={renderBrandItem}
              keyExtractor={(_, i) => `brand_${i}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: wp('3%'),
                paddingBottom: 20,
              }}
            />
          </View>
        )}

        {accessorizeCategories.length > 0 && (
          <View style={[styles.section, { marginTop: hp('2%') }]}>
            <Text
              style={[
                styles.sectionTitle,
                { textTransform: 'uppercase', marginBottom: hp('2%') },
              ]}
            >
              {getSectionTitle('category_tabs_images', 'ACCESSORIZE')}
            </Text>
            <View
              style={{
                marginHorizontal: -wp('0%'),
              }}
            >
              <FlatList
                data={accessorizeCategories}
                renderItem={renderAccessorizeItem}
                keyExtractor={(item, i) => `acc_${item.catId || i}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: wp('4%') }}
              />
            </View>

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
                  colors={[colors.themeTeal, '#FFD9C6', colors.figmaTeal]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.dummyAccessorizeContainer}
                >
                  <FlatList
                    ref={accessorizeSubListRef}
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
                          navigation.navigate('KshopeSearch', {
                            catId: item.catId || item.categoryId || item.id,
                            catName:
                              item.displayTitle || item.name || 'Category',
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
                      </TouchableOpacity>
                    )}
                  />
                </LinearGradient>
              );
            })()}
          </View>
        )}

        {activeFirstProducts.length > 0 && (
          <View style={[styles.section, { marginTop: '1%' }]}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  textTransform: 'uppercase',
                  marginTop: '1%',
                },
              ]}
            >
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
                    navigation.navigate('KshopeProductDetails', {
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
                  navigation.navigate('KshopeProductCategoryDetail', {
                    catId: id?.toString(),
                    title: parsedFirstBlock?.title || 'Top Deals',
                    products: activeFirstProducts,
                  });
                }}
                title={`Click for more ${parsedFirstBlock?.title || 'Deals'}`}
              />
            </View>
          </View>
        )}

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

        <View style={styles.section}>
          <Text style={[styles.sectionTitle]}>GOAT DEALS</Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginHorizontal: 10,
            }}
          >
            <FlatList
              data={activeGoatDeals}
              renderItem={renderGoatDeal}
              keyExtractor={(item, index) =>
                item.bannerId?.toString() ||
                item.id?.toString() ||
                index.toString()
              }
              numColumns={3}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              scrollEnabled={false}
            />
          </View>
        </View>

        {bestSelling && bestSelling.length > 0 && (
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  textTransform: 'uppercase',
                  marginBottom: hp('1%'),
                  marginTop: hp('0%'),
                },
              ]}
            >
              {getSectionTitle('image_slides', 'BEST SELLING')}
            </Text>
            <View style={{ position: 'relative' }}>
              <ImageBackground
                source={require('../../assets/images/profile/bestsellingbg.png')}
                style={styles.bestSellingCard}
                resizeMode="contain"
                imageStyle={{ alignSelf: 'center', alignContent: 'center' }}
              >
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

                <TouchableOpacity
                  style={styles.centerImageContainer}
                  activeOpacity={0.8}
                  onPress={() => {
                    const item = bestSelling[bestSellingIndex];
                    navigation.navigate('KshopeProductDetails', {
                      productId: item.productId || item.id,
                      product: item,
                    });
                  }}
                >
                  <Image
                    source={getImageSource(
                      bestSelling[bestSellingIndex].imageUrl ||
                        bestSelling[bestSellingIndex].image,
                    )}
                    style={styles.centerImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <View style={styles.bestSellingTextOverlay}>
                  <Text style={styles.bestSellingTitleText} numberOfLines={2}>
                    {bestSelling[bestSellingIndex].brand ||
                      bestSelling[bestSellingIndex].prName ||
                      'Product'}
                  </Text>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.bestSellingMrpText}>
                      MRP ₹
                      {bestSelling[bestSellingIndex].unitPrice ||
                        bestSelling[bestSellingIndex].originalPrice ||
                        '0'}
                    </Text>
                    <Text style={styles.bestSellingPriceText}>
                      ₹
                      {bestSelling[bestSellingIndex].specialPrice ||
                        bestSelling[bestSellingIndex].price ||
                        '0'}
                    </Text>
                  </View>
                </View>
              </ImageBackground>

              <View style={styles.arrowRow}>
                {bestSellingIndex > 0 ? (
                  <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => setBestSellingIndex(prev => prev - 1)}
                  >
                    <Image
                      source={require('../../assets/images/profile/arrowleft.png')}
                      style={{ width: wp('10%'), height: hp('10%') }}
                      resizeMode="contain"
                    />
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
                    <Image
                      source={require('../../assets/images/profile/arrowright.png')}
                      style={{ width: wp('10%'), height: hp('10%') }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ) : (
                  <View style={{ width: wp('10%') }} />
                )}
              </View>
            </View>
          </View>
        )}

        {activeSecondProducts.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { textTransform: 'uppercase' }]}>
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
                    navigation.navigate('KshopeProductDetails', {
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
                  navigation.navigate('KshopeProductCategoryDetail', {
                    catId: id?.toString(),
                    title: parsedSecondBlock?.title || 'Featured Products',
                    products: activeSecondProducts,
                  });
                }}
                title={`Click for more ${
                  parsedSecondBlock?.title || 'Featured'
                }`}
              />
            </View>
          </View>
        )}

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

        {bottomShowcaseItems2?.length > 0 && gShockMainBanner2 && (
          <View style={{ ...styles.section, marginTop: hp('2%') }}>
            <ImageBackground
              source={{
                uri: CONFIG.image_base_url + gShockMainBanner2.imageUrl,
              }}
              style={styles.gShockTopBanner}
              resizeMode="stretch"
            >
              <View
                style={{
                  paddingHorizontal: 16,
                  position: 'absolute',
                  bottom: 20,
                  left: 0,
                  right: 0,
                }}
              >
                <FlatList
                  data={bottomShowcaseItems2}
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

        {midBannerBottom && midBannerBottom.length > 0 && (
          <View
            style={[
              styles.section,
              { marginTop: hp('0%'), marginBottom: hp('0%') },
            ]}
          >
            <FlatList
              data={midBannerBottom}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handleBannerPress(item)}
                  style={{ marginRight: 15 }}
                >
                  <Image
                    source={getImageSource(
                      item.imageUrl || item.ImageUrl || item.image,
                    )}
                    style={{
                      width: wp('45%'),
                      height: hp('15%'),
                      borderRadius: 12,
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) =>
                item.bannerId?.toString() ||
                item.id?.toString() ||
                `midbot_${index}`
              }
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: wp('4%') }}
            />
          </View>
        )}

        <View
          style={{
            backgroundColor: colors.figmaTeal,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        />
        <Image
          source={require('../../assets/images/profile/kaprabottom.png')}
          style={{
            width: wp('100%'),
            height: hp('48%'),
          }}
          resizeMode="contain"
        />
      </ScrollView>
      <FloatingCartButton bottom={20} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.figmaTeal,
  },

  header: {},
  topSectionContainer: {
    width: width,
    backgroundColor: colors.white,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 10,
  },
  topSectionImage: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  headerSectionContainer: {
    width: width,
    backgroundColor: '#ffffff',
    top: -20,
  },
  featuredBannerContainer: {
    marginTop: hp('1.5%'),
  },
  featuredBannerImage: {
    width: width,
    height: hp('21%'),
  },
  mockDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  mockDot: {
    width: 25,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  activeMockDot: {
    backgroundColor: '#000000',
  },
  bestDealTitle: {
    fontSize: 18,
    fontFamily: Fonts.gilroyBold,
    color: '#000000',
    textAlign: 'center',
    marginTop: 15,
    textTransform: 'uppercase',
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    width: width,
  },
  headerSearchBar: {
    flex: 1,
    width: undefined,
  },
  topBarIcon: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bcoinContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  bcoinBackground: {
    width: 54,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomBrandingSection: {
    alignItems: 'center',
    marginTop: hp('3%'),
    marginBottom: hp('1%'),
    paddingVertical: hp('2%'),
  },
  kapraLogoBottom: {
    width: wp('50%'),
    height: hp('8%'),
    resizeMode: 'contain',
    marginBottom: hp('1%'),
  },
  footerBranding: {
    alignItems: 'flex-start',
    paddingVertical: hp('2%'),
    marginBottom: 0,
  },
  tokenSvg: {
    marginRight: -5,
  },
  tokenText: {
    fontSize: 12,
    fontFamily: Fonts.gilroyBold,
    color: '#000000',
  },
  profileIconMainView: {
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
  },
  profileIcon: {
    width: 30,
    height: 30,
  },
  profileIconView: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crownImage: {
    width: 15,
    height: 15,
    position: 'absolute',
    top: -5,
    right: -2,
    zIndex: 2,
  },
  headerDotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  headerDot: {
    width: 32,
    height: 8,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 3,
    top: hp('1%'),
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
  profileIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userName: {
    fontFamily: Fonts.gilroyMedium,
    fontSize: 17,
    color: '#222222',
    fontWeight: '400',
    marginLeft: wp('4%'),
  },
  topIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 20,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('4%'),
    height: 48,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 45,
    flex: 1,
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
    height: hp('35%'),
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
    marginTop: hp('2%'),
  },
  sectionTitle: {
    fontSize: 16,
    color: colors.black,
    fontFamily: Fonts.gilroySemiBold,
    textAlign: 'left',
    textTransform: 'uppercase',
    paddingHorizontal: wp('4%'),
    marginBottom: hp('1.5%'),
    letterSpacing: 0.8,
  },
  categoriesGrid: {
    paddingHorizontal: wp('4%'),
  },
  categoryItem: {
    width: (width - wp('6%')) / 4,
    height: wp('28%'),
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  categoryCircle: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFE0CE',
  },
  categoryImage: {
    width: wp('13.5%'),
    height: wp('13.5%'),
  },
  categoryLabel: {
    fontSize: 12,
    color: colors.black1,
    fontFamily: Fonts.gilroySemiBold,
    textAlign: 'center',
    marginTop: hp('0.5%'),
    width: wp('18%'),
  },
  accessorizeCard: {
    backgroundColor: colors.white,
    width: wp('22%'),
    marginRight: wp('2%'),
    alignItems: 'center',
    paddingTop: hp('1%'),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  accessorizeCardActive: {
    backgroundColor: colors.themeTeal,
    borderColor: colors.themeTeal,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: hp('1%'),
  },
  accessorizeImageContainer: {
    width: wp('16%'),
    height: wp('16%'),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  accessorizeImage: {
    width: '100%',
    height: '100%',
  },
  accessorizeLabel: {
    fontSize: 12,
    color: '#999999',
    fontFamily: Fonts.gilroySemiBold,
    textAlign: 'center',
    paddingBottom: hp('1%'),
  },
  dummyAccessorizeContainer: {
    marginTop: -hp('0%'),
  },
  accessorizeBannerCard: {
    width: wp('39%'),
    height: hp('27%'),
    marginRight: wp('4%'),
    borderRadius: 20,
    overflow: 'hidden',
  },
  dummyAccessorizeImage: {
    width: '100%',
    height: '100%',
  },
  bannerTextOverlay: {
    position: 'absolute',
    top: hp('3%'),
    left: wp('5%'),
    right: wp('5%'),
  },
  bannerTitleText: {
    fontSize: wp('7%'),
    fontFamily: Fonts.gilroyBold,
    color: '#000',
    fontWeight: '800',
    lineHeight: wp('8%'),
  },
  midBannerCard: {
    width: wp('90%'),
    height: hp('20%'),
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: wp('3%'),
  },
  midBannerImage: {
    width: '100%',
    height: '100%',
  },
  brandCard: {
    width: 86,
    height: 86,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
    borderWidth: 1,
    borderColor: '#FFE8DC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  brandImage: {
    width: '80%',
    height: '70%',
  },
  gShockSectionWrapper: {
    width: '100%',
    overflow: 'hidden',
  },
  gShockTopBanner: {
    width: width,
    height: hp('40%'),
    alignSelf: 'center',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  gShockCard: {
    width: (width - 32 - 16) / 2,
    height: 90,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
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
    width: width * 0.9,
    height: hp('35%'),
    overflow: 'hidden',
    position: 'relative',
    padding: wp('4%'),
  },
  sideImage: {
    position: 'absolute',
    width: wp('23%'),
    height: hp('18%'),
    top: hp('8%'),
    opacity: 0.45,
  },
  sideImageLeft: {
    left: -wp('1%'),
  },
  sideImageRight: {
    right: -wp('1%'),
  },
  centerImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  centerImage: {
    width: '100%',
    height: '100%',
    bottom: hp('2%'),
    resizeMode: 'contain',
  },
  arrowRow: {
    position: 'absolute',
    left: wp('1%'),
    right: wp('1%'),
    top: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  arrowButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  bestSellingTextOverlay: {
    position: 'absolute',
    bottom: wp('9%'),
    left: wp('5%'),
    right: wp('5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 2,
  },
  bestSellingTitleText: {
    fontSize: 18,
    fontFamily: Fonts.gilroyBold,
    color: colors.black,
    maxWidth: '48%',
    bottom: hp('1%'),
  },
  bestSellingPriceText: {
    fontSize: 20,
    fontFamily: Fonts.gilroyBold,
    color: colors.black,
  },
  bestSellingMrpText: {
    fontSize: 12,
    color: '#999999',
    textDecorationLine: 'line-through',
    fontFamily: Fonts.gilroyMedium,
    marginBottom: 2,
  },
  goatDealCard: {
    backgroundColor: colors.white,
    marginStart: 5,
    marginBottom: 5,
    marginRight: wp('2%'),

    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,

    width: (width - 32 - 32) / 3,
    borderRadius: 20,

    height: hp('19%'),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFE8DC',
  },
  goatDealBg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  footerLogoContainer: {
    width: '100%',
    alignItems: 'flex-start',
    paddingVertical: 30,
    backgroundColor: colors.figmaTeal,
  },
  footerLogo: {
    width: wp('40%'),
    height: height / 8,
    alignSelf: 'flex-start',
  },
});

export default HomeScreen;
