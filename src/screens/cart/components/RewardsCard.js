import React from 'react';
import OfferRow from './OfferRow';
import icons from '../../../assets/icons';

const RewardsCard = ({ appliedGiftCardCode, onApply, onRemove }) => (
  <OfferRow
    iconSource={icons.smartPoint}
    title="Smart point"
    appliedLabel={appliedGiftCardCode}
    subtitle="View all gift cards"
    isApplied={!!appliedGiftCardCode}
    onPress={appliedGiftCardCode ? onRemove : onApply}
  />
);

export default React.memo(RewardsCard);
