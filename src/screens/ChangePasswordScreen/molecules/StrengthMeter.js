import React from 'react';
import { View, StyleSheet } from 'react-native';
import CartText from '@/screens/cart/components/atoms/CartText';
import { CART_COLORS, CART_SPACING, wp } from '@/styles/cartTheme';
import MeterSegment from '../atoms/MeterSegment';
import { METER_SEGMENTS, STRENGTH_COPY } from '../constants';

const AMBER = '#B45309';

export const strengthInk = score =>
  score <= 1 ? CART_COLORS.danger : score === 2 ? AMBER : CART_COLORS.successDeep;

const StrengthMeter = ({ score }) => {
  const ink = strengthInk(score);

  return (
    <View style={styles.row}>
      {Array.from({ length: METER_SEGMENTS }).map((_, index) => (
        <MeterSegment key={index} filled={index < score} ink={ink} />
      ))}

      <CartText variant="micro" tone={ink} style={styles.label}>
        {STRENGTH_COPY[score]}
      </CartText>
    </View>
  );
};

export default React.memo(StrengthMeter);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs + 2,
  },
  label: {
    width: wp('17%'),
    textAlign: 'right',
    marginLeft: CART_SPACING.xs,
  },
});
