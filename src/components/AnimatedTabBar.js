import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  clamp,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
  tabBarVisibility,
  TAB_BAR_ANIM_DURATION,
  TAB_BAR_EXTRA_HIDDEN_OFFSET,
  getTabBarHeight,
} from '../animations/tabBarVisibility';

// Drop-in replacement for React Navigation's built-in bottom tab bar
// (`tabBar={props => <AnimatedTabBar {...props} />}` on <Tab.Navigator>).
// It renders from `state` / `descriptors` exactly like the default tab bar
// does, so every `tabBarIcon`, `tabBarLabel`, and `listeners.tabPress`
// already defined on each <Tab.Screen> in MainTabNavigator keeps working
// completely unchanged — this component only adds the show/hide animation
// on top of identical visuals and identical press behavior.
export default function AnimatedTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  // Same height formula as the tab bar's previous `screenOptions.tabBarStyle`
  // (shared with HomeScreen/CategoriesScreen via getTabBarHeight so their
  // content padding always matches this bar's actual height).
  const tabBarHeight = getTabBarHeight(insets.bottom);

  // Per spec: Hidden Position = tabHeight + bottomSafeArea + 20.
  const hiddenTranslateY =
    tabBarHeight + insets.bottom + TAB_BAR_EXTRA_HIDDEN_OFFSET;

  // Edge case: whenever the focused tab changes (tab navigation / returning
  // from another tab), force the bar visible. This is a discrete navigation
  // event (state.index changing), not a scroll calculation, so a JS-thread
  // effect here doesn't violate the "no JS thread for scroll" requirement —
  // it just kicks off a UI-thread `withTiming` like everything else.
  useEffect(() => {
    tabBarVisibility.value = withTiming(1, { duration: TAB_BAR_ANIM_DURATION });
  }, [state.index]);

  // ─── UI THREAD ───────────────────────────────────────────────────────────
  // Reads the single global progress value that HomeScreen/CategoriesScreen
  // write to from their scroll worklets and maps it onto translateY only.
  // `clamp` guards against any transient out-of-range value so the bar can
  // never overshoot past its hidden position. This style recomputes on the
  // UI thread every frame `tabBarVisibility` changes — no JS thread, no
  // React re-render, no bridge traffic.
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
        const color = focused ? '#F25000' : '#8E8E8E';

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
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            activeOpacity={0.8}
            style={styles.tabButton}
          >
            {options.tabBarIcon
              ? options.tabBarIcon({ focused, color })
              : null}
            {options.tabBarLabel
              ? options.tabBarLabel({ focused, color })
              : null}
          </TouchableOpacity>
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
