import { View, Text, StyleSheet, Platform, Image } from 'react-native';
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
import Toast from 'react-native-simple-toast';
import AntDesign from 'react-native-vector-icons/AntDesign';
import icons from '../assets/icons';
import { useCart } from '../context/CartContext';
import CONFIG from '../globals/config';
import ConfirmationModal from './ConfirmationModal';
import { FONTS } from '../styles/typography';
import { getCartItemAvailability } from '../utils/cartAvailability';
import {
  maxQtyMessage,
  resolveQuantityCeiling,
} from '../utils/cartQuantityLimits';
import AnimatedPressable from './AnimatedPressable';
import QtyStepper from '../screens/cart/components/atoms/QtyStepper';
import { wp, hp } from '../styles/cartTheme';

const SOLD_OUT_IMAGE_OPACITY = 0.4;

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
  const { maxQty, maxQtyIsStock } = resolveQuantityCeiling(item);
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
    if (maxQty !== null && quantityRef.current >= maxQty) {
      Toast.show(maxQtyMessage({ maxQty, maxQtyIsStock }), Toast.SHORT);
      return;
    }
    quantityRef.current += 1;
    setQuantity(quantityRef.current);
    changeCartItemQuantity(cartItemId, 1, pincodeAreaIdOverride);
  }, [
    cartItemId,
    pincodeAreaIdOverride,
    changeCartItemQuantity,
    maxQty,
    maxQtyIsStock,
  ]);

  const handleDelete = useCallback(() => {
    setIsRemovalModalVisible(true);
  }, []);

  return (
    <View style={styles.card}>
      {/* Top-left round close button */}
      <AnimatedPressable
        style={styles.removeBtn}
        onPress={handleDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <AntDesign name="close" size={10} color="#6B7280" />
      </AnimatedPressable>

      {/* Product Image Well */}
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
      </View>

      {/* Product Info & Controls */}
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text
            style={[styles.productTitle, isSoldOut && styles.mutedText]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {productName}
          </Text>

          {hasDiscount && !isSoldOut && discountPercent > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>
                {discountPercent}% OFF
              </Text>
            </View>
          )}
        </View>

        {isSoldOut ? (
          <Text style={styles.soldOutHelpText}>Remove to place order</Text>
        ) : btokens > 0 ? (
          <View style={styles.tokenPill}>
            <Image
              source={icons.udCoinUpdated || icons.udcoin}
              style={styles.coinIcon}
            />
            <Text style={styles.tokenText}>{`${btokens} tokens`}</Text>
          </View>
        ) : null}

        <View style={styles.footerRow}>
          <View style={styles.priceBlock}>
            <Text style={[styles.specialPrice, isSoldOut && styles.mutedText]}>
              ₹{specialPrice}/-
            </Text>
            {hasDiscount && (
              <Text style={styles.strikePrice}>₹ {unitPrice}/-</Text>
            )}
          </View>

          {!disableManage && (
            <QtyStepper
              quantity={quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              disabled={isSoldOut}
              updating={isUpdating}
              atMaxQty={maxQty !== null && quantity >= maxQty}
              productName={productName}
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
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8ECF2',
    padding: 12,
    marginHorizontal: wp('4%'),
    marginVertical: hp('0.5%'),
    position: 'relative',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,

    elevation: 5,
  },
  removeBtn: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  imageWell: {
    width: wp('22%'),
    height: wp('20%'),
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: wp('2%'),
    borderRightWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E5E7EB',
  },
  image: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  soldOutOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  soldOutPill: {
    backgroundColor: '#12131A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  soldOutText: {
    fontSize: wp('2.4%'),
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.bold,
  },
  info: {
    flex: 1,
    paddingLeft: wp('3%'),
    justifyContent: 'space-between',
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 6,
  },
  productTitle: {
    flex: 1,
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.7%'),
    color: '#000000',
    lineHeight: wp('4.6%'),
  },
  discountBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  discountBadgeText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('2.7%'),
    color: '#16A34A',
  },
  soldOutHelpText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.8%'),
    color: '#D93025',
  },
  tokenPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFF2E5',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 4,
  },
  coinIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  tokenText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('2.7%'),
    color: '#8D5200',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  priceBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  specialPrice: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.1%'),
    color: '#942D04',
  },
  strikePrice: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3%'),
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  mutedText: {
    color: '#9CA3AF',
  },
});

export default React.memo(CartProductCard);
