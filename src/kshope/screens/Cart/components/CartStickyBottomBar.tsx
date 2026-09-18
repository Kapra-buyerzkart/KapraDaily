import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CART_COLORS, CART_FONTS, fs, s } from '../cartRedesignTheme';

type Props = {
  toPay: number;
  mrpTotal?: number;
  totalSavings?: number;
  onViewDetails: () => void;
  onPlaceOrder: () => void;
};

export const CartStickyBottomBar: React.FC<Props> = ({
  toPay,
  mrpTotal,
  totalSavings = 0,
  onViewDetails,
  onPlaceOrder,
}) => {
  const insets = useSafeAreaInsets();
  const effectiveMrp = mrpTotal && mrpTotal > toPay ? mrpTotal : 0;
  const savingsPct =
    effectiveMrp > 0 && totalSavings > 0
      ? Math.round((totalSavings / effectiveMrp) * 100)
      : 0;

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, s(12)) }]}>
      <View style={styles.container}>
        {/* Left Side: Pricing & Details toggle */}
        <View style={styles.priceCol}>
          <View style={styles.priceRow}>
            <Text style={styles.toPayText}>₹{toPay.toLocaleString('en-IN')}</Text>
            {effectiveMrp > 0 && (
              <Text style={styles.mrpText}>₹{effectiveMrp.toLocaleString('en-IN')}</Text>
            )}
          </View>

          {totalSavings > 0 && (
            <Text style={styles.savingsText}>
              You save ₹{totalSavings.toLocaleString('en-IN')}{' '}
              {savingsPct > 0 ? `(${savingsPct}%)` : ''}
            </Text>
          )}

          <TouchableOpacity
            testID="cart-view-details-btn"
            activeOpacity={0.7}
            onPress={onViewDetails}
            style={styles.viewDetailsBtn}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Text style={styles.viewDetailsText}>VIEW DETAILS</Text>
            <Ionicons name="chevron-up" size={s(12)} color={CART_COLORS.textDark} />
          </TouchableOpacity>
        </View>

        {/* Right Side: Place Order Button */}
        <TouchableOpacity
          testID="cart-place-order-btn"
          activeOpacity={0.88}
          onPress={onPlaceOrder}
          style={styles.placeOrderBtn}
        >
          <Text style={styles.placeOrderText}>Place Order</Text>
          <Ionicons name="chevron-forward" size={s(16)} color={CART_COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: CART_COLORS.white,
    borderTopWidth: 1,
    borderColor: '#ECEAE5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(16),
    paddingTop: s(10),
  },
  priceCol: {
    justifyContent: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: s(6),
  },
  toPayText: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(19),
    color: CART_COLORS.textDark,
  },
  mrpText: {
    fontFamily: CART_FONTS.sansRegular,
    fontSize: fs(12),
    color: '#8E8E8E',
    textDecorationLine: 'line-through',
  },
  savingsText: {
    fontFamily: CART_FONTS.sansMedium,
    fontSize: fs(11),
    color: '#0E8A44',
    marginTop: s(2),
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(2),
    marginTop: s(4),
  },
  viewDetailsText: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(10),
    color: CART_COLORS.textDark,
    letterSpacing: 0.3,
  },
  placeOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(6),
    backgroundColor: '#072D24',
    borderRadius: s(14),
    paddingVertical: s(12),
    paddingHorizontal: s(22),
  },
  placeOrderText: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(14.5),
    color: CART_COLORS.white,
  },
});
