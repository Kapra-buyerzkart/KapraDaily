import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { FONTS } from '@/styles/typography';

import { formatAmount } from '../utils';
import { PALETTE, RADIUS, SHADOW } from '../theme';

export const FOOTER_HEIGHT = 84;
const FADE = ['rgba(255,255,255,0)', 'rgba(255,255,255,0.92)', '#FFFFFF'];

const RedeemFooter = ({ bottomInset, isLocked, minCoins, note, onPress }) => (
  <View style={[styles.footer, { paddingBottom: Math.max(bottomInset, 14) }]}>
    <LinearGradient colors={FADE} style={styles.fade} pointerEvents="none" />

    {note ? (
      <View style={styles.noteRow}>
        <AntDesign name="infocirlceo" size={11} color={PALETTE.textMuted} />
        <Text style={styles.noteText}>
          Only your most recent transactions are shown here
        </Text>
      </View>
    ) : null}

    {isLocked ? (
      <Text style={styles.lockHint}>
        Redeeming unlocks at {formatAmount(minCoins)} UD Coins
      </Text>
    ) : null}

    <TouchableOpacity
      style={[styles.button, isLocked && styles.buttonLocked]}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel="Redeem UD Coins"
      onPress={onPress}
    >
      <Text style={[styles.buttonText, isLocked && styles.buttonTextLocked]}>
        Redeem now
      </Text>
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
    paddingHorizontal: '4%',
    paddingTop: 8,
    backgroundColor: PALETTE.surface,
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -26,
    height: 26,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  noteText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: 11,
    color: PALETTE.textMuted,
  },
  lockHint: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: 11.5,
    color: PALETTE.textMuted,
    textAlign: 'center',
    marginBottom: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 54,
    borderRadius: RADIUS.md,
    backgroundColor: PALETTE.orange,
    ...SHADOW.cta,
  },
  buttonLocked: {
    backgroundColor: PALETTE.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: 15.5,
    color: PALETTE.surface,
  },
  buttonTextLocked: {
    color: PALETTE.disabledText,
  },
});

export default React.memo(RedeemFooter);
