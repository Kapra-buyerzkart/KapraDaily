import { memo, useEffect } from 'react';
import { Circle, Group } from '@shopify/react-native-skia';
import {
  useSharedValue,
  useDerivedValue,
  withRepeat,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { LOCATION_COLORS } from './locationTheme';
import {
  MARKER_CANVAS_CENTER,
  RIPPLE_BASE_RADIUS,
  RIPPLE_DURATION,
  RIPPLE_OPACITY,
  RIPPLE_SCALE_FROM,
  RIPPLE_SCALE_TO,
} from './locationConstants';

// Pure Skia node tree — no own <Canvas>. Rendered as a child of the shared
// Canvas in LocationScreen, mounted *before* LocationMarker so it draws
// behind the marker body.
const RIPPLE_EASING = Easing.out(Easing.ease);

const Ring = ({ delay, color }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: RIPPLE_DURATION, easing: RIPPLE_EASING }),
        -1,
        false,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scale = useDerivedValue(
    () => RIPPLE_SCALE_FROM + progress.value * (RIPPLE_SCALE_TO - RIPPLE_SCALE_FROM),
    [progress],
  );
  const opacity = useDerivedValue(
    () => RIPPLE_OPACITY * (1 - progress.value),
    [progress],
  );
  const transform = useDerivedValue(() => [{ scale: scale.value }], [scale]);

  return (
    <Group
      origin={{ x: MARKER_CANVAS_CENTER, y: MARKER_CANVAS_CENTER }}
      transform={transform}
    >
      <Circle
        cx={MARKER_CANVAS_CENTER}
        cy={MARKER_CANVAS_CENTER}
        r={RIPPLE_BASE_RADIUS}
        color={color}
        style="stroke"
        strokeWidth={1.6}
        opacity={opacity}
      />
    </Group>
  );
};

const RippleEffect = () => (
  <>
    <Ring delay={0} color={LOCATION_COLORS.primary} />
    {/* "White" ring uses the warm accent tint, not pure white — a pure
        white stroke would be invisible against the screen's white bg. */}
    <Ring delay={RIPPLE_DURATION / 2} color={LOCATION_COLORS.accentLight} />
  </>
);

export default memo(RippleEffect);
