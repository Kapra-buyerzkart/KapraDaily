import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { AppText } from '../../../components/atoms';
import { CoinTile } from '../atoms';
import { COIN_ICON } from '../constants';
import { formatCurrency } from '../utils';
import { GUTTER, PALETTE, RADIUS, SHADOW, SPACING } from '../theme';

interface RateCardProps {
  coinValue: number;
  onPress: () => void;
}

const RateCard: React.FC<RateCardProps> = ({ coinValue, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    accessibilityRole="button"
    accessibilityLabel="View UD Coin rate history"
    onPress={onPress}
    style={styles.card}
  >
    <CoinTile
      tone="gold"
      size={40}
      source={COIN_ICON}
      imageStyle={styles.coin}
    />

    <View style={styles.copy}>
      <AppText variant="micro" tone="muted">
        TODAY'S UD COIN VALUE
      </AppText>
      <AppText variant="bodyStrong" style={styles.value}>
        1 UD Coin = {formatCurrency(coinValue)}
      </AppText>
    </View>

    <View style={styles.pill}>
      <AppText variant="micro" tone="muted">
        Rate history
      </AppText>
      <AntDesign name="right" size={10} color={PALETTE.textMuted} />
    </View>
  </TouchableOpacity>
);

export default React.memo(RateCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: GUTTER,
    marginTop: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.card,
    backgroundColor: PALETTE.surface,
    ...SHADOW.card,
  },
  coin: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  copy: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  value: {
    marginTop: 2,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    backgroundColor: PALETTE.well,
  },
});
