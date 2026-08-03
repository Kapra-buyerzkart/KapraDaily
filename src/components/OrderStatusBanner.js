import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import { INK, RADIUS, SPACE, MAX_FONT_SCALE } from '../styles/homeTheme';

// The three terminal-ish order states — cancelled, awaiting payment, delivered —
// share one card so the screen reads as a system rather than three unrelated
// treatments. Each leads with the fact, then immediately answers the only
// question that follows it: "what happened to my money?".
//
// Colour is confined to the icon well, the rules and the strip title. A fully
// saturated slab reads as an error/success toast, not as a settled order state.
const VARIANTS = {
  cancelled: {
    accent: '#D93025',
    tint: '#FEF3F2',
    edge: 'rgba(217,48,37,0.14)',
    icon: 'close',
    title: 'Order cancelled',
    helpLabel: 'Something wrong? Get help',
  },
  pending: {
    accent: '#B45309',
    tint: '#FFF8EB',
    edge: 'rgba(180,83,9,0.14)',
    icon: 'time-outline',
    title: 'Payment pending',
    helpLabel: 'Payment issue? Get help',
  },
  delivered: {
    accent: '#0B7A3D',
    tint: '#E7F7EE',
    edge: 'rgba(11,122,61,0.14)',
    icon: 'checkmark',
    title: 'Order delivered',
    helpLabel: 'Issue with this order? Get help',
  },
};

const STRIP_NEUTRAL = '#F0F1F4';

const buildStrip = ({
  variant,
  amount,
  paymentLabel,
  isRefundApplicable,
  itemCount,
  canRetryPayment,
}) => {
  const money = `₹${Number(amount || 0).toFixed(2)}`;

  if (variant === 'cancelled') {
    return isRefundApplicable
      ? {
          icon: 'wallet-outline',
          title: `${money} refund initiated`,
          hint: 'Credited to your original payment method in 3–5 business days',
          positive: true,
        }
      : {
          icon: 'information-circle-outline',
          title: 'No amount was charged',
          hint: 'This was a pay-on-delivery order, so there is nothing to refund',
          positive: false,
        };
  }

  if (variant === 'pending') {
    return {
      icon: 'hourglass-outline',
      title: `${money} awaiting confirmation`,
      // Only point at the retry button when the screen is actually rendering one.
      hint: canRetryPayment
        ? 'If the amount was deducted it will reflect shortly. Otherwise retry the payment below.'
        : 'If the amount was deducted it will reflect shortly. Your order is confirmed the moment it clears.',
      positive: true,
    };
  }

  return {
    icon: 'receipt-outline',
    title: `${money} paid`,
    hint: [paymentLabel, itemCount ? `${itemCount} items` : null]
      .filter(Boolean)
      .join(' · '),
    positive: true,
  };
};

const OrderStatusBanner = ({
  variant = 'cancelled',
  timestampLabel,
  reason,
  amount = 0,
  paymentLabel,
  itemCount,
  isRefundApplicable = false,
  canRetryPayment = false,
  onHelpPress,
}) => {
  const theme = VARIANTS[variant] || VARIANTS.cancelled;
  const strip = buildStrip({
    variant,
    amount,
    paymentLabel,
    isRefundApplicable,
    itemCount,
    canRetryPayment,
  });

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.tint, borderColor: theme.edge },
      ]}
    >
      <View style={styles.headRow}>
        <View style={[styles.iconWell, { borderColor: theme.edge }]}>
          <Ionicons name={theme.icon} size={wp('4.6%')} color={theme.accent} />
        </View>
        <View style={styles.headText}>
          <Text style={styles.title} maxFontSizeMultiplier={MAX_FONT_SCALE}>
            {theme.title}
          </Text>
          {!!timestampLabel && (
            <Text
              style={styles.subtitle}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {timestampLabel}
            </Text>
          )}
        </View>
      </View>

      {!!reason && (
        <View style={[styles.reasonRow, { borderTopColor: theme.edge }]}>
          <Text
            style={styles.reasonLabel}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            Reason
          </Text>
          <Text
            style={styles.reasonValue}
            numberOfLines={2}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {reason}
          </Text>
        </View>
      )}

      <View style={styles.strip}>
        <View
          style={[
            styles.stripIcon,
            { backgroundColor: strip.positive ? theme.tint : STRIP_NEUTRAL },
          ]}
        >
          <Ionicons
            name={strip.icon}
            size={wp('3.8%')}
            color={strip.positive ? theme.accent : INK.muted}
          />
        </View>
        <View style={styles.stripText}>
          <Text
            style={[
              styles.stripTitle,
              { color: strip.positive ? theme.accent : INK.base },
            ]}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {strip.title}
          </Text>
          {!!strip.hint && (
            <Text
              style={styles.stripHint}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {strip.hint}
            </Text>
          )}
        </View>
      </View>

      {!!onHelpPress && (
        <TouchableOpacity
          style={[styles.helpRow, { borderTopColor: theme.edge }]}
          onPress={onHelpPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={theme.helpLabel}
        >
          <Text
            style={[styles.helpText, { color: theme.accent }]}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {theme.helpLabel}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={wp('3.6%')}
            color={theme.accent}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: wp('90.7%'),
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.8%'),
    marginBottom: hp('1.5%'),
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWell: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  headText: {
    flex: 1,
    marginLeft: wp('3%'),
  },
  title: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.1%'),
    color: INK.strong,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.1%'),
    color: INK.muted,
    marginTop: hp('0.3%'),
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: hp('1.4%'),
    paddingTop: hp('1.4%'),
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  reasonLabel: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.1%'),
    color: INK.muted,
    marginRight: wp('3%'),
  },
  reasonValue: {
    flex: 1,
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.1%'),
    color: INK.base,
    textAlign: 'right',
  },
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.sm,
    padding: SPACE.md,
    marginTop: hp('1.4%'),
  },
  stripIcon: {
    width: wp('7.4%'),
    height: wp('7.4%'),
    borderRadius: wp('3.7%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripText: {
    flex: 1,
    marginLeft: wp('2.8%'),
  },
  stripTitle: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.4%'),
  },
  stripHint: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.9%'),
    color: INK.muted,
    marginTop: hp('0.2%'),
    lineHeight: wp('4.1%'),
  },
  helpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('1.2%'),
    paddingTop: hp('1.2%'),
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  helpText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.2%'),
    marginRight: wp('1%'),
  },
});

export default React.memo(OrderStatusBanner);
