import React, { useCallback, useMemo } from 'react';
import { Animated, FlatList, StyleSheet } from 'react-native';
import HeroCarousel from '@/components/events/HeroCarousel';
import RewardsCard from '@/components/events/RewardsCard';
import GiftCardRow from '@/components/events/GiftCardRow';
import EventCard from '@/components/events/EventCard';
import UpcomingEventCard from '@/components/events/UpcomingEventCard';
import SectionTitle from '@/components/events/SectionTitle';
import LoadingSkeleton from '@/components/events/LoadingSkeleton';
import EmptyState from '@/components/events/EmptyState';
import ExploreMoreRow from '@/components/events/ExploreMoreRow';

import { EMPTY_COPY, POPULAR_ICON } from '../../constants';
import { TicketLandingSkeleton } from '../molecules';

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
  const renderUpcomingEvent = useCallback(
    ({ item, index }) => (
      <UpcomingEventCard item={item} onPress={onEventPress} index={index} />
    ),
    [onEventPress],
  );
  const upcomingKeyExtractor = useCallback(
    (item, index) => String(item?.eventId ?? index),
    [],
  );

  // Only the very first load blanks the tab. A refetch (tab re-entry, pull to
  // refresh) keeps the current content on screen instead of flashing back to
  // the skeleton and replaying every card's entrance animation.
  const hasPopularContent =
    heroItems.length > 0 ||
    giftCardItems.length > 0 ||
    (popularEvents?.length ?? 0) > 0;

  if (popularEventsLoading && !hasPopularContent) {
    return (
      <Animated.View style={containerStyle}>
        <TicketLandingSkeleton />
      </Animated.View>
    );
  }

  if (!loading && (!vouchers || vouchers.length === 0)) {
    return (
      <EmptyState
        icon={POPULAR_ICON}
        title={EMPTY_COPY.popular.title}
        subtitle={EMPTY_COPY.popular.subtitle}
      />
    );
  }

  return (
    <Animated.View style={containerStyle}>
      {bannersLoading && heroItems.length === 0 ? (
        <LoadingSkeleton variant="hero" />
      ) : (
        <HeroCarousel data={heroItems} onItemPress={handleBannerPress} />
      )}

      <RewardsCard
        bCoins={bCoins}
        loading={bCoinsLoading}
        onPress={handleViewRewards}
      />
      {}

      {giftCardItems.length > 0 && (
        <>
          <SectionTitle
            title="Popular Gift Cards"
            onActionPress={onGoToVouchers}
          />
          <GiftCardRow vouchers={giftCardItems} onPress={onClaim} />
        </>
      )}

      {}

      {loading && listItems.length === 0 && (
        <LoadingSkeleton variant="card" count={3} />
      )}

      {listItems.length > 0 && (
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
      {popularEventsLoading && !(popularEvents?.length > 0) ? (
        <LoadingSkeleton variant="card" count={3} />
      ) : popularEvents && popularEvents.length > 0 ? (
        <FlatList
          data={popularEvents}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.upcomingRow}
          keyExtractor={upcomingKeyExtractor}
          renderItem={renderUpcomingEvent}
          initialNumToRender={popularEvents.length}
          removeClippedSubviews={false}
        />
      ) : (
        <EmptyState
          icon={POPULAR_ICON}
          title={EMPTY_COPY.popularEvents.title}
          subtitle={EMPTY_COPY.popularEvents.subtitle}
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
  upcomingRow: {
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 16,
  },
});

export default React.memo(PopularTab);
