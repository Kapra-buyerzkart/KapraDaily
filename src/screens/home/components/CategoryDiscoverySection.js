import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Image,
  ScrollView,
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
import { SPACE, GUTTER, MAX_FONT_SCALE, divider } from '@/styles/homeTheme';

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

// The tabs are the "Shop by category" tile, scrolled sideways: the same well,
// the same near-full-bleed image anchored to the bottom edge, the same label
// ramp. The previous inline pills shrank the category art to a ~24pt icon in a
// circle, which is too small for merchandise photography to read as anything —
// at tile scale you can actually tell the categories apart. Selection is a ring
// plus a tinted well rather than a solid fill, so the image stays legible.
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

  // Takes the item and calls back with it, rather than receiving a
  // pre-bound `() => onSelect(item)` from the map below — that closure was a
  // new identity on every parent render, so this component's React.memo could
  // never hit and tapping one tab re-rendered all of them.
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
        <Image
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
            activeName ? `Top picks in ${activeName}` : 'Pick a category to shop'
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tile.tabRow}
            accessibilityRole="tablist"
          >
            {discoveryCategories.map((item, index) => (
              <DiscoveryTab
                key={(item.catId || item.id || index).toString()}
                item={item}
                isActive={selectedDiscoveryCategory?.catId === item.catId}
                onPress={onSelectCategory}
              />
            ))}
          </ScrollView>
        )}

        {isDiscoveryLoading ? (
          <View style={styles.railLoading}>
            <ProductBlockShimmer />
          </View>
        ) : (
          discoveryProducts.length > 0 && (
            <ProductRail
              items={discoveryProducts}
              navigation={navigation}
              contentContainerStyle={styles.railContent}
              // This rail swaps its whole dataset every time a chip is tapped.
              // Replaying the staggered entrance on each swap turns a filter
              // into a visible reload, so the cards just cut over.
              animateEntrance={false}
            />
          )
        )}
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

  // Shimmer
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

// Memoised to match its sibling sections. This was the only home section still
// re-rendering on every HomeScreen render — including the ones driven by
// pull-to-refresh state and by selecting a different discovery category.
export default React.memo(CategoryDiscoverySection);
