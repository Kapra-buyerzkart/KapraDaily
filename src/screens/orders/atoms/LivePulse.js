import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const DOT = 7;
const HALO = 16;

const LivePulse = ({ color, size = DOT }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) }),
      -1,
      false,
    );
    return () => cancelAnimation(progress);
  }, [progress]);

  const haloStyle = useAnimatedStyle(() => ({
    opacity: 0.35 * (1 - progress.value),
    transform: [{ scale: 0.5 + progress.value }],
  }));

  return (
    <View style={[styles.wrap, { width: HALO, height: HALO }]}>
      <Animated.View
        style={[
          styles.halo,
          { backgroundColor: color, borderRadius: HALO / 2 },
          haloStyle,
        ]}
      />
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default React.memo(LivePulse);
