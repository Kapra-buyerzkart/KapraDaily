import React from 'react';
import { View, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { CART_COLORS } from '@/styles/cartTheme';
import { DISC_SIZE } from '../tokens';

const TONES = {
  solid: { bg: CART_COLORS.primary, fg: CART_COLORS.onPrimary },
  tint: { bg: CART_COLORS.primaryTint, fg: CART_COLORS.primary },
};

const ArrowDisc = ({
  icon = 'arrow-up-right',
  tone = 'solid',
  size = DISC_SIZE,
  style,
}) => {
  const palette = TONES[tone] || TONES.solid;

  return (
    <View
      style={[
        styles.disc,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: palette.bg,
        },
        style,
      ]}
    >
      <Feather name={icon} size={size * 0.5} color={palette.fg} />
    </View>
  );
};

const styles = StyleSheet.create({
  disc: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(ArrowDisc);
