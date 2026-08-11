import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import icons from '../../../assets/icons';
import ShimmerPlaceholder from '../../../components/ShimmerPlaceholder';
import ProductBlockShimmer from './ProductBlockShimmer';
import ProductRail from './ProductRail';
import SectionHeader from './SectionHeader';
import { selectionTick } from '../../../utils/haptics';
import {
  SPACE,
  GUTTER,
  MAX_FONT_SCALE,
  divider,
  ACCENT,
  CANVAS,
  EXPLORE_PANEL,
  EXPLORE_PANEL_EDGE,
  INK,
  RADIUS,
  SURFACE,
  TYPE,
} from '@/styles/homeTheme';
import { FONTS } from '../../../styles/typography';

const RULE = 1.5;
const TAB_H = 34;
const TAB_PAD_H = 12;
const TAB_RADIUS = 12;
const SHOULDER = 8;
const TAB_GAP = 6;
const TAB_PEEK = 44;

const TAB_LABEL_IDLE = INK.strong;
const TAB_LABEL_ACTIVE = ACCENT.primary;

const SWEEP_MS = 1150;
const SWEEP_WIDTH_PCT = 0.34;
const SWEEP_COLORS = [
  'rgba(242,80,0,0)',
  'rgba(242,80,0,0.85)',
  'rgba(242,80,0,0)',
];
const SWEEP_START = { x: 0, y: 0 };
const SWEEP_END = { x: 1, y: 0 };

const SHIMMER_TAB_WIDTHS = [wp('24%'), wp('30%'), wp('26%'), wp('34%')];

const ExploreShimmer = () => (
  <View style={styles.section}>
    <View style={styles.shimmerHeader}>
      <ShimmerPlaceholder style={styles.shimmerEyebrow} />
      <ShimmerPlaceholder style={styles.shimmerTitle} />
    </View>
    <View style={styles.tabRow}>
      {SHIMMER_TAB_WIDTHS.map((tabWidth, i) => (
        <ShimmerPlaceholder
          key={i}
          style={[styles.shimmerTab, { width: tabWidth }]}
        />
      ))}
    </View>
    <ProductBlockShimmer />
  </View>
);

const RailShimmer = () => (
  <View style={styles.railShimmerRow}>
    {[1, 2, 3].map((_, i) => (
      <ShimmerPlaceholder key={i} style={styles.railShimmerCard} />
    ))}
  </View>
);

/** SVG tab shape with smooth circular arc corners & inverted-arc shoulders. */
const TabShapeSvg = React.memo(({ width, height }) => {
  if (!width || !height) return null;

  const sw = RULE; // stroke width
  const r = TAB_RADIUS; // top corner radius
  const s = SHOULDER; // shoulder (inverted arc) radius
  const half = sw / 2;

  // All corners use SVG arc (A) commands — true circular quarter-arcs.
  // A rx,ry rotation large-arc sweep x,y
  const d = [
    `M 0,${height}`,
    // left shoulder — inverted arc curving from bottom up to tab wall
    `A ${s},${s} 0 0,0 ${s},${height - s}`,
    // left wall straight up
    `L ${s},${r + half}`,
    // top-left corner — standard rounded corner
    `A ${r},${r} 0 0,1 ${s + r},${half}`,
    // top edge straight across
    `L ${width - s - r},${half}`,
    // top-right corner — standard rounded corner
    `A ${r},${r} 0 0,1 ${width - s},${r + half}`,
    // right wall straight down
    `L ${width - s},${height - s}`,
    // right shoulder — inverted arc curving from tab wall down to bottom
    `A ${s},${s} 0 0,0 ${width},${height}`,
  ].join(' ');

  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
      <Path d={d} fill={CANVAS} stroke={ACCENT.primary} strokeWidth={sw} />
    </Svg>
  );
});

const DiscoveryTab = React.memo(function DiscoveryTab({
  item,
  isActive,
  onPress,
}) {
  const activeProgress = useSharedValue(isActive ? 1 : 0);
  const [tabSize, setTabSize] = React.useState({ w: 0, h: 0 });

  const label = item.catName || item.name;

  useEffect(() => {
    activeProgress.value = withTiming(isActive ? 1 : 0, { duration: 160 });
  }, [isActive, activeProgress]);

  const shapeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: activeProgress.value,
  }));

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      activeProgress.value,
      [0, 1],
      [TAB_LABEL_IDLE, TAB_LABEL_ACTIVE],
    ),
  }));

  const handlePress = useCallback(() => {
    selectionTick();
    onPress(item);
  }, [onPress, item]);

  const handleLayout = useCallback(event => {
    const { width, height } = event.nativeEvent.layout;
    setTabSize(prev => {
      if (prev.w > 0) return prev; // already measured, skip
      return { w: width, h: height };
    });
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      onLayout={handleLayout}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={label}
    >
      <View style={styles.tab}>
        <Animated.View
          style={[styles.tabDecoration, shapeAnimatedStyle]}
          pointerEvents="none"
        >
          <TabShapeSvg width={tabSize.w} height={tabSize.h} />
        </Animated.View>
        <Animated.Text
          style={[styles.tabLabel, labelAnimatedStyle]}
          numberOfLines={1}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          {label}
        </Animated.Text>
      </View>
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
  const { width } = useWindowDimensions();

  const activeCatId = selectedDiscoveryCategory?.catId;
  const activeName =
    selectedDiscoveryCategory?.catName || selectedDiscoveryCategory?.name;

  const tabListRef = useRef(null);
  const prevActiveIndex = useRef(null);
  const bodyProgress = useSharedValue(1);
  const sweepProgress = useSharedValue(0);

  const activeIndex = useMemo(
    () => discoveryCategories.findIndex(c => c.catId === activeCatId),
    [discoveryCategories, activeCatId],
  );

  const sweepWidth = Math.round(width * SWEEP_WIDTH_PCT);

  useEffect(() => {
    if (!isDiscoveryLoading) {
      cancelAnimation(sweepProgress);
      sweepProgress.value = 0;
      return undefined;
    }
    sweepProgress.value = 0;
    sweepProgress.value = withRepeat(
      withTiming(1, { duration: SWEEP_MS, easing: Easing.inOut(Easing.quad) }),
      -1,
      false,
    );
    return () => cancelAnimation(sweepProgress);
  }, [isDiscoveryLoading, sweepProgress]);

  useEffect(() => {
    if (!activeCatId || isDiscoveryLoading) return;
    bodyProgress.value = 0;
    bodyProgress.value = withTiming(1, { duration: 260 });
  }, [activeCatId, isDiscoveryLoading, bodyProgress]);

  const lastTabIndex = discoveryCategories.length - 1;

  useEffect(() => {
    if (activeIndex < 0 || lastTabIndex < 0) return;

    const previous = prevActiveIndex.current;
    prevActiveIndex.current = activeIndex;
    if (previous === null || previous === activeIndex) return;

    const forward = activeIndex > previous;

    tabListRef.current?.scrollToIndex({
      index: activeIndex,
      animated: true,
      viewPosition: forward ? 0 : 1,
      viewOffset: forward ? GUTTER : activeIndex === 0 ? 0 : TAB_PEEK,
    });
  }, [activeIndex, lastTabIndex]);

  const handleScrollToIndexFailed = useCallback(
    ({ averageItemLength, index }) => {
      tabListRef.current?.scrollToOffset({
        offset: Math.max(averageItemLength * index - GUTTER, 0),
        animated: true,
      });
    },
    [],
  );

  const sweepStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          sweepProgress.value,
          [0, 1],
          [-sweepWidth, width],
        ),
      },
    ],
  }));

  const sweepSizeStyle = useMemo(() => ({ width: sweepWidth }), [sweepWidth]);

  const bodyStyle = useAnimatedStyle(() => ({
    opacity: bodyProgress.value,
    transform: [{ translateY: (1 - bodyProgress.value) * 10 }],
  }));

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
          <View style={styles.tabBar}>
            <View style={styles.tabRule} pointerEvents="none" />
            {isDiscoveryLoading && (
              <Animated.View
                style={[styles.sweep, sweepSizeStyle, sweepStyle]}
                pointerEvents="none"
              >
                <LinearGradient
                  colors={SWEEP_COLORS}
                  start={SWEEP_START}
                  end={SWEEP_END}
                  style={styles.sweepFill}
                />
              </Animated.View>
            )}
            <FlatList
              ref={tabListRef}
              horizontal
              data={discoveryCategories}
              keyExtractor={tabKeyExtractor}
              renderItem={renderTab}
              extraData={activeCatId}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabRow}
              onScrollToIndexFailed={handleScrollToIndexFailed}
              initialNumToRender={8}
              maxToRenderPerBatch={8}
              windowSize={5}
              accessibilityRole="tablist"
            />
          </View>
        )}

        <View
          style={[
            styles.panel,
            !!selectedDiscoveryCategory && styles.panelActive,
          ]}
        >
          <Animated.View style={bodyStyle}>
            {!!activeName && (
              <View style={styles.panelHeader}>
                {/* <View style={styles.panelBadge}>
                  <View style={styles.panelDot} />
                  <Text
                    style={styles.panelBadgeText}
                    numberOfLines={1}
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                  >
                    {activeName}
                  </Text>
                </View> */}
                {isDiscoveryLoading ? (
                  <Text
                    style={styles.panelCount}
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                  >
                    Finding deals…
                  </Text>
                ) : (
                  discoveryProducts.length > 0 && (
                    <Text
                      style={styles.panelCount}
                      maxFontSizeMultiplier={MAX_FONT_SCALE}
                    >
                      {discoveryProducts.length}{' '}
                      {discoveryProducts.length === 1 ? 'deal' : 'deals'}
                    </Text>
                  )
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
                <Image source={icons.noProducts} style={styles.emptyImage} />
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

  tabBar: {
    justifyContent: 'flex-end',
  },
  tabRow: {
    paddingHorizontal: GUTTER,
    alignItems: 'flex-end',
    gap: TAB_GAP,
  },
  tabRule: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: RULE,
    backgroundColor: ACCENT.primary,
  },
  tab: {
    height: TAB_H,
    paddingHorizontal: TAB_PAD_H + SHOULDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabDecoration: {
    ...StyleSheet.absoluteFillObject,
  },
  tabLabel: {
    ...TYPE.caption,
    includeFontPadding: false,
    fontFamily: FONTS.gilroy.semiBold,
  },
  sweep: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: RULE,
  },
  sweepFill: {
    flex: 1,
  },
  panel: {
    paddingTop: SPACE.md,
    paddingBottom: SPACE.md,
  },
  panelActive: {
    // backgroundColor: EXPLORE_PANEL,
    borderBottomWidth: RULE,
    borderBottomColor: EXPLORE_PANEL_EDGE,
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
    width: wp('20%'),
    height: wp('20%'),
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
  shimmerTab: {
    height: TAB_H,
    borderTopLeftRadius: TAB_RADIUS,
    borderTopRightRadius: TAB_RADIUS,
  },
});

export default React.memo(CategoryDiscoverySection);
