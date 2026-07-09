import { Image } from 'react-native';
import CONFIG from '../globals/config';

// Resolves a product item's remote image to a plain uri string (or null if
// it has no remote image), so it can be passed to Image.prefetch — mirrors
// the field fallback + base-url logic TokenProductCard uses to build its source.
export const getProductImageUri = item => {
  const img =
    item?.featuredImage ||
    item?.productImage ||
    item?.image ||
    item?.img ||
    item?.imageUrl;
  if (!img || typeof img !== 'string') return null;
  return img.startsWith('http') ? img : `${CONFIG.image_base_url}${img}`;
};

// Warms the RN image cache for a list of product/cart items so their
// thumbnails render instantly when the cart pill / cart screen next mount.
// Pass `limit` to only prefetch the first N (e.g. the pill shows 3).
export const prefetchProductImages = (items, limit) => {
  if (!Array.isArray(items) || items.length === 0) return;
  const slice = typeof limit === 'number' ? items.slice(0, limit) : items;
  slice
    .map(getProductImageUri)
    .filter(Boolean)
    .forEach(uri => {
      // Swallow failures — a missing image must not throw into the cart flow.
      Image.prefetch(uri).catch(() => {});
    });
};

export const getImageUrl = imagePath => {
  if (!imagePath) return require('../assets/images/fv.png');
  if (imagePath.startsWith('http')) return { uri: imagePath };
  return {
    uri: `${CONFIG.image_base_url}/${imagePath}`.replace(
      /([^:]\/)\/+/g,
      '$1',
    ),
  }; // Simple clean of double slashes
};
