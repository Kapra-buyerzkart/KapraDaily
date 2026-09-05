import { useCallback } from 'react';
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

export const trackCartPillScroll = (offsetY: number) => {
  'worklet';
  updateTabBarVisibilityWorklet(offsetY, scrollAnchor);
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
      trackCartPillScroll(e.contentOffset.y);
    },
  });
};

export const useCartPillScrollProps = () => {
  const onScroll = useCartPillScrollHandler();
  return { onScroll, scrollEventThrottle: 1 };
};

export const useCartPillScrollTracker = () => {
  useCartPillScrollReset();

  return useCallback((offsetY: number) => {
    'worklet';
    trackCartPillScroll(offsetY);
  }, []);
};
