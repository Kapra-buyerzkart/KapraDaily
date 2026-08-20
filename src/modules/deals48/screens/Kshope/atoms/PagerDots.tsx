import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CART_COLORS, CART_SPACING } from '@/styles/cartTheme';

interface PagerDotsProps {
  count: number;
  index: number;
}

const PagerDots: React.FC<PagerDotsProps> = ({ count, index }) => {
  if (count <= 1) return null;

  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
      ))}
    </View>
  );
};

export default React.memo(PagerDots);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: CART_SPACING.xs + 1,
    marginTop: CART_SPACING.md,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: CART_COLORS.borderStrong,
  },
  dotActive: {
    width: 18,
    backgroundColor: CART_COLORS.primary,
  },
});
