import React from 'react';
import { View, StyleSheet } from 'react-native';
import Surface from './atoms/Surface';
import Divider from './atoms/Divider';
import CartText from './atoms/CartText';
import CouponCard from './CouponCard';
import RewardsCard from './RewardsCard';
import CoinCard from './CoinCard';
import { CART_SPACING, hp } from '../../../styles/cartTheme';

const SavingsSection = ({
  appliedCouponCode,
  appliedGiftCardCode,
  isCouponApplied,
  isGiftCardApplied,
  bcoinsAppliedValue,
  availableBCoins,
  onApplyOffer,
  onRejectOffer,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headingRow}>
        <CartText variant="heading">Save money</CartText>
        <CartText variant="micro" tone="muted">
          Coupons, points & coins
        </CartText>
      </View>

      <Surface>
        <View style={styles.body}>
          <CouponCard
            appliedCouponCode={appliedCouponCode}
            isApplied={isCouponApplied}
            onApply={() => onApplyOffer('2')}
            onRemove={() => onRejectOffer('2')}
          />
          <Divider inset={CART_SPACING.lg} />
          <RewardsCard
            appliedGiftCardCode={appliedGiftCardCode}
            isApplied={isGiftCardApplied}
            onApply={() => onApplyOffer('4')}
            onRemove={() => onRejectOffer('4')}
          />
          <Divider inset={CART_SPACING.lg} />
          <CoinCard
            bcoinsApplied={bcoinsAppliedValue}
            availableBCoins={availableBCoins}
            onApply={() => onApplyOffer('3')}
            onRemove={() => onRejectOffer('3')}
          />
        </View>
      </Surface>
    </View>
  );
};

export default React.memo(SavingsSection);

const styles = StyleSheet.create({
  container: {
    marginTop: hp('2.2%'),
  },
  headingRow: {
    paddingHorizontal: CART_SPACING.lg,
    marginBottom: CART_SPACING.sm,
    gap: 1,
  },
  body: {
    paddingVertical: CART_SPACING.xs,
  },
});
