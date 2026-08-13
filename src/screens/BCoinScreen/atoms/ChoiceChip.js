import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import CoinText from './CoinText';
import { PALETTE, RADIUS } from '../theme';

const ChoiceChip = ({ label, isActive, onPress, style, ...rest }) => (
  <Pressable
    {...rest}
    style={[styles.chip, isActive && styles.chipActive, style]}
    onPress={onPress}
  >
    <CoinText variant="captionStrong" tone={isActive ? 'primary' : 'muted'}>
      {label}
    </CoinText>
  </Pressable>
);

export default React.memo(ChoiceChip);

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    backgroundColor: PALETTE.well,
  },
  chipActive: {
    backgroundColor: PALETTE.selectedTint,
  },
});
