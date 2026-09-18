import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CART_COLORS, CART_FONTS, fs, s } from '../cartRedesignTheme';

type Props = {
  cartCount: number;
  onBack: () => void;
  onWishlist: () => void;
  onCartPress?: () => void;
};

export const CartHeader: React.FC<Props> = ({
  cartCount,
  onBack,
  onWishlist,
  onCartPress,
}) => {
  return (
    <View style={styles.header}>
      {/* Left Back Button */}
      <TouchableOpacity
        testID="cart-back-button"
        activeOpacity={0.75}
        onPress={onBack}
        style={styles.iconCircleButton}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="chevron-back" size={s(20)} color={CART_COLORS.textDark} />
      </TouchableOpacity>

      {/* Right Action Icons: Heart (Wishlist) and Bag (Cart with count) */}
      <View style={styles.actions}>
        <TouchableOpacity
          testID="cart-wishlist-button"
          activeOpacity={0.75}
          onPress={onWishlist}
          style={styles.iconCircleButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="heart-outline" size={s(20)} color={CART_COLORS.textDark} />
        </TouchableOpacity>

        <TouchableOpacity
          testID="cart-bag-button"
          activeOpacity={0.75}
          onPress={onCartPress}
          style={styles.iconCircleButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="bag-outline" size={s(19)} color={CART_COLORS.textDark} />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(16),
    paddingTop: s(8),
    paddingBottom: s(12),
    backgroundColor: CART_COLORS.background,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  iconCircleButton: {
    width: s(38),
    height: s(38),
    borderRadius: s(19),
    borderWidth: 1,
    borderColor: '#ECEAE5',
    backgroundColor: CART_COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -s(2),
    right: -s(2),
    backgroundColor: '#07332C',
    minWidth: s(16),
    height: s(16),
    borderRadius: s(8),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(2),
    borderWidth: 1.5,
    borderColor: CART_COLORS.white,
  },
  badgeText: {
    color: CART_COLORS.white,
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(8.5),
    lineHeight: fs(11),
  },
});
