import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { FONTS } from '@/styles/typography';

import { TOKEN_ICON } from '../constants';
import { PALETTE, RADIUS } from '../theme';

const TokenStrip = ({ tokens }) => (
  // <LinearGradient
  //   colors={[PALETTE.violetTint, PALETTE.surface]}
  //   start={{ x: 0, y: 0 }}
  //   end={{ x: 1, y: 1 }}
  //   style={styles.card}
  // >
  <View style={styles.card}>
    <View style={styles.iconTile}>
      <Image source={TOKEN_ICON} style={styles.icon} />
    </View>

    <View style={styles.copy}>
      <Text style={styles.title}>UD Token</Text>
      <Text style={styles.caption}>Earned from referrals & orders</Text>
    </View>

    <View style={styles.right}>
      <Text style={styles.value}>{tokens}</Text>
      <Text style={styles.valueLabel}>Available</Text>
    </View>
  </View>

  // </LinearGradient>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: '92%',
    marginTop: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(110,52,192,0.14)',
  },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(110,52,192,0.10)',
  },
  icon: {
    width: 24,
    height: 18,
    resizeMode: 'contain',
  },
  copy: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: 15,
    color: PALETTE.textPrimary,
  },
  caption: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: 11.5,
    color: PALETTE.textSecondary,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  value: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: 18,
    color: PALETTE.violet,
  },
  valueLabel: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: 10.5,
    color: PALETTE.textMuted,
    marginTop: 1,
  },
});

export default React.memo(TokenStrip);
