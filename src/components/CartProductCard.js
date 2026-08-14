import { View, Text, StyleSheet, Platform } from 'react-native';
import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCart } from '../context/CartContext';
import CONFIG from '../globals/config';
import ConfirmationModal from './ConfirmationModal';
import { FONTS } from '../styles/typography';
import { getCartItemAvailability } from '../utils/cartAvailability';
import AnimatedPressable from './AnimatedPressable';
import CartText from '../screens/cart/components/atoms/CartText';
import QtyStepper from '../screens/cart/components/atoms/QtyStepper';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  wp,
  hp,
} from '../styles/cartTheme';
import { ACCENT, RADIUS, TYPE, MAX_FONT_SCALE } from '../styles/homeTheme';

const SOLD_OUT_IMAGE_OPACITY = 0.4;
const UD_TOKEN_ICON = 'ticket-confirmation-outline';
const UD_TOKEN_ICON_SIZE = 12;

const CartProductCard = props => {
  const { changeCartItemQuantity, removeFromCart, updatingItems } = useCart();

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
    cartItemId: itemCartItemId,
  } = item;

  const productName = prName || name || 'Product';
  const cartItemId = itemCartItemId || productId || id;
  const unitPrice = itemUnitPrice || mrp || 0;
  const specialPrice = itemSpecialPrice || price || 0;
  const { isSoldOut, label: soldOutLabel } = getCartItemAvailability(item);
  const isUpdating = updatingItems.includes(String(cartItemId));
  const btokens = item.totalBtokens || item.bTokenValue || item.bTokens || 0;

  const hasDiscount = unitPrice > specialPrice && specialPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((unitPrice - specialPrice) / unitPrice) * 100)
    : 0;

  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(item.addedQty || item.quantity || 1);
  const [isRemovalModalVisible, setIsRemovalModalVisible] = useState(false);
  const quantityRef = useRef(quantity);
  const imageOpacity = useSharedValue(0);

  useEffect(() => {
    const synced = item.addedQty || item.quantity || 1;
    setQuantity(synced);
    quantityRef.current = synced;
  }, [item.quantity, item.addedQty]);

  useEffect(() => {
    setImageError(false);
    imageOpacity.value = 0;
  }, [featuredImage, imageOpacity]);

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value * (isSoldOut ? SOLD_OUT_IMAGE_OPACITY : 1),
  }));

  const imageSource = useMemo(() => {
    if (imageError || !featuredImage) {
      return require('../assets/images/udenDealNotfound.png');
    }
    if (typeof featuredImage === 'string' && featuredImage.startsWith('http')) {
      return { uri: featuredImage };
    }
    return { uri: `${CONFIG.image_base_url}${featuredImage}` };
  }, [featuredImage, imageError]);

  const handleDecrease = useCallback(() => {
    if (quantityRef.current > 1 && !isSoldOut) {
      quantityRef.current -= 1;
      setQuantity(quantityRef.current);
      changeCartItemQuantity(cartItemId, -1, pincodeAreaIdOverride);
    } else {
      setIsRemovalModalVisible(true);
    }
  }, [isSoldOut, cartItemId, pincodeAreaIdOverride, changeCartItemQuantity]);

  const handleIncrease = useCallback(() => {
    quantityRef.current += 1;
    setQuantity(quantityRef.current);
    changeCartItemQuantity(cartItemId, 1, pincodeAreaIdOverride);
  }, [cartItemId, pincodeAreaIdOverride, changeCartItemQuantity]);

  const handleDelete = useCallback(() => {
    setIsRemovalModalVisible(true);
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.imageWell}>
        <Animated.Image
          style={[styles.image, imageAnimatedStyle]}
          source={imageSource}
          onLoadEnd={() => {
            imageOpacity.value = withTiming(1, { duration: 220 });
          }}
          onError={() => {
            setImageError(true);
            imageOpacity.value = withTiming(1, { duration: 220 });
          }}
        />

        {hasDiscount && !isSoldOut && discountPercent > 0 && (
          <View style={styles.discountFlag}>
            <CartText variant="micro" tone="onDark" numberOfLines={1}>
              {discountPercent}% OFF
            </CartText>
          </View>
        )}

        {isSoldOut && (
          <View style={styles.soldOutOverlay}>
            <View style={styles.soldOutPill}>
              <Text
                style={styles.soldOutText}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {soldOutLabel}
              </Text>
            </View>
          </View>
        )}

        <AnimatedPressable
          style={styles.removeBtn}
          onPress={handleDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <AntDesign
            name="close"
            size={wp('3%')}
            color={CART_COLORS.textMuted}
          />
        </AnimatedPressable>
      </View>

      <View style={styles.info}>
        <View style={styles.copy}>
          <CartText
            variant="label"
            tone={isSoldOut ? 'muted' : 'primary'}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {productName}
          </CartText>

          {isSoldOut ? (
            <CartText variant="micro" tone="danger">
              Remove to place order
            </CartText>
          ) : btokens > 0 ? (
            <View style={styles.tokenRow}>
              <MaterialCommunityIcons
                name={UD_TOKEN_ICON}
                size={UD_TOKEN_ICON_SIZE}
                color={ACCENT.action}
              />
              <Text
                style={styles.tokenText}
                numberOfLines={1}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                {`${btokens} UD ${Number(btokens) > 1 ? 'Tokens' : 'Token'}`}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.footerRow}>
          <View style={styles.priceBlock}>
            <CartText variant="price" tone={isSoldOut ? 'muted' : 'primary'}>
              ₹{specialPrice}
            </CartText>
            {hasDiscount && (
              <CartText variant="micro" tone="faint" style={styles.strike}>
                ₹{unitPrice}
              </CartText>
            )}
          </View>

          {!disableManage && (
            <QtyStepper
              quantity={quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              disabled={isSoldOut}
              updating={isUpdating}
            />
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
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingVertical: hp('1.4%'),
    gap: CART_SPACING.md,
  },
  imageWell: {
    width: wp('20%'),
    borderWidth: 1,
    borderColor: 'rgba(208, 207, 207, 0.32)',
    height: wp('20%'),
    backgroundColor: CART_COLORS.card,
    borderRadius: CART_RADIUS.productCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '76%',
    height: '76%',
    resizeMode: 'contain',
  },
  discountFlag: {
    position: 'absolute',
    bottom: -CART_SPACING.xs,
    alignSelf: 'center',
    backgroundColor: CART_COLORS.success,
    paddingHorizontal: CART_SPACING.sm,
    paddingVertical: 1,
    borderRadius: CART_RADIUS.pill,
  },
  soldOutOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: CART_RADIUS.productCard,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.66)',
  },
  soldOutPill: {
    backgroundColor: CART_COLORS.textPrimary,
    maxWidth: '92%',
    paddingHorizontal: CART_SPACING.sm,
    paddingVertical: 3,
    borderRadius: CART_RADIUS.pill,
  },
  soldOutText: {
    fontSize: wp('2.6%'),
    color: CART_COLORS.onPrimary,
    fontFamily: FONTS.gilroy.bold,
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
    ...Platform.select({
      ios: {
        shadowColor: '#0B1020',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: CART_COLORS.border,
      },
    }),
    zIndex: 11,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: wp('20%'),
    gap: CART_SPACING.sm,
  },
  copy: {
    gap: CART_SPACING.xs,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    maxWidth: '100%',
    minHeight: TYPE.micro.lineHeight,
    backgroundColor: ACCENT.actionSoft,
    borderRadius: RADIUS.xs,
    paddingHorizontal: 5,
    paddingVertical: 1,
    gap: 3,
  },
  tokenText: {
    ...TYPE.micro,
    color: ACCENT.action,
    fontFamily: FONTS.gilroy.bold,
    flexShrink: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: CART_SPACING.sm,
  },
  priceBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: CART_SPACING.xs,
  },
  strike: {
    textDecorationLine: 'line-through',
  },
});

export default React.memo(CartProductCard);
