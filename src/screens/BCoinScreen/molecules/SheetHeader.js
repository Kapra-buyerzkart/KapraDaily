import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { CART_SPACING } from '@/styles/cartTheme';

import { CoinText } from '../atoms';
import { PALETTE } from '../theme';

const SheetHeader = ({ title, caption, onClose }) => (
  <View style={styles.header}>
    <View style={styles.copy}>
      <CoinText variant="title">{title}</CoinText>
      {caption ? (
        <CoinText variant="caption" tone="muted" style={styles.caption}>
          {caption}
        </CoinText>
      ) : null}
    </View>

    <TouchableOpacity
      style={styles.close}
      hitSlop={12}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel="Close"
      onPress={onClose}
    >
      <AntDesign name="close" size={15} color={PALETTE.textSecondary} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: CART_SPACING.xl,
    paddingBottom: CART_SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: PALETTE.line,
  },
  copy: {
    flex: 1,
    paddingRight: CART_SPACING.md,
  },
  caption: {
    marginTop: 3,
  },
  close: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PALETTE.well,
  },
});

export default React.memo(SheetHeader);
