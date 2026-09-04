import { useCallback, useEffect } from 'react';
import {
  makeMutable,
  useAnimatedScrollHandler,
  withSpring,
} from 'react-native-reanimated';

const HIDE_DISTANCE = 28;
const SHOW_DISTANCE = 18;
const TOP_ZONE = 32;

const SHOW_SPRING = {
  damping: 18,
  stiffness: 190,
  mass: 0.7,
  overshootClamping: false,
  restDisplacementThreshold: 0.001,
  restSpeedThreshold: 0.01,
};

const HIDE_SPRING = {
  damping: 22,
  stiffness: 210,
  mass: 0.7,
  overshootClamping: true,
  restDisplacementThreshold: 0.001,
  restSpeedThreshold: 0.01,
};

export const cartPillHidden = makeMutable(0);

const target = makeMutable(0);
const lastOffset = makeMutable(0);
const travel = makeMutable(0);

const setTarget = (next: number) => {
  'worklet';
  if (target.value === next) return;
  target.value = next;
  cartPillHidden.value = withSpring(next, next ? HIDE_SPRING : SHOW_SPRING);
};

export const trackCartPillScroll = (offsetY: number) => {
  'worklet';
  const y = offsetY < 0 ? 0 : offsetY;
  const delta = y - lastOffset.value;
  lastOffset.value = y;

  if (delta === 0) return;

  if (y <= TOP_ZONE) {
    travel.value = 0;
    setTarget(0);
    return;
  }

  travel.value = travel.value * delta > 0 ? travel.value + delta : delta;

  if (travel.value > HIDE_DISTANCE) {
    setTarget(1);
  } else if (travel.value < -SHOW_DISTANCE) {
    setTarget(0);
  }
};

export const resetCartPillScroll = () => {
  target.value = 0;
  cartPillHidden.value = 0;
  lastOffset.value = 0;
  travel.value = 0;
};

export const useCartPillScrollHandler = () => {
  useEffect(() => {
    resetCartPillScroll();
    return resetCartPillScroll;
  }, []);

  return useAnimatedScrollHandler({
    onScroll: e => {
      trackCartPillScroll(e.contentOffset.y);
    },
    onBeginDrag: e => {
      lastOffset.value = e.contentOffset.y < 0 ? 0 : e.contentOffset.y;
      travel.value = 0;
    },
  });
};

export const useCartPillScrollProps = () => {
  const onScroll = useCartPillScrollHandler();
  return { onScroll, scrollEventThrottle: 1 };
};

export const useCartPillScrollTracker = () => {
  useEffect(() => {
    resetCartPillScroll();
    return resetCartPillScroll;
  }, []);

  return useCallback((offsetY: number) => {
    'worklet';
    trackCartPillScroll(offsetY);
  }, []);
};
