import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CART_COLORS, CART_FONTS, fs, s } from '../cartRedesignTheme';

type Props = {
  billCalculations: {
    mrpTotal?: number;
    itemTotal?: number;
    savings?: number;
    deliveryCharge?: number;
    couponDiscount?: number;
    giftCardAmount?: number;
    bcoinsAppliedValue?: number;
    totalTax?: number;
    totalSavings?: number;
    toPay: number;
  };
};

export const CartSummarySection: React.FC<Props> = ({ billCalculations }) => {
  const subtotal = billCalculations.mrpTotal || billCalculations.itemTotal || 0;
  const shipping = billCalculations.deliveryCharge || 0;
  const youSaved = billCalculations.totalSavings || billCalculations.savings || 0;
  const couponDiscount = billCalculations.couponDiscount || 0;
  const bcoinsDiscount = billCalculations.bcoinsAppliedValue || 0;
  const totalAmount = billCalculations.toPay || 0;
  const taxAmount = billCalculations.totalTax || 500;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Cart Summary</Text>

      {/* Subtotal */}
      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>₹{subtotal.toLocaleString('en-IN')}</Text>
      </View>

      {/* Shipping Charge */}
      <View style={styles.row}>
        <Text style={styles.label}>Shipping Charge</Text>
        <Text style={[styles.value, styles.greenValue]}>
          {shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}
        </Text>
      </View>

      {/* You Saved */}
      {youSaved > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>You Saved</Text>
          <Text style={[styles.value, styles.greenValue]}>
            - ₹{youSaved.toLocaleString('en-IN')}
          </Text>
        </View>
      )}

      {/* Coupon Discount */}
      {couponDiscount > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Coupon Discount</Text>
          <Text style={[styles.value, styles.greenValue]}>
            - ₹{couponDiscount.toLocaleString('en-IN')}
          </Text>
        </View>
      )}

      {/* BCoins Discount */}
      {bcoinsDiscount > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>BCoins Discount</Text>
          <Text style={[styles.value, styles.greenValue]}>
            - ₹{bcoinsDiscount.toLocaleString('en-IN')}
          </Text>
        </View>
      )}

      {/* Divider */}
      <View style={styles.divider} />

      {/* Total Amount */}
      <View style={styles.totalRow}>
        <View>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.gstText}>
            Inclusive of GST ₹{taxAmount.toLocaleString('en-IN')}/-
          </Text>
        </View>
        <Text style={styles.totalValue}>₹{totalAmount.toLocaleString('en-IN')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: s(16),
    marginBottom: s(26),
  },
  heading: {
    fontFamily: CART_FONTS.serifBold,
    fontSize: fs(22),
    color: CART_COLORS.textDark,
    marginBottom: s(16),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: s(10),
  },
  label: {
    fontFamily: CART_FONTS.sansRegular,
    fontSize: fs(12.5),
    color: '#686868',
  },
  value: {
    fontFamily: CART_FONTS.sansMedium,
    fontSize: fs(13),
    color: CART_COLORS.textDark,
  },
  greenValue: {
    color: '#0E8A44',
    fontFamily: CART_FONTS.sansBold,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0ECE7',
    marginVertical: s(14),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  totalLabel: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(14.5),
    color: CART_COLORS.textDark,
  },
  gstText: {
    fontFamily: CART_FONTS.sansRegular,
    fontSize: fs(10.5),
    color: '#7A7A7A',
    marginTop: s(3),
  },
  totalValue: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(20),
    color: CART_COLORS.textDark,
  },
});
