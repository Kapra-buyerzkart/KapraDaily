import { useCallback } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import {
  tabBarVisibility,
  TAB_BAR_ANIM_DURATION,
  updateTabBarVisibilityWorklet,
} from '../animations/tabBarVisibility';

// Drop this into HomeScreen / CategoriesScreen only — per spec, the
// hide-on-scroll animation is scoped to those two screens. Every other
// screen leaves `tabBarVisibility` exactly as the last scroll/focus event
// left it.
export default function useTabBarAnimation() {
  // ─── UI THREAD ───────────────────────────────────────────────────────────
  // Per-screen scroll anchor. Created with `useSharedValue` (not
  // `useSharedValue` exported state, not React state) so it never causes a
  // re-render and lives purely as UI-thread memory for this screen's list.
  const scrollAnchor = useSharedValue(0);

  // Worklet wrapper exposed to the screen's own `useAnimatedScrollHandler`.
  // It does not create a second scroll handler/listener — the screen calls
  // this from inside the `onScroll` worklet it already has (e.g. alongside
  // its floating-cart logic), so scroll direction calculation and the
  // visibility decision both happen in the same UI-thread frame.
  const onScrollWorklet = y => {
    'worklet';
    updateTabBarVisibilityWorklet(y, scrollAnchor);
  };

  // ─── JS THREAD (unavoidable, navigation-lifecycle only) ─────────────────
  // There is no UI-thread concept of "this screen just regained focus" —
  // that's inherently a JS-thread navigation event, not a scroll/animation
  // calculation, so it's not covered by the "no JS thread" scroll rules.
  // The only thing it does is kick off a `withTiming` on the global shared
  // value, so the actual animation still runs entirely on the UI thread.
  useFocusEffect(
    useCallback(() => {
      scrollAnchor.value = 0;
      tabBarVisibility.value = withTiming(1, {
        duration: TAB_BAR_ANIM_DURATION,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return { onScrollWorklet };
}
