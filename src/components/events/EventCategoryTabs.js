import React, { useEffect } from 'react';
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
};

const TABS = [
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
  // {
  //   id: TAB_IDS.SPORTS,
  //   label: 'Sports',
  //   icon: require('../../assets/events/Group 1000004803.png'),
  //   badgedIcon: require('../../assets/events/Group 1000004803.png'),
  // },
  {
    id: TAB_IDS.BILLS,
    label: 'Bills & recharge',
    icon: icons.coin,
    badgedIcon: icons.coin,
  },
];

const ICON_SIZE = 18;
const STICKY_START = 40;
const STICKY_END = 90;

const TabIcon = React.memo(({ tab, active }) => {
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
      ['rgba(255,255,255,0.55)', '#FFFFFF'],
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
          </ImageBackground>
        </TouchableOpacity>
      </Reanimated.View>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={handlePress}>
      <Reanimated.View style={[styles.pill, wrapStyle]}>
        <View style={styles.pillInactiveBg} />
        <TabIcon tab={tab} active={isActive} />
        <Reanimated.Text style={[styles.label, textStyle]} numberOfLines={1}>
          {tab.label}
        </Reanimated.Text>
      </Reanimated.View>
    </TouchableOpacity>
  );
});

const EventCategoryTabs = ({ activeTab, onTabChange, scrollY, insets }) => {
  const topInset = insets?.top ?? 0;

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
        {TABS.map(tab => (
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
