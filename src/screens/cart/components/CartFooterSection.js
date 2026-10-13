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
