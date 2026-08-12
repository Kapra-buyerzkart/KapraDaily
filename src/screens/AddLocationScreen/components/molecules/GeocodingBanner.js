import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AddrText } from '../atoms';
import { COLORS, RADIUS, SHADOW, SPACING } from '../../theme';

const GeocodingBanner = () => (
  <View style={styles.banner}>
    <ActivityIndicator size="small" color={COLORS.textMuted} />
    <AddrText variant="caption" tone="secondary" style={styles.text}>
      Fetching address…
    </AddrText>
  </View>
);

export default React.memo(GeocodingBanner);

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: SPACING.sm,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    ...SHADOW.raised,
  },
  text: {
    marginLeft: SPACING.sm,
  },
});
