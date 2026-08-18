import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import AddrText from './AddrText';
import {
  MAP_HEIGHT,
  PIN_HEIGHT,
  PIN_ICON,
  PIN_SHADOW_HEIGHT,
} from '../../constants';
import { COLORS, RADIUS, SHADOW, SPACING, wp } from '../../theme';

const MapPin = ({ isLifted }) => (
  <View style={styles.wrap} pointerEvents="none">
    <View style={[styles.callout, isLifted && styles.calloutHidden]}>
      <AddrText variant="captionStrong" numberOfLines={1}>
        Order will be delivered here
      </AddrText>
      <AddrText variant="micro" tone="muted" numberOfLines={1}>
        Move the map to set exact spot
      </AddrText>
      <View style={styles.calloutTail} />
    </View>

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
  callout: {
    position: 'absolute',
    bottom: PIN_HEIGHT + SPACING.md,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.surface,
    ...SHADOW.float,
  },
  calloutHidden: {
    opacity: 0,
  },
  calloutTail: {
    position: 'absolute',
    bottom: -4,
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: COLORS.surface,
    transform: [{ rotate: '45deg' }],
  },
  pin: {
    width: wp('8.5%'),
    height: PIN_HEIGHT,
    resizeMode: 'contain',
    tintColor: COLORS.primary,
  },
  pinLifted: {
    transform: [{ translateY: -8 }],
  },
  shadow: {
    width: wp('4%'),
    height: PIN_SHADOW_HEIGHT,
    borderRadius: wp('2%'),
    backgroundColor: COLORS.pinShadow,
    marginTop: 2,
    alignSelf: 'center',
  },
  shadowLifted: {
    width: wp('3%'),
    height: wp('1%'),
    backgroundColor: 'rgba(11,16,32,0.10)',
  },
});
