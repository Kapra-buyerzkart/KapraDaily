import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { AppText, Shimmer } from '../../../components/atoms';
import { CoinSurface, CoinTile } from '../atoms';
import { COIN_ICON, TOKEN_GLYPH } from '../constants';
import { PALETTE, RADIUS, SPACING } from '../theme';

const SKELETON_ROWS = [0, 1, 2, 3, 4, 5];
const GLYPH_SIZE = 30;

export const HistorySkeleton: React.FC = () => (
  <CoinSurface style={styles.skeletonWrap}>
    {SKELETON_ROWS.map(row => (
      <View key={row} style={styles.skeletonRow}>
        <Shimmer width={38} height={38} radius={RADIUS.icon} />
        <View style={styles.skeletonCopy}>
          <Shimmer width="78%" height={11} radius={6} />
          <Shimmer width="45%" height={9} radius={5} />
        </View>
        <Shimmer width={72} height={30} radius={RADIUS.stepper} />
      </View>
    ))}
  </CoinSurface>
);

export const HistoryEmpty: React.FC<{ isCoin: boolean }> = ({ isCoin }) => (
  <CoinSurface style={styles.emptyWrap}>
    <CoinTile size={66} tone="neutral" radius={RADIUS.card}>
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
    </CoinTile>
    <AppText variant="heading" style={styles.emptyTitle}>
      No {isCoin ? 'UD Coin' : 'UD Token'} activity yet
    </AppText>
    <AppText variant="body" tone="muted" style={styles.emptyCaption}>
      {isCoin
        ? 'Coins you earn and spend will show up here.'
        : 'Invite friends and shop to start earning tokens.'}
    </AppText>
  </CoinSurface>
);

const styles = StyleSheet.create({
  skeletonWrap: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  skeletonCopy: {
    flex: 1,
    marginHorizontal: SPACING.md,
    gap: 7,
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xxxl,
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
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
  emptyCaption: {
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});
