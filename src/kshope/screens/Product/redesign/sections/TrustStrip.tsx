import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { HOME_FONTS, fs, s } from '../../../Home/redesign/theme';
import { PDP_ART } from '../assets';
import { PDP_COLORS } from '../theme';

const ITEMS = [
  { id: 'quality', icon: PDP_ART.trustQuality, lines: ['Quality', 'Products'] },
  { id: 'returns', icon: PDP_ART.trustReturns, lines: ['Easy', 'Returns'] },
  { id: 'secure', icon: PDP_ART.trustSecure, lines: ['Secure', 'Transaction'] },
];

const TrustStrip: React.FC = () => (
  <View style={styles.strip}>
    {ITEMS.map((item, index) => (
      <React.Fragment key={item.id}>
        {index > 0 ? <View style={styles.divider} /> : null}
        <View style={styles.item}>
          <Image source={item.icon} resizeMode="contain" style={styles.icon} />
          <View>
            {item.lines.map(line => (
              <Text key={line} style={styles.label}>
                {line}
              </Text>
            ))}
          </View>
        </View>
      </React.Fragment>
    ))}
  </View>
);

const styles = StyleSheet.create({
  strip: {
    height: s(69),
    backgroundColor: PDP_COLORS.trustStrip,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(8),
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: s(52),
    backgroundColor: PDP_COLORS.orange,
  },
  icon: {
    width: s(27),
    height: s(27),
  },
  label: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    lineHeight: fs(12) * 1.3,
    color: PDP_COLORS.black,
  },
});

export default TrustStrip;
