import React from 'react';
import OfferRow from './OfferRow';

const CoinCard = ({ bcoinsApplied, availableBCoins, onApply, onRemove }) => (
  <OfferRow
    iconName="hand-coin-outline"
    iconTone="brand"
    title="UD Coin"
    subtitle={`Available UD Coins : ${availableBCoins || 0}`}
    isApplied={bcoinsApplied > 0}
    onPress={bcoinsApplied > 0 ? onRemove : onApply}
  />
);

export default React.memo(CoinCard);
