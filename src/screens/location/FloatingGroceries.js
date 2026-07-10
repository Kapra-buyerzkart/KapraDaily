import React, { useEffect, memo } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { GROCERY_ICONS } from './groceryIcons';
import { LOCATION_COLORS } from './locationTheme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Deterministic layout so positions stay stable across re-renders — not
// Math.random() at render time. Spread loosely around the whole screen so
// the drift reads as ambient depth, not a cluster near the marker.
const ICON_LAYOUT = [
  { xPct: 0.12, yPct: 0.1, size: 30, driftX: 14, driftY: 10, duration: 11000 },
  { xPct: 0.82, yPct: 0.16, size: 24, driftX: 10, driftY: 14, duration: 13500 },
  { xPct: 0.18, yPct: 0.58, size: 26, driftX: 12, driftY: 8, duration: 9500 },
  { xPct: 0.86, yPct: 0.62, size: 32, driftX: 8, driftY: 12, duration: 12500 },
  { xPct: 0.5, yPct: 0.08, size: 22, driftX: 10, driftY: 10, duration: 10500 },
];

const FloatingGroceryIcon = memo(({ Icon, layout, delay }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(layout.driftX, {
          duration: layout.duration,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(-layout.driftX, {
          duration: layout.duration,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      true,
    );
    translateY.value = withRepeat(
      withSequence(
        withTiming(-layout.driftY, {
          duration: layout.duration * 1.15,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(layout.driftY, {
          duration: layout.duration * 1.15,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      true,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.iconWrapper,
        {
          left: layout.xPct * SCREEN_WIDTH,
          top: layout.yPct * SCREEN_HEIGHT,
          opacity: 0.05,
        },
        animatedStyle,
      ]}
    >
      <Icon size={layout.size} color={LOCATION_COLORS.textPrimary} />
    </Animated.View>
  );
});

const FloatingGroceries = () => (
  <Animated.View style={StyleSheet.absoluteFill} pointerEvents="none">
    {ICON_LAYOUT.map((layout, index) => (
      <FloatingGroceryIcon
        key={index}
        Icon={GROCERY_ICONS[index % GROCERY_ICONS.length]}
        layout={layout}
      />
    ))}
  </Animated.View>
);

const styles = StyleSheet.create({
  iconWrapper: {
    position: 'absolute',
  },
});

export default memo(FloatingGroceries);
