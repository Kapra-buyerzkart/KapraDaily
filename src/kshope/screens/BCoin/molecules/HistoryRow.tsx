import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { AppText } from '../../../components/atoms';
import { AmountPill, CoinSurface, CoinTile } from '../atoms';
import { COIN_ICON, TOKEN_GLYPH } from '../constants';
import { HistoryItem, formatAmount, formatShortDate, toNumber } from '../utils';
import { PALETTE, SPACING } from '../theme';

const GLYPH_SIZE = 20;

interface HistoryRowProps {
  item: HistoryItem;
  isCoin: boolean;
  position?: 'single' | 'top' | 'middle' | 'bottom';
}

const HistoryRow: React.FC<HistoryRowProps> = ({
  item,
  isCoin,
  position = 'middle',
}) => {
  const isCredit = String(item.transactionType).toLowerCase() === 'credit';
  const description = item.description || 'Unknown transaction';
  const showOrderId =
    Boolean(item.orderId) && !(!isCoin && /\border\b/i.test(description));

  return (
    <CoinSurface position={position} elevated={false} style={styles.row}>
      <CoinTile size={38} tone={isCoin ? 'gold' : 'token'}>
        {isCoin ? (
          <Image source={COIN_ICON} style={styles.icon} />
        ) : (
          <MaterialCommunityIcons
            name={TOKEN_GLYPH}
            size={GLYPH_SIZE}
            color={PALETTE.token}
          />
        )}
      </CoinTile>

      <View style={styles.copy}>
        <AppText variant="bodyStrong" numberOfLines={2}>
          {description}
        </AppText>

        <View style={styles.metaRow}>
          <AppText variant="caption" tone="muted" style={styles.meta}>
            {formatShortDate(item.transactionDate)}
          </AppText>
          {showOrderId ? (
            <>
              <View style={styles.dot} />
              <AppText
                variant="caption"
                tone="muted"
                style={styles.meta}
                numberOfLines={1}
              >
                Order #{item.orderId}
              </AppText>
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

export default React.memo(HistoryRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: SPACING.lg,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  copy: {
    flex: 1,
    marginHorizontal: SPACING.md,
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
