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
  vouchers,
  loading,
  bCoins,
  giftQuote,
  giftQuoteLoading,
  onClaim,
  onGoToVouchers,
  onGoToSports,
}) => {
  switch (activeTab) {
    case TAB_IDS.POPULAR:
      return (
        <PopularTab
          fadeAnim={fadeAnim}
          vouchers={vouchers}
          loading={loading}
          bCoins={bCoins}
          giftQuote={giftQuote}
          giftQuoteLoading={giftQuoteLoading}
          onClaim={onClaim}
          onGoToVouchers={onGoToVouchers}
          onGoToSports={onGoToSports}
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
          subtitle="Pay bills and recharge with UD-Coins, coming soon."
        />
      );
    default:
      return null;
  }
};

export default React.memo(TabContent);
