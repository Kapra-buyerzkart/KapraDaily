import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BEST_SELLING, Tile } from '../content';
import { SectionTitle } from '../parts';
import { HOME_COLORS, HOME_FONTS, fs, s } from '../theme';

type Props = {
  onPressTile?: (item: Tile) => void;
};

const BestSelling: React.FC<Props> = ({ onPressTile }) => (
  <View style={styles.wrap}>
    <SectionTitle text="Best Selling" style={styles.title} />

    <View style={styles.grid}>
      {BEST_SELLING.map(item => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.9}
          onPress={() => onPressTile?.(item)}
          style={styles.cell}
        >
          <View style={styles.tile}>
            <Image
              source={item.image}
              resizeMode="cover"
              style={styles.tileImage}
            />
          </View>
          <Text style={styles.label} numberOfLines={1}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    <View style={styles.rule} />
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: HOME_COLORS.white,
  },
  title: {
    paddingHorizontal: s(25),
    marginTop: s(18),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: s(25),
    marginTop: s(14),
  },
  cell: {
    width: s(113),
    alignItems: 'center',
    marginBottom: s(14),
  },
  tile: {
    width: s(113),
    height: s(107),
    borderRadius: s(10),
    backgroundColor: HOME_COLORS.searchField,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HOME_COLORS.tileBorder,
    overflow: 'hidden',
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(14),
    lineHeight: fs(14) * 1.3,
    color: HOME_COLORS.black,
    marginTop: s(7),
  },
  rule: {
    height: s(7),
    backgroundColor: HOME_COLORS.creamRule,
    marginTop: s(6),
  },
});

export default BestSelling;
