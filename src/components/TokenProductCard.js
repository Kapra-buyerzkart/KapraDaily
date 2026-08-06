import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import CONFIG from '../globals/config';
import { useCart, useCartEntry } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import AnimatedPressable from './AnimatedPressable';
import ShimmerPlaceholder from './ShimmerPlaceholder';
import { impactTick, selectionTick } from '../utils/haptics';
import {
  INK,
  ACCENT,
  SURFACE,
  RADIUS,
  SPACE,
  TYPE,
  HAIRLINE,
  MAX_FONT_SCALE,
  hitSlopTo,
} from '@/styles/homeTheme';

const DEFAULT_TOKEN_VALUE = '1';
const NO_IMAGE_SOURCE = require('../assets/images/udenDealNotfound.png');
const UD_TOKEN_ICON = require('../assets/icons/tokenud.png');

const ACTION_H = 30;
const ACTION_W = 62;
const ACTION_H_SMALL = 28;
const ACTION_W_SMALL = 54;

const ACTION_HIT_SLOP = hitSlopTo(ACTION_H);
const COUNTER_HIT_SLOP = { top: 10, bottom: 10, left: 6, right: 6 };
const WISHLIST_HIT_SLOP = hitSlopTo(26);

const NAME_LINES = 2;

const styles = StyleSheet.create({
  cardContainer: {
    width: wp('35%'),
    marginVertical: hp('1%'),
    marginHorizontal: wp('1%'),
  },
  threeColumnContainer: {
    width: wp('29%'),
    marginHorizontal: wp('1%'),
  },

  cardSurface: {
    backgroundColor: SURFACE.base,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: HAIRLINE,
    padding: SPACE.sm,
  },
  cardSurfaceSmall: {
    padding: SPACE.xs + 2,
    borderRadius: RADIUS.sm,
  },

  mediaWrap: {
    width: '100%',
    position: 'relative',
  },
  mediaWell: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: RADIUS.sm,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  productImageFill: {
    width: '86%',
    height: '86%',
    resizeMode: 'contain',
  },
  productImageOutOfStock: {
    opacity: 0.45,
  },
  imageShimmer: {
    ...StyleSheet.absoluteFillObject,
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.66)',
  },
  outOfStockPill: {
    backgroundColor: INK.base,
    paddingHorizontal: SPACE.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
  },
  outOfStockText: {
    ...TYPE.micro,
    color: INK.onDark,
    fontFamily: FONTS.gilroy.bold,
  },

  discountBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: ACCENT.discount,
    paddingHorizontal: SPACE.sm - 2,
    paddingVertical: 2,
    borderTopLeftRadius: RADIUS.sm,
    borderBottomRightRadius: RADIUS.sm,
  },
  discountText: {
    ...TYPE.micro,
    fontSize: TYPE.micro.fontSize - 1,
    color: INK.onDark,
    fontFamily: FONTS.gilroy.bold,
    letterSpacing: 0.2,
  },

  wishlistButton: {
    position: 'absolute',
    top: SPACE.xs,
    right: SPACE.xs,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },

  actionDock: {
    position: 'absolute',
    right: 0,
    bottom: -(ACTION_H / 2),
  },
  actionDockSmall: {
    bottom: -(ACTION_H_SMALL / 2),
  },
  addButton: {
    width: ACTION_W,
    height: ACTION_H,
    borderRadius: RADIUS.xs,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SURFACE.base,
    borderWidth: 1.2,
    borderColor: ACCENT.primary,
  },
  addButtonSmall: {
    width: ACTION_W_SMALL,
    height: ACTION_H_SMALL,
  },
  addLabel: {
    ...TYPE.label,
    lineHeight: undefined,
    color: ACCENT.primary,
    fontFamily: FONTS.gilroy.bold,
    letterSpacing: 0.4,
  },
  addLabelSmall: {
    ...TYPE.caption,
    lineHeight: undefined,
  },
  addDisabled: {
    backgroundColor: SURFACE.sunken,
    borderColor: HAIRLINE,
  },
  addLabelDisabled: {
    color: INK.faint,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: ACTION_W,
    height: ACTION_H,
    borderRadius: RADIUS.xs,
    backgroundColor: ACCENT.primary,
  },
  counterContainerSmall: {
    width: ACTION_W_SMALL,
    height: ACTION_H_SMALL,
  },
  counterBtn: {
    width: ACTION_H,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnSmall: {
    width: ACTION_H_SMALL - 4,
  },
  counterQty: {
    ...TYPE.label,
    lineHeight: undefined,
    color: INK.onDark,
    fontFamily: FONTS.gilroy.bold,
  },

  info: {
    paddingTop: ACTION_H / 2 + SPACE.sm,
  },
  infoSmall: {
    paddingTop: ACTION_H_SMALL / 2 + SPACE.xs,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACE.xs,
  },
  tokenIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  tokenText: {
    ...TYPE.micro,
    color: '#5E3568',
    fontFamily: FONTS.gilroy.semiBold,
    marginLeft: SPACE.xs,
    flexShrink: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACE.xs,
    gap: SPACE.xs,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT.successSoft,
    borderRadius: RADIUS.xs,
    paddingHorizontal: 5,
    paddingVertical: 1,
    gap: 2,
  },
  ratingText: {
    ...TYPE.micro,
    color: ACCENT.successText,
    fontFamily: FONTS.gilroy.bold,
  },
  deliveryText: {
    ...TYPE.micro,
    color: INK.muted,
    fontFamily: FONTS.gilroy.medium,
  },

  productName: {
    ...TYPE.label,
    color: INK.base,
    fontFamily: FONTS.gilroy.semiBold,
    minHeight: TYPE.label.lineHeight * NAME_LINES,
    includeFontPadding: false,
  },
  productNameSmall: {
    ...TYPE.caption,
    minHeight: TYPE.caption.lineHeight * NAME_LINES,
  },
  productWeight: {
    ...TYPE.caption,
    color: INK.muted,
    fontFamily: FONTS.gilroy.regular,
    marginTop: 2,
    minHeight: TYPE.caption.lineHeight,
  },
  productWeightSmall: {
    ...TYPE.micro,
    minHeight: TYPE.micro.lineHeight,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: SPACE.xs + 2,
    flexWrap: 'wrap',
  },
  priceText: {
    ...TYPE.heading,
    lineHeight: undefined,
    color: INK.strong,
    fontFamily: FONTS.gilroy.bold,
  },
  priceTextSmall: {
    ...TYPE.body,
    lineHeight: undefined,
  },
  mrpText: {
    ...TYPE.caption,
    color: INK.faint,
    fontFamily: FONTS.gilroy.medium,
    textDecorationLine: 'line-through',
    marginLeft: SPACE.xs + 2,
  },
  mrpTextSmall: {
    ...TYPE.micro,
  },
});

const HEART_POP_SPRING = { damping: 8, stiffness: 300, mass: 0.5 };

const WishlistButton = React.memo(function WishlistButton({
  liked,
  productName,
  onPress,
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (liked) {
      scale.value = withSequence(
        withSpring(1.35, HEART_POP_SPRING),
        withSpring(1, HEART_POP_SPRING),
      );
    }
  }, [liked, scale]);

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      style={styles.wishlistButton}
      hitSlop={WISHLIST_HIT_SLOP}
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: liked }}
      accessibilityLabel={
        liked
          ? `Remove ${productName} from wishlist`
          : `Add ${productName} to wishlist`
      }
    >
      <Animated.View style={heartAnimatedStyle}>
        <Ionicons
          name={liked ? 'heart' : 'heart-outline'}
          size={16}
          color={liked ? '#FF0048' : INK.muted}
        />
      </Animated.View>
    </TouchableOpacity>
  );
});

const ProductImage = React.memo(function ProductImage({
  imageSource,
  isPlaceholder,
  isOutOfStock,
  onError,
}) {
  const [loaded, setLoaded] = useState(false);
  const opacity = useSharedValue(isPlaceholder ? 1 : 0);

  useEffect(() => {
    if (isPlaceholder) {
      setLoaded(true);
      opacity.value = 1;
    } else {
      setLoaded(false);
      opacity.value = 0;
    }
  }, [imageSource, isPlaceholder, opacity]);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    opacity.value = withTiming(1, { duration: 220 });
  }, [opacity]);

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <>
      <Animated.Image
        source={imageSource}
        style={[
          styles.productImageFill,
          isOutOfStock && styles.productImageOutOfStock,
          imageAnimatedStyle,
        ]}
        resizeMode="contain"
        onLoad={handleLoad}
        onError={onError}
        accessible={false}
      />
      {!isPlaceholder && !loaded && (
        <ShimmerPlaceholder style={styles.imageShimmer} />
      )}
      {isOutOfStock && (
        <View style={styles.outOfStockOverlay}>
          <View style={styles.outOfStockPill}>
            <Text
              style={styles.outOfStockText}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              Out of stock
            </Text>
          </View>
        </View>
      )}
    </>
  );
});

const ADD_SQUISH = { duration: 90 };
const ADD_POP_SPRING = { damping: 9, stiffness: 420, mass: 0.6 };
const ADD_SQUISH_SCALE = 0.88;
const COUNTER_FADE = { duration: 160 };

const QuantityControl = React.memo(function QuantityControl({
  quantity,
  isOutOfStock,
  isThreeColumn,
  productName,
  onIncrement,
  onDecrement,
  onAdd,
}) {
  const pop = useSharedValue(1);
  const counterIn = useSharedValue(quantity > 0 ? 1 : 0);
  const wasEmpty = useRef(quantity === 0);

  useEffect(() => {
    if (quantity > 0 && wasEmpty.current) {
      counterIn.value = 0;
      counterIn.value = withTiming(1, COUNTER_FADE);
    } else if (quantity === 0) {
      counterIn.value = 0;
    }
    wasEmpty.current = quantity === 0;
  }, [quantity, counterIn]);

  const dockAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pop.value }],
  }));

  const counterAnimatedStyle = useAnimatedStyle(() => ({
    opacity: counterIn.value,
    transform: [{ scale: pop.value * (0.9 + counterIn.value * 0.1) }],
  }));

  const handleAddPress = useCallback(() => {
    pop.value = withSequence(
      withTiming(ADD_SQUISH_SCALE, ADD_SQUISH),
      withSpring(1, ADD_POP_SPRING),
    );
    onAdd?.();
  }, [onAdd, pop]);

  if (quantity > 0) {
    return (
      <Animated.View
        style={[
          styles.counterContainer,
          isThreeColumn && styles.counterContainerSmall,
          counterAnimatedStyle,
        ]}
        accessibilityLabel={`${productName}, quantity ${quantity}`}
      >
        <AnimatedPressable
          style={[styles.counterBtn, isThreeColumn && styles.counterBtnSmall]}
          hitSlop={COUNTER_HIT_SLOP}
          onPress={onDecrement}
          accessibilityRole="button"
          accessibilityLabel={
            quantity === 1
              ? `Remove ${productName} from cart`
              : `Decrease ${productName} quantity`
          }
        >
          <Entypo name="minus" size={isThreeColumn ? 15 : 17} color="#FFFFFF" />
        </AnimatedPressable>

        <Text style={styles.counterQty} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          {quantity}
        </Text>

        <AnimatedPressable
          style={[styles.counterBtn, isThreeColumn && styles.counterBtnSmall]}
          hitSlop={COUNTER_HIT_SLOP}
          onPress={onIncrement}
          accessibilityRole="button"
          accessibilityLabel={`Increase ${productName} quantity`}
        >
          <Entypo name="plus" size={isThreeColumn ? 15 : 17} color="#FFFFFF" />
        </AnimatedPressable>
      </Animated.View>
    );
  }

  if (isOutOfStock) {
    return (
      <View
        style={[
          styles.addButton,
          isThreeColumn && styles.addButtonSmall,
          styles.addDisabled,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled: true }}
        accessibilityLabel={`${productName} is out of stock`}
      >
        <Text
          style={[
            styles.addLabel,
            isThreeColumn && styles.addLabelSmall,
            styles.addLabelDisabled,
          ]}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          ADD
        </Text>
      </View>
    );
  }

  return (
    <Animated.View style={dockAnimatedStyle}>
      <AnimatedPressable
        onPress={handleAddPress}
        hitSlop={ACTION_HIT_SLOP}
        style={[styles.addButton, isThreeColumn && styles.addButtonSmall]}
        accessibilityRole="button"
        accessibilityLabel={`Add ${productName} to cart`}
      >
        <Text
          style={[styles.addLabel, isThreeColumn && styles.addLabelSmall]}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          ADD
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
});

const PriceSection = React.memo(function PriceSection({
  price,
  mrp,
  isThreeColumn,
}) {
  const hasMrp = !!mrp && mrp !== price;

  return (
    <View style={styles.priceRow}>
      <Text
        style={[styles.priceText, isThreeColumn && styles.priceTextSmall]}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        ₹{price}
      </Text>

      {hasMrp && (
        <Text
          style={[styles.mrpText, isThreeColumn && styles.mrpTextSmall]}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          ₹{mrp}
        </Text>
      )}
    </View>
  );
});

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
  entering,
}) => {
  const [imageError, setImageError] = useState(false);

  const { addToCart, updateCartItemQuantity, removeFromCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const {
    productId,
    name,
    mrp,
    price,
    offer,
    weight,
    token,
    isOutOfStock,
    rating,
    deliveryEta,
  } = useMemo(() => {
    const derivedProductId = item?.productId || item?.id;
    const derivedTokenValue =
      item?.bTokenValue || item?.token || item?.btokens || DEFAULT_TOKEN_VALUE;
    const discount =
      item?.offer || item?.discountPercentage || item?.discountPercent;
    const derivedRating = item?.rating ?? item?.avgRating ?? item?.ratingValue;
    const derivedEta =
      item?.deliveryTime ?? item?.deliveryEta ?? item?.eta ?? null;

    return {
      productId: derivedProductId,
      name: item?.prName || item?.name || '',
      mrp: item?.mrp || item?.unitPrice || '',
      price: item?.price || item?.specialPrice || '',
      offer: discount ? `${Math.round(discount)}% OFF` : '',
      weight: item?.weight,
      token: `${derivedTokenValue} UD ${
        Number(derivedTokenValue) > 1 ? 'Tokens' : 'Token'
      }`,
      isOutOfStock:
        item?.stockQty === 0 ||
        item?.stockQty === '0' ||
        item?.isAvailable === false,
      rating: derivedRating ? Number(derivedRating).toFixed(1) : null,
      deliveryEta: derivedEta,
    };
  }, [item]);

  const { quantity, cartItemId } = useCartEntry(productId);

  const liked = useMemo(
    () =>
      propIsInWishlist ? propIsInWishlist(productId) : isInWishlist(productId),
    [propIsInWishlist, isInWishlist, productId],
  );

  const rawImage =
    item?.featuredImage ||
    item?.productImage ||
    item?.image ||
    item?.img ||
    item?.imageUrl;

  useEffect(() => {
    setImageError(false);
  }, [rawImage]);

  const imageSource = useMemo(() => {
    if (!rawImage || imageError) {
      return NO_IMAGE_SOURCE;
    }

    if (typeof rawImage === 'string') {
      const uri = rawImage.startsWith('http')
        ? rawImage
        : `${CONFIG.image_base_url}${rawImage}`;
      return { uri };
    }

    return rawImage;
  }, [rawImage, imageError]);

  const handleImageError = useCallback(() => setImageError(true), []);

  const handleToggleWishlist = useCallback(() => {
    selectionTick();
    if (onToggleWishlist) {
      onToggleWishlist(item);
    } else {
      toggleWishlist(item);
    }
  }, [onToggleWishlist, toggleWishlist, item]);

  const handleDecrement = useCallback(() => {
    selectionTick();
    if (quantity === 1) {
      removeFromCart(cartItemId);
    } else {
      updateCartItemQuantity(cartItemId, quantity - 1);
    }
  }, [quantity, cartItemId, removeFromCart, updateCartItemQuantity]);

  const handleIncrement = useCallback(() => {
    selectionTick();
    updateCartItemQuantity(cartItemId, quantity + 1);
  }, [cartItemId, quantity, updateCartItemQuantity]);

  const handleAdd = useCallback(() => {
    impactTick();
    if (onAdd) {
      onAdd(item);
    } else {
      addToCart(item);
    }
  }, [onAdd, addToCart, item]);

  const cardAccessibilityLabel = useMemo(() => {
    const parts = [name];
    if (weight) parts.push(weight);
    parts.push(`₹${price}`);
    if (mrp && mrp !== price) parts.push(`MRP ₹${mrp}`);
    if (offer) parts.push(offer);
    if (isOutOfStock) parts.push('Out of stock');
    return parts.filter(Boolean).join(', ');
  }, [name, weight, price, mrp, offer, isOutOfStock]);

  const showMetaRow = !!rating || !!deliveryEta;

  const accessibilityActions = useMemo(() => {
    const actions = [{ name: 'activate', label: 'View product' }];
    if (!isOutOfStock) {
      if (quantity > 0) {
        actions.push({ name: 'increment', label: 'Increase quantity' });
        actions.push({ name: 'decrement', label: 'Decrease quantity' });
      } else {
        actions.push({ name: 'addToCart', label: 'Add to cart' });
      }
    }
    if (!hideWishlist) {
      actions.push({
        name: 'toggleWishlist',
        label: liked ? 'Remove from wishlist' : 'Add to wishlist',
      });
    }
    return actions;
  }, [isOutOfStock, quantity, hideWishlist, liked]);

  const handleAccessibilityAction = useCallback(
    event => {
      switch (event.nativeEvent.actionName) {
        case 'addToCart':
          handleAdd();
          break;
        case 'increment':
          handleIncrement();
          break;
        case 'decrement':
          handleDecrement();
          break;
        case 'toggleWishlist':
          handleToggleWishlist();
          break;
        default:
          onPress?.();
      }
    },
    [
      handleAdd,
      handleIncrement,
      handleDecrement,
      handleToggleWishlist,
      onPress,
    ],
  );

  return (
    <AnimatedPressable
      entering={entering}
      style={[
        styles.cardContainer,
        isThreeColumn && styles.threeColumnContainer,
        containerStyle,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={cardAccessibilityLabel}
      accessibilityActions={accessibilityActions}
      onAccessibilityAction={handleAccessibilityAction}
    >
      <View
        style={[styles.cardSurface, isThreeColumn && styles.cardSurfaceSmall]}
        importantForAccessibility="no-hide-descendants"
      >
        <View style={styles.mediaWrap}>
          <View style={styles.mediaWell}>
            <ProductImage
              imageSource={imageSource}
              isPlaceholder={!rawImage || imageError}
              isOutOfStock={isOutOfStock}
              onError={handleImageError}
            />

            {!!offer && (
              <View style={styles.discountBadge}>
                <Text
                  style={styles.discountText}
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                >
                  {offer}
                </Text>
              </View>
            )}

            {!hideWishlist && (
              <WishlistButton
                liked={liked}
                productName={name}
                onPress={handleToggleWishlist}
              />
            )}
          </View>

          <View
            style={[styles.actionDock, isThreeColumn && styles.actionDockSmall]}
          >
            <QuantityControl
              quantity={quantity}
              isOutOfStock={isOutOfStock}
              isThreeColumn={isThreeColumn}
              productName={name}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onAdd={handleAdd}
            />
          </View>
        </View>

        <View style={[styles.info, isThreeColumn && styles.infoSmall]}>
          {!hideToken && quantity === 0 && (
            <View style={styles.tokenRow}>
              <Image source={UD_TOKEN_ICON} style={styles.tokenIcon} />
              <Text
                style={styles.tokenText}
                numberOfLines={1}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                {token}
              </Text>
            </View>
          )}

          {showMetaRow && (
            <View style={styles.metaRow}>
              {!!rating && (
                <View style={styles.ratingPill}>
                  <Ionicons name="star" size={9} color={ACCENT.successText} />
                  <Text
                    style={styles.ratingText}
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                  >
                    {rating}
                  </Text>
                </View>
              )}
              {!!deliveryEta && (
                <Text
                  style={styles.deliveryText}
                  numberOfLines={1}
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                >
                  {deliveryEta}
                </Text>
              )}
            </View>
          )}

          <Text
            numberOfLines={NAME_LINES}
            ellipsizeMode="tail"
            style={[
              styles.productName,
              isThreeColumn && styles.productNameSmall,
            ]}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {name}
          </Text>

          <Text
            numberOfLines={1}
            style={[
              styles.productWeight,
              isThreeColumn && styles.productWeightSmall,
            ]}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {weight}
          </Text>

          <PriceSection price={price} mrp={mrp} isThreeColumn={isThreeColumn} />
        </View>
      </View>
    </AnimatedPressable>
  );
};

export default React.memo(TokenProductCard);
