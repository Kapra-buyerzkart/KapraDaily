import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { AppText } from '../../../components/atoms';
import { formatAmount } from '../utils';
import { GUTTER, PALETTE, RADIUS, SHADOW, SPACING } from '../theme';

export const FOOTER_HEIGHT = 84;

interface RedeemFooterProps {
  bottomInset: number;
  isLocked: boolean;
  minCoins: number;
  note: boolean;
  onPress: () => void;
}

const RedeemFooter: React.FC<RedeemFooterProps> = ({
  bottomInset,
  isLocked,
  minCoins,
  note,
  onPress,
}) => (
  <View style={[styles.footer, { paddingBottom: Math.max(bottomInset, 14) }]}>
    {note ? (
      <View style={styles.noteRow}>
        <AntDesign name="infocirlceo" size={11} color={PALETTE.textMuted} />
        <AppText variant="micro" tone="muted" style={styles.noteText}>
          Only your most recent transactions are shown here
        </AppText>
      </View>
    ) : null}

    {isLocked ? (
      <AppText variant="caption" tone="muted" style={styles.lockHint}>
        Redeeming unlocks at {formatAmount(minCoins)} UD Coins
      </AppText>
    ) : null}

    <TouchableOpacity
      style={[styles.button, isLocked && styles.buttonLocked]}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel="Redeem UD Coins"
      onPress={onPress}
    >
      <AppText variant="cta" tone={isLocked ? 'faint' : 'onDark'}>
        Redeem now
      </AppText>
      {!isLocked && (
        <AntDesign name="arrowright" size={16} color={PALETTE.surface} />
      )}
    </TouchableOpacity>
  </View>
);

export default React.memo(RedeemFooter);

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: GUTTER,
    paddingTop: SPACING.md,
    backgroundColor: PALETTE.surface,
    borderTopLeftRadius: RADIUS.card,
    borderTopRightRadius: RADIUS.card,
    ...SHADOW.bar,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.button,
    backgroundColor: PALETTE.well,
  },
  noteText: {
    flex: 1,
  },
  lockHint: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    height: 52,
    borderRadius: RADIUS.button,
    backgroundColor: PALETTE.orange,
  },
  buttonLocked: {
    backgroundColor: PALETTE.well,
  },
});
