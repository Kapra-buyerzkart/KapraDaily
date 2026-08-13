import React, { useMemo } from 'react';
import AnimatedPressable from '@/components/AnimatedPressable';
import { SURFACE, categoryTint } from '@/styles/homeTheme';
import ProductInfo from './components/ProductInfo';
import ProductMedia from './components/ProductMedia';
import useTokenProductCard from './hooks/useTokenProductCard';
import { resolveTintIndex } from './utils';
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
    liked,
    imageSource,
    isPlaceholder,
    isOpaqueImage,
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
    token,
    isOutOfStock,
    rating,
    deliveryEta,
  } = product;

  const tint = useMemo(
    () =>
      isOpaqueImage
        ? SURFACE.base
        : categoryTint(resolveTintIndex(index, productId)),
    [isOpaqueImage, index, productId],
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
      <ProductMedia
        imageSource={imageSource}
        isPlaceholder={isPlaceholder}
        isOutOfStock={isOutOfStock}
        onImageError={handleImageError}
        tint={tint}
        name={name}
        liked={liked}
        hideWishlist={hideWishlist}
        onToggleWishlist={handleToggleWishlist}
        quantity={quantity}
        isThreeColumn={isThreeColumn}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onAdd={handleAdd}
      />

      <ProductInfo
        name={name}
        weight={weight}
        price={price}
        mrp={mrp}
        offer={offer}
        token={token}
        rating={rating}
        deliveryEta={deliveryEta}
        showToken={!hideToken}
        isThreeColumn={isThreeColumn}
      />
    </AnimatedPressable>
  );
};

export default React.memo(TokenProductCard);
