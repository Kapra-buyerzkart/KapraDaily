import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HOME_FONTS, fs, s } from '../../../Home/redesign/theme';
import { PDP_COLORS } from '../theme';

type SpecPillItem = {
  id: string;
  label: string;
  value: string;
  hasBullet?: boolean;
};

type Props = {
  title?: string;
  attributes: { id: string; label: string; value: string }[];
};

export const SpecDetailsRow: React.FC<Props> = ({
  title = 'GOLD, KT & DIAMOND DETAILS',
  attributes,
}) => {
  if (!attributes || attributes.length === 0) {
    return null;
  }

  // Build pill items from available attributes
  const pills: SpecPillItem[] = attributes
    .filter(attr => Boolean(attr.value && attr.value.trim()))
    .map((attr, idx) => {
      const val = attr.value.trim();
      const hasBullet = idx % 2 === 0;
      return {
        id: attr.id || String(idx),
        label: attr.label,
        value: val,
        hasBullet,
      };
    });

  if (pills.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {pills.map(item => (
          <View key={item.id} style={styles.pill}>
            {item.hasBullet ? <View style={styles.bullet} /> : null}
            <Text style={styles.pillText}>{item.value}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: s(16),
    paddingBottom: s(8),
  },
  heading: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(11),
    letterSpacing: 0.8,
    color: '#55605C',
    paddingHorizontal: s(16),
    marginBottom: s(10),
    textTransform: 'uppercase',
  },
  scrollContent: {
    paddingHorizontal: s(16),
    gap: s(8),
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(14),
    paddingVertical: s(7),
    borderRadius: s(20),
    borderWidth: 1,
    borderColor: PDP_COLORS.pillBorder,
    backgroundColor: PDP_COLORS.white,
  },
  bullet: {
    width: s(5),
    height: s(5),
    borderRadius: s(2.5),
    backgroundColor: '#38584F',
    marginRight: s(6),
  },
  pillText: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(11.5),
    color: '#222222',
  },
});

export default SpecDetailsRow;
