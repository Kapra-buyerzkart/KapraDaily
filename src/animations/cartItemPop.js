import { withTiming, withSpring } from 'react-native-reanimated';

// Used for the floating "View cart" pill (SelectedProducts) appearing when
// the first item is added and disappearing when the cart empties.
export function cartPillSlideIn() {
  'worklet';
  return {
    initialValues: { opacity: 0, transform: [{ translateY: 40 }] },
    animations: {
      opacity: withTiming(1, { duration: 200 }),
      transform: [
        {
          translateY: withSpring(0, {
            damping: 14,
            stiffness: 160,
            mass: 0.6,
          }),
        },
      ],
    },
  };
}

export function cartPillSlideOut() {
  'worklet';
  return {
    initialValues: { opacity: 1, transform: [{ translateY: 0 }] },
    animations: {
      opacity: withTiming(0, { duration: 150 }),
      transform: [{ translateY: withTiming(40, { duration: 150 }) }],
    },
  };
}
