import React from 'react';
import OfferRow from './OfferRow';
import icons from '../../../assets/icons';

const CouponCard = ({ appliedCouponCode, onApply, onRemove }) => (
  <OfferRow
    iconSource={icons.coupon}
    title="Coupon"
    appliedLabel={appliedCouponCode}
    subtitle="View all coupons"
    isApplied={!!appliedCouponCode}
    onPress={appliedCouponCode ? onRemove : onApply}
  />
);

export default React.memo(CouponCard);
