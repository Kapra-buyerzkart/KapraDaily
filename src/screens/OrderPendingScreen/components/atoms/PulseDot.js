import React, { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { styles } from '../../styles';

const PulseDot = ({ style }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [progress]);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + progress.value * 0.65,
  }));

  return <Animated.View style={[styles.pulseDot, dotStyle, style]} />;
};

export default React.memo(PulseDot);
