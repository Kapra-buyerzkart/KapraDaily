import React from 'react';
import { StyleSheet, View } from 'react-native';

import AnimatedPressable from '@/components/AnimatedPressable';

import { RADIUS, TILE_RATIO } from '../theme';

const TileSurface = ({
  ratio = TILE_RATIO.wide,
  height,
  style,
  children,
  ...rest
}) => (
  <AnimatedPressable
    {...rest}
    style={[styles.frame, height ? { height } : { aspectRatio: ratio }, style]}
  >
    <View style={styles.clip}>{children}</View>
  </AnimatedPressable>
);

export default React.memo(TileSurface);

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    borderRadius: RADIUS.card,
  },
  clip: {
    flex: 1,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
  },
});
