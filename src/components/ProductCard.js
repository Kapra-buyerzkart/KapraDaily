import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { FONTS } from '../styles/typography';
import { useNavigation } from '@react-navigation/native';

import CONFIG from '../globals/config';
import { useCart, useCartEntry } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

// Hoisted: require() is cached, but calling it inside the render path meant a
// module-registry lookup per card per render.
const NOT_FOUND_IMAGE = require('../assets/images/udenDealNotfound.png');
const COUNTER_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const PLUS_HIT_SLOP = { top: 15, bottom: 15, left: 15, right: 15 };
const PLUS_GRADIENT_COLORS = ['rgba(255,255,255,0.85)', 'rgba(242,80,0,0.55)'];
const GRADIENT_START = { x: 0, y: 0 };
const GRADIENT_END = { x: 1, y: 0 };

const ProductCard = props => {
  const [imageError, setImageError] = useState(false);
  const imageOpacity = useSharedValue(0);
  const heartScale = useSharedValue(1);

  // Hooks
  const navigation = useNavigation();
  const { addToCart, updateCartItemQuantity, removeFromCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const { item, hideWishlist } = props;
  const itemId = item.productId || item.id;
  const isLiked = isInWishlist(itemId);
  const isOutOfStock =
    item.stockQty === 0 || item.stockQty === '0' || item.isAvailable === false;

  // Indexed lookup instead of scanning the whole cart array per card.
  const { quantity, cartItemId } = useCartEntry(itemId);

  const name = item.prName || item.name || '';
  const price = item.specialPrice || item.price || '';
  const mrp = item.unitPrice || item.mrp || '';
  let offer = item.discountPercentage
    ? Math.round(item.discountPercentage)
    : item.offer || 0;
  if (!offer && mrp && price && mrp > price) {
    offer = Math.round(((mrp - price) / mrp) * 100);
  }
  // Memoised so the `source` prop keeps a stable identity across re-renders.
  // Rebuilding `{ uri }` every render handed Animated.Image a "changed" prop
  // each time, pushing a needless update across to the native image view.
  const rawImage = item.featuredImage || item.img || item.imageUrl;
  const imageSource = useMemo(() => {
    if (!rawImage || imageError) return NOT_FOUND_IMAGE; // Fallback on error or empty
    if (typeof rawImage === 'string') {
      if (rawImage.startsWith('http')) return { uri: rawImage };
      return { uri: `${CONFIG.image_base_url}${rawImage}` };
    }
    return rawImage;
  }, [rawImage, imageError]);

  const imageAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: imageOpacity.value * (isOutOfStock ? 0.5 : 1),
    }),
    [isOutOfStock],
  );

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const handleWishlistToggle = useCallback(() => {
    heartScale.value = withSequence(
      withTiming(1.3, { duration: 120 }),
      withSpring(1, { damping: 6, stiffness: 200 }),
    );
    toggleWishlist(item);
  }, [heartScale, toggleWishlist, item]);

  useEffect(() => {
    setImageError(false);
    imageOpacity.value = 0;
  }, [item.featuredImage, item.img, imageOpacity]);

  // Stable handler identities so the TouchableOpacity/Image children below are
  // not handed a new onPress on every cart tick.
  const handleOpenDetails = useCallback(
    () =>
      navigation.navigate('ProductDetailsScreen', {
        productId: itemId,
        product: item,
      }),
    [navigation, itemId, item],
  );

  const handleDecrement = useCallback(() => {
    if (quantity === 1) {
      removeFromCart(cartItemId);
    } else {
      updateCartItemQuantity(cartItemId, quantity - 1);
    }
  }, [quantity, cartItemId, removeFromCart, updateCartItemQuantity]);

  const handleIncrement = useCallback(
    () => updateCartItemQuantity(cartItemId, quantity + 1),
    [cartItemId, quantity, updateCartItemQuantity],
  );

  const handleAddToCart = useCallback(() => addToCart(item), [addToCart, item]);

  const handleImageLoadEnd = useCallback(() => {
    imageOpacity.value = withTiming(1, { duration: 220 });
  }, [imageOpacity]);

  const handleImageError = useCallback(() => {
    setImageError(true);
    imageOpacity.value = withTiming(1, { duration: 220 });
  }, [imageOpacity]);

  // console.log('ProductCard Render', item.id || item.productId);

  return (
    <TouchableOpacity onPress={handleOpenDetails} style={styles.productCard}>
      <View style={styles.productCardViewOne}>
        {!hideWishlist && (
          <TouchableOpacity onPress={handleWishlistToggle}>
            <Animated.View style={heartAnimatedStyle}>
              <FontAwesome
                name={isLiked ? 'heart' : 'heart-o'}
                size={wp('5.5%')}
                color={isLiked ? '#FF0048' : '#979797'}
              />
            </Animated.View>
          </TouchableOpacity>
        )}

        {quantity > 0 ? (
          <View style={styles.counterContainer}>
            <TouchableOpacity
              onPress={handleDecrement}
              style={styles.counterButton}
              hitSlop={COUNTER_HIT_SLOP}
            >
              <Entypo name="minus" size={wp('3.5%')} color="#F04B1B" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              onPress={handleIncrement}
              style={styles.counterButton}
              hitSlop={COUNTER_HIT_SLOP}
            >
              <Entypo name="plus" size={wp('3.5%')} color="#F04B1B" />
            </TouchableOpacity>
          </View>
        ) : isOutOfStock ? (
          <View style={styles.plusIconDisabled}>
            <Entypo name="plus" color="#FFFFFF" size={wp('4%')} />
          </View>
        ) : (
          <LinearGradient
            colors={PLUS_GRADIENT_COLORS}
            start={GRADIENT_START}
            end={GRADIENT_END}
            style={styles.plusIconGradient}
          >
            <TouchableOpacity
              style={styles.plusIconInner}
              onPress={handleAddToCart}
              hitSlop={PLUS_HIT_SLOP}
              activeOpacity={0.8}
            >
              <Entypo name="plus" color="#F25000" size={wp('6%')} />
            </TouchableOpacity>
          </LinearGradient>
        )}
      </View>
      <View style={styles.productCardViewTwo}>
        <Animated.Image
          source={imageSource}
          style={[styles.productCardImage, imageAnimatedStyle]}
          resizeMode="contain"
          onLoadEnd={handleImageLoadEnd}
          onError={handleImageError}
        />
        {isOutOfStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>

      <View style={styles.productCardViewThree}>
        <View>
          {offer > 0 ? (
            <Text style={styles.offerText}>{offer}% OFF</Text>
          ) : (
            <Text style={styles.offerText}> </Text>
          )}
          <Text style={styles.btokenText}>
            Upto {item.bTokenValue || item.bTokens || 1} UD Token
          </Text>
        </View>

        <View>
          <View style={styles.productCardViewFour}>
            {mrp !== price ? (
              <>
                <Text style={styles.mrpText}>MRP </Text>
                <Text
                  style={[
                    styles.mrpText,
                    {
                      textDecorationLine: 'line-through',
                      textDecorationColor: '#777777',
                    },
                  ]}
                >
                  ₹{mrp}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.mrpText}> </Text>
                <Text
                  style={[
                    styles.mrpText,
                    {
                      textDecorationLine: 'line-through',
                      textDecorationColor: '#777777',
                    },
                  ]}
                ></Text>
              </>
            )}
          </View>
          <View style={styles.priceView}>
            {/* <MaterialIcons name={'currency-rupee'} color={'#0CA201'} size={wp("3.7%")} style={{
                            bottom: hp("0.15%")
                        }} /> */}
            <Text style={styles.priceText}>₹{price}</Text>
          </View>
        </View>
      </View>
      <View
        style={
          {
            // alignSelf: "center"
          }
        }
      >
        <Text
          style={styles.productNameText}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: wp('34.7%'),
    height: hp('24.2%'),
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: wp('1.9%'),
    marginRight: wp('3.8%'),
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    elevation: 3,
    marginTop: hp('1.5%'),
  },
  productCardViewOne: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: "yellow",
  },
  btokenText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('2.3%'),
    color: '#5E3568',
  },
  plusIconGradient: {
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: '#F25000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIconInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIconDisabled: {
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: 100,
    backgroundColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.7,
    borderColor: '#F04B1B',
    borderRadius: 7,
    paddingHorizontal: wp('1.5%'),
    paddingVertical: hp('0.15%'),
  },
  counterButton: {
    padding: wp('0.5%'),
  },
  quantityText: {
    color: '#F04B1B',
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3%'),
    marginHorizontal: wp('1.5%'),
    minWidth: wp('3%'),
    textAlign: 'center',
  },
  productCardViewTwo: {
    // backgroundColor:"blue",
    alignItems: 'center',
  },
  productCardImage: {
    width: wp('24.65%'),
    height: wp('23.25%'),
  },
  productCardViewThree: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: "yellow",
    alignItems: 'center',
  },
  offerText: {
    color: '#F04B1B',
    fontSize: wp('2.5%'),
    fontFamily: FONTS.gilroy.semiBold,
  },
  productCardViewFour: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mrpText: {
    fontFamily: FONTS.gilroy.light,
    fontSize: wp('2.5%'),
    color: '#777777',
  },
  priceView: {
    // flexDirection: "row",
    alignItems: 'center',
    borderColor: '#0CA201',
    borderWidth: 1,
    borderRadius: 8,
    padding: wp('0.5%'),
  },
  priceText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.7%'),
    color: '#0CA201',
  },
  productNameText: {
    // fontFamily: "Gilroy-Light",
    fontFamily: FONTS.gilroy.light,
    fontSize: wp('3.25%'),
    color: '#000000',
    textAlign: 'center',
    marginTop: hp('0.5%'),
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
    borderRadius: 20,
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
    marginTop: hp('1.5%'),
  },
});

// Wrap in React.memo to prevent unnecessary re-renders
export default React.memo(ProductCard);
