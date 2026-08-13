import React from 'react';
import { StyleSheet } from 'react-native';
import AnimatedPressable from '@/components/AnimatedPressable';
import { CART_RADIUS, CART_SPACING, TOUCH_MIN } from '@/styles/cartTheme';
import { ArrowRing, DealText } from '../atoms';
import { PEACH } from '../tokens';

const SeeMoreBar = ({ label, onPress }) => (
  <AnimatedPressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    style={styles.bar}
  >
    <DealText variant="cta" tone="ink" numberOfLines={1}>
      {label}
    </DealText>
    <ArrowRing />
  </AnimatedPressable>
);

const styles = StyleSheet.create({
  bar: {
    minHeight: TOUCH_MIN,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: CART_SPACING.lg,
    backgroundColor: PEACH.wash,
    borderRadius: CART_RADIUS.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PEACH.edge,
    paddingVertical: CART_SPACING.md,
    paddingHorizontal: CART_SPACING.xl,
  },
});

export default React.memo(SeeMoreBar);
