import { View, Text, Pressable } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import { ICON, styles } from '../../styles';
import { LUXURY_COLORS } from '../../supportLuxuryTheme';

export default function TicketsEmptyState({ onRaise }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconWell}>
        <MaterialCommunityIcons
          name="ticket-confirmation-outline"
          size={ICON.empty}
          color={LUXURY_COLORS.gold}
        />
      </View>

      <Text style={styles.emptyTitle} maxFontSizeMultiplier={MAX_FONT_SCALE}>
        No Support Tickets
      </Text>
      <Text style={styles.emptyBody} maxFontSizeMultiplier={MAX_FONT_SCALE}>
        You haven't submitted any support requests yet. We are here to assist you whenever you need help.
      </Text>

      <Pressable
        onPress={onRaise}
        accessibilityRole="button"
        accessibilityLabel="Raise a ticket"
        style={({ pressed }) => [
          styles.emptyButton,
          pressed && styles.emptyButtonPressed,
        ]}
      >
        <MaterialCommunityIcons
          name="plus"
          size={ICON.plus}
          color={LUXURY_COLORS.white}
        />
        <Text
          style={styles.emptyButtonText}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          Raise Support Ticket
        </Text>
      </Pressable>
    </View>
  );
}
