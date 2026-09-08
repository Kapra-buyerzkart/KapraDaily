import React from 'react';
import { StyleSheet, View } from 'react-native';

import { SPACING } from '../../theme';
import { LocatingBeacon, LocatingStatus } from '../molecules';

const LocatingView = () => (
  <View style={styles.wrap}>
    <LocatingBeacon />
    <View style={styles.status}>
      <LocatingStatus />
    </View>
  </View>
);

export default React.memo(LocatingView);

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  status: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: SPACING.xxxl,
  },
});
