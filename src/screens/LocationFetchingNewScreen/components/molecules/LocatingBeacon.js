import React from 'react';
import { StyleSheet, View } from 'react-native';

import { BEACON_SIZE, RING_DELAYS, RING_PERIOD } from '../../constants';
import { COLORS } from '../../theme';
import { BeaconCore, PulseRing } from '../atoms';

const LocatingBeacon = () => (
  <View style={styles.wrap}>
    <View style={styles.halo} />
    {RING_DELAYS.map(delay => (
      <PulseRing
        key={delay}
        size={BEACON_SIZE}
        delay={delay}
        duration={RING_PERIOD}
      />
    ))}
    <BeaconCore />
  </View>
);

export default React.memo(LocatingBeacon);

const styles = StyleSheet.create({
  wrap: {
    width: BEACON_SIZE,
    height: BEACON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: BEACON_SIZE * 0.66,
    height: BEACON_SIZE * 0.66,
    borderRadius: (BEACON_SIZE * 0.66) / 2,
    backgroundColor: COLORS.halo,
  },
});
