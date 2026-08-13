import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Reanimated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

const AnimatedLinearGradient =
  Reanimated.createAnimatedComponent(LinearGradient);

const Shimmer = ({ style }) => {
  const progress = useSharedValue(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.linear }),
      -1,
      false,
    );
  }, [progress]);

  const sweepStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [-width, width]) },
    ],
  }));

  return (
    <View
      style={[styles.block, style]}
      onLayout={e => setWidth(e.nativeEvent.layout.width)}
    >
      {width > 0 && (
        <AnimatedLinearGradient
          colors={[
            'rgba(255,255,255,0)',
            'rgba(255,255,255,0.16)',
            'rgba(255,255,255,0)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[StyleSheet.absoluteFill, sweepStyle]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
});

export default React.memo(Shimmer);
