import React, { useMemo } from 'react';
import { View, Text, Image } from 'react-native';
import AnimatedPressable from '@/components/AnimatedPressable';
import icons from '@/assets/icons';
import ProductImage from './components/ProductImage';
import WishlistButton from './components/WishlistButton';
import QuantityControl from './components/QuantityControl';
import useTokenProductCard from './hooks/useTokenProductCard';
import { formatAmount, resolveAmount } from './utils';
import styles from './styles';

const TokenProductCard = ({
  item,
  index,
  onPress,
  onAdd,
  onToggleWishlist,
  isInWishlist,
  hideWishlist,
  isThreeColumn,
  hideToken,
  containerStyle,
  entering,
}) => {
  const {
    product,
    quantity,
    isAtMaxQty,
    liked,
    imageSource,
    isPlaceholder,
    handleImageError,
    handleToggleWishlist,
    handleIncrement,
    handleDecrement,
    handleAdd,
    cardAccessibilityLabel,
    accessibilityActions,
    handleAccessibilityAction,
  } = useTokenProductCard({
    item,
    onAdd,
    onToggleWishlist,
    onPress,
    isInWishlist,
    hideWishlist,
  });

  const {
    productId,
    name,
    mrp,
    price,
    offer,
    weight,
    isOutOfStock,
  } = product;

  // Discount calculation
  const discountLabel = useMemo(() => {
    if (offer) return offer;
    const mrpNum = Number(mrp);
    const priceNum = Number(price);
    if (mrpNum > priceNum && priceNum > 0) {
      const pct = Math.round(((mrpNum - priceNum) / mrpNum) * 100);
      if (pct > 0) return `${pct}% OFF`;
    }
    return '';
  }, [offer, mrp, price]);

  // Price formatting
  const amount = resolveAmount(price);
  const priceLabel = formatAmount(amount) || amount;
  const hasMrp = !!mrp && Number(mrp) > Number(price);
  const mrpLabel = formatAmount(mrp) || mrp;

  // Coin / UD value formatting
  const tokenValue = useMemo(() => {
    const rawVal =
      item?.bTokenValue ??
      item?.token ??
      item?.btokens ??
      product?.tokenValue;
    if (rawVal != null) {
      const parsed = parseInt(rawVal, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 4; // Default matching +4 UD reference design
  }, [item, product]);

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
      {/* 1. Top Header Row: 50% OFF Badge (Left) + Wishlist Heart (Right) */}
      <View style={styles.topRow}>
        {discountLabel ? (
          <View
            style={[
              styles.discountBadge,
              isThreeColumn && styles.discountBadgeSmall,
            ]}
          >
            <Text
              style={[
                styles.discountText,
                isThreeColumn && styles.discountTextSmall,
              ]}
            >
              {discountLabel}
            </Text>
          </View>
        ) : (
          <View style={styles.topRowSpacer} />
        )}

        {!hideWishlist ? (
          <WishlistButton
            liked={liked}
            isThreeColumn={isThreeColumn}
            productName={name}
            onPress={handleToggleWishlist}
          />
        ) : null}
      </View>

      {/* 2. Product Image Centered */}
      <View
        style={[
          styles.imageContainer,
          isThreeColumn && styles.imageContainerSmall,
        ]}
      >
        <ProductImage
          imageSource={imageSource}
          isPlaceholder={isPlaceholder}
          isOutOfStock={isOutOfStock}
          onError={handleImageError}
        />
      </View>

      {/* 3. Product Weight */}
      <Text
        style={[styles.weightText, isThreeColumn && styles.weightTextSmall]}
        numberOfLines={1}
      >
        {weight || ' '}
      </Text>

      {/* 4. Product Name */}
      <Text
        style={[styles.titleText, isThreeColumn && styles.titleTextSmall]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {name}
      </Text>

      {/* 5. Price Row (Selling Price in Emerald Green + Struck-through MRP) */}
      <View style={styles.priceRow}>
        <Text
          style={[
            styles.sellingPriceText,
            isThreeColumn && styles.sellingPriceTextSmall,
          ]}
        >
          ₹{priceLabel}
        </Text>
        {hasMrp ? (
          <Text style={[styles.mrpText, isThreeColumn && styles.mrpTextSmall]}>
            ₹{mrpLabel}
          </Text>
        ) : null}
      </View>

      {/* 6. Bottom Action Row: +4 UD Coin Pill (Left) + + ADD Button (Right) */}
      <View style={styles.bottomRow}>
        {!hideToken ? (
          <View
            style={[styles.coinPill, isThreeColumn && styles.coinPillSmall]}
          >
            <Image
              source={icons.udCoinNew || icons.udcoin}
              style={[styles.coinIcon, isThreeColumn && styles.coinIconSmall]}
            />
            <Text
              style={[styles.coinText, isThreeColumn && styles.coinTextSmall]}
            >
              +{tokenValue} UD
            </Text>
          </View>
        ) : (
          <View />
        )}

        <QuantityControl
          quantity={quantity}
          isAtMaxQty={isAtMaxQty}
          isOutOfStock={isOutOfStock}
          isThreeColumn={isThreeColumn}
          productName={name}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onAdd={handleAdd}
        />
      </View>
    </AnimatedPressable>
  );
};

export default React.memo(TokenProductCard);
