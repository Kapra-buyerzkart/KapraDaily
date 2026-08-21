import CONFIG from '@/globals/config';
import { resolveQuantityCeiling } from '@/utils/cartQuantityLimits';
import { DEFAULT_TOKEN_VALUE, NO_IMAGE_SOURCE } from './constants';

export { resolveQuantityCeiling };

/** Picks the first supplied value, treating only null/undefined/'' as missing so a real 0 survives. */
const firstPresent = (values, fallback) => {
  const found = values.find(
    value => value !== null && value !== undefined && value !== '',
  );
  return found === undefined ? fallback : found;
};

/** Amounts fall back to 0 rather than a blank, so the card never renders a bare "₹". */
export const resolveAmount = value => firstPresent([value], 0);

/** Drops the decimals when there are none to show, so ₹59.00 renders as ₹59. */
export const formatAmount = value => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '';
  const rounded = Math.round(amount * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
};

/**
 * Rupees off, not percent: the card leads with the absolute saving.
 * A missing or lower MRP means there is nothing to claim, so it resolves to 0
 * and the caller falls back to the percentage the API sent, if any.
 */
export const resolveSavings = (mrp, price) => {
  const mrpValue = Number(mrp);
  const priceValue = Number(price);
  if (!Number.isFinite(mrpValue) || !Number.isFinite(priceValue)) return 0;

  const saving = Math.round((mrpValue - priceValue) * 100) / 100;
  return saving > 0 ? saving : 0;
};

/**
 * Which tint the image well gets. Callers inside a list pass their row index so
 * the palette cycles down the grid; everyone else falls back to a hash of the
 * product id, which still varies the wells without threading an index through.
 */
export const resolveTintIndex = (index, productId) => {
  if (Number.isFinite(index)) return index;

  const key = String(productId ?? '');
  let sum = 0;
  for (let i = 0; i < key.length; i += 1) sum += key.charCodeAt(i);
  return sum;
};

/**
 * Normalises the many shapes a product can arrive in (search, home rails,
 * category listings, wishlist) into the single set of fields the card renders.
 */
export const deriveProductFields = item => {
  const derivedProductId = item?.productId || item?.id;
  const { maxQty, maxQtyIsStock } = resolveQuantityCeiling(item);
  const derivedTokenValue = firstPresent(
    [item?.bTokenValue, item?.token, item?.btokens],
    DEFAULT_TOKEN_VALUE,
  );
  const discount =
    item?.offer || item?.discountPercentage || item?.discountPercent;
  const derivedRating = item?.rating ?? item?.avgRating ?? item?.ratingValue;
  const derivedEta =
    item?.deliveryTime ?? item?.deliveryEta ?? item?.eta ?? null;

  return {
    productId: derivedProductId,
    name: item?.prName || item?.name || '',
    mrp: firstPresent([item?.mrp, item?.unitPrice], ''),
    price: firstPresent([item?.price, item?.specialPrice], 0),
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
    maxQty,
    maxQtyIsStock,
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
    const path = rawImage.split(',')[0].trim();
    if (!path) return NO_IMAGE_SOURCE;

    const uri = path.startsWith('http')
      ? path
      : `${CONFIG.image_base_url}${path}`;
    return { uri };
  }

  if (typeof rawImage === 'number') return rawImage;
  if (typeof rawImage?.uri === 'string' && rawImage.uri) return rawImage;

  return NO_IMAGE_SOURCE;
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
  parts.push(`₹${resolveAmount(price)}`);
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
  isAtMaxQty,
}) => {
  const actions = [{ name: 'activate', label: 'View product' }];
  if (!isOutOfStock) {
    if (quantity > 0) {
      if (!isAtMaxQty) {
        actions.push({ name: 'increment', label: 'Increase quantity' });
      }
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
