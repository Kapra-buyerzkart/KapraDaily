import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, RADIUS } from '../theme';

const TONES = {
  neutral: COLORS.well,
  brand: COLORS.primaryTint,
  success: COLORS.successTint,
  info: COLORS.infoTint,
  warn: COLORS.warnTint,
  danger: COLORS.dangerTint,
  ink: COLORS.ink,
};

const IconDisc = ({ size = 34, tone = 'neutral', radius, style, children }) => (
  <View
    style={[
      styles.disc,
      {
        width: size,
        height: size,
        borderRadius: radius ?? RADIUS.icon,
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
  },
});
