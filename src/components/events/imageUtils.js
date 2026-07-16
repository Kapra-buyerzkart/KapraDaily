import CONFIG from '../../globals/config';

const PLACEHOLDER_IMAGE = require('../../assets/images/movieTicket/voucher.png');
const PLACEHOLDER_EVENT_IMAGE = require('../../assets/images/noimages/fallback.png');

export const getVoucherImageSource = item => {
  if (item?.imageUrl) return { uri: CONFIG.image_base_url + item.imageUrl };
  if (item?.cardImage) return item.cardImage;
  if (item?.image) {
    return typeof item.image === 'string'
      ? { uri: CONFIG.image_base_url + item.image }
      : item.image;
  }
  return PLACEHOLDER_IMAGE;
};

// Event summaries carry their own image (resolved from eventimages by the
// caller), falling back to the event's bannerImage/thumbnailImage, and
// finally a static placeholder if none of those are available.
export const getEventImageSource = event => {
  if (event?.image) {
    return typeof event.image === 'string'
      ? { uri: CONFIG.image_base_url + event.image }
      : event.image;
  }
  if (event?.bannerImage) {
    return { uri: CONFIG.image_base_url + event.bannerImage };
  }
  if (event?.thumbnailImage) {
    return { uri: CONFIG.image_base_url + event.thumbnailImage };
  }
  return PLACEHOLDER_EVENT_IMAGE;
};

export const PLACEHOLDER_VOUCHER_IMAGE = PLACEHOLDER_IMAGE;
export const PLACEHOLDER_EVENT_IMAGE_SOURCE = PLACEHOLDER_EVENT_IMAGE;
