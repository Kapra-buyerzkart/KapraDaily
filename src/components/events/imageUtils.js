import CONFIG from '../../globals/config';

const PLACEHOLDER_IMAGE = require('../../assets/images/movieTicket/voucher.png');

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

export const PLACEHOLDER_VOUCHER_IMAGE = PLACEHOLDER_IMAGE;
