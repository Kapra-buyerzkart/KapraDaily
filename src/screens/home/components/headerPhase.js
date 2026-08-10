export const HEADER_PHASE = {
  shimmer: 'shimmer',
  banner: 'banner',
  plain: 'plain',
};

export const resolveHeaderPhase = ({ bannerUrl, bannerPending, bannerPainted }) => {
  if (bannerUrl) {
    return bannerPainted ? HEADER_PHASE.banner : HEADER_PHASE.shimmer;
  }
  return bannerPending ? HEADER_PHASE.shimmer : HEADER_PHASE.plain;
};

export default resolveHeaderPhase;
