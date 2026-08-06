import CONFIG from '@/globals/config';
import { DEFAULT_TOKEN_VALUE, NO_IMAGE_SOURCE } from './constants';

/**
 * Normalises the many shapes a product can arrive in (search, home rails,
 * category listings, wishlist) into the single set of fields the card renders.
 */
export const deriveProductFields = item => {
  const derivedProductId = item?.productId || item?.id;
  const derivedTokenValue =
    item?.bTokenValue || item?.token || item?.btokens || DEFAULT_TOKEN_VALUE;
  const discount =
    item?.offer || item?.discountPercentage || item?.discountPercent;
  const derivedRating = item?.rating ?? item?.avgRating ?? item?.ratingValue;
  const derivedEta = item?.deliveryTime ?? item?.deliveryEta ?? item?.eta ?? null;

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
};

export const getRawImage = item =>
  item?.featuredImage ||
  item?.productImage ||
  item?.image ||
  item?.img ||
  item?.imageUrl;

export const resolveImageSource = (rawImage, hasError) => {
  if (!rawImage || hasError) {
    return NO_IMAGE_SOURCE;
  }

  if (typeof rawImage === 'string') {
    const uri = rawImage.startsWith('http')
      ? rawImage
      : `${CONFIG.image_base_url}${rawImage}`;
    return { uri };
  }

  return rawImage;
};

export const buildCardAccessibilityLabel = ({
  name,
  weight,
  price,
  mrp,
  offer,
  isOutOfStock,
}) => {
  const parts = [name];
  if (weight) parts.push(weight);
  parts.push(`₹${price}`);
  if (mrp && mrp !== price) parts.push(`MRP ₹${mrp}`);
  if (offer) parts.push(offer);
  if (isOutOfStock) parts.push('Out of stock');
  return parts.filter(Boolean).join(', ');
};

export const buildAccessibilityActions = ({
  isOutOfStock,
  quantity,
  hideWishlist,
  liked,
}) => {
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
};
