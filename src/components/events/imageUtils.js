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

const VOUCHER_IMAGE_KEYS = ['shortImageUrl', 'imageUrl', 'cardImage', 'image'];

export const getVoucherImageSource = item => {
  for (const key of VOUCHER_IMAGE_KEYS) {
    const value = item?.[key];
    if (!value) continue;
    if (typeof value !== 'string') return value;
    const source = toImageUri(value);
    if (source) return source;
  }
  return PLACEHOLDER_IMAGE;
};

export const getEventImageSource = event =>
  getEventCardImageUri(event) || PLACEHOLDER_EVENT_IMAGE;

export const getEventGalleryImages = event => {
  const gallery = Array.isArray(event?.images) ? event.images : [];
  const sources = gallery
    .map((img, index) => ({ source: toImageUri(img?.imageUrl), img, index }))
    .filter(entry => entry.source)
    .sort(
      (a, b) =>
        (a.img?.displayOrder ?? 0) - (b.img?.displayOrder ?? 0) ||
        a.index - b.index,
    )
    .map(entry => entry.source);

  if (sources.length) return sources;

  const cardImage = getEventCardImageUri(event);
  return cardImage ? [cardImage] : [];
};

export const PLACEHOLDER_VOUCHER_IMAGE = PLACEHOLDER_IMAGE;
export const PLACEHOLDER_EVENT_IMAGE_SOURCE = PLACEHOLDER_EVENT_IMAGE;
