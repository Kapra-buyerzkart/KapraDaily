import React from 'react';
import { StyleSheet } from 'react-native';
import { FadeInDown } from 'react-native-reanimated';
import AnimatedPressable from '@/components/AnimatedPressable';
import { CART_COLORS, CART_ELEVATION } from '@/styles/cartTheme';
import { TILE_ENTER_STEP, TILE_RADIUS } from '../tokens';

const TileFrame = ({ height, delayIndex = 0, style, children, ...rest }) => (
  <AnimatedPressable
    {...rest}
    entering={FadeInDown.delay(delayIndex * TILE_ENTER_STEP)
      .springify()
      .damping(18)}
    style={[styles.frame, height ? { height } : null, style]}
  >
    {children}
  </AnimatedPressable>
);

const styles = StyleSheet.create({
  frame: {
    backgroundColor: CART_COLORS.card,
    borderRadius: TILE_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CART_COLORS.border,
    overflow: 'hidden',
    ...CART_ELEVATION.raised,
  },
});

export default React.memo(TileFrame);
