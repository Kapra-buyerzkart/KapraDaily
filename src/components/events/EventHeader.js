import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import icons from '@/assets/icons';
import CoinBalance from './CoinBalance';
import { wp } from '../../utils/responsive';
import { hp } from '@/styles/cartTheme';
import images from '@/assets/images';

const EventHeader = ({ navigation, insets, bCoins }) => {
  const paddingTop = insets?.top > 0 ? insets.top + 16 : 40;

  return (
    <View style={[styles.header, { paddingTop }]}>
      <View style={styles.left}>
        <Image
          style={styles.udenticketconimage}
          source={icons.udenticketconimage}
        />
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
  },
  backButton: {
    position: 'absolute',
    left: 20,
  },
  backIcon: {
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },

  udenticketconimage: {
    resizeMode: 'contain',
    width: wp('16%'),
    height: hp('5%'),
    tintColor: '#ffffff',
  },
});

export default React.memo(EventHeader);
