import { View, Text, Pressable } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ACCENT, INK, MAX_FONT_SCALE } from '@/styles/homeTheme';
import { ICON, styles } from '../../styles';

export default function RaiseTicketCTA({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Raise a new support ticket"
      style={({ pressed }) => [styles.ctaRow, pressed && styles.ctaRowPressed]}
    >
      <View style={styles.ctaIconWell}>
        <MaterialCommunityIcons
          name="headset"
          size={ICON.well}
          color={ACCENT.primary}
        />
      </View>

      <View style={styles.ctaCopy}>
        <Text style={styles.ctaTitle} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          Raise a ticket
        </Text>
        <Text style={styles.ctaSubtitle} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          Tell us what went wrong and we will get back to you
        </Text>
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={ICON.chevron}
        color={INK.muted}
      />
    </Pressable>
  );
}
