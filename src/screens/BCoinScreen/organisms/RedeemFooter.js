import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { CART_SPACING } from '@/styles/cartTheme';

import { CoinText } from '../atoms';
import { formatAmount } from '../utils';
import { GUTTER, PALETTE, RADIUS, SHADOW } from '../theme';

export const FOOTER_HEIGHT = 84;

const RedeemFooter = ({ bottomInset, isLocked, minCoins, note, onPress }) => (
  <View style={[styles.footer, { paddingBottom: Math.max(bottomInset, 14) }]}>
    {note ? (
      <View style={styles.noteRow}>
        <AntDesign name="infocirlceo" size={11} color={PALETTE.textMuted} />
        <CoinText variant="micro" tone="muted" style={styles.noteText}>
          Only your most recent transactions are shown here
        </CoinText>
      </View>
    ) : null}

    {isLocked ? (
      <CoinText variant="caption" tone="muted" style={styles.lockHint}>
        Redeeming unlocks at {formatAmount(minCoins)} UD Coins
      </CoinText>
    ) : null}

    <TouchableOpacity
      style={[styles.button, isLocked && styles.buttonLocked]}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel="Redeem UD Coins"
      onPress={onPress}
    >
      <CoinText variant="cta" tone={isLocked ? 'faint' : 'onDark'}>
        Redeem now
      </CoinText>
      {!isLocked && (
        <AntDesign name="arrowright" size={16} color={PALETTE.surface} />
      )}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: GUTTER,
    paddingTop: CART_SPACING.md,
    backgroundColor: PALETTE.surface,
    borderTopLeftRadius: RADIUS.card,
    borderTopRightRadius: RADIUS.card,
    ...SHADOW.bar,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: 7,
    marginBottom: CART_SPACING.sm,
    borderRadius: RADIUS.button,
    backgroundColor: PALETTE.well,
  },
  noteText: {
    flex: 1,
  },
  lockHint: {
    textAlign: 'center',
    marginBottom: CART_SPACING.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: CART_SPACING.sm,
    height: 52,
    borderRadius: RADIUS.button,
    backgroundColor: PALETTE.orange,
  },
  buttonLocked: {
    backgroundColor: PALETTE.well,
  },
});

export default React.memo(RedeemFooter);
