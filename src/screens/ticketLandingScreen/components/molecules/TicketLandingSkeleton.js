import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonLine } from '../atoms';
import { COLORS, RADIUS } from '../../theme';

const GIFT_CARD_COUNT = 4;
const UPCOMING_COUNT = 3;

const TicketLandingSkeleton = () => (
  <View>
    <View style={styles.heroWrap}>
      <SkeletonLine style={styles.hero} />
    </View>

    <View style={styles.rewardsCard}>
      <View style={styles.rewardsLeft}>
        <SkeletonLine style={styles.rewardsIcon} />
        <View>
          <SkeletonLine style={styles.rewardsLabel} />
          <SkeletonLine style={styles.rewardsAmount} />
        </View>
      </View>
      <SkeletonLine style={styles.rewardsPill} />
    </View>

    <SkeletonLine style={styles.sectionTitle} />
    <View style={styles.row}>
      {Array.from({ length: GIFT_CARD_COUNT }).map((_, index) => (
        <View key={index} style={styles.giftCard}>
          <SkeletonLine style={styles.giftImage} />
          <View style={styles.giftBody}>
            <SkeletonLine style={styles.giftTitle} />
            <SkeletonLine style={styles.giftPrice} />
          </View>
        </View>
      ))}
    </View>

    <SkeletonLine style={styles.sectionTitle} />
    <View style={styles.row}>
      {Array.from({ length: UPCOMING_COUNT }).map((_, index) => (
        <SkeletonLine style={styles.upcomingCard} key={index} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  heroWrap: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  hero: {
    width: '100%',
    height: 220,
    borderRadius: RADIUS.lg,
  },
  rewardsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 14,
    borderRadius: 16,
    backgroundColor: COLORS.skeletonSurface,
    borderWidth: 1,
    borderColor: COLORS.skeletonBorder,
  },
  rewardsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rewardsIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  rewardsLabel: {
    width: 84,
    height: 10,
  },
  rewardsAmount: {
    width: 60,
    height: 18,
    marginTop: 6,
  },
  rewardsPill: {
    width: 104,
    height: 38,
    borderRadius: 12,
  },
  sectionTitle: {
    width: 160,
    height: 18,
    marginHorizontal: 20,
    marginTop: 28,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
  },
  giftCard: {
    width: 112,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: COLORS.skeletonSurface,
    borderWidth: 1,
    borderColor: COLORS.skeletonBorder,
  },
  giftImage: {
    width: '100%',
    height: 72,
    borderRadius: 0,
  },
  giftBody: {
    padding: 8,
    alignItems: 'center',
  },
  giftTitle: {
    width: '80%',
    height: 12,
  },
  giftPrice: {
    width: '55%',
    height: 11,
    marginTop: 6,
  },
  upcomingCard: {
    width: 220,
    height: 150,
    borderRadius: 16,
  },
});

export default React.memo(TicketLandingSkeleton);
