import React from 'react';
import { StyleSheet, View } from 'react-native';

import { PALETTE } from '../theme';

const CoinDivider = ({ inset = 0, style }) => (
  <View
    style={[styles.line, inset ? { marginHorizontal: inset } : null, style]}
  />
);

export default React.memo(CoinDivider);

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: PALETTE.line,
  },
});
