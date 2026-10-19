import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONTS } from '@/styles/typography';

const UD_COIN_ICON = require('../../../assets/icons/udcoinUpdated.png');

const formatCoins = coins => Number(coins || 0).toFixed(2);

const coinRate = wallet => {
  const rate = Number(wallet?.bCoinValue);
  return !rate || Number.isNaN(rate) ? 1 : rate;
};

const WalletRow = ({ walletData, onPress }) => {
  const wallet = walletData?.wallet;
  const coins = Number(wallet?.bCoins || 0);
  const rate = coinRate(wallet);
  const balance = formatCoins(coins);
  const worth = (coins * rate).toFixed(2);

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`UD Wallet, ${balance} UD coins`}
    >
      <Image source={UD_COIN_ICON} style={styles.coinIcon} />

      <View style={styles.content}>
        <Text style={styles.title}>UD Wallet</Text>
        <View style={styles.valueRow}>
          <Text style={styles.coinsValue}>{balance}</Text>
          <Text style={styles.worthText}>{` UD coins : ₹ ${worth}/-`}</Text>
        </View>
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={22}
        color="#CCCCCC"
      />
    </TouchableOpacity>
  );
};

export default React.memo(WalletRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  coinIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    fontSize: 14.5,
    fontFamily: FONTS.gilroy.semiBold,
    color: '#111111',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  coinsValue: {
    fontSize: 16,
    fontFamily: FONTS.gilroy.bold,
    color: '#F25000',
    includeFontPadding: false,
  },
  worthText: {
    fontSize: 13,
    fontFamily: FONTS.gilroy.regular,
    color: '#666666',
    includeFontPadding: false,
  },
});
