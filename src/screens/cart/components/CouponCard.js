import React from 'react';
import icons from '@/assets/icons';
import OfferRow from './OfferRow';

const CouponCard = ({ appliedCouponCode, isApplied, onApply, onRemove }) => (
  <OfferRow
    imageSource={icons.coupon}
    title="Coupon"
    appliedLabel={appliedCouponCode}
    subtitle="View all coupons"
    isApplied={isApplied ?? !!appliedCouponCode}
    onPress={onApply}
    onRemove={onRemove}
  />
);

export default React.memo(CouponCard);
