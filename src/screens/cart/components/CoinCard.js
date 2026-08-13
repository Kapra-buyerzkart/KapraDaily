import React from 'react';
import OfferRow from './OfferRow';

const CoinCard = ({ bcoinsApplied, availableBCoins, onApply, onRemove }) => (
  <OfferRow
    iconName="hand-coin-outline"
    iconTone="brand"
    title="UD Coin"
    subtitle={`Available UD Coins : ${availableBCoins || 0}`}
    appliedSubtitle={
      bcoinsApplied > 0 ? `₹${Number(bcoinsApplied).toFixed(2)} applied` : null
    }
    isApplied={bcoinsApplied > 0}
    onPress={onApply}
    onRemove={onRemove}
  />
);

export default React.memo(CoinCard);
