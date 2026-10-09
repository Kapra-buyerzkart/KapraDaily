import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import AnimatedPressable from '@/components/AnimatedPressable';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '@/styles/typography';
import CachedImage from '@/components/CachedImage';
import images from '@/assets/images';
import CONFIG from '@/globals/config';
import { getCategoriesApi } from '@/api/categoryService';
import getCategoryPlaceholder from '../getCategoryPlaceholder';
import CurvedFolderTab from './CurvedFolderTab';
import { getCategoryTabIcon } from './categoryTabIcons';

const TAB_PILL_HEIGHT = 28;
const TAB_ICON_SIZE = 26;
const TAB_GAP = 16;
const BRAND_BLACK = '#000000';

const HomeCategoriesSection = ({
  categories = [],
  navigation,
  onSelectCategory,
  colorScheme,
  banner,
  banners,
  gifBanner,
  onPressBanner,
}) => {
  const brandActive = colorScheme?.tabActive || BRAND_BLACK;
  const tabBgColors = colorScheme?.tabBackground || [
    '#E1E8CD',
    '#EFF4E3',
    '#FFFFFF',
  ];
  const [activeTab, setActiveTab] = useState('all');
  const [subCats, setSubCats] = useState([]);
  const [loadingSubCats, setLoadingSubCats] = useState(false);
  const [tabWidths, setTabWidths] = useState({});
  const [tabPositions, setTabPositions] = useState({});
  const scrollViewRef = useRef(null);

  const gifItem = useMemo(() => {
    const directBanner = banner || gifBanner;
    if (directBanner && !Array.isArray(directBanner)) {
      return directBanner;
    }
    const sourceList = Array.isArray(directBanner)
      ? directBanner
      : Array.isArray(banners)
      ? banners
      : Array.isArray(banners?.topGifSectionBanners)
      ? banners.topGifSectionBanners
      : banners?.topGifSection
      ? [banners.topGifSection]
      : [];

    if (sourceList.length > 0) {
      const matched = sourceList.find(item => {
        const key =
          item?.placementKey || item?.PlacementKey || item?.placement_key;
        return key === 'app_home_top_gif_section';
      });
      if (matched) return matched;
      return sourceList[0];
    }
    return null;
  }, [banner, gifBanner, banners]);

  const gifSource = useMemo(() => {
    if (!gifItem) return null;
    if (gifItem.uri) {
      return typeof gifItem.uri === 'string'
        ? { uri: gifItem.uri }
        : gifItem.uri;
    }
    const rawUrl = gifItem.imageUrl || gifItem.ImageUrl || gifItem.image;
    if (typeof rawUrl === 'string' && rawUrl.length > 0) {
      return {
        uri: rawUrl.startsWith('http')
          ? rawUrl
          : `${CONFIG.image_base_url}${
              rawUrl.startsWith('/') ? rawUrl.slice(1) : rawUrl
            }`,
      };
    }
    return null;
  }, [gifItem]);

  const handleHeaderPress = () => {
    navigation.navigate('Categories');
  };

  const tabs = [
    { catId: 'all', catName: 'All' },
    ...categories.slice(0, 8).map(c => ({
      catId: (c.catId || c.id || '').toString(),
      catName: c.catName || c.name || '',
    })),
  ];

  useEffect(() => {
    if (activeTab === 'all') {
      setSubCats([]);
      return;
    }
    let isMounted = true;
    setLoadingSubCats(true);
    getCategoriesApi(activeTab)
      .then(response => {
        const resData = response && response.data;
        const items = (resData && resData.items) || resData || [];
        setSubCats(Array.isArray(items) ? items : []);
      })
      .catch(() => {
        if (isMounted) setSubCats([]);
      })
      .finally(() => {
        if (isMounted) setLoadingSubCats(false);
      });
    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  const handleCategoryPress = useCallback(
    item => {
      if (onSelectCategory) {
        onSelectCategory(item);
      } else {
        navigation.navigate('SearchScreen', {
          catId: item.catId || item.id,
          catName: item.catName || item.name,
        });
      }
    },
    [navigation, onSelectCategory],
  );

  const handleTabLayout = useCallback((catId, e) => {
    const { width } = e.nativeEvent.layout;
    const w = Math.round(width);
    if (w > 0) {
      setTabWidths(prev =>
        prev[catId] === w ? prev : { ...prev, [catId]: w },
      );
    }
  }, []);

  const handleButtonLayout = useCallback((catId, e) => {
    const { x, width } = e.nativeEvent.layout;
    setTabPositions(prev => {
      const existing = prev[catId];
      if (existing && existing.x === x && existing.width === width) return prev;
      return { ...prev, [catId]: { x, width } };
    });
  }, []);

  const handleTabPress = useCallback(
    catId => {
      setActiveTab(catId);
      const pos = tabPositions[catId];
      const posX = pos?.x ?? pos;
      if (posX !== undefined && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: Math.max(0, posX - wp('12%')),
          animated: true,
        });
      }
    },
    [tabPositions],
  );

  const getEstimatedTabWidth = useCallback(
    (catId, catName) => {
      if (tabWidths[catId]) {
        return tabWidths[catId];
      }
      const len = (catName || '').length;
      return Math.max(46, Math.round(len * 8.2 + 24));
    },
    [tabWidths],
  );

  const BOTTOM_RADIUS = 9;
  const activeTabInfo = tabPositions[activeTab];
  const activeTabLeft = activeTabInfo
    ? Math.max(0, activeTabInfo.x - BOTTOM_RADIUS)
    : Math.max(0, Math.round(wp('4%') - BOTTOM_RADIUS));
  const activeTabRight = activeTabInfo
    ? activeTabInfo.x + activeTabInfo.width + BOTTOM_RADIUS
    : Math.round(wp('4%') + 48 + BOTTOM_RADIUS);

  const displayCategories =
    activeTab !== 'all' && subCats.length > 0
      ? subCats.slice(0, 4)
      : categories.slice(0, 4);

  return (
    <View style={styles.container}>
      {/* Store Graphic above Explore Deals */}
      {gifSource ? (
        <View style={styles.storeHeaderWrap}>
          {onPressBanner && gifItem ? (
            <AnimatedPressable
              onPress={() => onPressBanner(gifItem)}
              activeOpacity={0.92}
            >
              <Image
                source={gifSource}
                style={styles.storeGifImage}
                resizeMode="contain"
              />
            </AnimatedPressable>
          ) : (
            <Image
              source={gifSource}
              style={styles.storeGifImage}
              resizeMode="contain"
            />
          )}
        </View>
      ) : null}

      {/* Header: Explore deals & Tap a category to see its deals */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Explore deals</Text>
        <AnimatedPressable
          onPress={handleHeaderPress}
          style={styles.seeAllButton}
        >
          {/* <Text style={styles.seeAllText}>View All</Text> */}
          {/* <Feather name="chevron-right" size={14} color="#16A34A" /> */}
        </AnimatedPressable>
      </View>
      <Text style={styles.categoryText}>Tap a category to see its deals</Text>

      {/* Zepto/Swiggy Curved Folder Tab Bar with Continuous Baseline & Category Icons */}
      <View style={styles.tabBarWrapper}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScrollView}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {/* Continuous Baseline spanning the entire scroll width, strictly interrupted under the active tab */}
          {activeTabLeft > 0 ? (
            <View
              style={[
                styles.baselineSegment,
                { left: 0, width: activeTabLeft, backgroundColor: brandActive },
              ]}
              pointerEvents="none"
            />
          ) : null}
          <View
            style={[
              styles.baselineSegment,
              {
                left: activeTabRight,
                width: 3000,
                backgroundColor: brandActive,
              },
            ]}
            pointerEvents="none"
          />

          {tabs.map(tab => {
            const isActive = activeTab === tab.catId;
            const currentTabWidth = getEstimatedTabWidth(
              tab.catId,
              tab.catName,
            );
            const iconSource = getCategoryTabIcon(tab.catName, isActive);

            return (
              <TouchableOpacity
                key={tab.catId}
                activeOpacity={0.82}
                onPress={() => handleTabPress(tab.catId)}
                onLayout={e => handleButtonLayout(tab.catId, e)}
                style={styles.tabButton}
              >
                {/* 1. Category Icon centered above the tab */}
                <Image
                  source={iconSource}
                  style={[
                    styles.tabIcon,
                    { tintColor: brandActive },
                    isActive ? styles.activeTabIcon : styles.inactiveTabIcon,
                  ]}
                  resizeMode="contain"
                />

                {/* 2. Folder Tab Pill for Label (transparent background) */}
                <View
                  onLayout={e => handleTabLayout(tab.catId, e)}
                  style={[
                    styles.tabLabelContainer,
                    isActive && styles.activeTabLabelContainer,
                  ]}
                >
                  {isActive && (
                    <CurvedFolderTab
                      width={currentTabWidth}
                      height={TAB_PILL_HEIGHT}
                      topRadius={9}
                      bottomRadius={9}
                      strokeColor={brandActive}
                      strokeWidth={1.2}
                      fillColor="transparent"
                    />
                  )}
                  <Text
                    style={[
                      styles.tabText,
                      { color: brandActive },
                      isActive && styles.activeTabText,
                    ]}
                    numberOfLines={1}
                  >
                    {tab.catName}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 4 Category Quick Cards (Fruits, Veggies, Dairy, Snacks) */}
      <View style={styles.cardsRow}>
        {displayCategories.map((item, index) => {
          const label = item.catName || item.name || '';
          let imageSource;
          if (item.image) {
            imageSource = item.image;
          } else if (item.imageUrl) {
            imageSource = { uri: `${CONFIG.image_base_url}${item.imageUrl}` };
          } else {
            imageSource = getCategoryPlaceholder(label);
          }

          return (
            <AnimatedPressable
              key={item.catId || item.id || index}
              onPress={() => handleCategoryPress(item)}
              style={styles.categoryCard}
            >
              <View style={styles.cardImageContainer}>
                <CachedImage
                  source={imageSource}
                  style={styles.categoryImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.categoryLabel} numberOfLines={2}>
                {label}
              </Text>
            </AnimatedPressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: hp('1.8%'),
    paddingBottom: hp('1.2%'),
  },
  storeHeaderWrap: {
    // paddingHorizontal: wp('4%'),
    marginBottom: hp('1.2%'),
    alignItems: 'center',
    width: '100%',
  },
  storeGifImage: {
    width: '100%',
    aspectRatio: 440 / 200,
    marginTop: -20,
    zIndex: 9999,
  },
  storeHeaderImage: {
    width: '100%',
    aspectRatio: 440 / 179,
    marginTop: 10,
    resizeMode: 'contain',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: '4.5%',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    marginBottom: hp('1%'),
  },
  headerTitles: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.gilroy.semiBold,
    color: '#000',
    letterSpacing: 0,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingLeft: 8,
  },
  seeAllText: {
    fontSize: wp('3.3%'),
    fontFamily: FONTS.gilroy.semiBold,
    color: BRAND_BLACK,
    marginRight: 2,
  },
  tabBarWrapper: {
    position: 'relative',
    height: 66,
    marginBottom: hp('1.6%'),
  },
  tabsScrollView: {
    width: '100%',
  },
  tabsScrollContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: wp('4%'),
    paddingRight: wp('6%'),
    position: 'relative',
    height: 66,
  },
  baselineSegment: {
    position: 'absolute',
    bottom: 0,
    height: 1.2,
    backgroundColor: BRAND_BLACK,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: TAB_GAP,
    position: 'relative',
    height: 66,
  },
  tabIcon: {
    width: TAB_ICON_SIZE,
    height: TAB_ICON_SIZE,
    marginBottom: 6,
    tintColor: BRAND_BLACK,
  },
  activeTabIcon: {
    tintColor: BRAND_BLACK,
    opacity: 1,
  },
  inactiveTabIcon: {
    tintColor: BRAND_BLACK,
    opacity: 0.85,
  },
  tabLabelContainer: {
    height: TAB_PILL_HEIGHT,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeTabLabelContainer: {
    zIndex: 5,
    elevation: 5,
  },
  tabText: {
    fontSize: 12.5,
    fontFamily: FONTS.gilroy.semiBold,
    color: BRAND_BLACK,
    letterSpacing: 0.1,
    zIndex: 10,
    elevation: 10,
  },
  activeTabText: {
    color: BRAND_BLACK,
    fontFamily: FONTS.gilroy.bold,
    zIndex: 10,
    elevation: 10,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    marginTop: hp('0.6%'),
  },
  categoryCard: {
    width: wp('21%'),
    alignItems: 'center',
  },
  cardImageContainer: {
    width: wp('20.5%'),
    height: wp('20.5%'),
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 7,
    marginBottom: 6,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryLabel: {
    fontSize: wp('3.2%'),
    fontFamily: FONTS.gilroy.semiBold,
    color: '#1F2937',
    textAlign: 'center',
  },
  categoryText: {
    fontSize: 12,
    paddingHorizontal: wp('4%'),
    marginBottom: hp('2%'),
    fontFamily: FONTS.gilroy.medium,
    color: '#656565',
  },
});

export default React.memo(HomeCategoriesSection);
