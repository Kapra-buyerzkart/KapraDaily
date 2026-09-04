import React from 'react';
import { Pressable, PressableProps, StyleSheet } from 'react-native';

import { AppText } from '../../../components/atoms';
import { PALETTE, RADIUS } from '../theme';

interface ChoiceChipProps extends PressableProps {
  label: string;
  isActive?: boolean;
}

const ChoiceChip: React.FC<ChoiceChipProps> = ({
  label,
  isActive,
  style,
  ...rest
}) => (
  <Pressable
    {...rest}
    style={[styles.chip, isActive && styles.chipActive, style as any]}
  >
    <AppText variant="captionStrong" tone={isActive ? 'primary' : 'muted'}>
      {label}
    </AppText>
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
