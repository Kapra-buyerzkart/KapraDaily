import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { FONTS } from '@/styles/typography';

import { COIN_ICON, TOKEN_ICON } from '../constants';
import { formatAmount, formatShortDate, toNumber } from '../utils';
import { PALETTE, RADIUS } from '../theme';

const HistoryRow = ({ item, isCoin }) => {
  const isCredit = String(item.transactionType).toLowerCase() === 'credit';
  const amount = toNumber(item.amount);

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.iconTile,
          { backgroundColor: isCoin ? PALETTE.goldTint : PALETTE.violetTint },
        ]}
      >
        <Image
          source={isCoin ? COIN_ICON : TOKEN_ICON}
          style={isCoin ? styles.coinIcon : styles.tokenIcon}
        />
      </View>

      <View style={styles.copy}>
        <Text style={styles.title} numberOfLines={2}>
          {item.description || 'Unknown transaction'}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.date}>{formatShortDate(item.transactionDate)}</Text>
          {item.orderId ? (
            <>
              <View style={styles.dot} />
              <Text style={styles.date} numberOfLines={1}>
                Order #{item.orderId}
              </Text>
            </>
          ) : null}
        </View>
      </View>

      <View
        style={[
          styles.amountPill,
          {
            backgroundColor: isCredit ? PALETTE.creditTint : PALETTE.debitTint,
          },
        ]}
      >
        <Text
          style={[
            styles.amount,
            { color: isCredit ? PALETTE.credit : PALETTE.debit },
          ]}
        >
          {isCredit ? '+' : ''}
          {formatAmount(amount)}
        </Text>
        <Text
          style={[
            styles.unit,
            { color: isCredit ? PALETTE.credit : PALETTE.debit },
          ]}
        >
          {isCoin ? 'coins' : 'tokens'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: '92%',
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: PALETTE.line,
  },
  iconTile: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  tokenIcon: {
    width: 22,
    height: 15,
    resizeMode: 'contain',
  },
  copy: {
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: 13.5,
    lineHeight: 18,
    color: PALETTE.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  date: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: 11.5,
    color: PALETTE.textMuted,
    flexShrink: 1,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: PALETTE.textMuted,
  },
  amountPill: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    minWidth: 78,
  },
  amount: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: 13.5,
  },
  unit: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: 9.5,
    opacity: 0.8,
    marginTop: 1,
  },
});

export default React.memo(HistoryRow);
