import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CART_COLORS, CART_SPACING } from '@/styles/cartTheme';
import ShowcaseText from './ShowcaseText';

const EyebrowRule = ({ label, style }) => (
  <View style={[styles.row, style]}>
    <View style={styles.rule} />
    <ShowcaseText variant="micro" tone="brand" style={styles.label}>
      {label}
    </ShowcaseText>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rule: {
    width: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: CART_COLORS.primary,
    marginRight: CART_SPACING.sm,
  },
  label: {
    letterSpacing: 1.4,
  },
});

export default React.memo(EyebrowRule);
