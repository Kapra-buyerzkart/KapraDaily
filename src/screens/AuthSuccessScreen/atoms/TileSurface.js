import React from 'react';
import { StyleSheet, View } from 'react-native';

import AnimatedPressable from '@/components/AnimatedPressable';

import { PALETTE, RADIUS, TILE_RATIO } from '../theme';

const TileSurface = ({ ratio = TILE_RATIO.wide, style, children, ...rest }) => (
  <AnimatedPressable
    {...rest}
    style={[styles.frame, { aspectRatio: ratio }, style]}
  >
    <View style={styles.clip}>{children}</View>
  </AnimatedPressable>
);

export default React.memo(TileSurface);

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    borderRadius: RADIUS.card,
    backgroundColor: PALETTE.surface,
  },
  clip: {
    flex: 1,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
    backgroundColor: PALETTE.surface,
  },
});
