import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AddrText } from '../atoms';
import { COLORS, GUTTER, HAIRLINE, SPACING } from '../../theme';

const SheetHeader = ({ title, subtitle }) => (
  <View style={styles.header}>
    <AddrText variant="heading" numberOfLines={1}>
      {title}
    </AddrText>
    {subtitle ? (
      <AddrText
        variant="caption"
        tone="muted"
        numberOfLines={1}
        style={styles.subtitle}
      >
        {subtitle}
      </AddrText>
    ) : null}
  </View>
);

export default React.memo(SheetHeader);

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: HAIRLINE,
    borderBottomColor: COLORS.line,
  },
  subtitle: {
    marginTop: 2,
  },
});
