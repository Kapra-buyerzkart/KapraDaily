import { useCallback } from 'react';
import { NativeScrollEvent } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  makeMutable,
  useAnimatedScrollHandler,
  withTiming,
} from 'react-native-reanimated';
import {
  tabBarVisibility,
  TAB_BAR_ANIM_DURATION,
  updateTabBarVisibilityWorklet,
} from '../../animations/tabBarVisibility';

const scrollAnchor = makeMutable(0);

const SCROLL_END_SLOP = 2;

const isAtScrollEnd = (e: NativeScrollEvent) => {
  'worklet';
  return (
    e.contentOffset.y + e.layoutMeasurement.height >=
    e.contentSize.height - SCROLL_END_SLOP
  );
};

export const trackCartPillScroll = (offsetY: number, atEnd?: boolean) => {
  'worklet';
  updateTabBarVisibilityWorklet(offsetY, scrollAnchor, atEnd);
};

export const resetCartPillScroll = () => {
  scrollAnchor.value = 0;
  tabBarVisibility.value = withTiming(1, { duration: TAB_BAR_ANIM_DURATION });
};

const useCartPillScrollReset = () => {
  useFocusEffect(
    useCallback(() => {
      resetCartPillScroll();
    }, []),
  );
};

export const useCartPillScrollHandler = () => {
  useCartPillScrollReset();

  return useAnimatedScrollHandler({
    onScroll: e => {
      trackCartPillScroll(e.contentOffset.y, isAtScrollEnd(e));
    },
  });
};

export const useCartPillScrollProps = () => {
  const onScroll = useCartPillScrollHandler();
  return { onScroll, scrollEventThrottle: 1 };
};

export const useCartPillScrollTracker = () => {
  useCartPillScrollReset();

  return useCallback((e: NativeScrollEvent) => {
    'worklet';
    trackCartPillScroll(e.contentOffset.y, isAtScrollEnd(e));
  }, []);
};
