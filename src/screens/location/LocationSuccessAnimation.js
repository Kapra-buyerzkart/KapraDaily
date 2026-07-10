import { memo, useEffect } from 'react';
import { StyleSheet, Vibration } from 'react-native';
import { Canvas, Circle, Group, Path, Shadow } from '@shopify/react-native-skia';
import {
  useSharedValue,
  useDerivedValue,
  withDelay,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { MarkerGlyph } from './LocationMarker';
import { LOCATION_COLORS } from './locationTheme';
import {
  MARKER_CANVAS_CENTER,
  MARKER_CANVAS_SIZE,
  RIPPLE_BASE_RADIUS,
  SUCCESS_VIBRATION_MS,
} from './locationConstants';

// Fixed, deterministic "nearby store" dot offsets from the marker center —
// not meant to represent real geography, just a pleasant scatter.
const DOTS = [
  { dx: -58, dy: -48, delay: 0 },
  { dx: 54, dy: -62, delay: 90 },
  { dx: -66, dy: 42, delay: 180 },
  { dx: 64, dy: 34, delay: 270 },
];

const ROUTE_PATH = `M${MARKER_CANVAS_CENTER} ${MARKER_CANVAS_CENTER} Q${MARKER_CANVAS_CENTER - 30} ${MARKER_CANVAS_CENTER - 30} ${MARKER_CANVAS_CENTER + DOTS[0].dx} ${MARKER_CANVAS_CENTER + DOTS[0].dy}`;

const Dot = ({ dx, dy, delay }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      300 + delay,
      withTiming(1, { duration: 320, easing: Easing.out(Easing.back(1.4)) }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scale = useDerivedValue(() => progress.value, [progress]);
  const transform = useDerivedValue(() => [{ scale: scale.value }], [scale]);

  return (
    <Group
      origin={{ x: MARKER_CANVAS_CENTER + dx, y: MARKER_CANVAS_CENTER + dy }}
      transform={transform}
      opacity={progress}
    >
      <Group layer>
        <Shadow dx={0} dy={0} blur={6} color="rgba(242,80,0,0.55)" />
        <Circle
          cx={MARKER_CANVAS_CENTER + dx}
          cy={MARKER_CANVAS_CENTER + dy}
          r={5}
          color={LOCATION_COLORS.primary}
        />
      </Group>
    </Group>
  );
};

// One-shot terminal sequence: expanding ring, a scale-bump marker copy
// (kept separate from the looping LocationMarker so that component stays
// fully autonomous/memoized), glowing "nearby store" dots, and a
// self-drawing delivery route. Mounts once when the step machine reaches
// SUCCESS; LocationScreen owns the hold-then-navigate timing.
const LocationSuccessAnimation = () => {
  const ringProgress = useSharedValue(0);
  const markerScale = useSharedValue(0.9);
  const markerOpacity = useSharedValue(0);
  const routeEnd = useSharedValue(0);

  useEffect(() => {
    Vibration.vibrate(SUCCESS_VIBRATION_MS);

    ringProgress.value = withTiming(1, {
      duration: 900,
      easing: Easing.out(Easing.ease),
    });

    markerOpacity.value = withTiming(1, { duration: 220 });
    markerScale.value = withSequence(
      withTiming(1.15, { duration: 240, easing: Easing.out(Easing.ease) }),
      withTiming(1, { duration: 220, easing: Easing.out(Easing.ease) }),
    );

    routeEnd.value = withDelay(300, withTiming(1, { duration: 650 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ringScale = useDerivedValue(() => 1 + ringProgress.value * 2, [ringProgress]);
  const ringOpacity = useDerivedValue(() => 0.28 * (1 - ringProgress.value), [ringProgress]);
  const ringTransform = useDerivedValue(() => [{ scale: ringScale.value }], [ringScale]);

  const markerTransform = useDerivedValue(
    () => [{ scale: markerScale.value }],
    [markerScale],
  );

  return (
    <Canvas style={styles.canvas}>
      <Group
        origin={{ x: MARKER_CANVAS_CENTER, y: MARKER_CANVAS_CENTER }}
        transform={ringTransform}
        opacity={ringOpacity}
      >
        <Circle
          cx={MARKER_CANVAS_CENTER}
          cy={MARKER_CANVAS_CENTER}
          r={RIPPLE_BASE_RADIUS}
          color={LOCATION_COLORS.primary}
          style="stroke"
          strokeWidth={2}
        />
      </Group>

      <Path
        path={ROUTE_PATH}
        color={LOCATION_COLORS.primary}
        style="stroke"
        strokeWidth={1.8}
        strokeCap="round"
        start={0}
        end={routeEnd}
        opacity={0.55}
      />

      {DOTS.map((dot, index) => (
        <Dot key={index} dx={dot.dx} dy={dot.dy} delay={dot.delay} />
      ))}

      <Group
        origin={{ x: MARKER_CANVAS_CENTER, y: MARKER_CANVAS_CENTER }}
        transform={markerTransform}
      >
        <MarkerGlyph opacity={markerOpacity} />
      </Group>
    </Canvas>
  );
};

const styles = StyleSheet.create({
  canvas: {
    width: MARKER_CANVAS_SIZE,
    height: MARKER_CANVAS_SIZE,
  },
});

export default memo(LocationSuccessAnimation);
