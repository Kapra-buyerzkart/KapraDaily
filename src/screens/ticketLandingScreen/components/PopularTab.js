import React from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import HeroCarousel from '@/components/events/HeroCarousel';
import QuickActionCard from '@/components/events/QuickActionCard';
import GiftCard from '@/components/events/GiftCard';
import EventCard from '@/components/events/EventCard';
import SectionTitle from '@/components/events/SectionTitle';
import LoadingSkeleton from '@/components/events/LoadingSkeleton';
import EmptyState from '@/components/events/EmptyState';

const VOUCHERS_ICON = require('../../../assets/events/Frame 1216250138.png');
const SPORTS_ICON = require('../../../assets/events/Group 1000004808.png');
const POPULAR_ICON = require('../../../assets/events/Group 1000004801.png');

const PopularTab = ({
  fadeAnim,
  vouchers,
  loading,
  bCoins,
  giftQuote,
  giftQuoteLoading,
  onClaim,
  onGoToVouchers,
  onGoToSports,
}) => {
  if (!loading && (!vouchers || vouchers.length === 0)) {
    return (
      <EmptyState
        icon={POPULAR_ICON}
        title="No vouchers available"
        subtitle="Check back soon for exciting offers and events."
      />
    );
  }

  const featured = vouchers?.[0];
  const heroItems = vouchers?.slice(0, 5) ?? [];
  const listItems = vouchers && vouchers.length > 1 ? vouchers.slice(1) : [];

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {loading ? (
        <LoadingSkeleton variant="hero" />
      ) : (
        <HeroCarousel data={heroItems} onItemPress={onClaim} />
      )}

      <View style={styles.quickActionsRow}>
        <QuickActionCard
          icon={VOUCHERS_ICON}
          title={'Get BookMyShow vouchers from\nUDEN Tickets'}
          onPress={onGoToVouchers}
          index={0}
        />
        <QuickActionCard
          icon={SPORTS_ICON}
          title={'Book tickets for your\nfavourite sports'}
          onPress={onGoToSports}
          index={1}
        />
      </View>

      {!loading && featured && (
        <GiftCard
          voucher={featured}
          quote={giftQuote}
          quoteLoading={giftQuoteLoading}
          onPress={() => onClaim(featured)}
        />
      )}

      {loading && <LoadingSkeleton variant="card" count={3} />}

      {!loading && listItems.length > 0 && (
        <>
          <SectionTitle title="Featured Events" />
          {listItems.map((item, index) => (
            <EventCard
              key={item?.voucherId ?? item?.id}
              item={item}
              onPress={onClaim}
              index={index}
            />
          ))}
        </>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  quickActionsRow: {
    // flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 20,
    marginTop: 20,
  },
});

export default PopularTab;
