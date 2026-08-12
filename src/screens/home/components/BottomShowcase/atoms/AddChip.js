import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { RADIUS, SPACE, ACCENT, TYPE, MAX_FONT_SCALE } from '@/styles/homeTheme';
import { FONTS } from '../../../../../styles/typography';
import { ACCENT_EDGE } from '../tokens';

const AddChip = ({ label = 'Add', style }) => (
  <View style={[styles.chip, style]}>
    <Feather name="plus" size={13} color={ACCENT.primary} />
    <Text style={styles.text} maxFontSizeMultiplier={MAX_FONT_SCALE}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.sm,
    paddingVertical: SPACE.sm,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: ACCENT_EDGE,
  },
  text: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.bold,
    color: ACCENT.primary,
    marginLeft: SPACE.xs,
  },
});

export default React.memo(AddChip);
