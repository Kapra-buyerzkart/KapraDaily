import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { TYPE, INK, MAX_FONT_SCALE } from '@/styles/homeTheme';
import { FONTS } from '../../../../../styles/typography';

const TileCaption = ({ label, style }) => (
  <Text
    style={[styles.text, style]}
    numberOfLines={2}
    maxFontSizeMultiplier={MAX_FONT_SCALE}
  >
    {label}
  </Text>
);

const styles = StyleSheet.create({
  text: {
    ...TYPE.label,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    letterSpacing: -0.2,
  },
});

export default React.memo(TileCaption);
