import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import icons from '@/assets/icons';
import CoinBalance from './CoinBalance';

const EventHeader = ({ navigation, insets, bCoins }) => {
  const paddingTop = insets?.top > 0 ? insets.top + 16 : 40;

  return (
    <View style={[styles.header, { paddingTop }]}>
      <View style={styles.left}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={40}
          style={styles.backButton}
        >
          <Image
            source={icons.backArrowNew}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Image source={icons.titleText} style={styles.logo} />
      </View>
      <CoinBalance bCoins={bCoins} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginRight: 12,
  },
  backButton: {
    marginRight: 14,
  },
  backIcon: {
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },
  logo: {
    alignSelf: 'center',
  },
});

export default EventHeader;
