import React from 'react';
import OfferRow from './OfferRow';

const CouponCard = ({ appliedCouponCode, onApply, onRemove }) => (
  <OfferRow
    iconName="ticket-percent-outline"
    iconTone="brand"
    title="Coupon"
    appliedLabel={appliedCouponCode}
    subtitle="View all coupons"
    isApplied={!!appliedCouponCode}
    onPress={appliedCouponCode ? onRemove : onApply}
  />
);

export default React.memo(CouponCard);
