import { View, Text } from 'react-native';
import React from 'react';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import { styles } from '../../styles';

function PriorityHint({ tint, hint }) {
  return (
    <View style={styles.priorityHintRow}>
      <View style={[styles.priorityDot, { backgroundColor: tint }]} />
      <Text
        style={styles.priorityHintText}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        {hint}
      </Text>
    </View>
  );
}

export default React.memo(PriorityHint);
