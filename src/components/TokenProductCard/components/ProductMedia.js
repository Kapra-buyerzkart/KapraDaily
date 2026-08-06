import React from 'react';
import { Text, View } from 'react-native';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import ProductImage from './ProductImage';
import QuantityControl from './QuantityControl';
import WishlistButton from './WishlistButton';
import styles from '../styles';

/** Square image well plus its overlays: discount badge, wishlist, action dock. */
const ProductMedia = ({
  imageSource,
  isPlaceholder,
  isOutOfStock,
  onImageError,
  offer,
  name,
  liked,
  hideWishlist,
  onToggleWishlist,
  quantity,
  isThreeColumn,
  onIncrement,
  onDecrement,
  onAdd,
}) => (
  <View style={styles.mediaWrap}>
    <View style={styles.mediaWell}>
      <ProductImage
        imageSource={imageSource}
        isPlaceholder={isPlaceholder}
        isOutOfStock={isOutOfStock}
        onError={onImageError}
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
          onPress={onToggleWishlist}
        />
      )}
    </View>

    <View style={[styles.actionDock, isThreeColumn && styles.actionDockSmall]}>
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

export default React.memo(ProductMedia);
