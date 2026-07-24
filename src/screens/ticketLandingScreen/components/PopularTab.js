import React, { useCallback, useMemo } from 'react';
import { Animated, View, ScrollView, StyleSheet } from 'react-native';
import HeroCarousel from '@/components/events/HeroCarousel';
import RewardsCard from '@/components/events/RewardsCard';
import QuickActionCard from '@/components/events/QuickActionCard';
import GiftCard from '@/components/events/GiftCard';
import GiftCardRow from '@/components/events/GiftCardRow';
import EventCard from '@/components/events/EventCard';
import UpcomingEventCard from '@/components/events/UpcomingEventCard';
import SectionTitle from '@/components/events/SectionTitle';
import LoadingSkeleton from '@/components/events/LoadingSkeleton';
import EmptyState from '@/components/events/EmptyState';
import ExploreMoreRow from '@/components/events/ExploreMoreRow';

const VOUCHERS_ICON = require('../../../assets/events/Frame 1216250138.png');
const SPORTS_ICON = require('../../../assets/events/Group 1000004808.png');
const POPULAR_ICON = require('../../../assets/events/Group 1000004801.png');

const PopularTab = ({
  fadeAnim,
  navigation,
  vouchers,
  loading,
  bCoins,
  bCoinsLoading,
  giftQuote,
  giftQuoteLoading,
  onClaim,
  onGoToVouchers,
  onGoToSports,
  popularEvents,
  popularEventsLoading,
  banners,
  bannersLoading,
  popularVouchers,
  moreToExplore,
  onEventPress,
}) => {
  const featured = vouchers?.[0];
  const heroItems = useMemo(() => banners ?? [], [banners]);
  const giftCardItems = useMemo(() => {
    const list = popularVouchers ?? [];
    // Active gift cards first, sold-out (inactive) ones after. Sort is
    // stable so the original order is preserved within each group.
    const sorted = [...list].sort(
      (a, b) => (b?.isActive ? 1 : 0) - (a?.isActive ? 1 : 0),
    );
    return sorted.slice(0, 6);
  }, [popularVouchers]);
  const listItems = useMemo(
    () => (vouchers && vouchers.length > 1 ? vouchers.slice(1) : []),
    [vouchers],
  );
  const containerStyle = useMemo(() => ({ opacity: fadeAnim }), [fadeAnim]);
  const handleGiftPress = useCallback(
    () => onClaim(featured),
    [onClaim, featured],
  );
  const handleViewRewards = useCallback(() => {
    navigation.navigate('BCoinScreen');
  }, [navigation]);
  const handleBannerPress = useCallback(
    banner => {
      if (banner?.isEvent) {
        onEventPress?.({ eventId: banner.voucherId });
      } else {
        onClaim?.({ voucherId: banner.voucherId });
      }
    },
    [onEventPress, onClaim],
  );

  console.log('[DEBUG PopularTab]', {
    loading,
    vouchersLen: vouchers?.length,
    popularEventsLoading,
    popularEventsLen: popularEvents?.length,
  });

  if (!loading && (!vouchers || vouchers.length === 0)) {
    return (
      <EmptyState
        icon={POPULAR_ICON}
        title="No vouchers available"
        subtitle="Check back soon for exciting offers and events."
      />
    );
  }

  return (
    <Animated.View style={containerStyle}>
      {bannersLoading ? (
        <LoadingSkeleton variant="hero" />
      ) : (
        <HeroCarousel data={heroItems} onItemPress={handleBannerPress} />
      )}

      <RewardsCard
        bCoins={bCoins}
        loading={bCoinsLoading}
        onPress={handleViewRewards}
      />
      {/* 
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
      </View> */}

      {!popularEventsLoading && giftCardItems.length > 0 && (
        <>
          <SectionTitle
            title="Popular Gift Cards"
            // actionLabel="View All"
            onActionPress={onGoToVouchers}
          />
          <GiftCardRow vouchers={giftCardItems} onPress={onClaim} />
        </>
      )}

      {/* {!loading && featured && (
        <GiftCard
          voucher={featured}
          quote={giftQuote}
          quoteLoading={giftQuoteLoading}
          onPress={handleGiftPress}
        />
      )} */}

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

      <SectionTitle title="Upcoming Events" />
      {popularEventsLoading ? (
        <LoadingSkeleton variant="card" count={3} />
      ) : popularEvents && popularEvents.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.upcomingRow}
        >
          {popularEvents.map((event, index) => (
            <UpcomingEventCard
              key={event?.eventId ?? index}
              item={event}
              onPress={onEventPress}
              index={index}
            />
          ))}
        </ScrollView>
      ) : (
        <EmptyState
          icon={POPULAR_ICON}
          title="No data available"
          subtitle="Check back soon for popular events."
        />
      )}

      {moreToExplore && moreToExplore.length > 0 && (
        <>
          <SectionTitle title="More to Explore" />
          <ExploreMoreRow items={moreToExplore} />
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
  upcomingRow: {
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 16,
  },
});

export default React.memo(PopularTab);
