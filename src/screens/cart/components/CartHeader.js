import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import icons from '@/assets/icons';
import CartText from './atoms/CartText';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  hitSlopTo,
  wp,
  hp,
} from '../../../styles/cartTheme';

const CartHeader = ({ onBack, onClearAll, itemCount }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backBtn}
        hitSlop={hitSlopTo(24)}
        activeOpacity={0.7}
      >
        <Image source={icons.backArrowNew} style={styles.backIcon} />
      </TouchableOpacity>

      <View style={styles.titleBlock}>
        <CartText variant="title">Cart</CartText>
        {itemCount > 0 ? (
          <CartText variant="caption" tone="muted">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </CartText>
        ) : null}
      </View>

      <TouchableOpacity
        hitSlop={hitSlopTo(28)}
        onPress={onClearAll}
        activeOpacity={0.7}
        style={styles.clearAllBtn}
      >
        <Feather
          name="trash-2"
          size={wp('3.6%')}
          color={CART_COLORS.textMuted}
        />
        <CartText variant="micro" tone="muted">
          Clear all
        </CartText>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(CartHeader);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: CART_SPACING.lg,
    paddingVertical: hp('1.2%'),
    backgroundColor: CART_COLORS.card,
    gap: CART_SPACING.sm,
  },
  backBtn: {
    padding: CART_SPACING.xs,
  },
  backIcon: {
    resizeMode: 'contain',
    tintColor: CART_COLORS.textPrimary,
  },
  titleBlock: {
    flex: 1,
    marginLeft: CART_SPACING.xs,
  },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CART_COLORS.well,
    borderRadius: CART_RADIUS.pill,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('0.7%'),
    gap: CART_SPACING.xs,
  },
});
