import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../../../styles/typography';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  wp,
  hp,
} from '../../../styles/cartTheme';

const WishlistCTA = ({ onPress }) => {
  return (
    <View style={styles.row}>
      <Ionicons name="heart" size={wp('4.5%')} color={CART_COLORS.pink} />
      <Text style={styles.text}>Add item from your wishlist</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.addBtn}
        onPress={onPress}
      >
        <Text style={styles.addBtnText}>+ Add</Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(WishlistCTA);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: CART_SPACING.lg,
    paddingVertical: CART_SPACING.md,
    borderTopWidth: 1,
    borderTopColor: CART_COLORS.border,
    borderStyle: 'dashed',
  },
  text: {
    flex: 1,
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.3%'),
    color: CART_COLORS.textPrimary,
    marginLeft: CART_SPACING.sm,
  },
  addBtn: {
    borderWidth: 1,
    borderColor: CART_COLORS.pink,
    borderRadius: CART_RADIUS.sm,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('0.6%'),
  },
  addBtnText: {
    fontFamily: FONTS.poppins.medium,
    fontSize: wp('3.1%'),
    color: CART_COLORS.pink,
  },
});
