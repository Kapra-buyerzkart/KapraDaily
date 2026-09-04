import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../../../components/atoms';
import { GUTTER, PALETTE, SPACING } from '../theme';

const SectionLabel: React.FC<{ title: string }> = ({ title }) => (
  <View style={styles.wrap}>
    <AppText variant="micro" tone="muted" style={styles.title}>
      {title}
    </AppText>
  </View>
);

export default React.memo(SectionLabel);

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: GUTTER + SPACING.xs,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
    backgroundColor: PALETTE.canvas,
  },
  title: {
    letterSpacing: 1.1,
  },
});
