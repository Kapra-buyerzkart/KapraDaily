import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '@/styles/typography';
import { INK, SPACE, TYPE, GUTTER, MAX_FONT_SCALE } from '@/styles/homeTheme';

const SectionHeading = ({ title, right, style }) => (
  <View style={[styles.row, style]}>
    <Text
      style={styles.title}
      accessibilityRole="header"
      maxFontSizeMultiplier={MAX_FONT_SCALE}
    >
      {title}
    </Text>
    {right || null}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: GUTTER + SPACE.xs,
    marginTop: SPACE.sm,
    marginBottom: SPACE.md,
  },
  title: {
    ...TYPE.heading,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    letterSpacing: -0.3,
    flexShrink: 1,
  },
});

export default React.memo(SectionHeading);
