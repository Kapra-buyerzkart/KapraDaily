import { View, Text } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { INK, MAX_FONT_SCALE } from '@/styles/homeTheme';
import { ICON, styles } from '../../styles';

export default function MetaChip({ icon, label }) {
  if (!label) return null;

  return (
    <View style={styles.chip}>
      <MaterialCommunityIcons name={icon} size={ICON.meta} color={INK.muted} />
      <Text
        style={styles.chipText}
        numberOfLines={1}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        {label}
      </Text>
    </View>
  );
}
