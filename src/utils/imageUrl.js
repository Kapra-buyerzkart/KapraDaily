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
