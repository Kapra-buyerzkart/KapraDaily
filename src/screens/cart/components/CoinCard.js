import React from 'react';
import OfferRow from './OfferRow';

const CoinCard = ({ bcoinsApplied, availableBCoins, onApply, onRemove }) => (
  <OfferRow
    iconSource={require('../../../assets/images/bcoinn.png')}
    title="UD-coin"
    subtitle={`Available UD-coins : ${availableBCoins || 0}`}
    isApplied={bcoinsApplied > 0}
    onPress={bcoinsApplied > 0 ? onRemove : onApply}
  />
);

export default React.memo(CoinCard);
