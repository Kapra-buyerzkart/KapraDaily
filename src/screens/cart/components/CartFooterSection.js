import React from 'react';
import { View, StyleSheet } from 'react-native';
import WishlistCTA from './WishlistCTA';
import SavingsSection from './SavingsSection';
import BillSummary from './BillSummary';

const CartFooterSection = ({
  onWishlistPress,
  appliedCouponCode,
  appliedGiftCardCode,
  isCouponApplied,
  isGiftCardApplied,
  bcoinsAppliedValue,
  availableBCoins,
  onApplyOffer,
  onRejectOffer,
  billCalculations,
  bottomSpacerHeight,
  // One-tap coupon properties
  bestCoupon,
  betterCoupon,
  extraSavings,
  unlockableCoupon,
  totalCouponsCount,
  isApplyingCoupon,
  onOneTapApply,
  onRemoveCoupon,
  onSwitchCoupon,
}) => (
  <View style={styles.container}>
    <WishlistCTA onPress={onWishlistPress} />

    <SavingsSection
      appliedCouponCode={appliedCouponCode}
      appliedGiftCardCode={appliedGiftCardCode}
      isCouponApplied={isCouponApplied}
      isGiftCardApplied={isGiftCardApplied}
      bcoinsAppliedValue={bcoinsAppliedValue}
      availableBCoins={availableBCoins}
      onApplyOffer={onApplyOffer}
      onRejectOffer={onRejectOffer}
      bestCoupon={bestCoupon}
      betterCoupon={betterCoupon}
      extraSavings={extraSavings}
      unlockableCoupon={unlockableCoupon}
      totalCouponsCount={totalCouponsCount}
      couponSavingsAmount={billCalculations?.couponDiscount || 0}
      isApplyingCoupon={isApplyingCoupon}
      onOneTapApply={onOneTapApply}
      onRemoveCoupon={onRemoveCoupon}
      onSwitchCoupon={onSwitchCoupon}
    />

    <BillSummary billCalculations={billCalculations} />

    <View style={{ height: bottomSpacerHeight }} />
  </View>
);

export default CartFooterSection;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
});
