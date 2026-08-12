import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '@/styles/typography';
import { HAIRLINE, INK, SPACE, TYPE, MAX_FONT_SCALE } from '@/styles/homeTheme';

const DetailList = ({ rows = [] }) => (
  <View>
    {rows
      .filter(row => row && row.value)
      .map((row, index) => (
        <View key={row.label} style={[styles.row, index > 0 && styles.divided]}>
          <Text style={styles.label} maxFontSizeMultiplier={MAX_FONT_SCALE}>
            {row.label}
          </Text>
          <Text
            style={styles.value}
            numberOfLines={2}
            ellipsizeMode="tail"
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {row.value}
          </Text>
        </View>
      ))}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACE.md,
  },
  divided: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: HAIRLINE,
  },
  label: {
    ...TYPE.label,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.medium,
    color: INK.muted,
    marginRight: SPACE.base,
  },
  value: {
    ...TYPE.label,
    flex: 1,
    textAlign: 'right',
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
  },
});

export default React.memo(DetailList);
