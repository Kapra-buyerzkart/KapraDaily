import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CART_SPACING } from '@/styles/cartTheme';

import { CoinText } from '../atoms';
import { GUTTER, PALETTE } from '../theme';

const SectionLabel = ({ title }) => (
  <View style={styles.wrap}>
    <CoinText variant="micro" tone="muted" style={styles.title}>
      {title}
    </CoinText>
  </View>
);

export default React.memo(SectionLabel);

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: GUTTER + CART_SPACING.xs,
    paddingTop: CART_SPACING.lg,
    paddingBottom: CART_SPACING.sm,
    backgroundColor: PALETTE.canvas,
  },
  title: {
    letterSpacing: 1.1,
  },
});
