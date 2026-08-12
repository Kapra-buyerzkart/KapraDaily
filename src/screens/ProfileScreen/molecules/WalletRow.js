import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import icons from '@/assets/icons';
import { useCountUp } from '@/hooks/useCountUp';
import { ProfileText, PressableScale, IconDisc, RowChevron } from '../atoms';
import { BALANCE_COUNT_UP } from '../motion';
import { CART_SPACING, wp } from '@/styles/cartTheme';

const formatCoins = coins => Number(coins || 0).toFixed(2);

const coinRate = wallet => {
  const rate = Number(wallet?.bCoinValue);
  return !rate || Number.isNaN(rate) ? null : rate;
};

const WalletRow = ({ walletData, onPress }) => {
  const wallet = walletData?.wallet;
  const coins = Number(wallet?.bCoins || 0);
  const rate = coinRate(wallet);

  const counted = useCountUp(coins, BALANCE_COUNT_UP);
  const balance = formatCoins(counted);
  const worth = rate === null ? null : `₹${(counted * rate).toFixed(2)}`;

  return (
    <PressableScale
      to={0.99}
      contentStyle={styles.row}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`UD Wallet, ${formatCoins(coins)} UD Coins`}
    >
      <IconDisc size={wp('9.5%')} tone="neutral">
        <Image source={icons.udCoinUpdated} style={styles.coin} />
      </IconDisc>

      <View style={styles.copy}>
        <ProfileText variant="micro" tone="muted" style={styles.label}>
          UD WALLET
        </ProfileText>
        <View style={styles.balanceRow}>
          <ProfileText variant="priceLarge" numberOfLines={1}>
            {balance}
          </ProfileText>
          <ProfileText variant="micro" tone="muted">
            UD Coins
          </ProfileText>
          {!!worth && (
            <ProfileText variant="micro" tone="faint" numberOfLines={1}>
              · {worth}
            </ProfileText>
          )}
        </View>
      </View>

      <RowChevron />
    </PressableScale>
  );
};

export default React.memo(WalletRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.md,
    paddingHorizontal: CART_SPACING.lg,
    paddingVertical: CART_SPACING.md + 2,
  },
  coin: {
    width: wp('6%'),
    height: wp('6%'),
    resizeMode: 'contain',
  },
  copy: {
    flex: 1,
    gap: 1,
  },
  label: {
    letterSpacing: 0.6,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: CART_SPACING.xs,
  },
});
