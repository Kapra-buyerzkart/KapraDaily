import React, { useCallback, useMemo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AnimatedPressable from '@/components/AnimatedPressable';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '@/styles/typography';
import CachedImage from '@/components/CachedImage';
import images from '@/assets/images';
import CONFIG from '@/globals/config';
import getCategoryPlaceholder from '../getCategoryPlaceholder';

const ExploreCategoriesGrid = ({
  categories = [],
  navigation,
  banner,
  banners,
  bottomGifBanner,
  onBannerPress,
  onPressBanner,
}) => {
  const handleViewAll = () => {
    navigation.navigate('Categories');
  };

  const handleCategoryPress = useCallback(
    item => {
      navigation.navigate('SearchScreen', {
        catId: item.catId || item.id,
        catName: item.catName || item.name,
      });
    },
    [navigation],
  );

  // Take up to 8 categories to make a clean 4x2 grid
  const gridCategories = categories.slice(0, 8);

  const gifItem = useMemo(() => {
    if (banner && !Array.isArray(banner)) {
      return banner;
    }
    const sourceList = Array.isArray(banner)
      ? banner
      : Array.isArray(banners)
      ? banners
      : Array.isArray(banners?.bottomGifSectionBanners)
      ? banners.bottomGifSectionBanners
      : banners?.bottomGifSection
      ? [banners.bottomGifSection]
      : [];

    if (sourceList.length > 0) {
      const matched = sourceList.find(item => {
        const key =
          item?.placementKey || item?.PlacementKey || item?.placement_key;
        return key === 'app_home_bottom_gif_section';
      });
      if (matched) return matched;
      return sourceList[0];
    }
    return null;
  }, [banner, banners]);

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

  const bottomGifBannerItem = useMemo(() => {
    if (bottomGifBanner && !Array.isArray(bottomGifBanner)) {
      return bottomGifBanner;
    }
    const sourceList = Array.isArray(bottomGifBanner)
      ? bottomGifBanner
      : Array.isArray(banners)
      ? banners
      : Array.isArray(banners?.bottomGifBanners)
      ? banners.bottomGifBanners
      : banners?.bottomGifBanner
      ? [banners.bottomGifBanner]
      : Array.isArray(banner)
      ? banner
      : [];

    if (sourceList.length > 0) {
      const matched = sourceList.find(item => {
        const key =
          item?.placementKey || item?.PlacementKey || item?.placement_key;
        return key === 'app_home_bottom_gif_banner_section';
      });
      if (matched) return matched;
      return sourceList[0];
    }
    return null;
  }, [bottomGifBanner, banner, banners]);

  const bottomGifBannerSource = useMemo(() => {
    if (!bottomGifBannerItem) return null;
    if (bottomGifBannerItem.uri) {
      return typeof bottomGifBannerItem.uri === 'string'
        ? { uri: bottomGifBannerItem.uri }
        : bottomGifBannerItem.uri;
    }
    const rawUrl =
      bottomGifBannerItem.imageUrl ||
      bottomGifBannerItem.ImageUrl ||
      bottomGifBannerItem.image;
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
  }, [bottomGifBannerItem]);

  if (gridCategories.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Bottom GIF Banner Section */}

      {/* Category Banner GIF */}
      {gifSource ? (
        <View style={styles.bannerWrap}>
          {onBannerPress || onPressBanner ? (
            <AnimatedPressable
              disabled={!gifItem}
              onPress={() => {
                if (onBannerPress) onBannerPress(gifItem);
                else if (onPressBanner) onPressBanner(gifItem);
              }}
              activeOpacity={0.92}
            >
              <Image
                source={gifSource}
                style={styles.bannerImage}
                resizeMode="cover"
              />
            </AnimatedPressable>
          ) : (
            <Image
              source={gifSource}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          )}
        </View>
      ) : null}

      {bottomGifBannerSource ? (
        <View style={styles.bannerWrap}>
          {onBannerPress || onPressBanner ? (
            <AnimatedPressable
              disabled={!bottomGifBannerItem}
              onPress={() => {
                if (onBannerPress) onBannerPress(bottomGifBannerItem);
                else if (onPressBanner) onPressBanner(bottomGifBannerItem);
              }}
              activeOpacity={0.92}
            >
              <Image
                source={bottomGifBannerSource}
                style={styles.bannerImage}
                resizeMode="cover"
              />
            </AnimatedPressable>
          ) : (
            <Image
              source={bottomGifBannerSource}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          )}
        </View>
      ) : null}

      <View style={styles.contentWrap}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View
            style={{
              width: 8,
              height: 24,
              backgroundColor: '#F25000',
              borderRadius: 8,
              marginRight: 8,
            }}
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: '#F25000' }]}>
              Shop by category
            </Text>
          </View>
          <AnimatedPressable
            onPress={handleViewAll}
            style={styles.viewAllButton}
          >
            <Text style={[styles.viewAllText, { color: '#F25000' }]}>
              View all hubs
            </Text>
            <Feather name="chevron-right" size={15} color="#F25000" />
          </AnimatedPressable>
        </View>

        {/* 4x2 Grid */}
        <View style={styles.grid}>
          {gridCategories.map((item, index) => {
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
                key={item.catId || index}
                onPress={() => handleCategoryPress(item)}
                style={styles.cardItem}
              >
                <View style={styles.cardImageContainer}>
                  <CachedImage
                    source={imageSource}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.label} numberOfLines={2}>
                  {label}
                </Text>
              </AnimatedPressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp('4.8%'),
  },
  bannerWrap: {
    width: '100%',
    marginTop: -hp('3%'),
    marginBottom: hp('1.4%'),
    alignItems: 'center',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    aspectRatio: 440 / 100,
  },
  contentWrap: {
    paddingHorizontal: wp('4%'),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('1.4%'),
  },
  title: {
    fontSize: wp('4.4%'),
    fontFamily: FONTS.gilroy.bold,
    color: '#111827',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: wp('3.3%'),
    fontFamily: FONTS.gilroy.semiBold,
    color: '#16A34A',
    marginRight: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: hp('1.6%'),
  },
  cardItem: {
    width: wp('21%'),
    alignItems: 'center',
  },
  cardImageContainer: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontSize: wp('3%'),
    fontFamily: FONTS.gilroy.semiBold,
    color: '#2B2D36',
    textAlign: 'center',
    lineHeight: wp('3.8%'),
  },
});

export default React.memo(ExploreCategoriesGrid);
