import React from 'react';
import { View } from 'react-native';
import AnimatedPressable from '@/components/AnimatedPressable';
import ProductInfo from './components/ProductInfo';
import ProductMedia from './components/ProductMedia';
import useTokenProductCard from './hooks/useTokenProductCard';
import styles from './styles';

const TokenProductCard = ({
  item,
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
        <ProductMedia
          imageSource={imageSource}
          isPlaceholder={isPlaceholder}
          isOutOfStock={isOutOfStock}
          onImageError={handleImageError}
          offer={offer}
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
          token={token}
          rating={rating}
          deliveryEta={deliveryEta}
          showToken={!hideToken && quantity === 0}
          isThreeColumn={isThreeColumn}
        />
      </View>
    </AnimatedPressable>
  );
};

export default React.memo(TokenProductCard);
