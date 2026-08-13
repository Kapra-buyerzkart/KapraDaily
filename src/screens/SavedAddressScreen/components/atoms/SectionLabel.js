import { View, Text } from 'react-native';
import React from 'react';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import { styles } from '../../styles';

export default function SectionLabel({ title }) {
  return (
    <View style={styles.sectionLabel}>
      <Text
        style={styles.sectionLabelText}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        accessibilityRole="header"
      >
        {title}
      </Text>
      <View style={styles.sectionLabelRule} />
    </View>
  );
}
