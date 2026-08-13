import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, HAIRLINE, SPACING } from '../theme';

const Divider = ({ inset = 0, dashed = false, style }) => (
  <View
    style={[
      dashed ? styles.dashed : styles.solid,
      inset ? { marginHorizontal: inset } : null,
      style,
    ]}
  />
);

export default React.memo(Divider);

const styles = StyleSheet.create({
  solid: {
    height: HAIRLINE,
    backgroundColor: COLORS.lineStrong,
  },
  dashed: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.lineStrong,
    marginVertical: SPACING.xs,
  },
});
