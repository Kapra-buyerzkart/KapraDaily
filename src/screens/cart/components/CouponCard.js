import React from 'react';
import OfferRow from './OfferRow';

const CouponCard = ({ appliedCouponCode, isApplied, onApply, onRemove }) => (
  <OfferRow
    iconName="ticket-percent-outline"
    iconTone="brand"
    title="Coupon"
    appliedLabel={appliedCouponCode}
    subtitle="View all coupons"
    isApplied={isApplied ?? !!appliedCouponCode}
    onPress={onApply}
    onRemove={onRemove}
  />
);

export default React.memo(CouponCard);
