import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedScrollHandler,
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
  ACCENT,
  EXPLORE_PANEL,
  INK,
  RADIUS,
  SURFACE,
  TYPE,
} from '@/styles/homeTheme';
import { FONTS } from '../../../styles/typography';

// Half-width of the caret that points from the results panel up at the active
// tab. The panel and the caret share a fill colour so they read as one shape.
const CARET_HALF = 9;

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

// Card placeholders sized to the rail, shown inside the results panel while the
// tapped category's products load.
const RailShimmer = () => (
  <View style={styles.railShimmerRow}>
    {[1, 2, 3].map((_, i) => (
      <ShimmerPlaceholder key={i} style={styles.railShimmerCard} />
    ))}
  </View>
);

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
  const { gutter, stride, tile: tileSize, width } = tile.metrics;

  const activeCatId = selectedDiscoveryCategory?.catId;
  const activeName =
    selectedDiscoveryCategory?.catName || selectedDiscoveryCategory?.name;

  const tabListRef = useRef(null);
  const scrollX = useSharedValue(0);
  const caretX = useSharedValue(0);
  const bodyProgress = useSharedValue(1);

  const activeIndex = useMemo(
    () => discoveryCategories.findIndex(c => c.catId === activeCatId),
    [discoveryCategories, activeCatId],
  );

  // Caret sits under the centre of the active tab. The panel it points at is
  // full-bleed, so the caret only has to stay clear of the screen edges.
  const caretTarget = useMemo(() => {
    if (activeIndex < 0) return 0;
    const centre = gutter + activeIndex * stride + tileSize / 2;
    const min = CARET_HALF;
    const max = width - CARET_HALF;
    return Math.min(Math.max(centre, min), max) - CARET_HALF;
  }, [activeIndex, gutter, stride, tileSize, width]);

  useEffect(() => {
    caretX.value = withTiming(caretTarget, { duration: 220 });
  }, [caretTarget, caretX]);

  // Re-play the panel's entrance once the tapped category's products are in.
  // Skipped while loading so the panel behind the shimmer stays completely
  // still — the shimmer cards are the only thing moving.
  useEffect(() => {
    if (!activeCatId || isDiscoveryLoading) return;
    bodyProgress.value = 0;
    bodyProgress.value = withTiming(1, { duration: 260 });
  }, [activeCatId, isDiscoveryLoading, bodyProgress]);

  // Bring a tab that was tapped near the edge into view, so the caret it is
  // paired with stays on screen.
  useEffect(() => {
    if (activeIndex < 0 || discoveryCategories.length === 0) return;
    tabListRef.current?.scrollToIndex({
      index: activeIndex,
      animated: true,
      viewPosition: 0.5,
    });
  }, [activeIndex, discoveryCategories.length]);

  const onTabScroll = useAnimatedScrollHandler(event => {
    scrollX.value = event.contentOffset.x;
  });

  const caretStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: caretX.value - scrollX.value }],
  }));

  const bodyStyle = useAnimatedStyle(() => ({
    opacity: bodyProgress.value,
    transform: [{ translateY: (1 - bodyProgress.value) * 10 }],
  }));

  const tabKeyExtractor = useCallback(
    (item, index) => (item.catId || item.id || index).toString(),
    [],
  );

  // Offsets include the row's leading gutter, otherwise scrollToIndex lands a
  // gutter's width short of the tab.
  const getTabLayout = useCallback(
    (_, index) => ({ length: stride, offset: gutter + stride * index, index }),
    [gutter, stride],
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

  return (
    <>
      <View style={styles.divider} />
      <View style={styles.section}>
        <SectionHeader
          eyebrow="Handpicked for you"
          title="Explore"
          titleAccent="deals"
          subtitle="Tap a category to see its deals"
          onAction={
            selectedDiscoveryCategory
              ? () => {
                  const payload = {
                    catId: selectedDiscoveryCategory.catId,
                    catName: selectedDiscoveryCategory.catName,
                  };
                  console.log('👉 [ExploreDeals ViewAll] payload:', payload);
                  console.log(
                    '👉 [ExploreDeals ViewAll] selectedCategory:',
                    selectedDiscoveryCategory,
                  );
                  console.log(
                    '👉 [ExploreDeals ViewAll] visible products count:',
                    discoveryProducts?.length,
                  );
                  navigation.navigate('SearchScreen', payload);
                }
              : undefined
          }
        />

        {discoveryCategories.length > 0 && (
          <Animated.FlatList
            ref={tabListRef}
            horizontal
            data={discoveryCategories}
            keyExtractor={tabKeyExtractor}
            renderItem={renderTab}
            extraData={activeCatId}
            getItemLayout={getTabLayout}
            onScroll={onTabScroll}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tile.tabRow}
            initialNumToRender={6}
            maxToRenderPerBatch={6}
            windowSize={5}
            accessibilityRole="tablist"
          />
        )}

        {/* The caret belongs to the tinted panel, so it lives and dies with it
            — it slides across to the newly tapped tab rather than blinking. */}
        {!!selectedDiscoveryCategory && (
          <View style={styles.caretRow} pointerEvents="none">
            <Animated.View style={[styles.caret, caretStyle]} />
          </View>
        )}

        {/* The tint stays put across a tab switch: only the inner block, which
            is the part whose content actually changed, replays the entrance. */}
        <View
          style={[
            styles.panel,
            !!selectedDiscoveryCategory && styles.panelActive,
          ]}
        >
          <Animated.View style={bodyStyle}>
            {!!activeName && !isDiscoveryLoading && (
              <View style={styles.panelHeader}>
                <View style={styles.panelBadge}>
                  <View style={styles.panelDot} />
                  <Text
                    style={styles.panelBadgeText}
                    numberOfLines={1}
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                  >
                    {activeName}
                  </Text>
                </View>
                {discoveryProducts.length > 0 && (
                  <Text
                    style={styles.panelCount}
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                  >
                    {discoveryProducts.length}{' '}
                    {discoveryProducts.length === 1 ? 'deal' : 'deals'}
                  </Text>
                )}
              </View>
            )}

            {isDiscoveryLoading ? (
              <RailShimmer />
            ) : discoveryProducts.length > 0 ? (
              <ProductRail
                items={discoveryProducts}
                navigation={navigation}
                contentContainerStyle={styles.railContent}
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
                  No deals in {activeName} right now. Try another category — new
                  picks land every day.
                </Text>
              </View>
            ) : null}
          </Animated.View>
        </View>
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
    paddingLeft: GUTTER,
    paddingRight: GUTTER,
  },

  caretRow: {
    height: CARET_HALF,
    overflow: 'hidden',
  },
  caret: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftWidth: CARET_HALF,
    borderRightWidth: CARET_HALF,
    borderBottomWidth: CARET_HALF,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: EXPLORE_PANEL,
  },
  // Full-bleed: the tint runs edge to edge, so the panel takes no horizontal
  // margin or corner radius and its contents carry the page gutter instead.
  panel: {
    paddingTop: SPACE.md,
    paddingBottom: SPACE.md,
  },
  panelActive: {
    backgroundColor: EXPLORE_PANEL,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: GUTTER,
    paddingBottom: SPACE.sm,
  },
  panelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    backgroundColor: SURFACE.base,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACE.xs + 1,
    paddingHorizontal: SPACE.sm + 2,
  },
  panelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ACCENT.primary,
    marginRight: SPACE.xs + 2,
  },
  panelBadgeText: {
    ...TYPE.caption,
    flexShrink: 1,
    color: INK.strong,
    fontFamily: FONTS.gilroy.semiBold,
  },
  panelCount: {
    ...TYPE.micro,
    color: INK.muted,
    fontFamily: FONTS.gilroy.medium,
    marginLeft: SPACE.sm,
  },

  railShimmerRow: {
    flexDirection: 'row',
    paddingLeft: GUTTER,
  },
  railShimmerCard: {
    width: wp('35%'),
    height: hp('22%'),
    borderRadius: RADIUS.md,
    marginRight: wp('3%'),
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('2%'),
    paddingHorizontal: SPACE.lg,
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
