import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ACCENT, MAX_FONT_SCALE } from '@/styles/homeTheme';
import { ICON, styles } from '../../styles';

export default function AddNewAddressCTA({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Add a new address"
      style={({ pressed }) => [styles.ctaRow, pressed && styles.ctaRowPressed]}
    >
      <View style={styles.ctaIconWell}>
        <Ionicons name="add" size={ICON.plus} color={ACCENT.primary} />
      </View>

      <View style={styles.ctaCopy}>
        <Text style={styles.ctaTitle} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          Add a new address
        </Text>
        <Text style={styles.ctaSubtitle} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          Pin your exact spot for faster delivery
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={ICON.chevron}
        color={ACCENT.primary}
      />
    </Pressable>
  );
}
