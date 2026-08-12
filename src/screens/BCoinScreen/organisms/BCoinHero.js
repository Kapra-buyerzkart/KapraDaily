import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import AntDesign from 'react-native-vector-icons/AntDesign';
import icons from '@/assets/icons';
import { CART_SPACING, hitSlopTo } from '@/styles/cartTheme';

import { CoinText } from '../atoms';
import { COIN_ICON } from '../constants';
import { formatAmount, formatCurrency } from '../utils';
import { GUTTER, PALETTE, RADIUS } from '../theme';

const BCoinHero = ({ topInset, balance, coinValue, onBack, onInfo }) => (
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
        <Image source={icons.backArrowNew} style={styles.backIcon} />
      </TouchableOpacity>

      <View style={styles.titleBlock}>
        <CoinText variant="title">UD Coins</CoinText>
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
        <CoinText variant="micro" tone="muted">
          Know more
        </CoinText>
      </TouchableOpacity>
    </View>

    <Animated.View entering={FadeIn.duration(320)} style={styles.balanceBlock}>
      <CoinText variant="micro" tone="muted" style={styles.label}>
        TOTAL UD COINS
      </CoinText>

      <View style={styles.balanceRow}>
        <Image source={COIN_ICON} style={styles.coin} />
        <CoinText variant="display" style={styles.balance}>
          {formatAmount(balance)}
        </CoinText>
        <View style={styles.worthPill}>
          <CoinText variant="micro" tone="gold">
            worth {formatCurrency(balance * coinValue)}
          </CoinText>
        </View>
      </View>
    </Animated.View>
  </View>
);

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    paddingBottom: CART_SPACING.lg,
    backgroundColor: PALETTE.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: PALETTE.line,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    gap: CART_SPACING.sm,
    height: 46,
  },
  backBtn: {
    padding: CART_SPACING.xs,
  },
  backIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    tintColor: PALETTE.textPrimary,
  },
  titleBlock: {
    flex: 1,
    marginLeft: CART_SPACING.xs,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: 7,
    borderRadius: RADIUS.pill,
    backgroundColor: PALETTE.well,
  },
  balanceBlock: {
    paddingHorizontal: GUTTER,
    marginTop: CART_SPACING.md,
  },
  label: {
    letterSpacing: 1.4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
    marginTop: CART_SPACING.sm,
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

export default React.memo(BCoinHero);
