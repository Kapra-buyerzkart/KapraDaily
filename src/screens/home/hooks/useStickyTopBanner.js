const EMPTY = [];

let lastKnownBanner = EMPTY;

const useStickyTopBanner = (banner, hasResolvedData) => {
  if (banner && banner.length > 0) {
    lastKnownBanner = banner;
    return banner;
  }
  if (hasResolvedData) {
    lastKnownBanner = EMPTY;
    return EMPTY;
  }
  return lastKnownBanner;
};

export default useStickyTopBanner;
export { EMPTY as EMPTY_BANNERS };
