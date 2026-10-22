import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '@/styles/typography';
import { wp, hp, hitSlopTo } from '../../../styles/cartTheme';

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

const CouponSpotlightOverlay = ({
  visible = false,
  coupon,
  isApplying = false,
  onApply,
  onDismiss,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.95);
    }
  }, [visible, fadeAnim, scaleAnim]);

  if (!visible || !coupon) {
    return null;
  }

  const estimatedSavings = Math.round(coupon.estimatedDiscount || 0);
  const expiry = formatExpiry(coupon.validTo);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      {/* Dimmed Tinted Backdrop */}
      <TouchableWithoutFeedback onPress={onDismiss}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <Animated.View
              style={[
                styles.contentContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              {/* 1. Floating Pointer Tooltip Bubble */}
              <View style={styles.tooltipBubble}>
                <View style={styles.tooltipTopRow}>
                  <View style={styles.tooltipBadge}>
                    <MaterialCommunityIcons
                      name="star-four-points"
                      size={13}
                      color="#EA580C"
                    />
                    <Text style={styles.tooltipBadgeText}>
                      SPECIAL OFFER UNLOCKED
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onDismiss}
                    style={styles.closeBtn}
                    hitSlop={hitSlopTo(10)}
                  >
                    <Feather name="x" size={18} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.tooltipTitle}>
                  {estimatedSavings > 0
                    ? `Save ₹${estimatedSavings} on your cart!`
                    : 'Exclusive offer for your order!'}
                </Text>

                <Text style={styles.tooltipSubtitle}>
                  We found the highest saving coupon for your cart. Tap Apply
                  below to claim your discount instantly!
                </Text>
              </View>

              {/* Downward Pointer Arrow */}
              <View style={styles.arrowContainer}>
                <View style={styles.arrowDown} />
              </View>

              {/* 2. Spotlighted Hero Coupon Card (Flat, Crisp, No Shadows, 100% Width) */}
              <View style={styles.spotlightCard}>
                {/* Spotlight Card Header */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.codePill}>
                    <MaterialCommunityIcons
                      name="ticket-percent"
                      size={14}
                      color="#EA580C"
                    />
                    <Text
                      style={styles.codePillText}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {coupon.code}
                    </Text>
                  </View>

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

                {/* Title & Description */}
                <Text style={styles.offerTitle} numberOfLines={2}>
                  {coupon.title || 'Special discount offer'}
                </Text>
                {coupon.description ? (
                  <Text style={styles.offerDesc} numberOfLines={2}>
                    {coupon.description}
                  </Text>
                ) : null}

                {/* Meta items */}
                <View style={styles.metaRow}>
                  {coupon.minOrderAmount > 0 && (
                    <View style={styles.metaItem}>
                      <MaterialCommunityIcons
                        name="basket-outline"
                        size={12}
                        color="#6B7280"
                      />
                      <Text style={styles.metaItemText}>
                        Min order ₹{coupon.minOrderAmount}
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
                      <Text style={styles.metaItemText}>
                        Expires {expiry}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Spotlight Apply CTA Button */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  disabled={isApplying}
                  onPress={() => onApply?.(coupon.code)}
                  style={styles.applyButton}
                >
                  {isApplying ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <View style={styles.applyButtonContent}>
                      <MaterialCommunityIcons
                        name="lightning-bolt"
                        size={16}
                        color="#FFFFFF"
                      />
                      <Text style={styles.applyButtonText}>
                        {estimatedSavings > 0
                          ? `APPLY & SAVE ₹${estimatedSavings}`
                          : 'APPLY THIS OFFER'}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* 3. Dismiss Hint */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onDismiss}
                style={styles.dismissBtn}
                hitSlop={hitSlopTo(12)}
              >
                <Text style={styles.dismissBtnText}>
                  Got it, dismiss • or tap anywhere
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default React.memo(CouponSpotlightOverlay);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 29, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  contentContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  // Tooltip Speech Bubble (Flat card, NO shadows)
  tooltipBubble: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: wp('4.5%'),
    paddingTop: hp('1.8%'),
    paddingBottom: hp('1.6%'),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tooltipTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('0.8%'),
  },
  tooltipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 0.8,
    borderColor: '#FED7AA',
  },
  tooltipBadgeText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('2.6%'),
    color: '#EA580C',
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 2,
  },
  tooltipTitle: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.6%'),
    color: '#0F172A',
    marginBottom: 4,
  },
  tooltipSubtitle: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.2%'),
    color: '#475569',
    lineHeight: wp('4.6%'),
  },
  // Downward Pointer Arrow
  arrowContainer: {
    alignItems: 'center',
    width: '100%',
    height: 9,
    zIndex: 2,
  },
  arrowDown: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderTopWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
  // Spotlight Card (Clean, flat, solid white, NO shadows, NO double border)
  spotlightCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FB923C',
    padding: wp('4.2%'),
    marginTop: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
    marginBottom: hp('1%'),
  },
  codePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF1E9',
    borderWidth: 1,
    borderColor: '#FB923C',
    borderStyle: 'dashed',
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flex: 1,
    marginRight: 6,
  },
  codePillText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.2%'),
    color: '#EA580C',
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  savingsCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#16A34A',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 6,
    flexShrink: 0,
  },
  savingsCalloutText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('2.9%'),
    color: '#FFFFFF',
  },
  offerTitle: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4%'),
    color: '#111827',
    marginTop: 2,
  },
  offerDesc: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.1%'),
    color: '#4B5563',
    marginTop: 4,
    lineHeight: wp('4.4%'),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    marginBottom: hp('1%'),
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaItemText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.8%'),
    color: '#6B7280',
  },
  // Apply Button (Solid vibrant orange, full width, centered)
  applyButton: {
    width: '100%',
    minHeight: 46,
    backgroundColor: '#EA580C',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: wp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  applyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  applyButtonText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.5%'),
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  // Dismiss Button
  dismissBtn: {
    marginTop: hp('2%'),
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('4%'),
  },
  dismissBtnText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.2%'),
    color: '#CBD5E1',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
