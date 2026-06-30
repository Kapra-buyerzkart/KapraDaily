import React from 'react';
import OfferRow from './OfferRow';

const RewardsCard = ({ appliedGiftCardCode, onApply, onRemove }) => (
  <OfferRow
    iconSource={require('../../../assets/images/smart_point.png')}
    title="Smart point"
    appliedLabel={appliedGiftCardCode}
    subtitle="View all gift cards"
    isApplied={!!appliedGiftCardCode}
    onPress={appliedGiftCardCode ? onRemove : onApply}
  />
);

export default React.memo(RewardsCard);
