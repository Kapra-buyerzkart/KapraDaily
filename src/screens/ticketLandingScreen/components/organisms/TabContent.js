import React from 'react';
import EmptyState from '@/components/events/EmptyState';
import { TAB_IDS } from '@/components/events/EventCategoryTabs';
import { BILLS_ICON, EMPTY_COPY, SPORTS_ICON } from '../../constants';
import PopularTab from './PopularTab';
import CardCarousel from './CardCarousel';

const TabContent = ({
  activeTab,
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
  arcApexY,
}) => {
  switch (activeTab) {
    case TAB_IDS.POPULAR:
      return (
        <PopularTab
          fadeAnim={fadeAnim}
          navigation={navigation}
          vouchers={vouchers}
          loading={loading}
          bCoins={bCoins}
          bCoinsLoading={bCoinsLoading}
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
          arcApexY={arcApexY}
        />
      );
    case TAB_IDS.SPORTS:
      return (
        <EmptyState
          icon={SPORTS_ICON}
          title={EMPTY_COPY.sports.title}
          subtitle={EMPTY_COPY.sports.subtitle}
        />
      );
    case TAB_IDS.BILLS:
      return (
        <EmptyState
          icon={BILLS_ICON}
          title={EMPTY_COPY.bills.title}
          subtitle={EMPTY_COPY.bills.subtitle}
        />
      );
    case TAB_IDS.HOLIDAYS:
      return (
        <EmptyState
          icon={SPORTS_ICON}
          title={EMPTY_COPY.holidays.title}
          subtitle={EMPTY_COPY.holidays.subtitle}
        />
      );
    case TAB_IDS.TRAVEL:
      return (
        <EmptyState
          icon={SPORTS_ICON}
          title={EMPTY_COPY.travel.title}
          subtitle={EMPTY_COPY.travel.subtitle}
        />
      );
    default:
      return null;
  }
};

export default React.memo(TabContent);
