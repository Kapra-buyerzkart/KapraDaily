import { View, Text } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ACCENT, MAX_FONT_SCALE } from '@/styles/homeTheme';
import { styles } from '../../styles';

export default function SelectedBadge({ label = 'Delivering here' }) {
  return (
    <View style={styles.badge}>
      <Ionicons
        name="checkmark-circle"
        size={wp('3.4%')}
        color={ACCENT.successText}
      />
      <Text style={styles.badgeText} maxFontSizeMultiplier={MAX_FONT_SCALE}>
        {label}
      </Text>
    </View>
  );
}
