import React, { useEffect } from 'react';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import COLORS from '@/styles/colors';
import styles from '../styles';

const ScrollHint = ({ scrollY }) => {
  const bounce = useSharedValue(0);

  useEffect(() => {
    bounce.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 700, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [bounce]);

  const containerStyle = useAnimatedStyle(() => {
    const y = scrollY?.value ?? 0;
    return {
      opacity: interpolate(y, [0, 60], [1, 0], Extrapolation.CLAMP),
      transform: [
        { translateY: interpolate(bounce.value, [0, 1], [0, 6]) },
      ],
    };
  });

  return (
    <Animated.View
      style={[styles.scrollHint, containerStyle]}
      pointerEvents="none"
    >
      <Ionicons
        name="chevron-down"
        size={26}
        color={COLORS.white}
        style={styles.scrollHintChevron}
      />
      <Ionicons
        name="chevron-down"
        size={26}
        color={COLORS.white}
        style={styles.scrollHintChevron}
      />
    </Animated.View>
  );
};

export default React.memo(ScrollHint);
