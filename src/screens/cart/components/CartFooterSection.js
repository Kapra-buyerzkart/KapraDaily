import React from 'react';
import { View } from 'react-native';
import WishlistCTA from './WishlistCTA';
import DeliveryGroupCard from './DeliveryGroupCard';
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
    <DeliveryGroupCard position="bottom">
      <WishlistCTA onPress={onWishlistPress} />
    </DeliveryGroupCard>

    <SavingsSection
      appliedCouponCode={appliedCouponCode}
      appliedGiftCardCode={appliedGiftCardCode}
      bcoinsAppliedValue={bcoinsAppliedValue}
      availableBCoins={availableBCoins}
      onApplyOffer={onApplyOffer}
      onRejectOffer={onRejectOffer}
    />

    <BillSummary billCalculations={billCalculations} />

    {}

    <View style={{ height: bottomSpacerHeight }} />
  </View>
);

export default CartFooterSection;
