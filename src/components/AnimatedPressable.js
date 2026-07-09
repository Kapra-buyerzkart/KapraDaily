import React from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const PRESS_SCALE = 0.96;
const PRESS_SPRING = { damping: 50, stiffness: 400, mass: 0.5 };

const ReanimatedPressable = Animated.createAnimatedComponent(Pressable);

// Drop-in TouchableOpacity replacement: scales down on press instead of
// fading opacity, so grids of cards/pills/buttons feel tactile.
const AnimatedPressable = ({ style, onPressIn, onPressOut, ...rest }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = event => {
    scale.value = withSpring(PRESS_SCALE, PRESS_SPRING);
    onPressIn?.(event);
  };

  const handlePressOut = event => {
    scale.value = withSpring(1, PRESS_SPRING);
    onPressOut?.(event);
  };

  return (
    <ReanimatedPressable
      {...rest}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
    />
  );
};

export default AnimatedPressable;
