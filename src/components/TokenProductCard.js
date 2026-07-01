import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import CONFIG from '../globals/config';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

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
  const [imageError, setImageError] = useState(false);

  const { addToCart, cartItems, updateCartItemQuantity, removeFromCart } =
    useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const productId = item?.productId || item?.id;
  const name =
    item?.prName ||
    item?.name ||
    'Lorem Ipsum is simply dummy textsimply dummy';
  const mrp = item?.mrp || item?.unitPrice || '394';
  const price = item?.price || item?.specialPrice || '324';
  const offer =
    item?.offer || item?.discountPercentage || item?.discountPercent
      ? `${Math.round(
          item?.offer || item?.discountPercentage || item?.discountPercent,
        )}% OFF`
      : '';
  const weight = item?.weight || '1kg';
  const tokenValue = item?.bTokenValue || item?.token || item?.btokens || '1';
  const token = `${tokenValue} UD ${
    Number(tokenValue) > 1 ? 'Tokens' : 'Token'
  }`;

  const liked = propIsInWishlist
    ? propIsInWishlist(productId)
    : isInWishlist(productId);

  const cartItem = cartItems.find(
    i => String(i.productId || i.id) === String(productId),
  );
  const quantity = cartItem?.quantity || cartItem?.addedQty || 0;
  const cartItemId = cartItem?.cartItemId || productId;

  const isOutOfStock =
    item?.stockQty === 0 ||
    item?.stockQty === '0' ||
    item?.isAvailable === false;

  const imageSource = useMemo(() => {
    const img =
      item?.featuredImage ||
      item?.productImage ||
      item?.image ||
      item?.img ||
      item?.imageUrl;

    if (!img || imageError) {
      return require('../assets/images/noimage.png');
    }

    if (typeof img === 'string') {
      const uri = img.startsWith('http')
        ? img
        : `${CONFIG.image_base_url}${img}`;
      return { uri };
    }

    return img;
  }, [item, imageError]);

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
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#F3F4F6',
        }}
      >
        <View style={styles.topCardBox}>
          <View style={styles.topRow}>
            <View style={styles.topLeftRow}>
              {!hideToken && quantity === 0 ? (
                <Text
                  style={[
                    styles.tokenText,
                    isThreeColumn && { fontSize: wp('2%') },
                  ]}
                >
                  {token}
                </Text>
              ) : null}
            </View>

            <View>
              {!hideWishlist ? (
                <TouchableOpacity
                  style={{ padding: 4, right: 4 }}
                  hitSlop={20}
                  activeOpacity={0.8}
                  onPress={() =>
                    onToggleWishlist
                      ? onToggleWishlist(item)
                      : toggleWishlist(item)
                  }
                >
                  <Ionicons
                    name={liked ? 'heart' : 'heart-outline'}
                    size={isThreeColumn ? wp('4.6%') : wp('5.5%')}
                    color={liked ? '#FF0048' : '#9B9B9B'}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>

        {/* Image Section */}
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={imageSource}
              style={[
                styles.productImage,
                isThreeColumn && { width: wp('22%'), height: wp('20%') },
                isOutOfStock && { opacity: 0.5 },
              ]}
              resizeMode="contain"
              onError={() => setImageError(true)}
            />
            {isOutOfStock && (
              <View style={styles.outOfStockOverlay}>
                <Text
                  style={[
                    styles.outOfStockText,
                    isThreeColumn && { fontSize: wp('2.2%') },
                  ]}
                >
                  Out of Stock
                </Text>
              </View>
            )}

            <View style={styles.actionOverlay}>
              {quantity > 0 ? (
                <View style={styles.counterContainer}>
                  <TouchableOpacity
                    style={styles.counterBtn}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    onPress={() => {
                      if (quantity === 1) {
                        removeFromCart(cartItemId);
                      } else {
                        updateCartItemQuantity(cartItemId, quantity - 1);
                      }
                    }}
                  >
                    <Entypo
                      name="minus"
                      size={isThreeColumn ? 16 : 22}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>

                  <Text
                    style={[
                      styles.counterQty,
                      { top: Platform.OS == 'ios' ? 0 : 1 },
                      isThreeColumn && { fontSize: wp('3.5%') },
                    ]}
                  >
                    {quantity}
                  </Text>

                  <TouchableOpacity
                    style={styles.counterBtn}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    onPress={() =>
                      updateCartItemQuantity(cartItemId, quantity + 1)
                    }
                  >
                    <Entypo
                      name="plus"
                      size={isThreeColumn ? 16 : 22}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                </View>
              ) : isOutOfStock ? (
                <View
                  style={[
                    styles.plusIconDisabled,
                    isThreeColumn && {
                      width: wp('6%'),
                      height: wp('6%'),
                      borderRadius: wp('1.6%'),
                    },
                  ]}
                >
                  <Entypo
                    name="plus"
                    size={isThreeColumn ? 16 : 20}
                    color="#FFFFFF"
                  />
                </View>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => (onAdd ? onAdd(item) : addToCart(item))}
                >
                  <View
                    style={[
                      styles.plusIconCircle,
                      isThreeColumn && {
                        width: wp('7%'),
                        height: wp('7%'),
                        borderRadius: wp('2%'),
                      },
                    ]}
                  >
                    <Entypo
                      name="plus"
                      size={isThreeColumn ? 16 : 20}
                      color="#F25000"
                    />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.priceContainer}>
              <Text
                style={[
                  styles.priceText,
                  isThreeColumn && { fontSize: wp('2.8%') },
                ]}
              >
                ₹{price}
              </Text>

              {mrp !== price && (
                <Text
                  style={[
                    styles.mrpLabel,
                    isThreeColumn && { fontSize: wp('2.4%') },
                  ]}
                >
                  ₹
                  <Text
                    style={[
                      styles.mrpText,
                      mrp === price && { textDecorationLine: 'none' },
                    ]}
                  >
                    {mrp}
                  </Text>
                </Text>
              )}
            </View>

            <View style={styles.offerRow}>
              <Text
                style={[
                  styles.offerText,
                  isThreeColumn && { fontSize: wp('2.6%') },
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
                isThreeColumn && {
                  fontSize: wp('2.8%'),
                  minHeight: hp('3.5%'),
                  lineHeight: hp('1.8%'),
                },
              ]}
            >
              {name}
            </Text>

            <Text
              style={[
                styles.productWeight,
                isThreeColumn && { fontSize: wp('2.4%') },
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

const styles = StyleSheet.create({
  cardContainer: {
    width: wp('35%'),
    marginVertical: hp('1%'),
    marginHorizontal: wp('1%'),
    // backgroundColor: 'red',
  },
  threeColumnContainer: {
    width: wp('29%'),
    marginHorizontal: wp('1%'),
  },

  topCardBox: {
    paddingVertical: hp('0.5%'),
  },
  heartIcon: {
    // height of image is handled inline
  },
  topLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: wp('1%'),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionEnd: {
    alignItems: 'flex-end',
  },

  tokenText: {
    fontSize: wp('2.2%'),
    color: '#5E3568',
    fontFamily: FONTS.gilroy.semiBold,
    marginLeft: wp('2.5%'),
  },

  actionOverlay: {
    position: 'absolute',
    right: 3,
    bottom: 0,
  },

  plusIconCircle: {
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: wp('2%'),
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F25000',
  },
  plusIconDisabled: {
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: wp('1.8%'),
    backgroundColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: wp('7%'),
    borderRadius: wp('2%'),
    backgroundColor: '#F25000',
  },

  counterBtn: {
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: wp('1.2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },

  counterQty: {
    fontSize: wp('3.5%'),
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.semiBold,
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

  imageFrame: {
    width: wp('6%'),
    height: wp('20%'),
    borderRadius: 18,
    borderWidth: 2,
    // borderColor: '#1B8CFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  productImage: {
    width: wp('28%'),
    height: wp('26%'),
    resizeMode: 'contain',
  },

  // tokenBadge: {
  //     position: 'absolute',
  //     top: hp('-1%'),
  //     alignSelf: 'center',
  //     backgroundColor: '#7B5AF5',
  //     paddingHorizontal: wp('3%'),
  //     paddingVertical: hp('0.4%'),
  //     borderRadius: 6,
  // },

  // tokenBadgeText: {
  //     color: '#FFF',
  //     fontSize: wp('2.5%'),
  //     fontFamily: 'Gilroy-fbold',
  // },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('0.3%'),
  },

  priceText: {
    color: '#000000',
    fontSize: wp('3.8%'),
    fontFamily: FONTS.gilroy.semiBold,
  },

  mrpLabel: {
    fontSize: wp('3.4%'),
    color: '#9B9B9B',
    top: Platform.OS === 'ios' ? 0 : 1,

    marginStart: wp('1%'),
    fontFamily: FONTS.gilroy.medium,
  },

  mrpText: {
    textDecorationLine: 'line-through',
  },

  bottomSection: {
    padding: hp(1),
    // marginTop: hp('0.8%'),
  },

  offerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('0.5%'),
  },

  offerTag: {
    // backgroundColor: 'red',
    paddingHorizontal: wp('1.5%'),
    paddingVertical: hp('0.2%'),

    borderRadius: wp('1%'),
  },

  offerTagEmpty: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },

  offerText: {
    color: '#0CA201',
    fontSize: wp('2.5%'),
    fontFamily: FONTS.gilroy.semiBold,
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

  productWeight: {
    fontSize: wp('2.8%'),
    color: '#727783',
    marginTop: hp('0.5%'),
    fontFamily: FONTS.gilroy.regular,
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
});
