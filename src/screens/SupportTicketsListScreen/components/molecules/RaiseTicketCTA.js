import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import { ICON, styles } from '../../styles';
import { LUXURY_COLORS } from '../../supportLuxuryTheme';

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
          name="face-agent"
          size={ICON.well}
          color={LUXURY_COLORS.gold}
        />
      </View>

      <View style={styles.ctaCopy}>
        <Text style={styles.ctaTitle} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          Need Assistance?
        </Text>
        <Text style={styles.ctaSubtitle} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          Raise a ticket and our concierge support team will resolve it promptly
        </Text>
      </View>

      <Feather
        name="chevron-right"
        size={18}
        color={LUXURY_COLORS.emerald}
      />
    </Pressable>
  );
}
