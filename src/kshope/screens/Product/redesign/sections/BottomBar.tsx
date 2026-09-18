import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HOME_FONTS, fs, s } from '../../../Home/redesign/theme';
import { CartIcon, HeartSolidIcon } from '../icons';
import { PDP_COLORS } from '../theme';

type Props = {
  inWishlist: boolean;
  onToggleWishlist: () => void;
  inCart: boolean;
  outOfStock: boolean;
  onAddToCart: () => void;
  style?: any;
};

export const BottomBar: React.FC<Props> = ({
  inWishlist,
  onToggleWishlist,
  inCart,
  outOfStock,
  onAddToCart,
  style,
}) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(bottom, s(12)) },
        style,
      ]}
    >
      {/* ADD TO WISHLIST Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onToggleWishlist}
        style={[
          styles.button,
          styles.wishlistButton,
          inWishlist && styles.wishlistButtonActive,
        ]}
      >
        {inWishlist ? (
          <HeartSolidIcon
            width={16}
            height={16}
            color={PDP_COLORS.white}
            style={styles.btnIcon}
          />
        ) : null}
        <Text style={styles.buttonText} numberOfLines={1}>
          {inWishlist ? 'WISHLISTED' : 'ADD TO WISHLIST'}
        </Text>
      </TouchableOpacity>

      {/* ADD TO BAG Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={outOfStock}
        onPress={onAddToCart}
        style={[
          styles.button,
          styles.bagButton,
          outOfStock && styles.bagButtonDisabled,
        ]}
      >
        {!outOfStock ? (
          <CartIcon
            width={18}
            height={16}
            color={PDP_COLORS.white}
            style={styles.btnIcon}
          />
        ) : null}
        <Text style={styles.buttonText} numberOfLines={1}>
          {outOfStock ? 'OUT OF STOCK' : inCart ? 'ADDED TO BAG' : 'ADD TO BAG'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingTop: s(12),
    backgroundColor: PDP_COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#EBE6DF',
    gap: s(12),
  },
  button: {
    flex: 1,
    height: s(48),
    borderRadius: s(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(10),
  },
  btnIcon: {
    marginRight: s(8),
  },
  wishlistButton: {
    backgroundColor: PDP_COLORS.bottomWishlist,
  },
  wishlistButtonActive: {
    backgroundColor: PDP_COLORS.bottomWishlistActive,
  },
  bagButton: {
    backgroundColor: PDP_COLORS.bottomBag,
  },
  bagButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(12),
    letterSpacing: 0.8,
    color: PDP_COLORS.white,
    textTransform: 'uppercase',
  },
});

export default BottomBar;
