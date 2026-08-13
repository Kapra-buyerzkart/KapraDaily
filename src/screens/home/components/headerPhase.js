export const HEADER_PHASE = {
  shimmer: 'shimmer',
  banner: 'banner',
  plain: 'plain',
};

export const HEADER_TONE = {
  brand: 'brand',
  surface: 'surface',
};

const NO_BANNERS = [];

export const resolveHeaderInputs = ({
  isResolvingArea,
  data,
  error,
  noLocationSelected,
  storeUnavailable,
}) => {
  if (noLocationSelected || storeUnavailable) {
    return { topSectionBanner: NO_BANNERS, bannerPending: false };
  }
  if (isResolvingArea) {
    return { topSectionBanner: NO_BANNERS, bannerPending: true };
  }
  return {
    topSectionBanner: data?.banners?.topSectionBanner || NO_BANNERS,
    bannerPending: !data && !error,
  };
};

export const resolveHeaderPhase = ({
  bannerUrl,
  bannerPending,
  bannerPainted,
}) => {
  if (bannerUrl) {
    return bannerPainted ? HEADER_PHASE.banner : HEADER_PHASE.shimmer;
  }
  return bannerPending ? HEADER_PHASE.shimmer : HEADER_PHASE.plain;
};

export const resolveHeaderTone = ({ storeUnavailable }) =>
  storeUnavailable ? HEADER_TONE.surface : HEADER_TONE.brand;

export default resolveHeaderPhase;
