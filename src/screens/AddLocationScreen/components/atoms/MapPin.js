import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import {
  MAP_HEIGHT,
  PIN_HEIGHT,
  PIN_ICON,
  PIN_SHADOW_HEIGHT,
} from '../../constants';
import { COLORS, wp } from '../../theme';

const MapPin = ({ isLifted }) => (
  <View style={styles.wrap} pointerEvents="none">
    <Image
      source={PIN_ICON}
      style={[styles.pin, isLifted && styles.pinLifted]}
    />
    <View style={[styles.shadow, isLifted && styles.shadowLifted]} />
  </View>
);

export default React.memo(MapPin);

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    top: MAP_HEIGHT / 2 - (PIN_HEIGHT + PIN_SHADOW_HEIGHT / 2 + 2),
    zIndex: 10,
  },
  pin: {
    width: wp('8%'),
    height: PIN_HEIGHT,
    resizeMode: 'contain',
    tintColor: COLORS.primary,
  },
  pinLifted: {
    transform: [{ translateY: -6 }],
  },
  shadow: {
    width: wp('4%'),
    height: PIN_SHADOW_HEIGHT,
    borderRadius: wp('2%'),
    backgroundColor: 'rgba(0,0,0,0.18)',
    marginTop: 2,
    alignSelf: 'center',
  },
  shadowLifted: {
    width: wp('3%'),
    height: wp('1%'),
    backgroundColor: 'rgba(0,0,0,0.10)',
  },
});
