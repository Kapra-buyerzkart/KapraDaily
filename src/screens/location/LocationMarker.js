import { memo, useEffect } from 'react';
import { Group, Path, Shadow } from '@shopify/react-native-skia';
import {
  useSharedValue,
  useDerivedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { LOCATION_COLORS } from './locationTheme';
import {
  MARKER_CANVAS_CENTER,
  MARKER_FLOAT_DURATION,
  MARKER_FLOAT_SCALE_TO,
  MARKER_PIN_HEIGHT,
} from './locationConstants';

// Teardrop silhouette, viewBox 0 0 20 24 — same family as the existing
// LocationIcon in src/components/ProfileIcons.js, redrawn as a Skia Path
// (fill + stroke) instead of a filled+evenodd-hole SVG icon, since the
// brief wants a white body with an orange outline, not a solid orange pin.
const PIN_OUTER_PATH =
  'M2.92911 2.91169C4.80446 1.04737 7.34797 0 10.0001 0C12.6522 0 15.1958 1.04737 17.0711 2.91169C18.9464 4.77601 20 7.30458 20 9.94113C20 12.5777 18.9464 15.1062 17.0711 16.9706L10.0001 24L2.92911 16.9706C2.00048 16.0475 1.26384 14.9516 0.761255 13.7455C0.258675 12.5394 0 11.2466 0 9.94113C0 8.63562 0.258675 7.3429 0.761255 6.13678C1.26384 4.93066 2.00048 3.83477 2.92911 2.91169Z';

// A minimal grocery-basket glyph, hand-placed to sit inside the pin's
// circular head (centered ~[10, 9.94], radius ~2.84 in the same 20x24
// local space as PIN_OUTER_PATH).
const BASKET_BODY_PATH = 'M7.5 8.6L12.5 8.6L11.7 11.7L8.3 11.7Z';
const BASKET_HANDLE_PATH = 'M8.5 8.6Q10 6.1 11.5 8.6';

const PIN_VIEWBOX_WIDTH = 20;
const PIN_VIEWBOX_HEIGHT = 24;
const PIN_SCALE = MARKER_PIN_HEIGHT / PIN_VIEWBOX_HEIGHT;
const PIN_TRANSLATE_X = MARKER_CANVAS_CENTER - (PIN_VIEWBOX_WIDTH * PIN_SCALE) / 2;
const PIN_TRANSLATE_Y = MARKER_CANVAS_CENTER - (PIN_VIEWBOX_HEIGHT * PIN_SCALE) / 2;

// Pure Skia node tree — no own <Canvas>, rendered as a child of the shared
// Canvas in LocationScreen (after RippleEffect, so it draws on top).
const LocationMarker = () => {
  const floatProgress = useSharedValue(0);

  useEffect(() => {
    floatProgress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: MARKER_FLOAT_DURATION / 2 }),
        withTiming(0, { duration: MARKER_FLOAT_DURATION / 2 }),
      ),
      -1,
      true,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const floatScale = useDerivedValue(
    () => 1 + floatProgress.value * (MARKER_FLOAT_SCALE_TO - 1),
    [floatProgress],
  );
  const floatTransform = useDerivedValue(
    () => [{ scale: floatScale.value }],
    [floatScale],
  );

  return (
    <Group
      origin={{ x: MARKER_CANVAS_CENTER, y: MARKER_CANVAS_CENTER }}
      transform={floatTransform}
    >
      <Group layer>
        <Shadow dx={0} dy={10} blur={16} color="rgba(242,80,0,0.22)" />
        <Group transform={[{ translateX: PIN_TRANSLATE_X }, { translateY: PIN_TRANSLATE_Y }, { scale: PIN_SCALE }]}>
          <Path path={PIN_OUTER_PATH} color={LOCATION_COLORS.background} style="fill" />
          <Path
            path={PIN_OUTER_PATH}
            color={LOCATION_COLORS.primary}
            style="stroke"
            strokeWidth={1.4}
            strokeJoin="round"
          />
          <Path path={BASKET_BODY_PATH} color={LOCATION_COLORS.primary} style="fill" />
          <Path
            path={BASKET_HANDLE_PATH}
            color={LOCATION_COLORS.primary}
            style="stroke"
            strokeWidth={0.9}
            strokeCap="round"
          />
        </Group>
      </Group>
    </Group>
  );
};

export default memo(LocationMarker);

// Exported for LocationSuccessAnimation's one-shot marker copy, so the two
// stay visually identical without threading extra props into this
// otherwise fully autonomous, memoized component.
export const MarkerGlyph = ({ opacity = 1 }) => (
  <Group
    transform={[{ translateX: PIN_TRANSLATE_X }, { translateY: PIN_TRANSLATE_Y }, { scale: PIN_SCALE }]}
    opacity={opacity}
  >
    <Path path={PIN_OUTER_PATH} color={LOCATION_COLORS.background} style="fill" />
    <Path
      path={PIN_OUTER_PATH}
      color={LOCATION_COLORS.primary}
      style="stroke"
      strokeWidth={1.4}
      strokeJoin="round"
    />
    <Path path={BASKET_BODY_PATH} color={LOCATION_COLORS.primary} style="fill" />
    <Path
      path={BASKET_HANDLE_PATH}
      color={LOCATION_COLORS.primary}
      style="stroke"
      strokeWidth={0.9}
      strokeCap="round"
    />
  </Group>
);

export { MARKER_CANVAS_CENTER as MARKER_CENTER };
