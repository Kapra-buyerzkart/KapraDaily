import React from 'react';
import { View, StyleSheet } from 'react-native';
import OrderText from '../atoms/OrderText';
import Divider from '../atoms/Divider';
import { SPACING } from '../theme';
import { formatMoney } from '../tokens/format';

const Line = ({ label, value, positive }) => (
  <View style={styles.line}>
    <OrderText variant="label" tone="muted" style={styles.label}>
      {label}
    </OrderText>
    <OrderText variant="labelStrong" tone={positive ? 'success' : 'primary'}>
      {value}
    </OrderText>
  </View>
);

const BillBreakdown = ({ bill }) => {
  if (!bill) return null;

  const discounts = [
    { key: 'item', label: 'Item discount', amount: bill.savings },
    { key: 'coupon', label: 'Coupon discount', amount: bill.couponDiscount },
    { key: 'gift', label: 'Gift card applied', amount: bill.giftCardAmount },
    { key: 'coins', label: 'Bcoins applied', amount: bill.bcoinsAppliedValue },
  ].filter(entry => entry.amount > 0);

  const freeDelivery = bill.deliveryCharge === 0;

  return (
    <View style={styles.block}>
      <Divider dashed style={styles.rule} />

      <View style={styles.group}>
        <Line label="Item total" value={formatMoney(bill.itemTotal)} />
        <Line
          label="Delivery charge"
          value={freeDelivery ? 'FREE' : formatMoney(bill.deliveryCharge)}
          positive={freeDelivery}
        />
      </View>

      {discounts.length > 0 && (
        <>
          <Divider style={styles.rule} />
          <View style={styles.group}>
            {discounts.map(entry => (
              <Line
                key={entry.key}
                label={entry.label}
                value={`− ${formatMoney(entry.amount)}`}
                positive
              />
            ))}
          </View>
        </>
      )}

      <Divider style={styles.rule} />

      <View style={styles.totalRow}>
        <OrderText variant="bodyStrong">To pay</OrderText>
        <OrderText variant="price">{formatMoney(bill.toPay)}</OrderText>
      </View>

      {bill.totalTax > 0 && (
        <OrderText variant="micro" tone="faint" style={styles.note}>
          Inclusive of GST {formatMoney(bill.totalTax)}
        </OrderText>
      )}
    </View>
  );
};

export default React.memo(BillBreakdown);

const styles = StyleSheet.create({
  block: {
    marginTop: SPACING.md,
  },
  group: {
    gap: SPACING.sm,
  },
  rule: {
    marginVertical: SPACING.md,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.md,
  },
  label: {
    flex: 1,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.md,
  },
  note: {
    marginTop: SPACING.xs,
  },
});
