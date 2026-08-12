import { View, Text } from 'react-native';
import React from 'react';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import { styles } from '../../styles';

export default function SectionLabel({ title, count }) {
  return (
    <View style={styles.sectionLabel}>
      <Text
        style={styles.sectionLabelText}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        accessibilityRole="header"
      >
        {title}
      </Text>
      {count > 0 ? (
        <Text
          style={styles.sectionLabelCount}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          {count}
        </Text>
      ) : null}
      <View style={styles.sectionLabelRule} />
    </View>
  );
}
