import React from 'react';
import { StyleSheet, View } from 'react-native';

import { COLORS, RADIUS, wp } from '../../theme';

const TONES = {
  neutral: COLORS.well,
  brand: COLORS.primaryTint,
  surface: COLORS.surface,
};

const IconDisc = ({ size = wp('9%'), tone = 'neutral', style, children }) => (
  <View
    style={[
      styles.disc,
      {
        width: size,
        height: size,
        backgroundColor: TONES[tone] || tone,
      },
      style,
    ]}
  >
    {children}
  </View>
);

export default React.memo(IconDisc);

const styles = StyleSheet.create({
  disc: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.pill,
  },
});
