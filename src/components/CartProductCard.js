import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import { useCart } from '../context/CartContext';
import CONFIG from '../globals/config';
import { useWishlist } from '../context/WishlistContext';
import ConfirmationModal from './ConfirmationModal';
import AnimatedPressable from './AnimatedPressable';
import { CART_COLORS, CART_RADIUS, CART_SPACING } from '../styles/cartTheme';
import COLORS from '@/styles/colors';

const BUMP_SPRING = { damping: 8, stiffness: 260, mass: 0.4 };

const CartProductCard = props => {
  const { updateCartItemQuantity, removeFromCart, updatingItems } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const { item, disableManage, pincodeAreaIdOverride } = props;
  const {
    productId,
    id,
    prName,
    name,
    featuredImage,
    unitPrice: itemUnitPrice,
    mrp,
    specialPrice: itemSpecialPrice,
    price,
    stockQty,
    isAvailable,
    cartItemId: itemCartItemId,
  } = item;

  const productName = prName || name || 'Product';
  const cartItemId = itemCartItemId || productId || id;
  const unitPrice = itemUnitPrice || mrp || 0;
  const specialPrice = itemSpecialPrice || price || 0;
  const isSoldOut = stockQty === 0 || stockQty === '0' || isAvailable === false;
  const isUpdating = updatingItems.includes(String(cartItemId));
  const btokens = item.totalBtokens || item.bTokenValue || item.bTokens || 0;

  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(item.addedQty || item.quantity || 1);
  const [isRemovalModalVisible, setIsRemovalModalVisible] = useState(false);
  // Mirror of `quantity` so rapid taps read the latest value synchronously,
  // even before React has re-rendered with the new state. Without this, two
  // quick taps both read the same stale `quantity` closure and send the same
  // value to the server.
  const quantityRef = useRef(quantity);
  const imageOpacity = useSharedValue(0);
  const qtyScale = useSharedValue(1);

  useEffect(() => {
    const synced = item.addedQty || item.quantity || 1;
    setQuantity(synced);
    quantityRef.current = synced;
    qtyScale.value = withSequence(
      withTiming(1.18, { duration: 100 }),
      withSpring(1, BUMP_SPRING),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.quantity, item.addedQty]);

  useEffect(() => {
    setImageError(false);
    imageOpacity.value = 0;
  }, [featuredImage, imageOpacity]);

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
  }));

  const qtyAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: qtyScale.value }],
  }));

  // Get image source
  const imageSource = useMemo(() => {
    if (imageError || !featuredImage) {
      return require('../assets/images/udenDealNotfound.png');
    }
    if (typeof featuredImage === 'string' && featuredImage.startsWith('http')) {
      return { uri: featuredImage };
    }
    return { uri: `${CONFIG.image_base_url}${featuredImage}` };
  }, [featuredImage, imageError]);

  // Handle quantity change. Read/advance the ref (not the `quantity` closure)
  // so several taps fired before the next render still increment correctly.
  const handleDecrease = useCallback(() => {
    if (quantityRef.current > 1 && !isSoldOut) {
      const next = quantityRef.current - 1;
      quantityRef.current = next;
      setQuantity(next);
      updateCartItemQuantity(cartItemId, next, pincodeAreaIdOverride);
    } else {
      setIsRemovalModalVisible(true);
    }
  }, [isSoldOut, cartItemId, pincodeAreaIdOverride, updateCartItemQuantity]);

  const handleIncrease = useCallback(() => {
    const next = quantityRef.current + 1;
    quantityRef.current = next;
    setQuantity(next);
    updateCartItemQuantity(cartItemId, next, pincodeAreaIdOverride);
  }, [cartItemId, pincodeAreaIdOverride, updateCartItemQuantity]);

  const handleDelete = useCallback(() => {
    setIsRemovalModalVisible(true);
  }, []);

  return (
    <View
      style={[
        styles.productCardView,
        isSoldOut && styles.productCardViewSoldOut,
      ]}
    >
      <View
        style={[
          styles.productImageView,
          isSoldOut && styles.productImageViewSoldOut,
        ]}
      >
        <Animated.Image
          style={[styles.productImageStyle, imageAnimatedStyle]}
          source={imageSource}
          onLoadEnd={() => {
            imageOpacity.value = withTiming(1, { duration: 220 });
          }}
          onError={() => {
            setImageError(true);
            imageOpacity.value = withTiming(1, { duration: 220 });
          }}
        />

        <AnimatedPressable
          style={styles.removeBtn}
          onPress={handleDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AntDesign
            name="close"
            size={wp('3%')}
            color={CART_COLORS.textMuted}
          />
        </AnimatedPressable>
      </View>

      <View style={styles.productInfo}>
        <View style={styles.infoRow}>
          {isSoldOut ? (
            <View style={styles.soldOutInfoColumn}>
              <View style={styles.soldOutBadge}>
                <Text style={styles.soldOutBadgeText}>Sold Out</Text>
              </View>
              <Text
                style={styles.removeToPlaceOrderText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Remove to place order
              </Text>
            </View>
          ) : (
            <Text
              style={styles.productNameText}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {productName}
            </Text>
          )}

          <View style={styles.productPrizeView}>
            {unitPrice !== specialPrice && (
              <Text style={styles.mrpText}>₹{unitPrice}</Text>
            )}

            <Text style={styles.sellingPriceText}>₹{specialPrice}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.countColumn}>
            {!isSoldOut && btokens > 0 && (
              <View style={styles.btokenContainerSmall}>
                <Image
                  style={styles.btokenImageSmall}
                  source={require('../assets/icons/tokenud.png')}
                />
                <Text style={styles.btokenTextSmall}>{btokens} UD Token</Text>
              </View>
            )}
            {/* {!isSoldOut && (
              <Text style={styles.productCount}>{quantity} pcs</Text>
            )} */}
          </View>

          {!disableManage && (
            // Steppers stay mounted and tappable while a change syncs — we only
            // dim them to signal "saving". Swapping them for a spinner used to
            // lock the user out for the whole 500ms debounce + network trip and
            // defeated the debounce's rapid-tap batching.
            <View
              style={[
                styles.countContainer,
                isUpdating && styles.countContainerUpdating,
              ]}
            >
              <AnimatedPressable
                style={styles.stepperBtn}
                onPress={handleDecrease}
              >
                <Entypo
                  name="minus"
                  size={wp('3.6%')}
                  color={CART_COLORS.primary}
                />
              </AnimatedPressable>
              <Animated.Text style={[styles.countText, qtyAnimatedStyle]}>
                {quantity}
              </Animated.Text>
              <AnimatedPressable
                style={styles.stepperBtn}
                onPress={handleIncrease}
                disabled={isSoldOut}
              >
                <Entypo
                  name="plus"
                  size={wp('3.6%')}
                  color={CART_COLORS.primary}
                />
              </AnimatedPressable>
            </View>
          )}
        </View>
      </View>

      <ConfirmationModal
        visible={isRemovalModalVisible}
        onClose={() => setIsRemovalModalVisible(false)}
        onConfirm={() => removeFromCart(cartItemId, pincodeAreaIdOverride)}
        title="Remove Item"
        message={`Are you sure you want to remove "${productName}" from the cart?`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  productCardView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: hp('1.4%'),
  },
  productCardViewSoldOut: {
    borderRadius: CART_RADIUS.card,
    // backgroundColor: CART_COLORS.background,
    paddingHorizontal: CART_SPACING.sm,
  },
  soldOutInfoColumn: {
    flex: 1,
    alignItems: 'flex-start',
    marginRight: CART_SPACING.sm,
  },
  soldOutBadge: {
    backgroundColor: COLORS.error,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: hp('0.6%'),
  },
  soldOutBadgeText: {
    fontFamily: FONTS.gilroy.bold,
    color: '#FFFFFF',
    fontSize: wp('3%'),
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  removeToPlaceOrderText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('4%'),
    color: CART_COLORS.textGray,
  },
  productImageView: {
    width: wp('21.4%'),
    height: wp('21.4%'),
    backgroundColor: CART_COLORS.background,
    borderRadius: CART_RADIUS.productCard,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  productImageViewSoldOut: {
    backgroundColor: CART_COLORS.background,
  },
  productImageStyle: {
    width: '78%',
    height: '78%',
    resizeMode: 'contain',
  },
  removeBtn: {
    position: 'absolute',
    top: -CART_SPACING.xs,
    left: -CART_SPACING.xs,
    width: wp('5.5%'),
    height: wp('5.5%'),
    borderRadius: wp('2.75%'),
    backgroundColor: CART_COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 11,
  },
  productInfo: {
    flex: 1,
    paddingLeft: CART_SPACING.md,
    justifyContent: 'space-between',
    minHeight: wp('21.4%'),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productNameText: {
    flex: 1,
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.7%'),
    color: CART_COLORS.textPrimary,
    marginRight: CART_SPACING.sm,
  },
  countColumn: {
    alignSelf: 'flex-end',
    alignItems: 'flex-start',
    gap: hp('0.4%'),
  },
  productCount: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3%'),
    color: CART_COLORS.textMuted,
  },
  productPrizeView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mrpText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.1%'),
    color: CART_COLORS.textFaint,
    textDecorationLine: 'line-through',
    marginRight: wp('1.5%'),
  },
  sellingPriceText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.9%'),
    color: CART_COLORS.textPrimary,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CART_COLORS.card,
    borderRadius: CART_RADIUS.sm,
    borderWidth: 1,
    borderColor: CART_COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  countContainerUpdating: {
    opacity: 0.55,
  },
  stepperBtn: {
    width: wp('6.5%'),
    height: wp('6.5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: CART_COLORS.primary,
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.4%'),
    minWidth: wp('5%'),
    textAlign: 'center',
  },
  btokenContainerSmall: {
    flexDirection: 'row',
    marginBottom: CART_SPACING.xl,

    alignItems: 'center',
    // backgroundColor: '#F3E5F5',
    paddingHorizontal: wp('1.5%'),
    paddingVertical: hp('0.2%'),
    borderRadius: 4,
    gap: wp('1%'),
    alignSelf: 'flex-start',
  },
  btokenImageSmall: {
    width: wp('2.8%'),
    height: wp('2.8%'),
    resizeMode: 'contain',
  },
  btokenTextSmall: {
    fontFamily: FONTS.lexend.medium,
    fontSize: wp('2.5%'),
    color: '#5E3568',
  },
});

export default React.memo(CartProductCard);
