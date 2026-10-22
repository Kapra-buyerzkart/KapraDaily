import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '@/styles/typography';
import { wp, hp, hitSlopTo } from '../../../styles/cartTheme';
import CouponSpotlightOverlay from './CouponSpotlightOverlay';

const formatExpiry = validTo => {
  if (!validTo) return null;
  try {
    const d = new Date(validTo);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
    });
  } catch {
    return null;
  }
};

const OneTapCouponCard = ({
  appliedCouponCode,
  isCouponApplied,
  couponSavingsAmount = 0,
  bestCoupon,
  betterCoupon,
  extraSavings = 0,
  unlockableCoupon,
  totalCouponsCount = 0,
  isApplyingCoupon = false,
  enableSpotlight = true,
  onOneTapApply,
  onRemoveCoupon,
  onSwitchCoupon,
  onViewAllCoupons,
}) => {
  const successScaleAnim = useRef(new Animated.Value(0.95)).current;
  const successOpacityAnim = useRef(new Animated.Value(0)).current;

  // Full-Screen Spotlight Tint State
  const [isSpotlightVisible, setIsSpotlightVisible] = useState(false);
  const dismissedCouponsRef = useRef(new Set());

  // Automatically trigger the whole-screen tint spotlight when a recommended coupon is available
  useEffect(() => {
    if (
      enableSpotlight &&
      bestCoupon?.code &&
      !isCouponApplied &&
      !dismissedCouponsRef.current.has(bestCoupon.code)
    ) {
      const timer = setTimeout(() => {
        setIsSpotlightVisible(true);
      }, 600);
      return () => clearTimeout(timer);
    } else if (isCouponApplied) {
      setIsSpotlightVisible(false);
    }
  }, [enableSpotlight, bestCoupon?.code, isCouponApplied]);

  const handleDismissSpotlight = () => {
    if (bestCoupon?.code) {
      dismissedCouponsRef.current.add(bestCoupon.code);
    }
    setIsSpotlightVisible(false);
  };

  const handleApplyFromSpotlight = code => {
    if (code) {
      dismissedCouponsRef.current.add(code);
    }
    setIsSpotlightVisible(false);
    onOneTapApply?.(code);
  };

  useEffect(() => {
    if (isCouponApplied) {
      Animated.parallel([
        Animated.spring(successScaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(successOpacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      successScaleAnim.setValue(0.95);
      successOpacityAnim.setValue(0);
    }
  }, [isCouponApplied, successScaleAnim, successOpacityAnim]);

  // 1. Coupon is Applied (Success State)
  if (isCouponApplied) {
    const displayAmount =
      Number(couponSavingsAmount) > 0
        ? `₹${Math.round(couponSavingsAmount)}`
        : null;

    return (
      <View style={styles.appliedWrapper}>
        {/* If a better coupon is unlocked after cart items changed */}
        {betterCoupon && extraSavings > 0 && (
          <View style={styles.betterOfferBanner}>
            <View style={styles.betterOfferLeft}>
              <MaterialCommunityIcons
                name="star-shooting-outline"
                size={18}
                color="#D97706"
              />
              <View style={styles.betterOfferTexts}>
                <Text style={styles.betterOfferTitle}>
                  Better offer available!
                </Text>
                <Text style={styles.betterOfferSubtitle}>
                  Switch to{' '}
                  <Text style={styles.boldCode}>{betterCoupon.code}</Text> to
                  save ₹{Math.round(extraSavings)} more
                </Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={isApplyingCoupon}
              onPress={() => onSwitchCoupon?.(betterCoupon.code)}
              style={styles.switchButton}
              hitSlop={hitSlopTo(8)}
            >
              {isApplyingCoupon ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.switchButtonText}>Switch</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        <Animated.View
          style={[
            styles.appliedCardWrapper,
            {
              opacity: successOpacityAnim,
              transform: [{ scale: successScaleAnim }],
            },
          ]}
        >
          <View style={styles.appliedCard}>
            <View style={styles.appliedLeft}>
              <View style={styles.checkmarkBadge}>
                <MaterialCommunityIcons
                  name="check-bold"
                  size={14}
                  color="#FFFFFF"
                />
              </View>
              <View style={styles.appliedDetails}>
                <View style={styles.appliedCodeRow}>
                  <Text style={styles.appliedCodeText} numberOfLines={1}>
                    {appliedCouponCode || 'Coupon'}
                  </Text>
                </View>
                <Text style={styles.appliedSavingsText}>
                  {displayAmount
                    ? `You saved ${displayAmount} with this coupon`
                    : 'Coupon discount applied to your order'}
                </Text>
              </View>
            </View>

            <View style={styles.appliedActions}>
              <TouchableOpacity
                activeOpacity={0.7}
                disabled={isApplyingCoupon}
                onPress={onRemoveCoupon}
                style={styles.removeBtn}
                hitSlop={hitSlopTo(10)}
              >
                {isApplyingCoupon ? (
                  <ActivityIndicator size="small" color="#EF4444" />
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name="close"
                      size={14}
                      color="#EF4444"
                    />
                    <Text style={styles.removeBtnText}>Remove</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onViewAllCoupons}
                style={styles.changeBtn}
                hitSlop={hitSlopTo(10)}
              >
                <Text style={styles.changeBtnText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }

  // 2. Recommended Eligible Coupon Available (Hero Highlight with Full-screen Spotlight Tint)
  if (bestCoupon) {
    const expiry = formatExpiry(bestCoupon.validTo);
    const estimatedSavings = Math.round(bestCoupon.estimatedDiscount || 0);

    return (
      <>
        <View style={styles.recommendedCard}>
          {/* Top Header Badge & Savings Indicator */}
          <View style={styles.cardHeaderRow}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => setIsSpotlightVisible(true)}
              style={styles.bestOfferBadge}
              hitSlop={hitSlopTo(6)}
              accessibilityRole="button"
              accessibilityLabel="Open offer highlight spotlight"
            >
              <MaterialCommunityIcons
                name="star-four-points"
                size={12}
                color="#EA580C"
              />
              <Text style={styles.bestOfferBadgeText}>
                BEST OFFER FOR YOU
              </Text>
              <MaterialCommunityIcons
                name="information-outline"
                size={12}
                color="#EA580C"
              />
            </TouchableOpacity>

            {estimatedSavings > 0 && (
              <View style={styles.savingsCallout}>
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={12}
                  color="#FFFFFF"
                />
                <Text style={styles.savingsCalloutText}>
                  Save ₹{estimatedSavings}
                </Text>
              </View>
            )}
          </View>

          {/* Middle Details & One-Tap Apply Action */}
          <View style={styles.contentRow}>
            <View style={styles.offerDetails}>
              <View style={styles.codePillRow}>
                <View style={styles.codePill}>
                  <MaterialCommunityIcons
                    name="ticket-percent"
                    size={13}
                    color="#EA580C"
                  />
                  <Text
                    style={styles.codePillText}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {bestCoupon.code}
                  </Text>
                </View>
                <Text style={styles.offerTitle} numberOfLines={1}>
                  {bestCoupon.title}
                </Text>
              </View>

              <Text style={styles.offerDescription} numberOfLines={2}>
                {bestCoupon.description}
              </Text>

              <View style={styles.metaRow}>
                {bestCoupon.minOrderAmount > 0 && (
                  <View style={styles.metaItem}>
                    <MaterialCommunityIcons
                      name="basket-outline"
                      size={12}
                      color="#6B7280"
                    />
                    <Text style={styles.metaItemText}>
                      Min order ₹{bestCoupon.minOrderAmount}
                    </Text>
                  </View>
                )}
                {expiry && (
                  <View style={styles.metaItem}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={12}
                      color="#6B7280"
                    />
                    <Text style={styles.metaItemText}>Expires {expiry}</Text>
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={isApplyingCoupon}
              onPress={() => onOneTapApply?.(bestCoupon.code)}
              style={[
                styles.applyButton,
                isApplyingCoupon && styles.applyButtonDisabled,
              ]}
              hitSlop={hitSlopTo(6)}
            >
              {isApplyingCoupon ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.applyButtonText}>APPLY</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer: View All Offers if multiple are available */}
          {totalCouponsCount > 1 && (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={onViewAllCoupons}
              style={styles.viewAllFooter}
            >
              <Text style={styles.viewAllFooterText}>
                View all {totalCouponsCount} available coupons
              </Text>
              <Feather name="chevron-right" size={14} color="#EA580C" />
            </TouchableOpacity>
          )}
        </View>

        {/* Full-Screen Spotlight Tint Overlay highlighting the coupon apply component */}
        <CouponSpotlightOverlay
          visible={isSpotlightVisible}
          coupon={bestCoupon}
          isApplying={isApplyingCoupon}
          onApply={handleApplyFromSpotlight}
          onDismiss={handleDismissSpotlight}
        />
      </>
    );
  }

  // 3. Unlockable Coupon Available (Shortfall Highlight)
  if (unlockableCoupon) {
    const shortfall = Math.ceil(unlockableCoupon.shortfall || 0);
    const potentialDiscount = Math.round(
      unlockableCoupon.estimatedDiscount || 0,
    );

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onViewAllCoupons}
        style={styles.unlockableCardWrapper}
      >
        <View style={styles.unlockableCard}>
          <View style={styles.unlockableIconWrap}>
            <MaterialCommunityIcons
              name="lock-open-variant-outline"
              size={wp('5.5%')}
              color="#D97706"
            />
          </View>

          <View style={styles.unlockableDetails}>
            <View style={styles.unlockableTitleRow}>
              <Text style={styles.unlockableTitle}>
                Unlock{' '}
                {potentialDiscount > 0
                  ? `₹${potentialDiscount} OFF`
                  : 'special offer'}
              </Text>
              <View style={styles.unlockableCodePill}>
                <Text style={styles.unlockableCodeText}>
                  {unlockableCoupon.code}
                </Text>
              </View>
            </View>
            <Text style={styles.unlockableSubtitle}>
              Add ₹{shortfall} more to your cart to use this offer
            </Text>
          </View>

          <Feather name="chevron-right" size={18} color="#D97706" />
        </View>
      </TouchableOpacity>
    );
  }

  // 4. Default / Fallback: Distinct Entry Point
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onViewAllCoupons}
      style={styles.defaultRowWrapper}
    >
      <View style={styles.defaultRow}>
        <View style={styles.defaultIconWrap}>
          <MaterialCommunityIcons
            name="ticket-percent-outline"
            size={wp('5.8%')}
            color="#EA580C"
          />
        </View>

        <View style={styles.defaultDetails}>
          <Text style={styles.defaultTitle}>Coupons & Offers</Text>
          <Text style={styles.defaultSubtitle}>
            {totalCouponsCount > 0
              ? `${totalCouponsCount} coupon${
                  totalCouponsCount > 1 ? 's' : ''
                } available • Select or enter code`
              : 'Apply coupon code'}
          </Text>
        </View>

        <View style={styles.defaultActionBadge}>
          <Text style={styles.defaultActionText}>View</Text>
          <Feather name="chevron-right" size={14} color="#EA580C" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(OneTapCouponCard);

const styles = StyleSheet.create({
  // Applied State
  appliedWrapper: {
    marginHorizontal: wp('4%'),
    marginTop: hp('1%'),
    marginBottom: hp('0.5%'),
    gap: 8,
  },
  betterOfferBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('1%'),
  },
  betterOfferLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    paddingRight: 8,
  },
  betterOfferTexts: {
    flex: 1,
  },
  betterOfferTitle: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.2%'),
    color: '#92400E',
  },
  betterOfferSubtitle: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('2.9%'),
    color: '#B45309',
    marginTop: 1,
  },
  boldCode: {
    fontFamily: FONTS.gilroy.bold,
    color: '#78350F',
  },
  switchButton: {
    backgroundColor: '#D97706',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.6%'),
    borderRadius: 8,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchButtonText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3%'),
    color: '#FFFFFF',
  },
  appliedCardWrapper: {
    borderRadius: 14,
  },
  appliedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    borderWidth: 1.2,
    borderColor: '#86EFAC',
    borderRadius: 14,
    paddingVertical: hp('1.4%'),
    paddingHorizontal: wp('3.8%'),
  },
  appliedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
    flex: 1,
  },
  checkmarkBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appliedDetails: {
    flex: 1,
  },
  appliedCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appliedCodeText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.8%'),
    color: '#14532D',
  },
  appliedPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  appliedPillText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('2.5%'),
    color: '#15803D',
  },
  appliedSavingsText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.1%'),
    color: '#15803D',
    marginTop: 2,
  },
  appliedActions: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
    marginLeft: 8,
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  removeBtnText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3%'),
    color: '#EF4444',
  },
  changeBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  changeBtnText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('2.8%'),
    color: '#6B7280',
    textDecorationLine: 'underline',
  },

  // Recommended Card State (Hero Highlight)
  recommendedCard: {
    marginHorizontal: wp('4%'),
    marginTop: hp('1%'),
    marginBottom: hp('0.5%'),
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FB923C',
    padding: wp('3.8%'),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  bestOfferBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 6,
    borderWidth: 0.8,
    borderColor: '#FDBA74',
  },
  bestOfferBadgeText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('2.6%'),
    color: '#EA580C',
    letterSpacing: 0.5,
  },
  savingsCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#16A34A',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 6,
    flexShrink: 0,
  },
  savingsCalloutText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('2.8%'),
    color: '#FFFFFF',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  offerDetails: {
    flex: 1,
  },
  codePillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  codePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF1E9',
    borderWidth: 1,
    borderColor: '#FB923C',
    borderStyle: 'dashed',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    maxWidth: '62%',
    flexShrink: 1,
  },
  codePillText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.2%'),
    color: '#EA580C',
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  offerTitle: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.6%'),
    color: '#111827',
    flexShrink: 1,
  },
  offerDescription: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3%'),
    color: '#4B5563',
    marginTop: 4,
    lineHeight: wp('4.2%'),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaItemText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.7%'),
    color: '#6B7280',
  },
  applyButton: {
    backgroundColor: '#EA580C',
    borderRadius: 10,
    paddingHorizontal: wp('4.5%'),
    paddingVertical: hp('1.1%'),
    minWidth: 78,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonDisabled: {
    opacity: 0.7,
  },
  applyButtonText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.3%'),
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  viewAllFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#FED7AA',
    marginTop: hp('1.2%'),
    paddingTop: hp('0.9%'),
  },
  viewAllFooterText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('2.9%'),
    color: '#EA580C',
  },

  // Unlockable Card State (Shortfall Highlight)
  unlockableCardWrapper: {
    marginHorizontal: wp('4%'),
    marginTop: hp('1%'),
    marginBottom: hp('0.5%'),
    borderRadius: 14,
  },
  unlockableCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF7',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#FCD34D',
    paddingVertical: hp('1.3%'),
    paddingHorizontal: wp('3.8%'),
    gap: wp('3%'),
  },
  unlockableIconWrap: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockableDetails: {
    flex: 1,
  },
  unlockableTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unlockableTitle: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.4%'),
    color: '#92400E',
  },
  unlockableCodePill: {
    backgroundColor: '#FEF3C7',
    borderWidth: 0.8,
    borderColor: '#FCD34D',
    borderStyle: 'dashed',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  unlockableCodeText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('2.6%'),
    color: '#B45309',
  },
  unlockableSubtitle: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.9%'),
    color: '#B45309',
    marginTop: 2,
  },

  // Default Entry State
  defaultRowWrapper: {
    marginHorizontal: wp('4%'),
    marginTop: hp('1%'),
    marginBottom: hp('0.5%'),
  },
  defaultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#FED7AA',
    borderRadius: 14,
    paddingVertical: hp('1.3%'),
    paddingHorizontal: wp('3.8%'),
    gap: wp('3%'),
  },
  defaultIconWrap: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    backgroundColor: '#FFF1E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultDetails: {
    flex: 1,
  },
  defaultTitle: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.6%'),
    color: '#111827',
  },
  defaultSubtitle: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3%'),
    color: '#6B7280',
    marginTop: 2,
  },
  defaultActionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  defaultActionText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('2.8%'),
    color: '#EA580C',
  },
});
