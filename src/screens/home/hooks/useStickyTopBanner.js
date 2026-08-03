const EMPTY = [];

// The last top-section banner Home actually painted. Module-level on purpose:
// it has to outlive HomeScreen itself, so a screen that is torn down and
// rebuilt (tab teardown, the guest -> login reset) comes back with its banner
// already in hand.
let lastKnownBanner = EMPTY;

// Which banner the header should paint *right now*.
//
// The homepage query cannot answer that on the first frames of a mount:
// `useResolvedAreaId` reads the area id out of the keychain asynchronously, so
// `areaId` is undefined for a beat, the query is disabled, and `data` is
// undefined. Feeding the header the empty array there made it render its
// bannerless variant — a solid orange plate, the same one the no-location
// state shows — and then swap to the banner variant a moment later. That swap
// is a different subtree, so the banner Image remounted and the orange hold
// behind it showed through until the bitmap decoded: the flash.
//
// So: hold the previous banner while the answer is still unknown, and only
// fall back to the bannerless header once the query has actually resolved and
// told us there is no banner.
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
