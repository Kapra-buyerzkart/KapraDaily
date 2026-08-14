import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { PALETTE, RADIUS } from '../theme';

const TONES = {
  gold: PALETTE.goldTint,
  token: PALETTE.tokenTint,
  neutral: PALETTE.well,
  credit: PALETTE.creditTint,
};

const IconTile = ({
  size = 38,
  tone = 'neutral',
  radius,
  source,
  imageStyle,
  style,
  children,
}) => (
  <View
    style={[
      styles.tile,
      {
        width: size,
        height: size,
        borderRadius: radius ?? RADIUS.icon,
        backgroundColor: TONES[tone] || tone,
      },
      style,
    ]}
  >
    {source ? <Image source={source} style={imageStyle} /> : children}
  </View>
);

export default React.memo(IconTile);

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
