import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import ShimmerPlaceholder from '@/components/ShimmerPlaceholder';
import { FONTS } from '@/styles/typography';

import { COIN_ICON, TOKEN_ICON } from '../constants';
import { PALETTE, RADIUS } from '../theme';

const SKELETON_ROWS = [0, 1, 2, 3, 4, 5];

export const HistorySkeleton = () => (
  <View style={styles.skeletonWrap}>
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
  </View>
);

export const HistoryEmpty = ({ isCoin }) => (
  <View style={styles.emptyWrap}>
    <View style={styles.emptyTile}>
      <Image
        source={isCoin ? COIN_ICON : TOKEN_ICON}
        style={isCoin ? styles.emptyCoin : styles.emptyToken}
      />
    </View>
    <Text style={styles.emptyTitle}>
      No {isCoin ? 'UD Coin' : 'UD Token'} activity yet
    </Text>
    <Text style={styles.emptyCaption}>
      {isCoin
        ? 'Coins you earn and spend will show up here.'
        : 'Invite friends and shop to start earning tokens.'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  skeletonWrap: {
    alignSelf: 'center',
    width: '92%',
    paddingTop: 8,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  skeletonTile: {
    width: 38,
    height: 38,
    borderRadius: 13,
  },
  skeletonCopy: {
    flex: 1,
    marginHorizontal: 12,
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
    borderRadius: RADIUS.md,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 46,
  },
  emptyTile: {
    width: 66,
    height: 66,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PALETTE.canvas,
  },
  emptyCoin: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    opacity: 0.55,
  },
  emptyToken: {
    width: 34,
    height: 24,
    resizeMode: 'contain',
    opacity: 0.55,
  },
  emptyTitle: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: 15,
    color: PALETTE.textPrimary,
    marginTop: 14,
  },
  emptyCaption: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: 12.5,
    lineHeight: 18,
    color: PALETTE.textMuted,
    textAlign: 'center',
    marginTop: 5,
  },
});
