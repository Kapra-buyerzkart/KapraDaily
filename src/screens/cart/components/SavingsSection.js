import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '../../../styles/typography';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  CART_SHADOW,
  wp,
  hp,
} from '../../../styles/cartTheme';
import CouponCard from './CouponCard';
import RewardsCard from './RewardsCard';
import CoinCard from './CoinCard';

const SavingsSection = ({
  appliedCouponCode,
  appliedGiftCardCode,
  bcoinsAppliedValue,
  availableBCoins,
  onApplyOffer,
  onRejectOffer,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.ribbon}>
        <Text style={styles.ribbonText}>Save money</Text>
      </View>

      <View style={styles.card}>
        <CouponCard
          appliedCouponCode={appliedCouponCode}
          onApply={() => onApplyOffer('2')}
          onRemove={() => onRejectOffer('2')}
        />
        <View style={styles.divider} />
        <RewardsCard
          appliedGiftCardCode={appliedGiftCardCode}
          onApply={() => onApplyOffer('4')}
          onRemove={() => onRejectOffer('4')}
        />
        <View style={styles.divider} />
        <CoinCard
          bcoinsApplied={bcoinsAppliedValue}
          availableBCoins={availableBCoins}
          onApply={() => onApplyOffer('3')}
          onRemove={() => onRejectOffer('3')}
        />
      </View>
    </View>
  );
};

export default React.memo(SavingsSection);

const styles = StyleSheet.create({
  container: {
    marginTop: hp('2.5%'),
    paddingHorizontal: CART_SPACING.lg,
  },
  ribbon: {
    alignSelf: 'flex-start',
    backgroundColor: CART_COLORS.success,
    paddingHorizontal: CART_SPACING.lg,
    paddingVertical: hp('0.7%'),
    borderRadius: CART_RADIUS.button,
    marginBottom: -hp('1.8%'),
    marginLeft: CART_SPACING.md,
    zIndex: 1,
    ...CART_SHADOW,
  },
  ribbonText: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: wp('3.4%'),
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: CART_COLORS.card,
    borderRadius: CART_RADIUS.card,
    paddingTop: hp('2.5%'),
    paddingHorizontal: CART_SPACING.sm,
    paddingBottom: CART_SPACING.sm,
    // ...CART_SHADOW,
  },
  divider: {
    height: 1,
    backgroundColor: CART_COLORS.border,
    marginVertical: CART_SPACING.xs,
    marginHorizontal: CART_SPACING.md,
  },
});
