import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SPACE, ACCENT, TYPE, MAX_FONT_SCALE } from '@/styles/homeTheme';
import { FONTS } from '../../../../../styles/typography';

const EyebrowBadge = ({ label, style }) => (
  <View style={[styles.row, style]}>
    <View style={styles.rule} />
    <Text style={styles.text} maxFontSizeMultiplier={MAX_FONT_SCALE}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rule: {
    width: 18,
    height: 2,
    borderRadius: 1,
    backgroundColor: ACCENT.primary,
    marginRight: SPACE.sm,
  },
  text: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.bold,
    color: ACCENT.primary,
    letterSpacing: 1.4,
  },
});

export default React.memo(EyebrowBadge);
