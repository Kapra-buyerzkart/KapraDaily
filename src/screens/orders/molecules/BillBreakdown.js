import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '@/styles/typography';
import {
  ACCENT,
  HAIRLINE,
  INK,
  SPACE,
  TYPE,
  MAX_FONT_SCALE,
} from '@/styles/homeTheme';
import DashedRule from '../atoms/DashedRule';
import { formatMoney } from '../tokens/format';

const Line = ({ label, value, positive }) => (
  <View style={styles.line}>
    <Text style={styles.label} maxFontSizeMultiplier={MAX_FONT_SCALE}>
      {label}
    </Text>
    <Text
      style={[styles.value, positive && styles.valuePositive]}
      maxFontSizeMultiplier={MAX_FONT_SCALE}
    >
      {value}
    </Text>
  </View>
);

const BillBreakdown = ({ bill }) => {
  if (!bill) return null;

  return (
    <View style={styles.block}>
      <DashedRule />

      <Line label="Item total" value={formatMoney(bill.itemTotal)} />

      {bill.savings > 0 && (
        <Line
          label="Discount"
          value={`- ${formatMoney(bill.savings)}`}
          positive
        />
      )}

      <Line
        label="Delivery charge"
        value={
          bill.deliveryCharge === 0 ? 'FREE' : formatMoney(bill.deliveryCharge)
        }
        positive={bill.deliveryCharge === 0}
      />

      {bill.couponDiscount > 0 && (
        <Line
          label="Coupon discount"
          value={`- ${formatMoney(bill.couponDiscount)}`}
          positive
        />
      )}

      {bill.giftCardAmount > 0 && (
        <Line
          label="Gift card applied"
          value={`- ${formatMoney(bill.giftCardAmount)}`}
          positive
        />
      )}

      {bill.bcoinsAppliedValue > 0 && (
        <Line
          label="Bcoins applied"
          value={`- ${formatMoney(bill.bcoinsAppliedValue)}`}
          positive
        />
      )}

      <View style={styles.totalRow}>
        <Text style={styles.totalText} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          To pay
        </Text>
        <Text style={styles.totalText} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          {formatMoney(bill.toPay)}
        </Text>
      </View>

      {bill.totalTax > 0 && (
        <Text style={styles.note} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          Inclusive of GST {formatMoney(bill.totalTax)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    marginTop: SPACE.base,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACE.xs + 1,
  },
  label: {
    ...TYPE.label,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
  },
  value: {
    ...TYPE.label,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.base,
  },
  valuePositive: {
    color: ACCENT.successText,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACE.sm,
    paddingTop: SPACE.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: HAIRLINE,
  },
  totalText: {
    ...TYPE.body,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
  },
  note: {
    ...TYPE.micro,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.regular,
    color: INK.faint,
    marginTop: SPACE.xs,
  },
});

export default React.memo(BillBreakdown);
