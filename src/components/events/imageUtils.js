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

export const getEventImageSource = event => {
  if (event?.bannerImage) {
    return { uri: CONFIG.image_base_url + event.bannerImage };
  }
  if (event?.thumbnailImage) {
    return { uri: CONFIG.image_base_url + event.thumbnailImage };
  }
  return PLACEHOLDER_EVENT_IMAGE;
};

export const getEventGalleryImages = event => {
  const gallery = Array.isArray(event?.images) ? event.images : [];
  const sources = gallery
    .slice()
    .sort((a, b) => (a?.displayOrder ?? 0) - (b?.displayOrder ?? 0))
    .map(img => img?.imageUrl)
    .filter(Boolean)
    .map(url => ({ uri: CONFIG.image_base_url + url }));

  // Seed the carousel with the banner already shown in the list so the first
  // slide is the same (cached) image. Otherwise, when the details API adds the
  // gallery, the hero swaps from a single image to a carousel whose first slide
  // is a different, uncached URL — producing a blank flash where the banner
  // briefly disappears before the carousel images load.
  const banner = getEventImageSource(event);
  const bannerUri = banner && typeof banner === 'object' ? banner.uri : null;
  if (bannerUri && !sources.some(s => s.uri === bannerUri)) {
    sources.unshift(banner);
  }

  return sources.length > 0 ? sources : [banner];
};

export const PLACEHOLDER_VOUCHER_IMAGE = PLACEHOLDER_IMAGE;
export const PLACEHOLDER_EVENT_IMAGE_SOURCE = PLACEHOLDER_EVENT_IMAGE;
