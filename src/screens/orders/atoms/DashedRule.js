import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SPACE } from '@/styles/homeTheme';

const DashedRule = ({ style }) => (
  <View style={[styles.clip, style]}>
    <View style={styles.dashes} />
  </View>
);

const styles = StyleSheet.create({
  clip: {
    height: 1,
    overflow: 'hidden',
    marginBottom: SPACE.md,
  },
  dashes: {
    height: 2,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#DCDEE3',
  },
});

export default React.memo(DashedRule);
