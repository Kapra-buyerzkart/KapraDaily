import React from 'react';
import { View, StyleSheet } from 'react-native';
import AnimatedPressable from '@/components/AnimatedPressable';
import { CART_COLORS, CART_RADIUS, CART_SPACING } from '@/styles/cartTheme';
import { ArrowDisc, ShowcaseText } from '../atoms';

const CollectionFooter = ({ label, meta, onPress }) => (
  <View>
    <View style={styles.dashed} />

    <AnimatedPressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.row}
    >
      <View style={styles.copy}>
        <ShowcaseText variant="bodyStrong" numberOfLines={1}>
          {label}
        </ShowcaseText>
        {meta ? (
          <ShowcaseText variant="micro" tone="muted" numberOfLines={1}>
            {meta}
          </ShowcaseText>
        ) : null}
      </View>

      <ArrowDisc icon="arrow-right" />
    </AnimatedPressable>
  </View>
);

const styles = StyleSheet.create({
  dashed: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: CART_COLORS.borderStrong,
    marginBottom: CART_SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.md,
    backgroundColor: CART_COLORS.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CART_COLORS.primaryEdge,
    borderRadius: CART_RADIUS.card - 4,
    paddingVertical: CART_SPACING.md,
    paddingHorizontal: CART_SPACING.lg,
  },
  copy: {
    flex: 1,
    gap: 1,
  },
});

export default React.memo(CollectionFooter);
