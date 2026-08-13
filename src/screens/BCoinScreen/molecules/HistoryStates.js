import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ShimmerPlaceholder from '@/components/ShimmerPlaceholder';
import { CART_SPACING } from '@/styles/cartTheme';

import { CoinSurface, CoinText, IconTile } from '../atoms';
import { COIN_ICON, TOKEN_GLYPH } from '../constants';
import { PALETTE, RADIUS } from '../theme';

const SKELETON_ROWS = [0, 1, 2, 3, 4, 5];
const GLYPH_SIZE = 30;

export const HistorySkeleton = () => (
  <CoinSurface style={styles.skeletonWrap}>
    {SKELETON_ROWS.map(row => (
      <View key={row} style={styles.skeletonRow}>
        <ShimmerPlaceholder style={styles.skeletonTile} />
        <View style={styles.skeletonCopy}>
          <ShimmerPlaceholder style={styles.skeletonLineLong} />
          <ShimmerPlaceholder style={styles.skeletonLineShort} />
        </View>
        <ShimmerPlaceholder style={styles.skeletonPill} />
      </View>
    ))}
  </CoinSurface>
);

export const HistoryEmpty = ({ isCoin }) => (
  <CoinSurface style={styles.emptyWrap}>
    <IconTile size={66} tone="neutral" radius={RADIUS.card}>
      {isCoin ? (
        <Image source={COIN_ICON} style={styles.emptyCoin} />
      ) : (
        <MaterialCommunityIcons
          name={TOKEN_GLYPH}
          size={GLYPH_SIZE}
          color={PALETTE.token}
          style={styles.emptyToken}
        />
      )}
    </IconTile>
    <CoinText variant="heading" style={styles.emptyTitle}>
      No {isCoin ? 'UD Coin' : 'UD Token'} activity yet
    </CoinText>
    <CoinText variant="body" tone="muted" style={styles.emptyCaption}>
      {isCoin
        ? 'Coins you earn and spend will show up here.'
        : 'Invite friends and shop to start earning tokens.'}
    </CoinText>
  </CoinSurface>
);

const styles = StyleSheet.create({
  skeletonWrap: {
    marginTop: CART_SPACING.lg,
    paddingHorizontal: CART_SPACING.lg,
    paddingVertical: CART_SPACING.sm,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: CART_SPACING.md,
  },
  skeletonTile: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.icon,
  },
  skeletonCopy: {
    flex: 1,
    marginHorizontal: CART_SPACING.md,
    gap: 7,
  },
  skeletonLineLong: {
    height: 11,
    width: '78%',
    borderRadius: 6,
  },
  skeletonLineShort: {
    height: 9,
    width: '45%',
    borderRadius: 5,
  },
  skeletonPill: {
    width: 72,
    height: 30,
    borderRadius: RADIUS.stepper,
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: CART_SPACING.xxl,
    paddingHorizontal: CART_SPACING.xxl,
    paddingVertical: CART_SPACING.xxxl,
  },
  emptyCoin: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    opacity: 0.55,
  },
  emptyToken: {
    opacity: 0.55,
  },
  emptyTitle: {
    marginTop: CART_SPACING.lg,
    textAlign: 'center',
  },
  emptyCaption: {
    textAlign: 'center',
    marginTop: CART_SPACING.xs,
  },
});
