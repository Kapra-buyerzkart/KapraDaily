import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { HOME_FONTS, fs, s } from '../../../Home/redesign/theme';
import { PDP_COLORS } from '../theme';

const ACTION_WIDTH = s(112);
const ACTION_HEIGHT = s(40);
const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

type Props = {
  quantity: number;
  outOfStock: boolean;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
};

const CartAction: React.FC<Props> = ({
  quantity,
  outOfStock,
  onAdd,
  onIncrement,
  onDecrement,
}) => {
  if (quantity > 0) {
    return (
      <View style={styles.stepper}>
        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Decrease quantity"
          onPress={onDecrement}
        >
          <Entypo name="minus" size={18} color={PDP_COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.quantity}>{quantity}</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Increase quantity"
          onPress={onIncrement}
        >
          <Entypo name="plus" size={18} color={PDP_COLORS.white} />
        </TouchableOpacity>
      </View>
    );
  }

  if (outOfStock) {
    return (
      <View style={styles.disabled}>
        <Text style={styles.disabledText}>OUT OF STOCK</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel="Add to cart"
      onPress={onAdd}
      style={styles.add}
    >
      <Entypo name="plus" size={17} color={PDP_COLORS.white} />
      <Text style={styles.addText}>ADD</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  add: {
    width: ACTION_WIDTH,
    height: ACTION_HEIGHT,
    borderRadius: s(10),
    backgroundColor: PDP_COLORS.orange,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(4),
  },
  addText: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(14),
    color: PDP_COLORS.white,
    letterSpacing: 0.4,
  },
  stepper: {
    minWidth: ACTION_WIDTH,
    height: ACTION_HEIGHT,
    borderRadius: s(10),
    backgroundColor: PDP_COLORS.orange,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(16),
    paddingHorizontal: s(12),
  },
  quantity: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(16),
    color: PDP_COLORS.white,
    minWidth: s(16),
    textAlign: 'center',
  },
  disabled: {
    width: ACTION_WIDTH,
    height: ACTION_HEIGHT,
    borderRadius: s(10),
    backgroundColor: PDP_COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledText: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(12),
    color: PDP_COLORS.muted,
    letterSpacing: 0.4,
  },
});

export default CartAction;
