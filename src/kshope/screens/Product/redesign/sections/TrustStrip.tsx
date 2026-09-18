import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HOME_FONTS, fs, s } from '../../../Home/redesign/theme';
import { PDP_COLORS } from '../theme';

const TRUST_ITEMS = [
  {
    id: 'quality',
    icon: 'shield-checkmark-outline',
    title: '100% Quality',
    subtitle: 'Certified Products',
  },
  {
    id: 'returns',
    icon: 'swap-horizontal-outline',
    title: 'Easy Returns',
    subtitle: 'Hassle-Free Policy',
  },
  {
    id: 'secure',
    icon: 'lock-closed-outline',
    title: 'Secure Shopping',
    subtitle: '100% Safe Payment',
  },
];

const TrustStrip: React.FC = () => (
  <View style={styles.card}>
    {TRUST_ITEMS.map((item, index) => (
      <React.Fragment key={item.id}>
        {index > 0 ? <View style={styles.divider} /> : null}
        <View style={styles.item}>
          <View style={styles.iconCircle}>
            <Ionicons
              name={item.icon}
              size={s(16)}
              color={PDP_COLORS.darkGreen}
            />
          </View>
          <View style={styles.textCol}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {item.subtitle}
            </Text>
          </View>
        </View>
      </React.Fragment>
    ))}
  </View>
);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: s(16),
    backgroundColor: PDP_COLORS.specsBg,
    borderRadius: s(12),
    borderWidth: 1,
    borderColor: PDP_COLORS.specsBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: s(12),
    paddingHorizontal: s(8),
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(6),
    paddingHorizontal: s(2),
  },
  iconCircle: {
    width: s(30),
    height: s(30),
    borderRadius: s(15),
    backgroundColor: '#EBE5D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flexShrink: 1,
  },
  title: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(10),
    lineHeight: fs(10) * 1.3,
    color: '#1A1A1A',
  },
  subtitle: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(8),
    lineHeight: fs(8) * 1.3,
    color: '#707070',
    marginTop: s(1),
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: s(28),
    backgroundColor: '#E2DDD5',
  },
});

export default TrustStrip;
