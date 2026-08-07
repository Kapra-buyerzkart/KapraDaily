import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import AntDesign from 'react-native-vector-icons/AntDesign';
import icons from '@/assets/icons';
import { FONTS } from '@/styles/typography';

import { COIN_ICON } from '../constants';
import { formatAmount, formatCurrency } from '../utils';
import { PALETTE, RADIUS } from '../theme';

const BCoinHero = ({ topInset, balance, coinValue, onBack, onInfo }) => (
  <View style={[styles.hero, { paddingTop: topInset + 6 }]}>
    <View style={styles.topRow}>
      <TouchableOpacity
        style={styles.iconButton}
        hitSlop={16}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
      >
        <Image source={icons.backArrowNew} style={styles.backIcon} />
      </TouchableOpacity>

      <Text style={styles.title}>UD Coins</Text>

      <TouchableOpacity
        style={styles.infoPill}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Learn about UD Coins and UD Tokens"
        onPress={onInfo}
      >
        <AntDesign name="infocirlceo" size={12} color={PALETTE.textSecondary} />
        <Text style={styles.infoPillText}>Know more</Text>
      </TouchableOpacity>
    </View>

    <Animated.View entering={FadeIn.duration(320)} style={styles.balanceBlock}>
      <Text style={styles.label}>TOTAL UD COINS</Text>

      <View style={styles.balanceRow}>
        <Image source={COIN_ICON} style={styles.coin} />
        <Text style={styles.balance}>{formatAmount(balance)}</Text>
        <View style={styles.worthPill}>
          <Text style={styles.worthText}>
            worth {formatCurrency(balance * coinValue)}
          </Text>
        </View>
      </View>
    </Animated.View>
  </View>
);

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    paddingBottom: 18,
    backgroundColor: PALETTE.surface,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.line,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: PALETTE.line,
  },
  backIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    tintColor: PALETTE.textPrimary,
  },
  title: {
    flex: 1,
    marginLeft: 12,
    fontFamily: FONTS.gilroy.bold,
    fontSize: 16,
    color: PALETTE.textPrimary,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: PALETTE.line,
  },
  infoPillText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: 12,
    color: PALETTE.textSecondary,
  },
  balanceBlock: {
    paddingHorizontal: 18,
    marginTop: 10,
  },
  label: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: 10.5,
    letterSpacing: 1.4,
    color: PALETTE.textMuted,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  coin: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  balance: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: 32,
    lineHeight: 38,
    color: PALETTE.textPrimary,
  },
  worthPill: {
    marginLeft: 2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: 'rgba(217,162,27,0.35)',
    backgroundColor: PALETTE.goldTint,
  },
  worthText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: 11.5,
    color: PALETTE.goldDeep,
  },
});

export default React.memo(BCoinHero);
