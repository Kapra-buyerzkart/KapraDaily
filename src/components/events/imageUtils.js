import CONFIG from '../../globals/config';

const PLACEHOLDER_IMAGE = require('../../assets/images/movieTicket/voucher.png');
const PLACEHOLDER_EVENT_IMAGE = require('../../assets/images/noimages/fallback.png');

const toImageUri = path =>
  typeof path === 'string' && path.length > 0
    ? { uri: /^https?:\/\//i.test(path) ? path : CONFIG.image_base_url + path }
    : null;

const EVENT_CARD_IMAGE_KEYS = [
  'shortImageUrl',
  'image',
  'imageUrl',
  'ticketImage',
  'thumbnailImage',
];

const getEventCardImageUri = event => {
  for (const key of EVENT_CARD_IMAGE_KEYS) {
    const source = toImageUri(event?.[key]);
    if (source) return source;
  }
  return null;
};

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

export const getEventImageSource = event =>
  getEventCardImageUri(event) || PLACEHOLDER_EVENT_IMAGE;

export const getEventGalleryImages = event => {
  const gallery = Array.isArray(event?.images) ? event.images : [];
  const sources = gallery
    .slice()
    .sort((a, b) => (a?.displayOrder ?? 0) - (b?.displayOrder ?? 0))
    .map(img => toImageUri(img?.imageUrl))
    .filter(Boolean);

  if (sources.length) return sources;

  const cardImage = getEventCardImageUri(event);
  return cardImage ? [cardImage] : [];
};

export const PLACEHOLDER_VOUCHER_IMAGE = PLACEHOLDER_IMAGE;
export const PLACEHOLDER_EVENT_IMAGE_SOURCE = PLACEHOLDER_EVENT_IMAGE;
