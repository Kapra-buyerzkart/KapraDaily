import React from 'react';
import icons from '@/assets/icons';
import OfferRow from './OfferRow';

const CoinCard = ({
  bcoinsApplied,
  availableBCoins,
  onApply,
  onRemove,
  tinted,
  style,
}) => (
  <OfferRow
    imageSource={icons.udCoinUpdated || icons.udcoin}
    title="UD Coin"
    subtitle={`Available UD Coins : ${availableBCoins || 0}`}
    appliedSubtitle={
      bcoinsApplied > 0 ? `₹${Number(bcoinsApplied).toFixed(2)} applied` : null
    }
    isApplied={bcoinsApplied > 0}
    onPress={onApply}
    onRemove={onRemove}
    tinted={tinted}
    style={style}
  />
);

export default React.memo(CoinCard);
