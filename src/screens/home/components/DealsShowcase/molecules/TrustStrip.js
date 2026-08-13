import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CART_RADIUS, CART_SPACING } from '@/styles/cartTheme';
import { TrustChip } from '../atoms';
import { PEACH, TRUST_POINTS } from '../tokens';

const TrustStrip = ({ points = TRUST_POINTS }) => (
  <View style={styles.strip}>
    {points.map(point => (
      <TrustChip
        key={point.key}
        icon={point.icon}
        label={point.label}
        caption={point.caption}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
    backgroundColor: PEACH.card,
    borderRadius: CART_RADIUS.card,
    paddingVertical: CART_SPACING.md,
    paddingHorizontal: CART_SPACING.md,
  },
});

export default React.memo(TrustStrip);
