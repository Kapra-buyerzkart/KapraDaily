import React from 'react';
import { Image, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const CoinBalance = ({ bCoins, style }) => (
  <LinearGradient
    colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.08)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.pill, style]}
  >
    <Image
      source={require('../../assets/icons/udcoin.png')}
      style={styles.icon}
      resizeMode="contain"
    />
    <Text style={styles.amount}>{bCoins || 0}</Text>
  </LinearGradient>
);

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Gilroy-Bold',
  },
});

export default CoinBalance;
