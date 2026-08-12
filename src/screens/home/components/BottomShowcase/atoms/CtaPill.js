import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { RADIUS, SPACE, ACCENT, TYPE, MAX_FONT_SCALE } from '@/styles/homeTheme';
import { FONTS } from '../../../../../styles/typography';
import { ACCENT_EDGE, ACCENT_SOFT } from '../tokens';

const CtaPill = ({ label, style }) => (
  <View style={[styles.pill, style]}>
    <Text style={styles.text} maxFontSizeMultiplier={MAX_FONT_SCALE}>
      {label}
    </Text>
    <Feather name="arrow-up-right" size={13} color={ACCENT.primary} />
  </View>
);

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: ACCENT_SOFT,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: ACCENT_EDGE,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACE.xs + 2,
    paddingHorizontal: SPACE.md,
  },
  text: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.bold,
    color: ACCENT.primary,
    letterSpacing: 0.1,
    marginRight: SPACE.xs,
  },
});

export default React.memo(CtaPill);
