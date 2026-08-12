import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '@/styles/typography';
import {
  INK,
  RADIUS,
  SPACE,
  SURFACE,
  TYPE,
  MAX_FONT_SCALE,
} from '@/styles/homeTheme';

const CountPill = ({ label, tone, style }) => (
  <View
    style={[
      styles.pill,
      tone && { backgroundColor: tone.bg, borderColor: tone.border },
      style,
    ]}
  >
    <Text
      style={[styles.text, tone && { color: tone.fg }]}
      maxFontSizeMultiplier={MAX_FONT_SCALE}
    >
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  pill: {
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACE.md,
    paddingVertical: 4,
    backgroundColor: SURFACE.sunken,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  text: {
    ...TYPE.micro,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    color: INK.muted,
    letterSpacing: 0.2,
  },
});

export default React.memo(CountPill);
