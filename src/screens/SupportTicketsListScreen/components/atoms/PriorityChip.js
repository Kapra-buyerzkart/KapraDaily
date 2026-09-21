import { View, Text } from 'react-native';
import React from 'react';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import { styles } from '../../styles';
import { priorityMeta } from '../../constants';

function PriorityChip({ priority }) {
  const meta = priorityMeta(priority);
  if (!meta) return null;

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: meta.bg,
          borderColor: meta.border || meta.bg,
        },
      ]}
    >
      <View style={[styles.chipDot, { backgroundColor: meta.dot }]} />
      <Text
        style={[styles.chipText, { color: meta.fg }]}
        numberOfLines={1}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        {meta.label}
      </Text>
    </View>
  );
}

export default React.memo(PriorityChip);
