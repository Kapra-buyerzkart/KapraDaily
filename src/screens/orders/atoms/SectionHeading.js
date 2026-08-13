import React from 'react';
import { View, StyleSheet } from 'react-native';
import OrderText from './OrderText';
import { GUTTER, SPACING } from '../theme';

const SectionHeading = ({ title, caption, right, style }) => (
  <View style={[styles.row, style]}>
    <View style={styles.copy}>
      <OrderText variant="heading" accessibilityRole="header">
        {title}
      </OrderText>
      {!!caption && (
        <OrderText variant="caption" tone="muted" style={styles.caption}>
          {caption}
        </OrderText>
      )}
    </View>
    {right || null}
  </View>
);

export default React.memo(SectionHeading);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginHorizontal: GUTTER + SPACING.xs,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  copy: {
    flex: 1,
  },
  caption: {
    marginTop: 2,
  },
});
