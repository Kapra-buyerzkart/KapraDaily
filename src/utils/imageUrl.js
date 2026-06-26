import CONFIG from '../globals/config';

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
