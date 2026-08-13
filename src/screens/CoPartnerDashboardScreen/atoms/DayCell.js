import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import CartText from '@/screens/cart/components/atoms/CartText';
import { CART_COLORS, wp } from '@/styles/cartTheme';

const CELL = wp('9%');

const TONES = {
  edge: 'onDark',
  inRange: 'secondary',
  idle: 'primary',
  blank: 'faint',
};

const DayCell = ({ day, state, onPress, disabled }) => (
  <TouchableOpacity
    style={[
      styles.cell,
      state === 'edge' && styles.cellEdge,
      state === 'inRange' && styles.cellInRange,
    ]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.7}
  >
    {!!day && (
      <CartText
        variant={state === 'edge' ? 'captionStrong' : 'caption'}
        tone={TONES[state]}
      >
        {day}
      </CartText>
    )}
  </TouchableOpacity>
);

export default React.memo(DayCell);

const styles = StyleSheet.create({
  cell: {
    width: '14.28%',
    height: CELL,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 1,
    borderRadius: CELL / 2,
  },
  cellEdge: {
    backgroundColor: CART_COLORS.textPrimary,
  },
  cellInRange: {
    backgroundColor: CART_COLORS.well,
    borderRadius: 0,
  },
});
