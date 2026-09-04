import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutChangeEvent,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  Easing,
  SharedValue,
  FadeInRight,
  ReduceMotion,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcons } from '../assets/icons';
import { Fonts } from '../theme/fonts';
import { TAB_GEOMETRY, buildTabPath } from './homeHeaderTabPath';
import {
  CollapseMetrics,
  SectionSizes,
  collapseActions,
  collapseHeader,
  freezeSize,
} from './homeHeaderCollapse';
import RotatingPlaceholder from './RotatingPlaceholder';
import { wp } from '@/utils/responsive';

export const HEADER_BG = '#2E7FB6';
const BORDER = '#FFFFFF';
const STROKE = TAB_GEOMETRY.stroke;
const TAB_HEIGHT = TAB_GEOMETRY.height;
const REACH = TAB_GEOMETRY.flare * 2;

const SEARCH_EXAMPLES = [
  'Cookware',
  // 'Kitchen Appliances',
  'Garment Care',
  'Gas Stoves',
];

const SLIDE = {
  duration: 240,
  easing: Easing.out(Easing.cubic),
  reduceMotion: ReduceMotion.System,
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface TabLayout {
  x: number;
  width: number;
}

export interface HeaderTab {
  id: string;
  name: string;
}

export interface HeaderItem {
  id: string;
  name: string;
  image?: any;
  raw?: any;
}

interface HomeHeaderProps {
  title?: string;
  address?: string | null;
  avatar?: any;
  tabs: HeaderTab[];
  selectedTabId?: string | null;
  items: HeaderItem[];
  onSelectTab?: (id: string) => void;
  onItemPress?: (item: HeaderItem) => void;
  onSearchPress?: () => void;
  onAvatarPress?: () => void;
  onNotificationsPress?: () => void;
  onWishlistPress?: () => void;
  onProfilePress?: () => void;
  onAddressPress?: () => void;
  scrollY?: SharedValue<number>;
  onHeightChange?: (height: number) => void;
}

const SlidingTabShape: React.FC<{
  x: SharedValue<number>;
  width: SharedValue<number>;
  rowWidth: number;
}> = ({ x, width, rowWidth }) => {
  const fillProps = useAnimatedProps(() => ({
    d: buildTabPath(width.value, x.value + REACH).fill,
  }));
  const outlineProps = useAnimatedProps(() => ({
    d: buildTabPath(width.value, x.value + REACH).outline,
  }));

  return (
    <Svg
      pointerEvents="none"
      width={rowWidth + REACH * 2}
      height={TAB_HEIGHT}
      style={styles.tabShape}
    >
      <AnimatedPath animatedProps={fillProps} fill={HEADER_BG} />
      <AnimatedPath
        animatedProps={outlineProps}
        fill="none"
        stroke={BORDER}
        strokeWidth={STROKE}
        strokeLinecap="butt"
      />
    </Svg>
  );
};

const HeaderTabButton: React.FC<{
  tab: HeaderTab;
  index: number;
  active: boolean;
  focus: SharedValue<number>;
  onPress: (id: string) => void;
  onMeasure: (id: string, layout: TabLayout) => void;
}> = ({ tab, index, active, focus, onPress, onMeasure }) => {
  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { x, width } = e.nativeEvent.layout;
      onMeasure(String(tab.id), { x, width });
    },
    [onMeasure, tab.id],
  );

  const labelStyle = useAnimatedStyle(() => {
    const nearness = 1 - Math.min(1, Math.abs(focus.value - index));
    return {
      opacity: interpolate(nearness, [0, 1], [0.85, 1]),
      transform: [{ translateY: interpolate(nearness, [0, 1], [2, 0]) }],
    };
  });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(tab.id)}
      onLayout={handleLayout}
      style={styles.tab}
    >
      <Animated.Text
        style={[styles.tabLabel, active && styles.tabLabelActive, labelStyle]}
      >
        {tab.name}
      </Animated.Text>
    </TouchableOpacity>
  );
};

const HomeHeader: React.FC<HomeHeaderProps> = ({
  title = 'Home',
  address,
  avatar,
  tabs,
  selectedTabId,
  items,
  onSelectTab,
  onItemPress,
  onSearchPress,
  onAvatarPress,
  onNotificationsPress,
  onWishlistPress,
  onProfilePress,
  onAddressPress,
  scrollY,
  onHeightChange,
}) => {
  const insets = useSafeAreaInsets();
  const tabsScrollRef = useRef<ScrollView>(null);
  const [tabLayouts, setTabLayouts] = useState<Record<string, TabLayout>>({});
  const [rowWidth, setRowWidth] = useState(0);

  const shapeX = useSharedValue(0);
  const shapeWidth = useSharedValue(0);
  const focus = useSharedValue(0);
  const settled = useRef(false);

  const measureTab = useCallback((id: string, layout: TabLayout) => {
    setTabLayouts(prev => {
      const known = prev[id];
      if (known && known.x === layout.x && known.width === layout.width) {
        return prev;
      }
      return { ...prev, [id]: layout };
    });
  }, []);

  const measureRow = useCallback((e: LayoutChangeEvent) => {
    setRowWidth(e.nativeEvent.layout.width);
  }, []);

  const collapsible = !!scrollY;
  const metrics = useSharedValue<CollapseMetrics>({
    titleHeight: 0,
    panelHeight: 0,
  });
  const [sizes, setSizes] = useState<SectionSizes>({
    title: 0,
    pinned: 0,
    panel: 0,
    actions: 0,
  });
  const actionsWidth = useSharedValue(0);

  const measureSection = useCallback(
    (key: keyof SectionSizes) => (e: LayoutChangeEvent) => {
      const next = Math.round(e.nativeEvent.layout.height);
      setSizes(prev => freezeSize(prev, key, next));
    },
    [],
  );

  const measureActions = useCallback((e: LayoutChangeEvent) => {
    const next = Math.round(e.nativeEvent.layout.width);
    setSizes(prev => freezeSize(prev, 'actions', next));
  }, []);

  useEffect(() => {
    metrics.value = { titleHeight: sizes.title, panelHeight: sizes.panel };
    actionsWidth.value = sizes.actions;
  }, [metrics, actionsWidth, sizes.title, sizes.panel, sizes.actions]);

  useEffect(() => {
    if (!sizes.title || !sizes.pinned || !sizes.panel) return;
    onHeightChange?.(insets.top + 8 + sizes.title + sizes.pinned + sizes.panel);
  }, [onHeightChange, insets.top, sizes.title, sizes.pinned, sizes.panel]);

  const titleStyle = useAnimatedStyle(() => {
    const state = collapseHeader(scrollY ? scrollY.value : 0, metrics.value);
    return state.titleHeight === null
      ? { opacity: state.titleOpacity }
      : { height: state.titleHeight, opacity: state.titleOpacity };
  });

  const panelStyle = useAnimatedStyle(() => {
    const state = collapseHeader(scrollY ? scrollY.value : 0, metrics.value);
    return state.panelHeight === null
      ? { opacity: state.panelOpacity }
      : { height: state.panelHeight, opacity: state.panelOpacity };
  });

  const actionsStyle = useAnimatedStyle(() => {
    const state = collapseActions(
      scrollY ? scrollY.value : 0,
      metrics.value,
      actionsWidth.value,
    );
    return state.width === null
      ? { opacity: state.opacity }
      : { width: state.width, opacity: state.opacity };
  });

  const handleSelectTab = useCallback(
    (id: string) => onSelectTab?.(id),
    [onSelectTab],
  );

  const activeIndex = useMemo(
    () => tabs.findIndex(t => String(t.id) === String(selectedTabId)),
    [tabs, selectedTabId],
  );

  const activeLayout = tabLayouts[String(selectedTabId)];

  useEffect(() => {
    if (!activeLayout || activeIndex < 0) return;

    // The first measurement should land the notch, not slide it in from x=0.
    if (!settled.current) {
      settled.current = true;
      shapeX.value = activeLayout.x;
      shapeWidth.value = activeLayout.width;
      focus.value = activeIndex;
      return;
    }

    shapeX.value = withTiming(activeLayout.x, SLIDE);
    shapeWidth.value = withTiming(activeLayout.width, SLIDE);
    focus.value = withTiming(activeIndex, SLIDE);

    tabsScrollRef.current?.scrollTo({
      x: Math.max(0, activeLayout.x + activeLayout.width / 2 - 140),
      animated: true,
    });
  }, [activeLayout, activeIndex, shapeX, shapeWidth, focus]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <Animated.View
        style={[
          styles.collapsible,
          collapsible && sizes.title > 0 && titleStyle,
        ]}
      >
        <View
          style={[
            styles.titleRow,
            sizes.title > 0 && { minHeight: sizes.title },
          ]}
          onLayout={measureSection('title')}
        >
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onAddressPress}
              disabled={!onAddressPress}
              style={styles.addressRow}
            >
              <AppIcons.Location size={13} color="rgba(255,255,255,0.9)" />
              <Text
                style={[styles.address, !address && styles.addressPlaceholder]}
                numberOfLines={1}
              >
                {address || 'Select delivery address'}
              </Text>
              <AppIcons.ArrowDownBold size={12} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>
          </View>
          {/* <TouchableOpacity activeOpacity={0.85} onPress={onAvatarPress}>
            {avatar ? (
              <Image source={avatar} style={styles.avatar} />
            ) : (
              <View style={styles.avatar} />
            )}
          </TouchableOpacity> */}
        </View>
      </Animated.View>

      <View onLayout={measureSection('pinned')}>
        <View style={styles.searchRow}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.searchBar}
            onPress={onSearchPress}
          >
            <AppIcons.Search size={20} color="#5B5B5B" />
            <RotatingPlaceholder
              examples={SEARCH_EXAMPLES}
              prefix="Search For "
              openQuote="‘"
              closeQuote="’"
              style={styles.searchPlaceholder}
              containerStyle={styles.searchPlaceholderBox}
            />
            <View style={styles.searchDivider} />
            <AppIcons.Microphone size={20} color="#000000ff" />
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.actionsShell,
              collapsible && sizes.actions > 0 && actionsStyle,
            ]}
            onLayout={measureActions}
          >
            <View
              style={[
                styles.actions,
                sizes.actions > 0 && { width: sizes.actions },
              ]}
            >
              {/* <TouchableOpacity
                style={styles.headerIcon}
                onPress={onNotificationsPress}
              >
                <AppIcons.Bell size={23} color={BORDER} />
              </TouchableOpacity> */}
              <TouchableOpacity
                style={styles.headerIcon}
                onPress={onWishlistPress}
              >
                <AppIcons.HeartOutline size={23} color={BORDER} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerIcon}
                onPress={onProfilePress}
              >
                <AppIcons.UserCircle size={23} color={BORDER} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>

        <View style={styles.tabsSection}>
          <View style={styles.tabsBaseline} />
          <ScrollView
            ref={tabsScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
          >
            <View style={styles.tabsRow} onLayout={measureRow}>
              {rowWidth > 0 && (
                <SlidingTabShape
                  x={shapeX}
                  width={shapeWidth}
                  rowWidth={rowWidth}
                />
              )}
              {tabs.map((tab, index) => (
                <HeaderTabButton
                  key={tab.id}
                  tab={tab}
                  index={index}
                  active={String(tab.id) === String(selectedTabId)}
                  focus={focus}
                  onPress={handleSelectTab}
                  onMeasure={measureTab}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      <Animated.View
        style={[
          styles.collapsible,
          collapsible && sizes.panel > 0 && panelStyle,
        ]}
      >
        <View
          style={[styles.panel, sizes.panel > 0 && { minHeight: sizes.panel }]}
          onLayout={measureSection('panel')}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.itemsContent}
          >
            {items.map((item, index) => (
              <Animated.View
                key={`${selectedTabId}-${item.id}`}
                entering={FadeInRight.duration(220)
                  .delay(Math.min(index, 6) * 28)
                  .reduceMotion(ReduceMotion.System)}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.item}
                  onPress={() => onItemPress?.(item)}
                >
                  <View style={styles.itemCircle}>
                    {!!item.image && (
                      <Image
                        source={item.image}
                        style={styles.itemImage}
                        resizeMode="contain"
                      />
                    )}
                  </View>
                  <Text style={styles.itemLabel} numberOfLines={1}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: HEADER_BG,
  },
  collapsible: {
    overflow: 'hidden',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  titleBlock: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontFamily: Fonts.madelyn,
    fontSize: 38,
    lineHeight: 46,
    color: BORDER,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  address: {
    flexShrink: 1,
    fontFamily: Fonts.gilroyRegular,
    fontSize: 13,
    width: wp('60%'),
    color: 'rgba(255,255,255,0.9)',
    marginHorizontal: 4,
  },
  addressPlaceholder: {
    fontFamily: Fonts.gilroyBold,
    color: BORDER,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D9D9D9',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#ffffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 6,
  },
  searchPlaceholderBox: {
    flex: 1,
    marginLeft: 10,
  },
  searchPlaceholder: {
    fontFamily: Fonts.gilroyRegular,
    fontSize: 14,
    color: '#6B6B6B',
  },
  searchDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#BFBFBF',
    marginRight: 12,
  },
  actionsShell: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 16,
    padding: 2,
  },
  tabsSection: {
    marginTop: 26,
    justifyContent: 'flex-end',
  },
  tabsBaseline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: STROKE,
    backgroundColor: BORDER,
  },
  tabsContent: {
    paddingLeft: REACH,
    paddingRight: REACH,
    alignItems: 'flex-end',
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: TAB_HEIGHT,
  },
  tab: {
    height: TAB_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  tabShape: {
    position: 'absolute',
    left: -REACH,
    bottom: 0,
  },
  tabLabel: {
    fontFamily: Fonts.gilroyMedium,
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
  },
  tabLabelActive: {
    fontFamily: Fonts.gilroyBold,
    color: BORDER,
  },
  panel: {
    backgroundColor: HEADER_BG,
  },
  itemsContent: {
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 10,
  },
  item: {
    width: 92,
    alignItems: 'center',
  },
  itemCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  itemImage: {
    width: 46,
    height: 46,
  },
  itemLabel: {
    marginTop: 8,
    fontFamily: Fonts.gilroyMedium,
    fontSize: 12,
    color: BORDER,
    textAlign: 'center',
  },
});

export default HomeHeader;
