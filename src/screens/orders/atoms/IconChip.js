import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { RADIUS } from '@/styles/homeTheme';
import { CHIP_TONE } from '../tokens/tracking';

const IconChip = ({ name, tone = 'neutral', size = wp('9%'), style }) => {
  const palette = CHIP_TONE[tone] || CHIP_TONE.neutral;
  return (
    <View
      style={[
        styles.chip,
        {
          width: size,
          height: size,
          borderRadius: RADIUS.sm,
          backgroundColor: palette.bg,
        },
        style,
      ]}
    >
      <Ionicons name={name} size={size * 0.5} color={palette.fg} />
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(IconChip);
