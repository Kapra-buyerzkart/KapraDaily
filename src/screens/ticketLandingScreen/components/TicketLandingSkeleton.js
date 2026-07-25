import React from 'react';
import { View, StyleSheet } from 'react-native';
import Shimmer from '@/components/events/Shimmer';

const GIFT_CARD_COUNT = 4;
const UPCOMING_COUNT = 3;

// Full-screen placeholder for the Popular tab's initial load. Mirrors the real
// layout (hero, rewards card, gift-card row, upcoming events) so the whole
// content area shimmers as one instead of each section popping in separately.
const TicketLandingSkeleton = () => (
  <View>
    <View style={styles.heroWrap}>
      <Shimmer style={styles.hero} />
    </View>

    <View style={styles.rewardsCard}>
      <View style={styles.rewardsLeft}>
        <Shimmer style={styles.rewardsIcon} />
        <View>
          <Shimmer style={[styles.line, styles.rewardsLabel]} />
          <Shimmer style={[styles.line, styles.rewardsAmount]} />
        </View>
      </View>
      <Shimmer style={styles.rewardsPill} />
    </View>

    <Shimmer style={[styles.line, styles.sectionTitle]} />
    <View style={styles.row}>
      {Array.from({ length: GIFT_CARD_COUNT }).map((_, index) => (
        <View key={index} style={styles.giftCard}>
          <Shimmer style={styles.giftImage} />
          <View style={styles.giftBody}>
            <Shimmer style={[styles.line, styles.giftTitle]} />
            <Shimmer style={[styles.line, styles.giftPrice]} />
          </View>
        </View>
      ))}
    </View>

    <Shimmer style={[styles.line, styles.sectionTitle]} />
    <View style={styles.row}>
      {Array.from({ length: UPCOMING_COUNT }).map((_, index) => (
        <Shimmer key={index} style={styles.upcomingCard} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  line: {
    borderRadius: 8,
  },
  heroWrap: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  hero: {
    width: '100%',
    height: 220,
    borderRadius: 18,
  },
  rewardsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
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
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  giftImage: {
    width: '100%',
    height: 72,
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
