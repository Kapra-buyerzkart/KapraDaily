import CONFIG from '../../globals/config';

const PLACEHOLDER_IMAGE = require('../../assets/images/movieTicket/voucher.png');
const PLACEHOLDER_EVENT_IMAGE = require('../../assets/images/noimages/fallback.png');

export const getVoucherImageSource = item => {
  if (item?.shortImageUrl) {
    return { uri: CONFIG.image_base_url + item.shortImageUrl };
  }
  if (item?.imageUrl) return { uri: CONFIG.image_base_url + item.imageUrl };
  if (item?.cardImage) return item.cardImage;
  if (item?.image) {
    return typeof item.image === 'string'
      ? { uri: CONFIG.image_base_url + item.image }
      : item.image;
  }
  return PLACEHOLDER_IMAGE;
};

export const getEventImageSource = event => {
  if (event?.shortImageUrl) {
    return { uri: CONFIG.image_base_url + event.shortImageUrl };
  }
  if (event?.thumbnailImage) {
    return { uri: CONFIG.image_base_url + event.thumbnailImage };
  }
  return PLACEHOLDER_EVENT_IMAGE;
};

export const getEventGalleryImages = event => {
  const gallery = Array.isArray(event?.images) ? event.images : [];
  return gallery
    .slice()
    .sort((a, b) => (a?.displayOrder ?? 0) - (b?.displayOrder ?? 0))
    .map(img => img?.imageUrl)
    .filter(Boolean)
    .map(url => ({ uri: CONFIG.image_base_url + url }));
};

export const PLACEHOLDER_VOUCHER_IMAGE = PLACEHOLDER_IMAGE;
export const PLACEHOLDER_EVENT_IMAGE_SOURCE = PLACEHOLDER_EVENT_IMAGE;
