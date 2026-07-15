import React, { useCallback, useEffect } from 'react';
import {
  View,
  Image,
  FlatList,
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

export const TAB_IDS = {
  POPULAR: 'popular',
  EVENTS: 'events',
  VOUCHERS: 'vouchers',
  SPORTS: 'sports',
  BILLS: 'bills',
};

const TABS = [
  {
    id: TAB_IDS.POPULAR,
    label: 'Popular',
    icon: require('../../assets/events/popular.png'),
    badgedIcon: require('../../assets/events/Group 1000004801.png'),
  },
  {
    id: TAB_IDS.EVENTS,
    label: 'Events',
    icon: require('../../assets/events/Group 1000004805 3.png'),
    badgedIcon: require('../../assets/events/Group 1000004805.png'),
  },
  {
    id: TAB_IDS.VOUCHERS,
    label: 'Vouchers',
    icon: require('../../assets/events/Group 1000004802.png'),
    badgedIcon: require('../../assets/events/Group 1000004802 2.png'),
  },
  {
    id: TAB_IDS.SPORTS,
    label: 'Sports',
    icon: require('../../assets/events/Group 1000004803.png'),
    badgedIcon: require('../../assets/events/Group 1000004803.png'),
  },
  {
    id: TAB_IDS.BILLS,
    label: 'Bills & recharge',
    icon: require('../../assets/events/Group 1000004804.png'),
    badgedIcon: require('../../assets/events/Group 1000004804.png'),
  },
];

const ICON_SIZE = 34;
const STICKY_START = 40;
const STICKY_END = 90;

const keyExtractor = item => item.id;

const TabIcon = React.memo(({ tab, active }) => {
  if (tab.id === TAB_IDS.POPULAR) {
    return (
      <Image
        source={active ? tab.icon : tab.badgedIcon}
        style={[]}
        resizeMode="contain"
      />
    );
  }

  if (tab.badgedIcon) {
    return (
      <Image
        source={active ? tab.badgedIcon : tab.icon}
        style={[]}
        resizeMode="contain"
      />
    );
  }

  return (
    <View style={styles.iconBadgeWrap}>
      {active && (
        <LinearGradient
          colors={['#9A5CFF', '#5B2A9E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconBadgeGradient}
        />
      )}
      <Image
        source={tab.icon}
        style={[
          styles.iconGlyph,
          // active ? styles.iconGlyphActive : styles.iconGlyphInactive,
        ]}
        resizeMode="contain"
      />
    </View>
  );
});

const CategoryTab = React.memo(({ tab, isActive, onPress }) => {
  const activeProgress = useSharedValue(isActive ? 1 : 0);
  const scale = useSharedValue(1);

  useEffect(() => {
    activeProgress.value = withTiming(isActive ? 1 : 0, { duration: 220 });
  }, [isActive, activeProgress]);

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      activeProgress.value,
      [0, 1],
      ['rgba(255,255,255,0.45)', '#FFFFFF'],
    ),
  }));

  const wrapStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withTiming(0.94, { duration: 80 }, () => {
      scale.value = withTiming(1, { duration: 80 });
    });
    onPress(tab.id);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={styles.tab}
    >
      <Reanimated.View style={[styles.tabInner, wrapStyle]}>
        <TabIcon tab={tab} active={isActive} />
        <Reanimated.Text
          style={[styles.label, isActive && styles.labelActive, textStyle]}
          numberOfLines={1}
        >
          {tab.label}
        </Reanimated.Text>
      </Reanimated.View>
    </TouchableOpacity>
  );
});

const EventCategoryTabs = ({ activeTab, onTabChange, scrollY, insets }) => {
  const topInset = insets?.top ?? 0;

  const renderItem = useCallback(
    ({ item }) => (
      <CategoryTab
        tab={item}
        isActive={activeTab === item.id}
        onPress={onTabChange}
      />
    ),
    [activeTab, onTabChange],
  );

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

  const glowStyle = useAnimatedStyle(() => {
    if (!scrollY) return { opacity: 0 };
    return {
      opacity: interpolate(
        scrollY.value,
        [STICKY_START, STICKY_END],
        [0, 0.18],
        Extrapolation.CLAMP,
      ),
    };
  });

  return (
    <Reanimated.View style={[styles.outer, containerStyle]}>
      <Reanimated.View style={[styles.glow, glowStyle]} pointerEvents="none" />
      <FlatList
        data={TABS}
        horizontal
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
      />
    </Reanimated.View>
  );
};

const styles = StyleSheet.create({
  outer: {
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    right: -20,
    top: -10,
    bottom: -10,
    width: 100,
    backgroundColor: '#5B2A9E',
    borderRadius: 50,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 22,
  },
  tab: {
    alignItems: 'center',
  },
  tabInner: {
    alignItems: 'center',
    width: 64,
  },
  iconImage: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  iconInactive: {
    opacity: 0.45,
  },
  iconBadgeWrap: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconBadgeGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  iconGlyph: {
    width: ICON_SIZE * 0.55,
    height: ICON_SIZE * 0.55,
  },
  iconGlyphActive: {
    tintColor: '#FFFFFF',
  },
  iconGlyphInactive: {
    tintColor: 'rgba(255,255,255,0.45)',
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: 'Gilroy-Medium',
    textAlign: 'center',
  },
  labelActive: {
    fontFamily: 'Gilroy-Bold',
  },
});

export default React.memo(EventCategoryTabs);
