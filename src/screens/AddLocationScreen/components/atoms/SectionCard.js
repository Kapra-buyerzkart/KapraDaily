import React from 'react';
import { StyleSheet, View } from 'react-native';

import { COLORS, HAIRLINE, RADIUS, SPACING } from '../../theme';

const SectionCard = ({ style, children }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export default React.memo(SectionCard);

const styles = StyleSheet.create({
  card: {
    marginTop: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.card,
    borderWidth: HAIRLINE,
    borderColor: COLORS.line,
    backgroundColor: COLORS.surface,
  },
});
