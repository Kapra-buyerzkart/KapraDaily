import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from '../styles';

const CoinBar = ({ bCoins }) => (
  <View style={styles.coinBar}>
    <Text style={styles.coinBarText}>Use UD-Coins to Book Your Tickets</Text>
    <View style={styles.coinBadge}>
      <Image
        source={require('../../../assets/images/coin.png')}
        style={styles.coinIcon}
        resizeMode="contain"
      />
      <Text style={styles.coinAmount}>{bCoins || 0} B</Text>
    </View>
  </View>
);

export default CoinBar;
