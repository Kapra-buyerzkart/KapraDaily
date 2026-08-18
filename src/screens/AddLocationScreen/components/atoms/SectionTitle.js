import React from 'react';
import { StyleSheet, View } from 'react-native';

import AddrText from './AddrText';
import { COLORS, RADIUS, SPACING } from '../../theme';

const SectionTitle = ({ title, hint, style }) => (
  <View style={[styles.wrap, style]}>
    <View style={styles.row}>
      <View style={styles.bar} />
      <AddrText variant="labelStrong" numberOfLines={1}>
        {title}
      </AddrText>
    </View>
    {hint ? (
      <AddrText variant="micro" tone="muted" style={styles.hint}>
        {hint}
      </AddrText>
    ) : null}
  </View>
);

export default React.memo(SectionTitle);

const styles = StyleSheet.create({
  wrap: {
    marginBottom: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    width: 3,
    height: 14,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.textPrimary,
    marginRight: SPACING.sm,
  },
  hint: {
    marginTop: 2,
    marginLeft: SPACING.md,
  },
});
