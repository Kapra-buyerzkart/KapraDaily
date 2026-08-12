import { View, Text, Pressable } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ACCENT, INK, MAX_FONT_SCALE } from '@/styles/homeTheme';
import { ICON, styles } from '../../styles';

export default function TicketsEmptyState({ onRaise }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconWell}>
        <MaterialCommunityIcons
          name="ticket-confirmation-outline"
          size={ICON.empty}
          color={ACCENT.primary}
        />
      </View>

      <Text style={styles.emptyTitle} maxFontSizeMultiplier={MAX_FONT_SCALE}>
        No tickets yet
      </Text>
      <Text style={styles.emptyBody} maxFontSizeMultiplier={MAX_FONT_SCALE}>
        Raise a ticket when something goes wrong with an order and our team will
        pick it up.
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
          color={INK.onDark}
        />
        <Text
          style={styles.emptyButtonText}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          Raise a ticket
        </Text>
      </Pressable>
    </View>
  );
}
