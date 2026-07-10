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
const AnimatedPressable = ({
  style,
  onPressIn,
  onPressOut,
  entering,
  exiting,
  layout,
  ...rest
}) => {
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

  const pressable = (
    <ReanimatedPressable
      {...rest}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
    />
  );

  // Layout animations (entering/exiting/layout) can't live on the same
  // component as the animated `transform` above — Reanimated warns that one
  // may overwrite the other. When a caller passes one, wrap the pressable in
  // an animated view and run the layout animation on that wrapper instead.
  if (entering || exiting || layout) {
    return (
      <Animated.View entering={entering} exiting={exiting} layout={layout}>
        {pressable}
      </Animated.View>
    );
  }

  return pressable;
};

export default AnimatedPressable;
