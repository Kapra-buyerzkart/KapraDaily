import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartText from '@/screens/cart/components/atoms/CartText';
import IconDisc from '@/screens/cart/components/atoms/IconDisc';
import Surface from '@/screens/cart/components/atoms/Surface';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  hp,
  wp,
} from '@/styles/cartTheme';
import { formatDate } from '../utils';

const DateRangeBar = ({ fromDate, toDate, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`Date range ${formatDate(fromDate)} to ${formatDate(
      toDate,
    )}. Tap to change.`}
  >
    <Surface style={styles.card}>
      <IconDisc size={wp('9%')} tone="neutral">
        <MaterialCommunityIcons
          name="calendar-range-outline"
          size={wp('4.2%')}
          color={CART_COLORS.textSecondary}
        />
      </IconDisc>

      <View style={styles.copy}>
        <CartText variant="micro" tone="muted">
          SHOWING
        </CartText>
        <CartText variant="bodyStrong" numberOfLines={1}>
          {formatDate(fromDate)} → {formatDate(toDate)}
        </CartText>
      </View>

      <View style={styles.changeBtn}>
        <CartText variant="captionStrong" tone="secondary">
          Change
        </CartText>
      </View>
    </Surface>
  </TouchableOpacity>
);

export default React.memo(DateRangeBar);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: CART_SPACING.md,
    gap: CART_SPACING.md,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  changeBtn: {
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('0.7%'),
    borderRadius: CART_RADIUS.pill,
    backgroundColor: CART_COLORS.well,
  },
});
