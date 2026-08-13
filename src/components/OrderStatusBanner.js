import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import { INK, RADIUS, MAX_FONT_SCALE } from '../styles/homeTheme';

const VARIANTS = {
  cancelled: {
    accent: '#D93025',
    tint: '#FEF3F2',
    icon: 'close',
    title: 'Order cancelled',
    helpLabel: 'Something wrong? Get help',
  },
  pending: {
    accent: '#B45309',
    tint: '#FFF8EB',
    icon: 'time-outline',
    title: 'Payment pending',
    helpLabel: 'Payment issue? Get help',
  },
  delivered: {
    accent: '#0B7A3D',
    tint: '#E7F7EE',
    icon: 'checkmark',
    title: 'Order delivered',
    helpLabel: 'Issue with this order? Get help',
  },
};

const STRIP_NEUTRAL = '#F1F2F5';

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
    <View style={[styles.card, { backgroundColor: theme.tint }]}>
      <View style={styles.headRow}>
        <View style={styles.iconWell}>
          <Ionicons name={theme.icon} size={wp('5.2%')} color={theme.accent} />
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
        <View style={styles.reasonRow}>
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
            size={wp('4%')}
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
          style={styles.helpRow}
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
    borderRadius: RADIUS.md,
    marginHorizontal: wp('3.6%'),
    paddingHorizontal: wp('4.2%'),
    paddingVertical: hp('1.9%'),
    marginBottom: hp('1.2%'),
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWell: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: RADIUS.pill,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headText: {
    flex: 1,
    marginLeft: wp('3%'),
  },
  title: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.6%'),
    color: INK.strong,
    letterSpacing: -0.4,
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
    marginTop: hp('1.6%'),
  },
  reasonLabel: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.1%'),
    color: INK.muted,
    marginRight: wp('3%'),
  },
  reasonValue: {
    flex: 1,
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.1%'),
    color: INK.base,
    textAlign: 'right',
  },
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.sm,
    padding: wp('3%'),
    marginTop: hp('1.5%'),
  },
  stripIcon: {
    width: wp('7.6%'),
    height: wp('7.6%'),
    borderRadius: RADIUS.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripText: {
    flex: 1,
    marginLeft: wp('2.8%'),
  },
  stripTitle: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.4%'),
  },
  stripHint: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('2.9%'),
    color: INK.muted,
    marginTop: hp('0.3%'),
    lineHeight: wp('4.1%'),
  },
  helpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('1.4%'),
  },
  helpText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.2%'),
    marginRight: wp('1%'),
  },
});

export default React.memo(OrderStatusBanner);
