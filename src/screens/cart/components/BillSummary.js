import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import icons from '../../../assets/icons';
import { FONTS } from '@/styles/typography';
import { wp, hp } from '../../../styles/cartTheme';

const money = amount => `₹${Number(amount || 0).toFixed(2)}`;

const BillRow = ({ label, value, tone = 'primary', strike }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <View style={styles.valueWrap}>
      {strike ? <Text style={styles.strike}>{strike}</Text> : null}
      <Text
        style={[
          styles.rowValue,
          tone === 'success' && styles.successValue,
          tone === 'muted' && styles.mutedValue,
        ]}
      >
        {value}
      </Text>
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
  const displaySavings = totalSavings > 0 ? totalSavings : savings;
  const tokensEarned = totalBtokens > 0 ? totalBtokens : '10.6';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.titleWrap}>
            <Image
              source={icons.summaryBill || icons.billSummary}
              style={styles.billIcon}
            />
            <Text style={styles.title}>Bill summary</Text>
          </View>
          <Text style={styles.taxesText}>Incl. all taxes</Text>
        </View>

        {/* Bill Rows */}
        <View style={styles.group}>
          <BillRow label="Item total" value={money(itemTotal)} />
          <BillRow
            label="Delivery charge"
            value={isDeliveryFree ? 'FREE' : money(deliveryCharge)}
            tone={isDeliveryFree ? 'success' : 'primary'}
          />
          {discounts.map(entry => (
            <BillRow
              key={entry.key}
              label={entry.label}
              value={`- ${money(entry.amount)}`}
              tone="success"
            />
          ))}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* To pay row */}
        <View style={styles.toPayRow}>
          <Text style={styles.toPayLabel}>To pay</Text>
          <Text style={styles.toPayValue}>₹{Math.round(toPay)}</Text>
        </View>
      </View>

      {/* Savings & Earnings Banner */}
      <View style={styles.bottomBanner}>
        <View style={styles.bannerLeft}>
          <Ionicons name="checkmark-circle" size={18} color="#15803D" />
          <Text style={styles.savedText}>
            Saved ₹{Math.round(displaySavings)}
          </Text>
        </View>

        <View style={styles.bannerRight}>
          <MaterialCommunityIcons
            name="star-four-points"
            size={14}
            color="#4F46E5"
          />
          <Text style={styles.tokenEarnText}>
            Earn {tokensEarned} UD Tokens
          </Text>
        </View>
      </View>
    </View>
  );
};

export default React.memo(BillSummary);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginTop: hp('1.5%'),
    width: '100%',
  },
  content: {
    paddingHorizontal: wp('4%'),
    paddingTop: hp('1%'),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  billIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  title: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.3%'),
    color: '#000000',
  },
  taxesText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.1%'),
    color: '#9CA3AF',
  },
  group: {
    gap: hp('1.2%'),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.4%'),
    color: '#4B5563',
  },
  valueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  strike: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3%'),
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  rowValue: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.6%'),
    color: '#000000',
  },
  successValue: {
    color: '#15803D',
  },
  mutedValue: {
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
    marginTop: hp('2%'),
    marginBottom: hp('1.5%'),
  },
  toPayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toPayLabel: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4%'),
    color: '#000000',
  },
  toPayValue: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.5%'),
    color: '#000000',
  },
  bottomBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ECFDF5',
    marginHorizontal: wp('4%'),
    marginTop: hp('2%'),
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  savedText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.3%'),
    color: '#15803D',
  },
  bannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tokenEarnText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.2%'),
    color: '#4F46E5',
  },
});
