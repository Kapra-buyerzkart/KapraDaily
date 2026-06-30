import React from 'react';
import { View } from 'react-native';
import WishlistCTA from './WishlistCTA';
import SavingsSection from './SavingsSection';
import BillSummary from './BillSummary';
import RecommendationSection from './RecommendationSection';

const CartFooterSection = ({
  onWishlistPress,
  appliedCouponCode,
  appliedGiftCardCode,
  bcoinsAppliedValue,
  availableBCoins,
  onApplyOffer,
  onRejectOffer,
  billCalculations,
  firstProductId,
  pincodeAreaId,
  bottomSpacerHeight,
}) => (
  <View>
    <WishlistCTA onPress={onWishlistPress} />

    <SavingsSection
      appliedCouponCode={appliedCouponCode}
      appliedGiftCardCode={appliedGiftCardCode}
      bcoinsAppliedValue={bcoinsAppliedValue}
      availableBCoins={availableBCoins}
      onApplyOffer={onApplyOffer}
      onRejectOffer={onRejectOffer}
    />

    <BillSummary billCalculations={billCalculations} />

    <RecommendationSection
      productId={firstProductId}
      pincodeAreaId={pincodeAreaId}
    />

    <View style={{ height: bottomSpacerHeight }} />
  </View>
);

export default CartFooterSection;
