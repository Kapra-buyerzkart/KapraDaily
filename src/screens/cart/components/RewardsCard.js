import React from 'react';
import icons from '@/assets/icons';
import OfferRow from './OfferRow';

const RewardsCard = ({
  appliedGiftCardCode,
  isApplied,
  onApply,
  onRemove,
  tinted,
  style,
}) => (
  <OfferRow
    imageSource={icons.smartPoint}
    title="Smart point"
    appliedLabel={appliedGiftCardCode}
    subtitle="View all gift cards"
    isApplied={isApplied ?? !!appliedGiftCardCode}
    onPress={onApply}
    onRemove={onRemove}
    tinted={tinted}
    style={style}
  />
);

export default React.memo(RewardsCard);
