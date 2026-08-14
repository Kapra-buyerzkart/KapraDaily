import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartText from './atoms/CartText';
import Surface from './atoms/Surface';
import Divider from './atoms/Divider';
import SectionHeading from './atoms/SectionHeading';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  wp,
  hp,
} from '../../../styles/cartTheme';
import icons from '../../../assets/icons';

const money = amount => `₹${Number(amount || 0).toFixed(2)}`;

const BillRow = ({ label, value, tone = 'primary', strike }) => (
  <View style={styles.row}>
    <CartText variant="label" tone="muted" style={styles.rowLabel}>
      {label}
    </CartText>
    <View style={styles.valueWrap}>
      {strike ? (
        <CartText variant="caption" tone="faint" style={styles.strike}>
          {strike}
        </CartText>
      ) : null}
      <CartText variant="labelStrong" tone={tone}>
        {value}
      </CartText>
    </View>
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
    totalBtokens = 0,
    totalSavings = 0,
    toPay = 0,
  } = billCalculations;

  const discounts = [
    { key: 'item', label: 'Item discount', amount: savings },
    { key: 'coupon', label: 'Coupon discount', amount: couponDiscount },
    { key: 'gift', label: 'Gift card applied', amount: giftCardAmount },
    { key: 'coins', label: 'UD Coins applied', amount: bcoinsAppliedValue },
  ].filter(entry => entry.amount > 0);

  const isDeliveryFree = deliveryCharge === 0;
  const hasSavings = totalSavings > 0;
  const hasTokens = totalBtokens > 0;

  return (
    <View style={styles.container}>
      <Surface>
        <View style={styles.card}>
          <SectionHeading
            title="Bill summary"
            icon={icons.billSummary}
            right={
              <CartText variant="micro" tone="faint">
                Incl. all taxes
              </CartText>
            }
          />

          <View style={styles.group}>
            <BillRow label="Item total" value={money(itemTotal)} />
            <BillRow
              label="Delivery charge"
              value={isDeliveryFree ? 'FREE' : money(deliveryCharge)}
              tone={isDeliveryFree ? 'success' : 'primary'}
            />
          </View>

          {discounts.length > 0 && (
            <>
              <Divider style={styles.rule} />
              <View style={styles.group}>
                {discounts.map(entry => (
                  <BillRow
                    key={entry.key}
                    label={entry.label}
                    value={`− ${money(entry.amount)}`}
                    tone="success"
                  />
                ))}
              </View>
            </>
          )}

          <Divider dashed style={styles.dashedRule} />

          <View style={styles.toPayRow}>
            <View style={styles.toPayLabel}>
              <CartText variant="bodyStrong">To pay</CartText>
            </View>
            <CartText variant="priceLarge">₹{toPay.toFixed()}</CartText>
          </View>
        </View>

        {(hasSavings || hasTokens) && (
          <View style={styles.footerStrip}>
            {hasSavings && (
              <View style={styles.footerItem}>
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={wp('4%')}
                  color={CART_COLORS.successDeep}
                />
                <CartText variant="captionStrong" tone="success">
                  Saved ₹{totalSavings.toFixed(0)}
                </CartText>
              </View>
            )}

            {hasSavings && hasTokens ? (
              <View style={styles.footerSplit} />
            ) : null}

            {hasTokens && (
              <View style={styles.footerItem}>
                <MaterialCommunityIcons
                  name="star-four-points"
                  size={wp('4%')}
                  color={CART_COLORS.token}
                />
                <CartText variant="captionStrong" tone="token">
                  Earn {totalBtokens} UD Tokens
                </CartText>
              </View>
            )}
          </View>
        )}
      </Surface>
    </View>
  );
};

export default React.memo(BillSummary);

const styles = StyleSheet.create({
  container: {
    marginTop: hp('2.2%'),
  },
  card: {
    padding: CART_SPACING.lg,
  },
  group: {
    marginTop: CART_SPACING.md,
    gap: hp('1%'),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: CART_SPACING.md,
  },
  rowLabel: {
    flex: 1,
  },
  valueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs,
  },
  strike: {
    textDecorationLine: 'line-through',
  },
  rule: {
    marginTop: CART_SPACING.md,
  },
  dashedRule: {
    marginTop: CART_SPACING.md,
    marginBottom: 0,
  },
  toPayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: CART_SPACING.md,
    marginTop: CART_SPACING.md,
  },
  toPayLabel: {
    flex: 1,
    gap: 1,
  },
  footerStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CART_COLORS.successTint,
    paddingHorizontal: CART_SPACING.lg,
    paddingVertical: hp('1.1%'),
    gap: CART_SPACING.md,
    borderBottomLeftRadius: CART_RADIUS.card,
    borderBottomRightRadius: CART_RADIUS.card,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs + 2,
  },
  footerSplit: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(11,122,61,0.28)',
  },
});
