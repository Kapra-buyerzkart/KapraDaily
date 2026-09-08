import React from 'react';
import { Image, StyleSheet } from 'react-native';

import { LOCATING_ANIMATION } from '../../constants';

const LocatingBeacon = () => (
  <Image
    source={LOCATING_ANIMATION}
    style={StyleSheet.absoluteFill}
    resizeMode="cover"
  />
);

export default React.memo(LocatingBeacon);
