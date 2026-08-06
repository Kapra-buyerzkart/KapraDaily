import React, { useEffect, useMemo } from 'react';
import {
  View,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  withTiming,
  Extrapolation,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import icons from '@/assets/icons';

export const TAB_IDS = {
  POPULAR: 'popular',
  EVENTS: 'events',
  VOUCHERS: 'vouchers',
  SPORTS: 'sports',
  BILLS: 'bills',
  HOLIDAYS: 'holidays',
  TRAVEL: 'travel',
};

const DEFAULT_TABS = [
  {
    id: TAB_IDS.POPULAR,
    label: 'Popular',
    icon: icons.lighting,
    badgedIcon: icons.lighting,
  },
  {
    id: TAB_IDS.EVENTS,
    label: 'Events',
    icon: icons.calendar,
    badgedIcon: icons.calendar,
  },
  {
    id: TAB_IDS.VOUCHERS,
    label: 'Vouchers',
    icon: icons.voucher,
    badgedIcon: icons.voucher,
  },
  {
    id: TAB_IDS.BILLS,
    label: 'Bills & recharge',
    icon: icons.coin,
    badgedIcon: icons.coin,
  },
];

const CATEGORY_ALIASES = {
  popular: { id: TAB_IDS.POPULAR, icon: icons.lighting },
  events: { id: TAB_IDS.EVENTS, icon: icons.calendar },
  event: { id: TAB_IDS.EVENTS, icon: icons.calendar },
  vouchers: { id: TAB_IDS.VOUCHERS, icon: icons.voucher },
  voucher: { id: TAB_IDS.VOUCHERS, icon: icons.voucher },
  bills: { id: TAB_IDS.BILLS, icon: icons.coin },
  'bills-recharge': { id: TAB_IDS.BILLS, icon: icons.coin },
  'bills-recharges': { id: TAB_IDS.BILLS, icon: icons.coin },
  holidays: { id: TAB_IDS.HOLIDAYS, icon: icons.resort },
  travel: { id: TAB_IDS.TRAVEL, icon: icons.resort },
  sports: { id: TAB_IDS.SPORTS, icon: icons.lighting },
};

const slugify = name =>
  String(name || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const categoryToTab = category => {
  const slug = slugify(category?.catName);
  const alias = CATEGORY_ALIASES[slug];
  const icon = alias?.icon ?? icons.lighting;
  return {
    id: alias?.id ?? slug,
    label: category?.catName ?? '',
    icon,
    badgedIcon: icon,
    iconUri: category?.iconUri ?? null,
    isActive: category?.isActive !== false,
  };
};

const ICON_SIZE = 18;
const STICKY_START = 40;
const STICKY_END = 90;

const TabIcon = React.memo(({ tab, active }) => {
  if (tab.iconUri) {
    return (
      <Image
        source={{ uri: tab.iconUri }}
        style={styles.iconImage}
        resizeMode="contain"
      />
    );
  }

  const source =
    tab.id === TAB_IDS.POPULAR
      ? active
        ? tab.icon
        : tab.badgedIcon
      : tab.badgedIcon
      ? active
        ? tab.badgedIcon
        : tab.icon
      : tab.icon;

  return (
    <Image source={source} style={styles.iconImage} resizeMode="contain" />
  );
});

const SoonBadge = React.memo(() => (
  <View style={styles.soonBadge}>
    <Text style={styles.soonBadgeText}>Soon</Text>
  </View>
));

const CategoryTab = React.memo(({ tab, isActive, onPress }) => {
  const comingSoon = tab.isActive === false;
  const activeProgress = useSharedValue(isActive ? 1 : 0);
  const scale = useSharedValue(1);

  useEffect(() => {
    activeProgress.value = withTiming(isActive ? 1 : 0, { duration: 220 });
  }, [isActive, activeProgress]);

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      activeProgress.value,
      [0, 1],
      ['rgba(255,255,255,0.55)', '#FFFFFF'],
    ),
  }));

  const wrapStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (comingSoon) return;
    scale.value = withTiming(0.94, { duration: 80 }, () => {
      scale.value = withTiming(1, { duration: 80 });
    });
    onPress(tab.id);
  };

  if (isActive) {
    return (
      <Reanimated.View style={wrapStyle}>
        <TouchableOpacity activeOpacity={0.85} onPress={handlePress}>
          <ImageBackground
            source={icons.selectionPill}
            style={styles.activePill}
            imageStyle={styles.activePillImage}
            resizeMode="stretch"
          >
            <TabIcon tab={tab} active />
            <Text style={styles.activeLabel} numberOfLines={1}>
              {tab.label}
            </Text>
            {comingSoon && <SoonBadge />}
          </ImageBackground>
        </TouchableOpacity>
      </Reanimated.View>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      disabled={comingSoon}
    >
      <Reanimated.View
        style={[styles.pill, comingSoon && styles.pillSoon, wrapStyle]}
      >
        <View style={styles.pillInactiveBg} />
        <TabIcon tab={tab} active={isActive} />
        <Reanimated.Text style={[styles.label, textStyle]} numberOfLines={1}>
          {tab.label}
        </Reanimated.Text>
        {comingSoon && <SoonBadge />}
      </Reanimated.View>
    </TouchableOpacity>
  );
});

const EventCategoryTabs = ({
  activeTab,
  onTabChange,
  scrollY,
  insets,
  categories,
}) => {
  const topInset = insets?.top ?? 0;

  const tabs = useMemo(() => {
    if (Array.isArray(categories) && categories.length > 0) {
      const mapped = categories
        .map(categoryToTab)
        .filter(tab => tab.id && tab.label);
      return [...mapped].sort((a, b) => {
        if (a.id === TAB_IDS.POPULAR) return -1;
        if (b.id === TAB_IDS.POPULAR) return 1;
        return 0;
      });
    }
    return DEFAULT_TABS;
  }, [categories]);

  const containerStyle = useAnimatedStyle(() => {
    if (!scrollY) return {};
    return {
      paddingTop: interpolate(
        scrollY.value,
        [STICKY_START, STICKY_END],
        [0, topInset],
        Extrapolation.CLAMP,
      ),
      backgroundColor: interpolateColor(
        scrollY.value,
        [STICKY_START, STICKY_END],
        ['rgba(0,0,0,0)', 'rgba(0,0,0,0.95)'],
      ),
      borderBottomColor: interpolateColor(
        scrollY.value,
        [STICKY_START, STICKY_END],
        ['rgba(255,255,255,0)', 'rgba(255,255,255,0.08)'],
      ),
      borderBottomWidth: 1,
    };
  });

  return (
    <Reanimated.View style={[styles.outer, containerStyle]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {tabs.map(tab => (
          <CategoryTab
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onPress={onTabChange}
          />
        ))}
      </ScrollView>
    </Reanimated.View>
  );
};

const styles = StyleSheet.create({
  outer: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    overflow: 'hidden',
  },
  pillGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  pillInactiveBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  pillSoon: {
    opacity: 0.7,
  },
  soonBadge: {
    marginLeft: 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(154,92,255,0.18)',
  },
  soonBadgeText: {
    color: '#C9A6FF',
    fontSize: 9,
    fontFamily: 'Gilroy-Bold',
    letterSpacing: 0.3,
  },
  iconImage: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Gilroy-Medium',
  },
  labelActive: {
    fontFamily: 'Gilroy-Bold',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 18,
    paddingVertical: 10,
    minHeight: 40,
    justifyContent: 'center',
  },
  activePillImage: {
    borderRadius: 24,
  },
  activeLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Gilroy-SemiBold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});

export default React.memo(EventCategoryTabs);
