import { useEffect } from 'react';
import {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

// Entrance: the ticket area rises and scales in shortly after mount, matching
// the reveal the modal used to play when it opened.
const useTicketEntrance = () => {
  const ticketAnim = useSharedValue(0);

  useEffect(() => {
    ticketAnim.value = withDelay(
      40,
      withTiming(1, { duration: 360, easing: Easing.out(Easing.cubic) }),
    );
  }, [ticketAnim]);

  return useAnimatedStyle(() => ({
    opacity: ticketAnim.value,
    transform: [
      { translateY: interpolate(ticketAnim.value, [0, 1], [24, 0]) },
      { scale: interpolate(ticketAnim.value, [0, 1], [0.9, 1]) },
    ],
  }));
};

export default useTicketEntrance;
