import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CART_SPACING } from '@/styles/cartTheme';

import { AmountPill, CoinSurface, CoinText, IconTile } from '../atoms';
import { COIN_ICON, TOKEN_ICON } from '../constants';
import { formatAmount, formatShortDate, toNumber } from '../utils';
import { PALETTE } from '../theme';

const HistoryRow = ({ item, isCoin, position = 'middle' }) => {
  const isCredit = String(item.transactionType).toLowerCase() === 'credit';

  return (
    <CoinSurface position={position} elevated={false} style={styles.row}>
      <IconTile
        size={38}
        tone={isCoin ? 'gold' : 'violet'}
        source={isCoin ? COIN_ICON : TOKEN_ICON}
        imageStyle={isCoin ? styles.coinIcon : styles.tokenIcon}
      />

      <View style={styles.copy}>
        <CoinText variant="bodyStrong" numberOfLines={2}>
          {item.description || 'Unknown transaction'}
        </CoinText>

        <View style={styles.metaRow}>
          <CoinText variant="caption" tone="muted" style={styles.meta}>
            {formatShortDate(item.transactionDate)}
          </CoinText>
          {item.orderId ? (
            <>
              <View style={styles.dot} />
              <CoinText
                variant="caption"
                tone="muted"
                style={styles.meta}
                numberOfLines={1}
              >
                Order #{item.orderId}
              </CoinText>
            </>
          ) : null}
        </View>
      </View>

      <AmountPill
        isCredit={isCredit}
        value={formatAmount(toNumber(item.amount))}
        unit={isCoin ? 'coins' : 'tokens'}
      />
    </CoinSurface>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: CART_SPACING.lg,
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
    marginHorizontal: CART_SPACING.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  meta: {
    flexShrink: 1,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: PALETTE.textFaint,
  },
});

export default React.memo(HistoryRow);
