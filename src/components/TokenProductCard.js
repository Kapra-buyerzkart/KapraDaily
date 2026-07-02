import React, { useCallback, useMemo, useState } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import CONFIG from '../globals/config';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

// Constants
const DEFAULT_PRODUCT_NAME = 'Lorem Ipsum is simply dummy textsimply dummy';
const DEFAULT_MRP = '394';
const DEFAULT_PRICE = '324';
const DEFAULT_WEIGHT = '1kg';
const DEFAULT_TOKEN_VALUE = '1';
const COUNTER_HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };
const WISHLIST_HIT_SLOP = 20;
const NO_IMAGE_SOURCE = require('../assets/images/udenDealNotfound.png');

// Styles
const styles = StyleSheet.create({
  // Layout
  cardContainer: {
    width: wp('35%'),
    marginVertical: hp('1%'),
    marginHorizontal: wp('1%'),
  },
  threeColumnContainer: {
    width: wp('29%'),
    marginHorizontal: wp('1%'),
  },
  topCardBox: {
    paddingVertical: hp('0.5%'),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: wp('1%'),
  },
  imageContainer: {
    marginTop: hp('0.5%'),
    paddingHorizontal: wp('2%'),
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: hp('1.2%'),
  },
  actionOverlay: {
    position: 'absolute',
    right: 3,
    bottom: 0,
  },
  bottomSection: {
    padding: hp(1),
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('0.3%'),
  },
  offerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('0.5%'),
  },

  // Cards
  cardSurface: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },

  // Buttons
  wishlistButton: {
    padding: 4,
    right: 4,
  },
  plusIconCircle: {
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: 8,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F25000',
  },
  plusIconCircleThreeColumn: {
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: wp('2%'),
  },
  plusIconDisabled: {
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: wp('1.8%'),
    backgroundColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIconDisabledThreeColumn: {
    width: wp('6%'),
    height: wp('6%'),
    borderRadius: wp('1.6%'),
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: wp('7%'),
    borderRadius: 8,
    backgroundColor: '#F25000',
  },
  counterBtn: {
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: wp('1.2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Images
  productImage: {
    width: wp('28%'),
    height: wp('26%'),
    resizeMode: 'contain',
  },
  productImageThreeColumn: {
    width: wp('22%'),
    height: wp('20%'),
  },
  productImageOutOfStock: {
    opacity: 0.5,
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 18,
  },

  // Typography
  tokenText: {
    fontSize: wp('2.2%'),
    color: '#5E3568',
    fontFamily: FONTS.gilroy.semiBold,
    marginLeft: wp('2.5%'),
  },
  tokenTextThreeColumn: {
    fontSize: wp('2%'),
  },
  counterQty: {
    fontSize: wp('3.5%'),
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.semiBold,
    top: Platform.OS === 'ios' ? 0 : 1,
  },
  counterQtyThreeColumn: {
    fontSize: wp('3.5%'),
  },
  priceText: {
    color: '#000000',
    fontSize: wp('3.8%'),
    fontFamily: FONTS.gilroy.semiBold,
  },
  priceTextThreeColumn: {
    fontSize: wp('2.8%'),
  },
  mrpLabel: {
    fontSize: wp('3.4%'),
    color: '#9B9B9B',
    top: Platform.OS === 'ios' ? 0 : 1,
    marginStart: wp('1%'),
    fontFamily: FONTS.gilroy.medium,
  },
  mrpLabelThreeColumn: {
    fontSize: wp('2.4%'),
  },
  mrpText: {
    textDecorationLine: 'line-through',
  },
  mrpTextNoDecoration: {
    textDecorationLine: 'none',
  },
  offerText: {
    color: '#0CA201',
    fontSize: wp('2.5%'),
    fontFamily: FONTS.gilroy.semiBold,
  },
  offerTextThreeColumn: {
    fontSize: wp('2.6%'),
  },
  dashedLine: {
    flex: 1,
    borderStyle: 'dashed',
    borderWidth: 0.6,
    borderColor: '#CFCFCF',
    marginLeft: wp('2%'),
  },
  productName: {
    fontSize: wp('3.3%'),
    color: '#2F2F2F',
    lineHeight: hp('2.2%'),
    fontFamily: FONTS.gilroy.medium,
    minHeight: hp('5%'),
  },
  productNameThreeColumn: {
    fontSize: wp('2.8%'),
    minHeight: hp('3.5%'),
    lineHeight: hp('1.8%'),
  },
  productWeight: {
    fontSize: wp('2.8%'),
    color: '#727783',
    marginTop: hp('0.5%'),
    fontFamily: FONTS.gilroy.regular,
  },
  productWeightThreeColumn: {
    fontSize: wp('2.4%'),
  },
  outOfStockText: {
    color: '#FF0000',
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('2.8%'),
    transform: [{ rotate: '-15deg' }],
    borderWidth: 1,
    borderColor: '#FF0000',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  outOfStockTextThreeColumn: {
    fontSize: wp('2.2%'),
  },
});

// Sub-components
const WishlistButton = React.memo(function WishlistButton({
  liked,
  isThreeColumn,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.wishlistButton}
      hitSlop={WISHLIST_HIT_SLOP}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Ionicons
        name={liked ? 'heart' : 'heart-outline'}
        size={isThreeColumn ? wp('4.6%') : wp('5.5%')}
        color={liked ? '#FF0048' : '#9B9B9B'}
      />
    </TouchableOpacity>
  );
});

const ProductImage = React.memo(function ProductImage({
  imageSource,
  isThreeColumn,
  isOutOfStock,
  onError,
}) {
  return (
    <>
      <Image
        source={imageSource}
        style={[
          styles.productImage,
          isThreeColumn && styles.productImageThreeColumn,
          isOutOfStock && styles.productImageOutOfStock,
        ]}
        resizeMode="contain"
        onError={onError}
      />
      {isOutOfStock && (
        <View style={styles.outOfStockOverlay}>
          <Text
            style={[
              styles.outOfStockText,
              isThreeColumn && styles.outOfStockTextThreeColumn,
            ]}
          >
            Out of Stock
          </Text>
        </View>
      )}
    </>
  );
});

const QuantityControl = React.memo(function QuantityControl({
  quantity,
  isOutOfStock,
  isThreeColumn,
  onIncrement,
  onDecrement,
  onAdd,
}) {
  if (quantity > 0) {
    return (
      <View style={styles.counterContainer}>
        <TouchableOpacity
          style={styles.counterBtn}
          hitSlop={COUNTER_HIT_SLOP}
          onPress={onDecrement}
        >
          <Entypo name="minus" size={isThreeColumn ? 16 : 22} color="#FFFFFF" />
        </TouchableOpacity>

        <Text
          style={[
            styles.counterQty,
            isThreeColumn && styles.counterQtyThreeColumn,
          ]}
        >
          {quantity}
        </Text>

        <TouchableOpacity
          style={styles.counterBtn}
          hitSlop={COUNTER_HIT_SLOP}
          onPress={onIncrement}
        >
          <Entypo name="plus" size={isThreeColumn ? 16 : 22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  }

  if (isOutOfStock) {
    return (
      <View
        style={[
          styles.plusIconDisabled,
          isThreeColumn && styles.plusIconDisabledThreeColumn,
        ]}
      >
        <Entypo name="plus" size={isThreeColumn ? 16 : 20} color="#FFFFFF" />
      </View>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onAdd}>
      <View
        style={[
          styles.plusIconCircle,
          isThreeColumn && styles.plusIconCircleThreeColumn,
        ]}
      >
        <Entypo name="plus" size={isThreeColumn ? 16 : 20} color="#F25000" />
      </View>
    </TouchableOpacity>
  );
});

const PriceSection = React.memo(function PriceSection({
  price,
  mrp,
  isThreeColumn,
}) {
  return (
    <View style={styles.priceContainer}>
      <Text
        style={[styles.priceText, isThreeColumn && styles.priceTextThreeColumn]}
      >
        ₹{price}
      </Text>

      {mrp !== price && (
        <Text
          style={[styles.mrpLabel, isThreeColumn && styles.mrpLabelThreeColumn]}
        >
          ₹
          <Text
            style={[
              styles.mrpText,
              mrp === price && styles.mrpTextNoDecoration,
            ]}
          >
            {mrp}
          </Text>
        </Text>
      )}
    </View>
  );
});

// Component
const TokenProductCard = ({
  item,
  onPress,
  onAdd,
  onToggleWishlist,
  isInWishlist: propIsInWishlist,
  hideWishlist,
  isThreeColumn,
  hideToken,
  containerStyle,
}) => {
  // State
  const [imageError, setImageError] = useState(false);

  const { addToCart, cartItems, updateCartItemQuantity, removeFromCart } =
    useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Derived values
  const { productId, name, mrp, price, offer, weight, token, isOutOfStock } =
    useMemo(() => {
      const derivedProductId = item?.productId || item?.id;
      const derivedTokenValue =
        item?.bTokenValue ||
        item?.token ||
        item?.btokens ||
        DEFAULT_TOKEN_VALUE;
      const discount =
        item?.offer || item?.discountPercentage || item?.discountPercent;

      return {
        productId: derivedProductId,
        name: item?.prName || item?.name || DEFAULT_PRODUCT_NAME,
        mrp: item?.mrp || item?.unitPrice || DEFAULT_MRP,
        price: item?.price || item?.specialPrice || DEFAULT_PRICE,
        offer: discount ? `${Math.round(discount)}% OFF` : '',
        weight: item?.weight || DEFAULT_WEIGHT,
        token: `${derivedTokenValue} UD ${
          Number(derivedTokenValue) > 1 ? 'Tokens' : 'Token'
        }`,
        isOutOfStock:
          item?.stockQty === 0 ||
          item?.stockQty === '0' ||
          item?.isAvailable === false,
      };
    }, [item]);

  const cartItem = useMemo(
    () =>
      cartItems.find(i => String(i.productId || i.id) === String(productId)),
    [cartItems, productId],
  );
  const quantity = cartItem?.quantity || cartItem?.addedQty || 0;
  const cartItemId = cartItem?.cartItemId || productId;

  const liked = useMemo(
    () =>
      propIsInWishlist ? propIsInWishlist(productId) : isInWishlist(productId),
    [propIsInWishlist, isInWishlist, productId],
  );

  const imageSource = useMemo(() => {
    const img =
      item?.featuredImage ||
      item?.productImage ||
      item?.image ||
      item?.img ||
      item?.imageUrl;

    if (!img || imageError) {
      return NO_IMAGE_SOURCE;
    }

    if (typeof img === 'string') {
      const uri = img.startsWith('http')
        ? img
        : `${CONFIG.image_base_url}${img}`;
      return { uri };
    }

    return img;
  }, [item, imageError]);

  // Callbacks
  const handleImageError = useCallback(() => setImageError(true), []);

  const handleToggleWishlist = useCallback(() => {
    if (onToggleWishlist) {
      onToggleWishlist(item);
    } else {
      toggleWishlist(item);
    }
  }, [onToggleWishlist, toggleWishlist, item]);

  const handleDecrement = useCallback(() => {
    if (quantity === 1) {
      removeFromCart(cartItemId);
    } else {
      updateCartItemQuantity(cartItemId, quantity - 1);
    }
  }, [quantity, cartItemId, removeFromCart, updateCartItemQuantity]);

  const handleIncrement = useCallback(() => {
    updateCartItemQuantity(cartItemId, quantity + 1);
  }, [cartItemId, quantity, updateCartItemQuantity]);

  const handleAdd = useCallback(() => {
    if (onAdd) {
      onAdd(item);
    } else {
      addToCart(item);
    }
  }, [onAdd, addToCart, item]);

  // JSX return
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.cardContainer,
        isThreeColumn && styles.threeColumnContainer,
        containerStyle,
      ]}
      onPress={onPress}
    >
      <View style={styles.cardSurface}>
        <View style={styles.topCardBox}>
          <View style={styles.topRow}>
            <View style={styles.topLeftRow}>
              {!hideToken && quantity === 0 ? (
                <Text
                  style={[
                    styles.tokenText,
                    isThreeColumn && styles.tokenTextThreeColumn,
                  ]}
                >
                  {token}
                </Text>
              ) : null}
            </View>

            <View>
              {!hideWishlist ? (
                <WishlistButton
                  liked={liked}
                  isThreeColumn={isThreeColumn}
                  onPress={handleToggleWishlist}
                />
              ) : null}
            </View>
          </View>
        </View>

        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <ProductImage
              imageSource={imageSource}
              isThreeColumn={isThreeColumn}
              isOutOfStock={isOutOfStock}
              onError={handleImageError}
            />

            <View style={styles.actionOverlay}>
              <QuantityControl
                quantity={quantity}
                isOutOfStock={isOutOfStock}
                isThreeColumn={isThreeColumn}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                onAdd={handleAdd}
              />
            </View>
          </View>

          <View style={styles.bottomSection}>
            <PriceSection
              price={price}
              mrp={mrp}
              isThreeColumn={isThreeColumn}
            />

            <View style={styles.offerRow}>
              <Text
                style={[
                  styles.offerText,
                  isThreeColumn && styles.offerTextThreeColumn,
                ]}
              >
                {offer}
              </Text>
              <View style={styles.dashedLine} />
            </View>

            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={[
                styles.productName,
                isThreeColumn && styles.productNameThreeColumn,
              ]}
            >
              {name}
            </Text>

            <Text
              style={[
                styles.productWeight,
                isThreeColumn && styles.productWeightThreeColumn,
              ]}
            >
              {weight}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(TokenProductCard);
