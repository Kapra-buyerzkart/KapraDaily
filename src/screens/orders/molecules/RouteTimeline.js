import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '@/styles/typography';
import { INK, SPACE, TYPE, MAX_FONT_SCALE } from '@/styles/homeTheme';
import IconChip from '../atoms/IconChip';

const Stop = ({ icon, tone, title, lines, last }) => (
  <View style={styles.row}>
    <View style={styles.rail}>
      <IconChip name={icon} tone={tone} />
      {!last && <View style={styles.connector} />}
    </View>

    <View style={[styles.copy, last && styles.copyLast]}>
      <Text style={styles.title} maxFontSizeMultiplier={MAX_FONT_SCALE}>
        {title}
      </Text>
      {lines.filter(Boolean).map((line, index) => (
        <Text
          key={`${line}-${index}`}
          numberOfLines={2}
          ellipsizeMode="tail"
          style={[styles.line, index === 0 && styles.lineLead]}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          {line}
        </Text>
      ))}
    </View>
  </View>
);

const RouteTimeline = ({ store, destination }) => (
  <View>
    <Stop
      icon="storefront"
      tone="neutral"
      title={store.title}
      lines={store.lines}
    />
    <Stop
      icon="location"
      tone="success"
      title={destination.title}
      lines={destination.lines}
      last
    />
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  rail: {
    alignItems: 'center',
  },
  connector: {
    flex: 1,
    width: 2,
    minHeight: SPACE.base,
    borderRadius: 2,
    backgroundColor: '#E7E9ED',
    marginVertical: SPACE.xs,
  },
  copy: {
    flex: 1,
    marginLeft: SPACE.md,
    paddingBottom: SPACE.base,
  },
  copyLast: {
    paddingBottom: 0,
  },
  title: {
    ...TYPE.label,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    marginBottom: 3,
  },
  line: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
  },
  lineLead: {
    fontFamily: FONTS.gilroy.medium,
    color: INK.base,
  },
});

export default React.memo(RouteTimeline);
