import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { FONTS } from '../../../styles/typography';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  CART_SHADOW,
  wp,
  hp,
} from '../../../styles/cartTheme';
import icons from '../../../assets/icons';
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
      <ImageBackground
        source={icons.saveBanner}
        style={styles.ribbon}
        imageStyle={styles.ribbonImage}
        resizeMode="stretch"
      >
        <Text style={styles.ribbonText}>Save money</Text>
      </ImageBackground>

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
    alignSelf: 'center',
    paddingHorizontal: CART_SPACING.lg,
    paddingVertical: hp('0.7%'),
    marginBottom: -hp('1.8%'),
    zIndex: 1,
    ...CART_SHADOW,
  },
  ribbonImage: {},
  ribbonText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.4%'),
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: CART_COLORS.card,
    borderRadius: CART_RADIUS.card,
    paddingTop: hp('2.5%'),
    paddingHorizontal: CART_SPACING.sm,
    paddingBottom: CART_SPACING.sm,
  },
  divider: {
    backgroundColor: CART_COLORS.border,
    marginVertical: CART_SPACING.xs,
    marginHorizontal: CART_SPACING.md,
  },
});
