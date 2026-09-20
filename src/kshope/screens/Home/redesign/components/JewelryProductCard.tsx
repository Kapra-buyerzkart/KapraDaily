import React from 'react';
import ProductCard from '../../../Category/redesign/sections/ProductCard';
import type { ProductTile } from '../content';

interface JewelryProductCardProps {
  item: ProductTile;
  width: number;
  isWishlisted?: boolean;
  compact?: boolean;
  style?: any;
  onPress?: (item: ProductTile) => void;
  onToggleWishlist?: (item: ProductTile) => void;
}

const JewelryProductCard: React.FC<JewelryProductCardProps> = ({
  item,
  width,
  isWishlisted = false,
  compact = false,
  style,
  onPress,
  onToggleWishlist,
}) => {
  return (
    <ProductCard
      item={item}
      width={width}
      wishlisted={isWishlisted}
      compact={compact}
      style={[{ marginBottom: 0 }, style]}
      onPress={onPress}
      onToggleWishlist={onToggleWishlist}
    />
  );
};

export default JewelryProductCard;
