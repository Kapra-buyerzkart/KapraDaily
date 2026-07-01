import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
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

const BillRow = ({ label, value, isGreen }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, isGreen && { color: CART_COLORS.success }]}>
      {value}
    </Text>
  </View>
);

const BillSummary = ({ billCalculations }) => {
  const {
    itemTotal = 0,
    savings = 0,
    deliveryCharge = 0,
    couponDiscount = 0,
    giftCardAmount = 0,
    bcoinsAppliedValue = 0,
    totalSavings = 0,
    toPay = 0,
  } = billCalculations;

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Image style={{ top: -4 }} source={icons.billSummary} />
        <Text style={styles.title}>Bill summary</Text>
      </View>

      <View style={styles.card}>
        <BillRow label="Item total" value={`₹${itemTotal.toFixed(2)}`} />
        {savings > 0 && (
          <BillRow
            label="Discount"
            value={`- ₹${savings.toFixed(2)}`}
            isGreen
          />
        )}
        <BillRow
          label="Delivery charge"
          value={
            deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`
          }
          isGreen={deliveryCharge === 0}
        />
        {couponDiscount > 0 && (
          <BillRow
            label="Coupon discount"
            value={`- ₹${couponDiscount.toFixed(2)}`}
            isGreen
          />
        )}
        {giftCardAmount > 0 && (
          <BillRow
            label="Gift card applied"
            value={`- ₹${giftCardAmount.toFixed(2)}`}
            isGreen
          />
        )}
        {bcoinsAppliedValue > 0 && (
          <BillRow
            label="UD-coins applied"
            value={`- ₹${bcoinsAppliedValue.toFixed(2)}`}
            isGreen
          />
        )}

        {totalSavings > 0 && (
          <View style={styles.savingsBanner}>
            <Text style={styles.savingsText}>You have saved</Text>
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsBadgeText}>
                ₹{totalSavings.toFixed(0)}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.toPayRow}>
          <Text style={styles.toPayLabel}>To Pay</Text>
          <Text style={styles.toPayValue}>₹{toPay.toFixed()}</Text>
        </View>
      </View>
    </View>
  );
};

export default React.memo(BillSummary);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: CART_SPACING.lg,
    marginTop: hp('2.5%'),
  },
  title: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.8%'),
    color: CART_COLORS.textPrimary,
    marginBottom: hp('1%'),
  },
  card: {
    backgroundColor: CART_COLORS.card,
    borderRadius: CART_RADIUS.card,
    padding: CART_SPACING.lg,
    // ...CART_SHADOW,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  label: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.4%'),
    color: CART_COLORS.textMuted,
  },
  value: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.4%'),
    color: CART_COLORS.textPrimary,
  },
  savingsBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('0.5%'),
  },
  savingsText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.4%'),
    color: CART_COLORS.success,
  },
  savingsBadge: {
    backgroundColor: CART_COLORS.success,
    borderRadius: 6,
    paddingHorizontal: CART_SPACING.sm,
    paddingVertical: 2,
  },
  savingsBadgeText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.1%'),
    color: '#FFFFFF',
  },
  divider: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: CART_COLORS.border,
    marginTop: hp('1.5%'),
  },
  toPayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1.5%'),
  },
  toPayLabel: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.2%'),
    color: CART_COLORS.textGray,
  },
  toPayValue: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.5%'),
    color: CART_COLORS.textPrimary,
  },
});
