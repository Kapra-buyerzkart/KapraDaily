import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CONFIG from '../../../globals/config';
import ShimmerPlaceholder from '../../../components/ShimmerPlaceholder';
import CachedImage from '../../../components/CachedImage';
import ProductBlockShimmer from './ProductBlockShimmer';
import ProductRail from './ProductRail';
import SectionHeader from './SectionHeader';
import getCategoryPlaceholder from './getCategoryPlaceholder';
import useCategoryTileStyles, {
  TAB_WELL_IDLE,
  TAB_WELL_ACTIVE,
  TAB_RING_IDLE,
  TAB_RING_ACTIVE,
  TAB_LABEL_IDLE,
  TAB_LABEL_ACTIVE,
} from './useCategoryTileStyles';
import { selectionTick } from '../../../utils/haptics';
import {
  SPACE,
  GUTTER,
  MAX_FONT_SCALE,
  divider,
  INK,
  TYPE,
} from '@/styles/homeTheme';
import { FONTS } from '../../../styles/typography';

const ExploreShimmer = () => {
  const tile = useCategoryTileStyles();

  return (
    <View style={styles.section}>
      <View style={styles.shimmerHeader}>
        <ShimmerPlaceholder style={styles.shimmerEyebrow} />
        <ShimmerPlaceholder style={styles.shimmerTitle} />
      </View>
      <View style={tile.tabRow}>
        {[1, 2, 3, 4].map((_, i) => (
          <View key={i} style={tile.tabItem}>
            <ShimmerPlaceholder style={tile.shimmerTabWell} />
            <ShimmerPlaceholder style={tile.shimmerLabel} />
          </View>
        ))}
      </View>
      <ProductBlockShimmer />
    </View>
  );
};

const DiscoveryTab = React.memo(function DiscoveryTab({
  item,
  isActive,
  onPress,
}) {
  const tile = useCategoryTileStyles();
  const [imageError, setImageError] = useState(false);
  const activeProgress = useSharedValue(isActive ? 1 : 0);

  const label = item.catName || item.name;

  useEffect(() => {
    activeProgress.value = withTiming(isActive ? 1 : 0, { duration: 180 });
  }, [isActive, activeProgress]);

  useEffect(() => {
    setImageError(false);
  }, [item.imageUrl]);

  const wellAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      activeProgress.value,
      [0, 1],
      [TAB_WELL_IDLE, TAB_WELL_ACTIVE],
    ),
    borderColor: interpolateColor(
      activeProgress.value,
      [0, 1],
      [TAB_RING_IDLE, TAB_RING_ACTIVE],
    ),
  }));

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      activeProgress.value,
      [0, 1],
      [TAB_LABEL_IDLE, TAB_LABEL_ACTIVE],
    ),
  }));

  const imageSource =
    imageError || !item.imageUrl
      ? getCategoryPlaceholder(label)
      : { uri: `${CONFIG.image_base_url}${item.imageUrl}` };

  const handlePress = useCallback(() => {
    selectionTick();
    onPress(item);
  }, [onPress, item]);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={tile.tabItem}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={label}
    >
      <Animated.View style={[tile.tabWell, wellAnimatedStyle]}>
        <CachedImage
          source={imageSource}
          style={tile.tabImage}
          resizeMode="contain"
          onError={() => setImageError(true)}
          accessible={false}
        />
      </Animated.View>
      <Animated.Text
        style={[tile.tabLabel, labelAnimatedStyle]}
        numberOfLines={2}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        {label}
      </Animated.Text>
    </TouchableOpacity>
  );
});

const CategoryDiscoverySection = ({
  isHomeLoading,
  categoryDiscovery,
  shouldShow,
  discoveryCategories,
  selectedDiscoveryCategory,
  onSelectCategory,
  isDiscoveryLoading,
  discoveryProducts,
  navigation,
}) => {
  const tile = useCategoryTileStyles();

  const activeCatId = selectedDiscoveryCategory?.catId;

  const tabKeyExtractor = useCallback(
    (item, index) => (item.catId || item.id || index).toString(),
    [],
  );

  const renderTab = useCallback(
    ({ item }) => (
      <DiscoveryTab
        item={item}
        isActive={activeCatId === item.catId}
        onPress={onSelectCategory}
      />
    ),
    [activeCatId, onSelectCategory],
  );

  if (isHomeLoading && !categoryDiscovery) return <ExploreShimmer />;
  if (!shouldShow) return null;

  const activeName =
    selectedDiscoveryCategory?.catName || selectedDiscoveryCategory?.name;

  return (
    <>
      <View style={styles.divider} />
      <View style={styles.section}>
        <SectionHeader
          eyebrow="Handpicked for you"
          title="Explore"
          titleAccent="deals"
          subtitle={
            activeName
              ? `Top picks in ${activeName}`
              : 'Pick a category to shop'
          }
          onAction={
            selectedDiscoveryCategory
              ? () =>
                  navigation.navigate('SearchScreen', {
                    catId: selectedDiscoveryCategory.catId,
                    catName: selectedDiscoveryCategory.catName,
                  })
              : undefined
          }
        />

        {discoveryCategories.length > 0 && (
          <FlatList
            horizontal
            data={discoveryCategories}
            keyExtractor={tabKeyExtractor}
            renderItem={renderTab}
            extraData={activeCatId}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tile.tabRow}
            initialNumToRender={6}
            maxToRenderPerBatch={6}
            windowSize={5}
            accessibilityRole="tablist"
          />
        )}

        {isDiscoveryLoading ? (
          <View style={styles.railLoading}>
            <ProductBlockShimmer />
          </View>
        ) : discoveryProducts.length > 0 ? (
          <ProductRail
            items={discoveryProducts}
            navigation={navigation}
            contentContainerStyle={styles.railContent}
            animateEntrance={false}
          />
        ) : selectedDiscoveryCategory ? (
          <View style={styles.emptyContainer}>
            <Image
              source={require('../../../assets/images/udenDealNotfound.png')}
              style={styles.emptyImage}
            />
            <Text
              style={styles.emptyText}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              Uh-oh! We couldn't find any products in this category. Check back
              later for new additions.
            </Text>
          </View>
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  divider,
  section: {
    paddingTop: SPACE.xs,
    paddingBottom: SPACE.md,
  },
  railContent: {
    paddingLeft: wp('3.2%'),
    paddingRight: wp('2%'),
  },
  railLoading: {
    minHeight: hp('28%'),
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('3%'),
    paddingHorizontal: wp('10%'),
  },
  emptyImage: {
    width: wp('34%'),
    height: wp('34%'),
    resizeMode: 'contain',
    marginBottom: hp('1.6%'),
  },
  emptyText: {
    ...TYPE.label,
    color: INK.muted,
    fontFamily: FONTS.gilroy.medium,
    textAlign: 'center',
  },

  shimmerHeader: {
    paddingHorizontal: GUTTER,
    paddingTop: hp('2%'),
    paddingBottom: hp('1.2%'),
  },
  shimmerEyebrow: {
    width: wp('30%'),
    height: hp('1.3%'),
    borderRadius: 4,
    marginBottom: hp('0.8%'),
  },
  shimmerTitle: {
    width: wp('24%'),
    height: hp('2.4%'),
    borderRadius: 6,
  },
});

export default React.memo(CategoryDiscoverySection);
