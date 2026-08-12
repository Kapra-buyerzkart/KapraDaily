import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import icons from '@/assets/icons';

import { AddrText } from '../atoms';
import { COLORS, GUTTER, HAIRLINE, SPACING, hitSlopTo } from '../../theme';

const SheetHeader = ({ title, onBack }) => (
  <View style={styles.header}>
    <TouchableOpacity
      style={styles.backBtn}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={hitSlopTo(28)}
      onPress={onBack}
    >
      <Image source={icons.backArrowNew} style={styles.backIcon} />
    </TouchableOpacity>

    <AddrText variant="title" style={styles.title}>
      {title}
    </AddrText>
  </View>
);

export default React.memo(SheetHeader);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    paddingVertical: SPACING.md,
    borderBottomWidth: HAIRLINE,
    borderBottomColor: COLORS.line,
  },
  backBtn: {
    padding: SPACING.xs,
  },
  backIcon: {
    resizeMode: 'contain',
    tintColor: COLORS.textPrimary,
  },
  title: {
    flex: 1,
    marginLeft: SPACING.md,
  },
});
