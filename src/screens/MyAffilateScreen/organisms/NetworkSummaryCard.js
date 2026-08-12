import React from 'react';
import { View, StyleSheet } from 'react-native';
import Surface from '@/screens/cart/components/atoms/Surface';
import Divider from '@/screens/cart/components/atoms/Divider';
import CartText from '@/screens/cart/components/atoms/CartText';
import { CART_SPACING } from '@/styles/cartTheme';
import StatTile from '../atoms/StatTile';
import VerticalRule from '../atoms/VerticalRule';
import { formatBT } from '../utils';

const NetworkSummaryCard = ({ summary, totalLevels }) => (
  <Surface style={styles.card}>
    <View style={styles.stats}>
      <StatTile label="Total members" value={summary.totalMembers} />
      <VerticalRule />
      <StatTile label="UD earned" value={formatBT(summary.totalBTEarned)} />
      <VerticalRule />
      <StatTile
        label="Active levels"
        value={`${summary.filledLevels}/${totalLevels}`}
      />
    </View>

    <Divider />

    <CartText variant="micro" tone="muted">
      Earnings update as members in your network place orders.
    </CartText>
  </Surface>
);

export default React.memo(NetworkSummaryCard);

const styles = StyleSheet.create({
  card: {
    padding: CART_SPACING.lg,
    gap: CART_SPACING.lg,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.md,
  },
});
