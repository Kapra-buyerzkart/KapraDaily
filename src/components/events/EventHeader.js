import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import icons from '@/assets/icons';
import CoinBalance from './CoinBalance';
import { wp } from '../../utils/responsive';

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
          <Image source={icons.backArrowNew} style={styles.backIcon} />
        </TouchableOpacity>

        <Image
          style={{ width: wp('20%'), height: wp('20%') }}
          source={require('../../assets/images/movieTicket/udendeallanding.png')}
          resizeMode="contain"
        />
        {/* <Image source={icons.titleTextTwo} style={styles.logo} /> */}
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
  },
  backButton: {},
  backIcon: {
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
    width: 67,
    height: 32,
  },
  logo: {},
});

export default EventHeader;
