import React from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { PRESS_IN, PRESS_OUT } from '../motion';

interface PressableScaleProps extends PressableProps {
  to?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

const PressableScale: React.FC<PressableScaleProps> = ({
  to = 0.97,
  style,
  contentStyle,
  children,
  ...rest
}) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      {...rest}
      style={style}
      onPressIn={event => {
        scale.value = withTiming(to, PRESS_IN);
        rest.onPressIn?.(event);
      }}
      onPressOut={event => {
        scale.value = withSpring(1, PRESS_OUT);
        rest.onPressOut?.(event);
      }}
    >
      <Animated.View style={[contentStyle, animatedStyle]}>
        {children as React.ReactNode}
      </Animated.View>
    </Pressable>
  );
};

export default React.memo(PressableScale);
