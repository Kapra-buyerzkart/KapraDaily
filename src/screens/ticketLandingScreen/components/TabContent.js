import React from 'react';
import EmptyState from '@/components/events/EmptyState';
import { TAB_IDS } from '@/components/events/EventCategoryTabs';
import PopularTab from './PopularTab';
import CardCarousel from './CardCarousel';

const SPORTS_ICON = require('../../../assets/events/Group 1000004803.png');
const BILLS_ICON = require('../../../assets/events/Group 1000004804.png');
const TabContent = ({
  activeTab,
  fadeAnim,
  navigation,
  vouchers,
  loading,
  bCoins,
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
  console.log(
    '[DEBUG TabContent] activeTab=',
    activeTab,
    'POPULAR=',
    TAB_IDS.POPULAR,
  );
  switch (activeTab) {
    case TAB_IDS.POPULAR:
      return (
        <PopularTab
          fadeAnim={fadeAnim}
          navigation={navigation}
          vouchers={vouchers}
          loading={loading}
          bCoins={bCoins}
          giftQuote={giftQuote}
          giftQuoteLoading={giftQuoteLoading}
          onClaim={onClaim}
          onGoToVouchers={onGoToVouchers}
          onGoToSports={onGoToSports}
          popularEvents={popularEvents}
          popularEventsLoading={popularEventsLoading}
          banners={banners}
          bannersLoading={bannersLoading}
          popularVouchers={popularVouchers}
          moreToExplore={moreToExplore}
          onEventPress={onEventPress}
        />
      );
    case TAB_IDS.VOUCHERS:
      return (
        <CardCarousel
          fadeAnim={fadeAnim}
          vouchers={vouchers}
          onClaim={onClaim}
        />
      );
    case TAB_IDS.SPORTS:
      return (
        <EmptyState
          icon={SPORTS_ICON}
          title="Sports"
          subtitle="Book tickets for your favourite sports, coming soon."
        />
      );
    case TAB_IDS.BILLS:
      return (
        <EmptyState
          icon={BILLS_ICON}
          title="Bills & Recharge"
          subtitle="Pay bills and recharge with UD Coins, coming soon."
        />
      );
    case TAB_IDS.HOLIDAYS:
      return (
        <EmptyState
          icon={SPORTS_ICON}
          title="Holidays"
          subtitle="Plan your next getaway with UD Coins, coming soon."
        />
      );
    case TAB_IDS.TRAVEL:
      return (
        <EmptyState
          icon={SPORTS_ICON}
          title="Travel"
          subtitle="Book travel with UD Coins, coming soon."
        />
      );
    default:
      return null;
  }
};

export default React.memo(TabContent);
