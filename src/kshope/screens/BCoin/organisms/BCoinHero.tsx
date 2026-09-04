import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { AppText } from '../../../components/atoms';
import { hitSlopTo } from '../../../theme/tokens';
import { BACK_ICON, COIN_ICON } from '../constants';
import { formatAmount, formatCurrency } from '../utils';
import { GUTTER, PALETTE, RADIUS, SPACING } from '../theme';

interface BCoinHeroProps {
  topInset: number;
  balance: number;
  coinValue: number;
  onBack: () => void;
  onInfo: () => void;
}

const BCoinHero: React.FC<BCoinHeroProps> = ({
  topInset,
  balance,
  coinValue,
  onBack,
  onInfo,
}) => (
  <View style={[styles.hero, { paddingTop: topInset + 6 }]}>
    <View style={styles.topRow}>
      <TouchableOpacity
        style={styles.backBtn}
        hitSlop={hitSlopTo(24)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
      >
        <Image source={BACK_ICON} style={styles.backIcon} />
      </TouchableOpacity>

      <View style={styles.titleBlock}>
        <AppText variant="title">UD Coins</AppText>
      </View>

      <TouchableOpacity
        style={styles.infoChip}
        hitSlop={hitSlopTo(20)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Learn about UD Coins and UD Tokens"
        onPress={onInfo}
      >
        <AntDesign name="infocirlceo" size={11} color={PALETTE.textMuted} />
        <AppText variant="micro" tone="muted">
          Know more
        </AppText>
      </TouchableOpacity>
    </View>

    <Animated.View entering={FadeIn.duration(320)} style={styles.balanceBlock}>
      <AppText variant="micro" tone="muted" style={styles.label}>
        TOTAL UD COINS
      </AppText>

      <View style={styles.balanceRow}>
        <Image source={COIN_ICON} style={styles.coin} />
        <AppText variant="display" style={styles.balance}>
          {formatAmount(balance)}
        </AppText>
        <View style={styles.worthPill}>
          <AppText variant="micro" tone={PALETTE.goldDeep}>
            worth {formatCurrency(balance * coinValue)}
          </AppText>
        </View>
      </View>
    </Animated.View>
  </View>
);

export default React.memo(BCoinHero);

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    paddingBottom: SPACING.lg,
    backgroundColor: PALETTE.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: PALETTE.line,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    gap: SPACING.sm,
    height: 46,
  },
  backBtn: {
    padding: SPACING.xs,
  },
  backIcon: {
    resizeMode: 'contain',
    tintColor: PALETTE.textPrimary,
  },
  titleBlock: {
    flex: 1,
    marginLeft: SPACING.xs,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    borderRadius: RADIUS.pill,
    backgroundColor: PALETTE.well,
  },
  balanceBlock: {
    paddingHorizontal: GUTTER,
    marginTop: SPACING.md,
  },
  label: {
    letterSpacing: 1.4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  coin: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  balance: {
    fontSize: 32,
    lineHeight: 38,
  },
  worthPill: {
    marginLeft: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
    backgroundColor: PALETTE.goldTint,
  },
});
