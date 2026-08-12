import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HAIRLINE, RADIUS, SPACE, SURFACE, GUTTER } from '@/styles/homeTheme';

const SurfaceCard = ({ children, padded = true, style }) => (
  <View style={[styles.card, padded && styles.padded, style]}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: GUTTER,
    marginBottom: SPACE.md,
    borderRadius: RADIUS.lg,
    backgroundColor: SURFACE.base,
    borderWidth: 1,
    borderColor: HAIRLINE,
    overflow: 'hidden',
  },
  padded: {
    paddingHorizontal: SPACE.base,
    paddingVertical: SPACE.base,
  },
});

export default React.memo(SurfaceCard);
