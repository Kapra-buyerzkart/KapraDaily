import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import OneTapCouponCard from './OneTapCouponCard';
import RewardsCard from './RewardsCard';
import CoinCard from './CoinCard';
import DottedDivider from './atoms/DottedDivider';
import { FONTS } from '@/styles/typography';
import { wp, hp } from '../../../styles/cartTheme';

const SavingsSection = ({
  appliedCouponCode,
  appliedGiftCardCode,
  isCouponApplied,
  isGiftCardApplied,
  bcoinsAppliedValue,
  availableBCoins,
  onApplyOffer,
  onRejectOffer,
  // One-tap coupon props
  bestCoupon,
  betterCoupon,
  extraSavings = 0,
  unlockableCoupon,
  totalCouponsCount = 0,
  couponSavingsAmount = 0,
  isApplyingCoupon = false,
  onOneTapApply,
  onRemoveCoupon,
  onSwitchCoupon,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headingRow}>
        <Text style={styles.title}>Save money</Text>
        <Text style={styles.subtitle}>Coupons, points & coins</Text>
      </View>

      <View style={styles.body}>
        {/* Highlighted Hero Offer Card */}
        <OneTapCouponCard
          appliedCouponCode={appliedCouponCode}
          isCouponApplied={isCouponApplied}
          couponSavingsAmount={couponSavingsAmount}
          bestCoupon={bestCoupon}
          betterCoupon={betterCoupon}
          extraSavings={extraSavings}
          unlockableCoupon={unlockableCoupon}
          totalCouponsCount={totalCouponsCount}
          isApplyingCoupon={isApplyingCoupon}
          onOneTapApply={onOneTapApply}
          onRemoveCoupon={onRemoveCoupon || (() => onRejectOffer('2'))}
          onSwitchCoupon={onSwitchCoupon}
          onViewAllCoupons={() => onApplyOffer('2')}
        />

        <RewardsCard
          appliedGiftCardCode={appliedGiftCardCode}
          isApplied={isGiftCardApplied}
          onApply={() => onApplyOffer('4')}
          onRemove={() => onRejectOffer('4')}
        />

        <CoinCard
          bcoinsApplied={bcoinsAppliedValue}
          availableBCoins={availableBCoins}
          onApply={() => onApplyOffer('3')}
          onRemove={() => onRejectOffer('3')}
        />
      </View>

      {/* Dotted border separator */}
      <DottedDivider style={styles.dottedDivider} />
    </View>
  );
};

export default React.memo(SavingsSection);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginTop: hp('1.8%'),
    width: '100%',
  },
  headingRow: {
    paddingHorizontal: wp('4%'),
    marginBottom: hp('0.6%'),
    gap: 2,
  },
  title: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.4%'),
    color: '#000000',
  },
  subtitle: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.1%'),
    color: '#71717A',
  },
  body: {
    backgroundColor: '#FFFFFF',
  },
  dottedDivider: {
    marginTop: hp('1.5%'),
    marginBottom: hp('1%'),
  },
});
