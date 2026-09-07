import React, { useCallback, useEffect, useState } from 'react';
import {
  DimensionValue,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { UI_COLORS, UI_RADIUS } from '../../theme/tokens';

const SWEEP_DURATION = 1150;

export type ShimmerTone = 'light' | 'dark';

const TONES: Record<ShimmerTone, { base: string; sweep: string[] }> = {
  light: {
    base: UI_COLORS.skeleton,
    sweep: ['rgba(245,245,245,0)', 'rgba(245,245,245,0.9)', 'rgba(245,245,245,0)'],
  },
  dark: {
    base: UI_COLORS.skeletonOnDark,
    sweep: ['rgba(235,235,235,0)', 'rgba(235,235,235,0.8)', 'rgba(235,235,235,0)'],
  },
};

interface ShimmerProps {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  tone?: ShimmerTone;
  style?: StyleProp<ViewStyle>;
}

const Shimmer: React.FC<ShimmerProps> = ({
  width = '100%',
  height = 14,
  radius = UI_RADIUS.xs,
  tone = 'light',
  style,
}) => {
  const [boxWidth, setBoxWidth] = useState(0);
  const progress = useSharedValue(0);
  const palette = TONES[tone];

  const measure = useCallback((e: LayoutChangeEvent) => {
    setBoxWidth(e.nativeEvent.layout.width);
  }, []);

  useEffect(() => {
    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, {
        duration: SWEEP_DURATION,
        easing: Easing.inOut(Easing.quad),
        reduceMotion: ReduceMotion.System,
      }),
      -1,
      false,
    );
  }, [progress]);

  const sweepStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -boxWidth + progress.value * (boxWidth * 2) },
    ],
  }));

  return (
    <View
      onLayout={measure}
      style={[
        styles.box,
        { width, height, borderRadius: radius, backgroundColor: palette.base },
        style,
      ]}
    >
      {boxWidth > 0 && (
        <Animated.View style={[StyleSheet.absoluteFill, sweepStyle]}>
          <LinearGradient
            colors={palette.sweep}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    overflow: 'hidden',
    backgroundColor: UI_COLORS.skeleton,
  },
});

export default Shimmer;
