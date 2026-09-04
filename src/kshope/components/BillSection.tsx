import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppText, Surface, Divider, IconDisc, SectionHeading } from './atoms';
import { UI_COLORS, UI_RADIUS, UI_SPACING, hp, wp } from '../theme/tokens';
import { AppTextTone } from './atoms/AppText';

export interface BillCalculations {
  mrpTotal?: number;
  itemTotal?: number;
  savings?: number;
  deliveryCharge?: number;
  totalTax?: number;
  couponDiscount?: number;
  giftCardAmount?: number;
  bcoinsAppliedValue?: number;
  totalBtokens?: number;
  totalSavings?: number;
  toPay?: number;
}

const money = (amount?: number) => `₹${Number(amount || 0).toFixed(2)}`;

interface BillRowProps {
  label: string;
  value: string;
  tone?: AppTextTone;
  strike?: string;
}

const BillRow: React.FC<BillRowProps> = ({
  label,
  value,
  tone = 'primary',
  strike,
}) => (
  <View style={styles.row}>
    <AppText variant="label" tone="muted" style={styles.rowLabel}>
      {label}
    </AppText>
    <View style={styles.valueWrap}>
      {strike ? (
        <AppText variant="caption" tone="faint" style={styles.strike}>
          {strike}
        </AppText>
      ) : null}
      <AppText variant="labelStrong" tone={tone}>
        {value}
      </AppText>
    </View>
  </View>
);

interface BillSectionProps {
  billCalculations: BillCalculations;
  bordered?: boolean;
}

const BillSection: React.FC<BillSectionProps> = ({
  billCalculations,
  bordered = false,
}) => {
  const {
    mrpTotal = 0,
    itemTotal = 0,
    savings = 0,
    deliveryCharge = 0,
    totalTax = 0,
    couponDiscount = 0,
    giftCardAmount = 0,
    bcoinsAppliedValue = 0,
    totalBtokens = 0,
    totalSavings = 0,
    toPay = 0,
  } = billCalculations;

  const discounts = [
    {
      key: 'coupon',
      label: 'Coupon discount',
      amount: Math.abs(couponDiscount),
    },
    {
      key: 'gift',
      label: 'Gift card applied',
      amount: Math.abs(giftCardAmount),
    },
    {
      key: 'coins',
      label: 'UD-coinsapplied',
      amount: Math.abs(bcoinsAppliedValue),
    },
  ].filter(entry => entry.amount > 0);

  const strikeTotal = mrpTotal || itemTotal + Math.abs(savings);
  const isDeliveryFree = deliveryCharge === 0;
  const hasSavings = totalSavings > 0;
  const hasTokens = totalBtokens > 0;

  return (
    <View style={styles.container}>
      <Surface inset={false} bordered={bordered} style={styles.surface}>
        <View style={styles.card}>
          <SectionHeading
            title="Bill summary"
            icon={
              <IconDisc size={wp('8%')} tone="ink">
                <MaterialCommunityIcons
                  name="receipt"
                  size={wp('4.4%')}
                  color={UI_COLORS.ink}
                />
              </IconDisc>
            }
            right={
              <AppText variant="micro" tone="faint">
                Incl. all taxes
              </AppText>
            }
          />

          <View style={styles.group}>
            <BillRow
              label="Item total"
              value={money(itemTotal)}
              strike={strikeTotal > itemTotal ? money(strikeTotal) : undefined}
            />
            <BillRow
              label="Delivery charge"
              value={isDeliveryFree ? 'FREE' : money(deliveryCharge)}
              tone={isDeliveryFree ? 'success' : 'primary'}
            />
            {totalTax > 0 && <BillRow label="Tax" value={money(totalTax)} />}
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
            <AppText variant="bodyStrong" style={styles.toPayLabel}>
              To pay
            </AppText>
            <AppText variant="priceLarge">{money(toPay)}</AppText>
          </View>
        </View>

        {(hasSavings || hasTokens) && (
          <View style={styles.footerStrip}>
            {hasSavings && (
              <View style={styles.footerItem}>
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={wp('4%')}
                  color={UI_COLORS.successDeep}
                />
                <AppText variant="captionStrong" tone="success">
                  Saved ₹{totalSavings.toFixed(0)}
                </AppText>
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
                  color={UI_COLORS.token}
                />
                <AppText variant="captionStrong" tone="token">
                  Earn {totalBtokens} UD-tokens
                </AppText>
              </View>
            )}
          </View>
        )}
      </Surface>
    </View>
  );
};

export default React.memo(BillSection);

const styles = StyleSheet.create({
  container: {
    marginTop: hp('1.6%'),
  },
  surface: {
    overflow: 'hidden',
  },
  card: {
    padding: UI_SPACING.lg,
  },
  group: {
    marginTop: UI_SPACING.md,
    gap: hp('1%'),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: UI_SPACING.md,
  },
  rowLabel: {
    flex: 1,
  },
  valueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.xs,
  },
  strike: {
    textDecorationLine: 'line-through',
  },
  rule: {
    marginTop: UI_SPACING.md,
  },
  dashedRule: {
    marginTop: UI_SPACING.md,
    marginBottom: 0,
  },
  toPayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: UI_SPACING.md,
    marginTop: UI_SPACING.md,
  },
  toPayLabel: {
    flex: 1,
  },
  footerStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UI_COLORS.successTint,
    paddingHorizontal: UI_SPACING.lg,
    paddingVertical: hp('1.1%'),
    gap: UI_SPACING.md,
    borderBottomLeftRadius: UI_RADIUS.card,
    borderBottomRightRadius: UI_RADIUS.card,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.xs + 2,
  },
  footerSplit: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: UI_COLORS.successEdge,
  },
});
