import { withTiming, Easing } from 'react-native-reanimated';

export function cartPillSlideIn() {
  'worklet';
  return {
    initialValues: {
      opacity: 0,
      transform: [{ translateY: 40 }],
    },
    animations: {
      opacity: withTiming(1, {
        duration: 240,
        easing: Easing.out(Easing.cubic),
      }),
      transform: [
        {
          translateY: withTiming(0, {
            duration: 240,
            easing: Easing.out(Easing.cubic),
          }),
        },
      ],
    },
  };
}

export function cartPillSlideOut() {
  'worklet';
  return {
    initialValues: {
      opacity: 1,
      transform: [{ translateY: 0 }],
    },
    animations: {
      opacity: withTiming(0, {
        duration: 180,
        easing: Easing.in(Easing.quad),
      }),
      transform: [
        {
          translateY: withTiming(30, {
            duration: 180,
            easing: Easing.in(Easing.quad),
          }),
        },
      ],
    },
  };
}


