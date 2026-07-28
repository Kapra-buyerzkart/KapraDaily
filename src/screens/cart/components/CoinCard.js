import React from 'react';
import OfferRow from './OfferRow';
import icons from '../../../assets/icons';

const CoinCard = ({ bcoinsApplied, availableBCoins, onApply, onRemove }) => (
  <OfferRow
    iconSource={icons.udCoinNew}
    title="UD Coin"
    subtitle={`Available UD Coins : ${availableBCoins || 0}`}
    isApplied={bcoinsApplied > 0}
    onPress={bcoinsApplied > 0 ? onRemove : onApply}
  />
);

export default React.memo(CoinCard);
