import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '@/styles/typography';
import CachedImage from '@/components/CachedImage';
import CONFIG from '@/globals/config';
import { getCategoriesApi } from '@/api/categoryService';
import getCategoryPlaceholder from '../getCategoryPlaceholder';
import CurvedFolderTab from './CurvedFolderTab';

const TAB_HEIGHT = 40;
const TAB_GAP = 14;
const BRAND_GREEN = '#0D5335';

const HomeCategoriesSection = ({
  categories = [],
  navigation,
  onSelectCategory,
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [subCats, setSubCats] = useState([]);
  const [loadingSubCats, setLoadingSubCats] = useState(false);
  const [tabWidths, setTabWidths] = useState({});
  const [tabPositions, setTabPositions] = useState({});
  const scrollViewRef = useRef(null);

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
    const { width, x } = e.nativeEvent.layout;
    const w = Math.round(width);
    if (w > 0) {
      setTabWidths(prev => (prev[catId] === w ? prev : { ...prev, [catId]: w }));
      setTabPositions(prev => (prev[catId] === x ? prev : { ...prev, [catId]: x }));
    }
  }, []);

  const handleTabPress = useCallback(
    catId => {
      setActiveTab(catId);
      const posX = tabPositions[catId];
      if (posX !== undefined && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: Math.max(0, posX - wp('14%')),
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
      return Math.max(54, Math.round(len * 8.6 + 32));
    },
    [tabWidths],
  );

  const displayCategories =
    activeTab !== 'all' && subCats.length > 0
      ? subCats.slice(0, 4)
      : categories.slice(0, 4);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Categories</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleHeaderPress}
          style={styles.seeAllButton}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <Feather name="chevron-right" size={15} color={BRAND_GREEN} />
        </TouchableOpacity>
      </View>

      {/* Zepto/Swiggy Curved Folder Tab Bar with Continuous Baseline */}
      <View style={styles.tabBarWrapper}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScrollView}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {/* Continuous Baseline spanning the entire scroll width */}
          <View style={styles.scrollBaseline} pointerEvents="none" />

          {tabs.map(tab => {
            const isActive = activeTab === tab.catId;
            const currentTabWidth = getEstimatedTabWidth(tab.catId, tab.catName);

            return (
              <TouchableOpacity
                key={tab.catId}
                activeOpacity={0.82}
                onPress={() => handleTabPress(tab.catId)}
                onLayout={e => handleTabLayout(tab.catId, e)}
                style={[
                  styles.tabButton,
                  isActive && styles.activeTabButton,
                ]}
              >
                {isActive && (
                  <CurvedFolderTab
                    width={currentTabWidth}
                    height={TAB_HEIGHT}
                    topRadius={10}
                    bottomRadius={10}
                    strokeColor={BRAND_GREEN}
                    strokeWidth={1}
                    fillColor="#FFFFFF"
                  />
                )}
                <Text
                  style={[
                    styles.tabText,
                    isActive && styles.activeTabText,
                  ]}
                  numberOfLines={1}
                >
                  {tab.catName}
                </Text>
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
            <TouchableOpacity
              key={item.catId || index}
              activeOpacity={0.8}
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
              <Text style={styles.categoryLabel} numberOfLines={1}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp('1.4%'),
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    marginBottom: hp('1.2%'),
  },
  headerTitle: {
    fontSize: wp('4.4%'),
    fontFamily: FONTS.gilroy.bold,
    color: '#111827',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: wp('3.3%'),
    fontFamily: FONTS.gilroy.semiBold,
    color: BRAND_GREEN,
    marginRight: 2,
  },
  tabBarWrapper: {
    position: 'relative',
    height: TAB_HEIGHT,
    marginBottom: hp('1.6%'),
  },
  tabsScrollView: {
    width: '100%',
  },
  tabsScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: wp('4%'),
    paddingRight: wp('6%'),
    position: 'relative',
  },
  scrollBaseline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minWidth: wp('100%'),
    height: 1,
    backgroundColor: BRAND_GREEN,
  },
  tabButton: {
    height: TAB_HEIGHT,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: TAB_GAP,
    position: 'relative',
  },
  activeTabButton: {
    zIndex: 5,
    elevation: 5,
  },
  tabText: {
    fontSize: wp('3.5%'),
    fontFamily: FONTS.gilroy.semiBold,
    color: '#1E3A2F',
    letterSpacing: 0.1,
    zIndex: 10,
    elevation: 10,
  },
  activeTabText: {
    color: BRAND_GREEN,
    fontFamily: FONTS.gilroy.bold,
    zIndex: 10,
    elevation: 10,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    marginTop: hp('0.4%'),
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
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
});

export default React.memo(HomeCategoriesSection);
