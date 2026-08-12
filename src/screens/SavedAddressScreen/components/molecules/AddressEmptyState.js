import { View, Text } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ACCENT, MAX_FONT_SCALE } from '@/styles/homeTheme';
import { ICON, styles } from '../../styles';

export default function AddressEmptyState() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconWell}>
        <Ionicons
          name="location-outline"
          size={ICON.empty}
          color={ACCENT.primary}
        />
      </View>
      <Text style={styles.emptyTitle} maxFontSizeMultiplier={MAX_FONT_SCALE}>
        No addresses saved yet
      </Text>
      <Text style={styles.emptyBody} maxFontSizeMultiplier={MAX_FONT_SCALE}>
        Save a delivery location and we will bring your order straight to your
        door.
      </Text>
    </View>
  );
}
