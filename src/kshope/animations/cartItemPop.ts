import { withTiming, Easing } from 'react-native-reanimated';

export function cartPillSlideIn() {
  'worklet';
  return {
    initialValues: {
      opacity: 0,
      transform: [{ translateY: 24 }, { scale: 0.85 }],
    },
    animations: {
      opacity: withTiming(1, { duration: 260 }),
      transform: [
        {
          translateY: withTiming(0, {
            duration: 260,
            easing: Easing.bezier(0.2, 0.8, 0.2, 1),
          }),
        },
        {
          scale: withTiming(1, {
            duration: 260,
            easing: Easing.bezier(0.2, 0.8, 0.2, 1),
          }),
        },
      ],
    },
  };
}

export function cartPillSlideOut() {
  'worklet';
  return {
    initialValues: { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }] },
    animations: {
      opacity: withTiming(0, { duration: 200 }),
      transform: [
        { translateY: withTiming(30, { duration: 200 }) },
        { scale: withTiming(0.9, { duration: 200 }) },
      ],
    },
  };
}
