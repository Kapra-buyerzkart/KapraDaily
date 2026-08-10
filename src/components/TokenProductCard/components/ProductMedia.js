import React, { useMemo } from 'react';
import { View } from 'react-native';
import ProductImage from './ProductImage';
import QuantityControl from './QuantityControl';
import WishlistButton from './WishlistButton';
import styles from '../styles';

/**
 * Tinted square image well plus its overlays. The wishlist heart and the action
 * dock are siblings of the well rather than children, so the dock's overhang is
 * not clipped by the well's `overflow: hidden`.
 */
const ProductMedia = ({
  imageSource,
  isPlaceholder,
  isOutOfStock,
  onImageError,
  tint,
  name,
  liked,
  hideWishlist,
  onToggleWishlist,
  quantity,
  isThreeColumn,
  onIncrement,
  onDecrement,
  onAdd,
}) => {
  const wellStyle = useMemo(
    () => [
      styles.mediaWell,
      isThreeColumn && styles.mediaWellSmall,
      // { backgroundColor: tint },
    ],
    [isThreeColumn, tint],
  );

  return (
    <View
      style={styles.mediaWrap}
      importantForAccessibility="no-hide-descendants"
    >
      <View style={wellStyle}>
        <ProductImage
          imageSource={imageSource}
          isPlaceholder={isPlaceholder}
          isOutOfStock={isOutOfStock}
          onError={onImageError}
        />
      </View>

      {!hideWishlist && (
        <WishlistButton
          liked={liked}
          isThreeColumn={isThreeColumn}
          productName={name}
          onPress={onToggleWishlist}
        />
      )}

      <View
        style={[styles.actionDock, isThreeColumn && styles.actionDockSmall]}
      >
        <QuantityControl
          quantity={quantity}
          isOutOfStock={isOutOfStock}
          isThreeColumn={isThreeColumn}
          productName={name}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onAdd={onAdd}
        />
      </View>
    </View>
  );
};

export default React.memo(ProductMedia);
