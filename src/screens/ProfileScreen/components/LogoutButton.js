import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { styles } from '../styles';
import { ACCENT, MAX_FONT_SCALE } from '@/styles/homeTheme';

export default function LogoutButton({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.logoutButton}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel="Log out"
    >
      <Ionicons
        name="log-out-outline"
        size={wp('4.6%')}
        color={ACCENT.discount}
      />
      <Text
        style={styles.logoutButtonText}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        Log Out
      </Text>
    </TouchableOpacity>
  );
}
