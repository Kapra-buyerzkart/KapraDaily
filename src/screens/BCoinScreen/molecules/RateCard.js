import React from 'react';
import { StyleSheet, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AnimatedPressable from '@/components/AnimatedPressable';
import { CART_SPACING } from '@/styles/cartTheme';

import { CoinSurface, CoinText, IconTile } from '../atoms';
import { COIN_ICON } from '../constants';
import { formatCurrency } from '../utils';
import { PALETTE, RADIUS } from '../theme';

const RateCard = ({ coinValue, onPress }) => (
  <CoinSurface
    as={AnimatedPressable}
    style={styles.card}
    accessibilityRole="button"
    accessibilityLabel="View UD Coin rate history"
    onPress={onPress}
  >
    <IconTile
      tone="gold"
      size={40}
      source={COIN_ICON}
      imageStyle={styles.coin}
    />

    <View style={styles.copy}>
      <CoinText variant="micro" tone="muted">
        TODAY'S UD COIN VALUE
      </CoinText>
      <CoinText variant="bodyStrong" style={styles.value}>
        1 UD Coin = {formatCurrency(coinValue)}
      </CoinText>
    </View>

    <View style={styles.pill}>
      <CoinText variant="micro" tone="muted">
        Rate history
      </CoinText>
      <AntDesign name="right" size={10} color={PALETTE.textMuted} />
    </View>
  </CoinSurface>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: CART_SPACING.lg,
    paddingVertical: CART_SPACING.md,
    paddingHorizontal: CART_SPACING.lg,
  },
  coin: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  copy: {
    flex: 1,
    marginLeft: CART_SPACING.md,
  },
  value: {
    marginTop: 2,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    backgroundColor: PALETTE.well,
  },
});

export default React.memo(RateCard);
