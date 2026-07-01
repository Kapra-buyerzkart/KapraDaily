import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useMemo, useEffect } from 'react';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
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
import { CART_COLORS, CART_RADIUS, CART_SPACING } from '../styles/cartTheme';

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

  useEffect(() => {
    setQuantity(item.addedQty || item.quantity || 1);
  }, [item.quantity, item.addedQty]);

  // Get image source
  const imageSource = useMemo(() => {
    if (imageError || !featuredImage) {
      return require('../assets/images/noimage.png');
    }
    if (typeof featuredImage === 'string' && featuredImage.startsWith('http')) {
      return { uri: featuredImage };
    }
    return { uri: `${CONFIG.image_base_url}${featuredImage}` };
  }, [featuredImage, imageError]);

  // Handle quantity change
  const handleDecrease = () => {
    if (quantity > 1 && !isSoldOut) {
      setQuantity(quantity - 1);
      updateCartItemQuantity(cartItemId, quantity - 1, pincodeAreaIdOverride);
    } else {
      setIsRemovalModalVisible(true);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
    updateCartItemQuantity(cartItemId, quantity + 1, pincodeAreaIdOverride);
  };

  const handleDelete = () => {
    setIsRemovalModalVisible(true);
  };

  return (
    <View style={styles.productCardView}>
      <View style={styles.productImageView}>
        {isSoldOut && (
          <View style={styles.overlayContainer} pointerEvents="none">
            {Platform.OS === 'ios' && (
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType="light"
                blurAmount={2.5}
                reducedTransparencyFallbackColor="rgba(0,0,0,0.4)"
              />
            )}
            <View style={styles.overlayDark} />

            {Platform.OS === 'android' && (
              <View style={styles.androidBlurFallback} />
            )}

            <View style={styles.soldOutContainer}>
              <LinearGradient
                colors={['#FF0000', '#FF8D8D']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.soldOutGradient}
              >
                <Text style={styles.soldOutText}>Sold Out</Text>
              </LinearGradient>
            </View>
          </View>
        )}

        <Image
          style={styles.productImageStyle}
          source={imageSource}
          onError={() => setImageError(true)}
        />

        <TouchableOpacity
          style={styles.removeBtn}
          onPress={handleDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AntDesign
            name="close"
            size={wp('3%')}
            color={CART_COLORS.textMuted}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.productInfo}>
        <View style={styles.infoRow}>
          <Text
            style={styles.productNameText}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {productName}
          </Text>

          <View style={styles.productPrizeView}>
            {unitPrice !== specialPrice && (
              <Text style={styles.mrpText}>₹{unitPrice}</Text>
            )}

            <Text style={styles.sellingPriceText}>₹{specialPrice}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.countColumn}>
            {btokens > 0 && (
              <View style={styles.btokenContainerSmall}>
                <Image
                  style={styles.btokenImageSmall}
                  source={require('../assets/icons/tokenud.png')}
                />
                <Text style={styles.btokenTextSmall}>{btokens} UD Token</Text>
              </View>
            )}
            <Text style={styles.productCount}>{quantity} pcs</Text>
          </View>

          {!disableManage && (
            <View style={styles.countContainer}>
              {isUpdating ? (
                <View style={styles.loaderWrapper}>
                  <ActivityIndicator size="small" color={CART_COLORS.primary} />
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={handleDecrease}
                  >
                    <Entypo
                      name="minus"
                      size={wp('3.6%')}
                      color={CART_COLORS.primary}
                    />
                  </TouchableOpacity>
                  <Text style={styles.countText}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={handleIncrease}
                    disabled={isSoldOut}
                  >
                    <Entypo
                      name="plus"
                      size={wp('3.6%')}
                      color={CART_COLORS.primary}
                    />
                  </TouchableOpacity>
                </>
              )}
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
  overlayContainer: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
    borderRadius: CART_RADIUS.productCard,
    overflow: 'hidden',
  },
  overlayDark: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  soldOutContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  soldOutGradient: {
    width: wp('27.9%'),
    height: hp('3.3%'),
    borderBottomRightRadius: wp('2.3%'),
    borderBottomLeftRadius: wp('2.3%'),
    justifyContent: 'center',
    alignItems: 'center',
    bottom: hp('2%'),
  },
  soldOutText: {
    fontFamily: FONTS.gilroy.bold,
    color: '#FFFFFF',
    fontSize: wp('4.18%'),
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
    fontFamily: FONTS.outfit.regular,
    fontSize: wp('3%'),
    color: CART_COLORS.textMuted,
  },
  productPrizeView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mrpText: {
    fontFamily: FONTS.outfit.regular,
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
  androidBlurFallback: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  btokenContainerSmall: {
    flexDirection: 'row',
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
  loaderWrapper: {
    width: wp('20%'),
    height: wp('6.5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(CartProductCard);
