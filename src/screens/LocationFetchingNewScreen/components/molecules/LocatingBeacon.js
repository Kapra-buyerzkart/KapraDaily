import React from 'react';
import { Image, StyleSheet } from 'react-native';

import { LOCATING_ANIMATION } from '../../constants';

const LocatingBeacon = () => (
  <Image
    source={LOCATING_ANIMATION}
    style={styles.image}
    resizeMode="cover"
  />
);

export default React.memo(LocatingBeacon);

const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
});
