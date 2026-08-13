import React from 'react';
import { View, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { CART_COLORS, CART_RADIUS, CART_SPACING } from '@/styles/cartTheme';
import ShowcaseText from './ShowcaseText';

const SeeAllPill = ({ label, style }) => (
  <View style={[styles.pill, style]}>
    <ShowcaseText variant="captionStrong" tone="brand">
      {label}
    </ShowcaseText>
    <Feather name="chevron-right" size={14} color={CART_COLORS.primary} />
  </View>
);

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 2,
    backgroundColor: CART_COLORS.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CART_COLORS.primaryEdge,
    borderRadius: CART_RADIUS.pill,
    paddingVertical: CART_SPACING.xs + 2,
    paddingLeft: CART_SPACING.md,
    paddingRight: CART_SPACING.sm,
  },
});

export default React.memo(SeeAllPill);
