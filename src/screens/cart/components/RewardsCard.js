import React from 'react';
import OfferRow from './OfferRow';

const RewardsCard = ({ appliedGiftCardCode, isApplied, onApply, onRemove }) => (
  <OfferRow
    iconName="star-four-points-outline"
    iconTone="pink"
    title="Smart point"
    appliedLabel={appliedGiftCardCode}
    subtitle="View all gift cards"
    isApplied={isApplied ?? !!appliedGiftCardCode}
    onPress={onApply}
    onRemove={onRemove}
  />
);

export default React.memo(RewardsCard);
