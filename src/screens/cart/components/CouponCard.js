import React from 'react';
import OfferRow from './OfferRow';

const CouponCard = ({ appliedCouponCode, onApply, onRemove }) => (
  <OfferRow
    iconSource={require('../../../assets/images/couponcode.png')}
    title="Coupon"
    appliedLabel={appliedCouponCode}
    subtitle="View all coupons"
    isApplied={!!appliedCouponCode}
    onPress={appliedCouponCode ? onRemove : onApply}
  />
);

export default React.memo(CouponCard);
