import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HOME_FONTS, fs, s } from '../../../Home/redesign/theme';
import { CartIcon } from '../icons';
import { PDP_COLORS } from '../theme';

type Props = {
  quantity: number;
  price: string;
  mrp: string;
  inCart: boolean;
  outOfStock: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
  onSubmit: () => void;
};

const BottomBar: React.FC<Props> = ({
  quantity,
  price,
  mrp,
  inCart,
  outOfStock,
  onDecrement,
  onIncrement,
  onSubmit,
}) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: s(12) + bottom }]}>
      <View style={styles.stepper}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onDecrement}
          style={styles.stepperButton}
        >
          <Text style={styles.stepperSymbol}>−</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{quantity}</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onIncrement}
          style={styles.stepperButton}
        >
          <Text style={styles.stepperSymbol}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.priceCol}>
        <Text style={styles.price} numberOfLines={1} adjustsFontSizeToFit>
          {price}
        </Text>
        {mrp ? (
          <Text style={styles.mrp} numberOfLines={1}>{`MRP ${mrp}`}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        disabled={outOfStock}
        onPress={onSubmit}
        style={[styles.action, outOfStock && styles.actionDisabled]}
      >
        {outOfStock ? (
          <Text style={styles.actionText}>Out of Stock</Text>
        ) : (
          <>
            <CartIcon width={22} height={20} color={PDP_COLORS.white} />
            <Text style={styles.actionText}>
              {inCart ? 'Update Cart' : 'Add to Cart'}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(12),
    paddingVertical: s(12),
    backgroundColor: PDP_COLORS.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: PDP_COLORS.rule,
  },
  stepper: {
    width: s(112),
    height: s(36),
    borderRadius: s(20),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PDP_COLORS.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(14),
  },
  stepperButton: {
    paddingHorizontal: s(4),
  },
  stepperSymbol: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(20),
    lineHeight: fs(20) * 1.2,
    color: PDP_COLORS.black,
  },
  quantity: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(20),
    lineHeight: fs(20) * 1.2,
    color: PDP_COLORS.black,
  },
  priceCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(8),
  },
  price: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(20),
    lineHeight: fs(20) * 1.15,
    color: PDP_COLORS.black,
    textAlign: 'center',
  },
  mrp: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    lineHeight: fs(12) * 1.15,
    color: PDP_COLORS.muted,
    textAlign: 'center',
    textDecorationLine: 'line-through',
    textDecorationColor: PDP_COLORS.muted,
    marginTop: s(1),
  },
  action: {
    width: s(140),
    height: s(47),
    borderRadius: s(10),
    backgroundColor: PDP_COLORS.orange,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(8),
  },
  actionDisabled: {
    backgroundColor: PDP_COLORS.cardBorder,
  },
  actionText: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(14),
    color: PDP_COLORS.white,
  },
});

export default BottomBar;
