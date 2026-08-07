import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AnimatedPressable from '@/components/AnimatedPressable';
import { FONTS } from '@/styles/typography';

import { COIN_ICON } from '../constants';
import { formatCurrency } from '../utils';
import { PALETTE, RADIUS } from '../theme';

const RateCard = ({ coinValue, onPress }) => (
  <AnimatedPressable
    style={styles.card}
    accessibilityRole="button"
    accessibilityLabel="View UD Coin rate history"
    onPress={onPress}
  >
    <View style={styles.iconTile}>
      <Image source={COIN_ICON} style={styles.coin} />
    </View>

    <View style={styles.copy}>
      <Text style={styles.label}>Today's UD Coin value</Text>
      <Text style={styles.value}>1 UD Coin = {formatCurrency(coinValue)}</Text>
    </View>

    <View style={styles.pill}>
      <Text style={styles.pillText}>Rate history</Text>
      <AntDesign name="right" size={10} color={PALETTE.orange} />
    </View>
  </AnimatedPressable>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: '92%',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: RADIUS.lg,
    backgroundColor: PALETTE.surface,
    borderWidth: 1,
    borderColor: PALETTE.line,
  },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PALETTE.goldTint,
  },
  coin: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  copy: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: 11.5,
    color: PALETTE.textMuted,
  },
  value: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: 15,
    color: PALETTE.textPrimary,
    marginTop: 2,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    backgroundColor: PALETTE.orangeTint,
  },
  pillText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: 11.5,
    color: PALETTE.orange,
  },
});

export default React.memo(RateCard);
