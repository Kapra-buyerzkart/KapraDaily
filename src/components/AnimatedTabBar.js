import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  clamp,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
  tabBarVisibility,
  TAB_BAR_ANIM_DURATION,
  TAB_BAR_EXTRA_HIDDEN_OFFSET,
  getTabBarHeight,
} from '../animations/tabBarVisibility';
const ICON_ACTIVE_SCALE = 1.12;
const ICON_LIFT = -3;
const FADE_DURATION = 200;
const LOW_BOUNCE_SPRING = { damping: 50, stiffness: 260, mass: 0.5 };

function TabBarButton({ focused, options, accessibilityLabel, onPress }) {
  const progress = useSharedValue(focused ? 1 : 0);
  const fade = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, LOW_BOUNCE_SPRING);
    fade.value = withTiming(focused ? 1 : 0, { duration: FADE_DURATION });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          progress.value,
          [0, 1],
          [1, ICON_ACTIVE_SCALE],
          Extrapolation.CLAMP,
        ),
      },
      {
        translateY: interpolate(
          progress.value,
          [0, 1],
          [0, ICON_LIFT],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const pillStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [
      {
        scale: interpolate(fade.value, [0, 1], [0.8, 1], Extrapolation.CLAMP),
      },
    ],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(fade.value, [0, 1], [0.65, 1]),
  }));

  const color = focused ? '#F25000' : '#8E8E8E';

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.tabButton}
    >
      <Animated.View style={styles.iconWrapper}>
        <Animated.View style={[styles.pill, pillStyle]} />
        <Animated.View style={iconStyle}>
          {options.tabBarIcon ? options.tabBarIcon({ focused, color }) : null}
        </Animated.View>
      </Animated.View>
      <Animated.View style={labelStyle}>
        {options.tabBarLabel ? options.tabBarLabel({ focused, color }) : null}
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function AnimatedTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = getTabBarHeight(insets.bottom);

  const hiddenTranslateY =
    tabBarHeight + insets.bottom + TAB_BAR_EXTRA_HIDDEN_OFFSET;
  useEffect(() => {
    tabBarVisibility.value = withTiming(1, { duration: TAB_BAR_ANIM_DURATION });
  }, [state.index]);

  const animatedStyle = useAnimatedStyle(() => {
    const progress = clamp(tabBarVisibility.value, 0, 1);
    return {
      transform: [
        {
          translateY: interpolate(
            progress,
            [0, 1],
            [hiddenTranslateY, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { height: tabBarHeight, paddingTop: hp('0.2%') },
        animatedStyle,
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;

        const onPress = () => {
          // Standard React Navigation custom-tab-bar boilerplate: emit the
          // same `tabPress` event the default tab bar would, so every
          // `listeners.tabPress` already defined in MainTabNavigator (the
          // Home reset-to-root, the store-unavailable Toast, the Kshope
          // service-switcher modal) keeps firing exactly as before.
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TabBarButton
            key={route.key}
            focused={focused}
            options={options}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
          />
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Floats over the screen content instead of sitting in normal flex flow.
    // With a custom `tabBar`, React Navigation lays the screen content and
    // the tab bar out as flex siblings — translating a flow sibling only
    // moves its pixels, it still reserves its layout slot, which left a
    // blank gap (the navigator's background showing through) when hidden.
    // Taking it out of flow with `position: absolute` means the screen
    // content's flex:1 box fills that space immediately, and sliding the
    // bar down via translateY now genuinely moves it off-screen.
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
