import { Image } from 'react-native';
import CONFIG from '../globals/config';

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

export const prefetchProductImages = (items, limit) => {
  if (!Array.isArray(items) || items.length === 0) return;
  const slice = typeof limit === 'number' ? items.slice(0, limit) : items;
  slice
    .map(getProductImageUri)
    .filter(Boolean)
    .forEach(uri => {
      Image.prefetch(uri).catch(() => {});
    });
};

const OPAQUE_FORMAT = /\.(jpe?g|bmp)(?:[?#]|$)/i;

export const hasOpaqueBackground = image =>
  typeof image === 'string' && OPAQUE_FORMAT.test(image);

export const getImageUrl = imagePath => {
  if (!imagePath) return require('../assets/images/fv.png');
  if (imagePath.startsWith('http')) return { uri: imagePath };
  return {
    uri: `${CONFIG.image_base_url}/${imagePath}`.replace(/([^:]\/)\/+/g, '$1'),
  };
};
