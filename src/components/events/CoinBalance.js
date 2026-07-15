import React from 'react';
import { Animated, Image, Text, StyleSheet } from 'react-native';

const CoinBalance = ({ bCoins, style }) => (
  <Animated.View style={[styles.pill, style]}>
    <Image
      source={require('../../assets/icons/udcoin.png')}
      style={styles.icon}
      resizeMode="contain"
    />
    <Text style={styles.amount}>{bCoins || 0}</Text>
  </Animated.View>
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
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
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

export default React.memo(CoinBalance);
