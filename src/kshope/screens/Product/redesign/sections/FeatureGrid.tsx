import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { HOME_FONTS, fs, s } from '../../../Home/redesign/theme';
import type { Feature } from '../data/selectors';
import { PDP_COLORS } from '../theme';

type Props = {
  features: Feature[];
};

const FeatureCell: React.FC<{ feature: Feature }> = ({ feature }) => (
  <View style={styles.cell}>
    <Image source={feature.icon} resizeMode="contain" style={styles.icon} />
    <View style={styles.cellText}>
      <Text style={styles.title} numberOfLines={1}>
        {feature.title}
      </Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {feature.subtitle}
      </Text>
    </View>
  </View>
);

const FeatureGrid: React.FC<Props> = ({ features }) => {
  if (features.length === 0) {
    return null;
  }

  const rows: Feature[][] = [];
  for (let index = 0; index < features.length; index += 2) {
    rows.push(features.slice(index, index + 2));
  }

  return (
    <View style={styles.wrap}>
      {rows.map((row, index) => (
        <View key={index} style={styles.row}>
          <FeatureCell feature={row[0]} />
          {row[1] ? (
            <>
              <View style={styles.divider} />
              <FeatureCell feature={row[1]} />
            </>
          ) : (
            <View style={styles.cell} />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginTop: s(19),
    gap: s(19),
  },
  row: {
    marginHorizontal: s(11),
    height: s(56),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PDP_COLORS.cardBorder,
    borderRadius: s(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(14),
    gap: s(10),
  },
  cellText: {
    flex: 1,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: s(30),
    backgroundColor: PDP_COLORS.cardBorder,
  },
  icon: {
    width: s(30),
    height: s(30),
  },
  title: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(12),
    lineHeight: fs(12) * 1.25,
    color: PDP_COLORS.black,
  },
  subtitle: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    lineHeight: fs(12) * 1.25,
    color: PDP_COLORS.muted,
  },
});

export default FeatureGrid;
