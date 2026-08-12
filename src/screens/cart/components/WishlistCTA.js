import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CartText from './atoms/CartText';
import IconDisc from './atoms/IconDisc';
import Divider from './atoms/Divider';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  wp,
  hp,
} from '../../../styles/cartTheme';

const WishlistCTA = ({ onPress }) => {
  return (
    <View>
      <Divider inset={CART_SPACING.lg} />
      <View style={styles.row}>
        <IconDisc size={wp('8.5%')} tone="pink">
          <Ionicons name="heart" size={wp('4.2%')} color={CART_COLORS.pink} />
        </IconDisc>

        <View style={styles.copy}>
          <CartText variant="labelStrong">Add from your wishlist</CartText>
          <CartText variant="micro" tone="muted">
            Saved items you may still want
          </CartText>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addBtn}
          onPress={onPress}
        >
          <CartText variant="micro" tone="pink">
            + Add
          </CartText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(WishlistCTA);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.md,
    paddingHorizontal: CART_SPACING.lg,
    paddingVertical: CART_SPACING.md,
  },
  copy: {
    flex: 1,
    gap: 1,
  },
  addBtn: {
    borderWidth: 1,
    borderColor: CART_COLORS.pink,
    backgroundColor: CART_COLORS.pinkTint,
    borderRadius: CART_RADIUS.pill,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('0.6%'),
  },
});
