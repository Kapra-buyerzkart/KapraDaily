import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  PixelRatio,
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
import { ExploreSkeleton, ProductRailSkeleton } from './shimmer';
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

const RULE = PixelRatio.roundToNearestPixel(1.5);
const TAB_BLEED = PixelRatio.roundToNearestPixel(RULE + 1);
const TAB_H = 34;
const TAB_PAD_H = 12;
const TAB_RADIUS = 12;
const SHOULDER = 8;
const TAB_GAP = 6;
const TAB_OVERHANG = TAB_GAP / 2;
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

const TabShapeSvg = React.memo(({ width, height }) => {
  if (!width || !height) return null;

  const sw = RULE;
  const s = SHOULDER;
  const half = sw / 2;

  const canvasW = width + TAB_OVERHANG * 2;
  const bleed = height + TAB_BLEED;
  const left = TAB_OVERHANG;
  const right = canvasW - TAB_OVERHANG;
  const top = half;
  const base = height - half;

  const r = Math.min(TAB_RADIUS, (right - left) / 2 - s);
  const outline = [
    `M 0,${base}`,
    `L ${left},${base}`,
    `A ${s},${s} 0 0,0 ${left + s},${base - s}`,
    `L ${left + s},${top + r}`,
    `A ${r},${r} 0 0,1 ${left + s + r},${top}`,
    `L ${right - s - r},${top}`,
    `A ${r},${r} 0 0,1 ${right - s},${top + r}`,
    `L ${right - s},${base - s}`,
    `A ${s},${s} 0 0,0 ${right},${base}`,
    `L ${canvasW},${base}`,
  ].join(' ');

  const body = `${outline} L ${canvasW},${bleed} L 0,${bleed} Z`;

  return (
    <Svg width={canvasW} height={bleed} style={StyleSheet.absoluteFill}>
      <Path d={body} fill={CANVAS} />
      <Path d={outline} fill="none" stroke={ACCENT.primary} strokeWidth={sw} />
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
    const w = PixelRatio.roundToNearestPixel(width);
    const h = PixelRatio.roundToNearestPixel(height);
    setTabSize(prev => (prev.w === w && prev.h === h ? prev : { w, h }));
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

  if (isHomeLoading && !categoryDiscovery) return <ExploreSkeleton />;
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
              <ProductRailSkeleton />
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
    paddingBottom: TAB_BLEED,
    alignItems: 'flex-end',
    gap: TAB_GAP,
  },
  tabRule: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: TAB_BLEED,
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
    position: 'absolute',
    top: 0,
    left: -TAB_OVERHANG,
    right: -TAB_OVERHANG,
    bottom: -TAB_BLEED,
  },
  tabLabel: {
    ...TYPE.caption,
    includeFontPadding: false,
    fontFamily: FONTS.gilroy.semiBold,
  },
  sweep: {
    position: 'absolute',
    left: 0,
    bottom: TAB_BLEED,
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
});

export default React.memo(CategoryDiscoverySection);
