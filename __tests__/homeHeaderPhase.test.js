import {
  resolveHeaderInputs,
  resolveHeaderPhase,
  resolveHeaderTone,
  HEADER_PHASE,
  HEADER_TONE,
} from '../src/screens/home/components/headerPhase';

const BANNER_A = [{ uri: { uri: 'https://cdn/store-a.jpg' } }];
const BANNER_B = [{ uri: { uri: 'https://cdn/store-b.jpg' } }];

const storeWith = banner => ({
  storeStatus: 'OK',
  banners: { topSectionBanner: banner },
});

// A closed / out-of-range store: transformHomepageResponse resolves with data
// but strips every banner set.
const unavailableStore = { storeStatus: 'CLOSED', banners: {} };

const headerFor = ({
  inputs,
  bannerPainted = false,
  storeUnavailable = false,
}) => {
  const { topSectionBanner, bannerPending } = resolveHeaderInputs({
    ...inputs,
    storeUnavailable,
  });
  const bannerUrl = topSectionBanner?.[0]?.uri?.uri;
  const phase = resolveHeaderPhase({ bannerUrl, bannerPending, bannerPainted });
  return {
    bannerUrl,
    phase,
    tone: resolveHeaderTone({ storeUnavailable }),
  };
};

describe('resolveHeaderPhase', () => {
  it('shows the location chip on the plain header before any location is picked', () => {
    expect(
      resolveHeaderPhase({
        bannerUrl: undefined,
        bannerPending: false,
        bannerPainted: false,
      }),
    ).toBe(HEADER_PHASE.plain);
  });

  it('shimmers while the new area is being fetched instead of holding the orange header', () => {
    expect(
      resolveHeaderPhase({
        bannerUrl: undefined,
        bannerPending: true,
        bannerPainted: false,
      }),
    ).toBe(HEADER_PHASE.shimmer);
  });

  it('keeps shimmering after the banner url arrives until the image has painted', () => {
    expect(
      resolveHeaderPhase({
        bannerUrl: 'https://cdn/banner-a.jpg',
        bannerPending: false,
        bannerPainted: false,
      }),
    ).toBe(HEADER_PHASE.shimmer);
  });

  it('hands over to the banner once it has painted', () => {
    expect(
      resolveHeaderPhase({
        bannerUrl: 'https://cdn/banner-a.jpg',
        bannerPending: false,
        bannerPainted: true,
      }),
    ).toBe(HEADER_PHASE.banner);
  });
});

describe('resolveHeaderInputs', () => {
  it('never hands the header a banner belonging to the area being left', () => {
    const { topSectionBanner, bannerPending } = resolveHeaderInputs({
      isResolvingArea: true,
      data: storeWith(BANNER_A),
      error: null,
      noLocationSelected: false,
    });
    expect(topSectionBanner).toEqual([]);
    expect(bannerPending).toBe(true);
  });

  it('is pending while the query for the new area is in flight', () => {
    expect(
      resolveHeaderInputs({
        isResolvingArea: false,
        data: undefined,
        error: null,
        noLocationSelected: false,
      }).bannerPending,
    ).toBe(true);
  });

  it('settles once the new area answers with a banner', () => {
    expect(
      resolveHeaderInputs({
        isResolvingArea: false,
        data: storeWith(BANNER_B),
        error: null,
        noLocationSelected: false,
      }),
    ).toEqual({ topSectionBanner: BANNER_B, bannerPending: false });
  });

  it('settles once the new area answers with no banner at all', () => {
    expect(
      resolveHeaderInputs({
        isResolvingArea: false,
        data: unavailableStore,
        error: null,
        noLocationSelected: false,
      }),
    ).toEqual({ topSectionBanner: [], bannerPending: false });
  });

  it('stops waiting when the query fails', () => {
    expect(
      resolveHeaderInputs({
        isResolvingArea: false,
        data: undefined,
        error: new Error('store closed'),
        noLocationSelected: false,
      }).bannerPending,
    ).toBe(false);
  });

  it('does not shimmer for a user who has picked no location', () => {
    expect(
      resolveHeaderInputs({
        isResolvingArea: true,
        data: undefined,
        error: null,
        noLocationSelected: true,
      }),
    ).toEqual({ topSectionBanner: [], bannerPending: false });
  });
});

describe('switching store', () => {
  it('shimmers from the tap until the new banner paints, never showing the old one', () => {
    const frames = [
      // Serving store A, its banner painted.
      {
        inputs: {
          isResolvingArea: false,
          data: storeWith(BANNER_A),
          error: null,
          noLocationSelected: false,
        },
        bannerPainted: true,
      },
      // Tap: the profile carries the new area, the query key has flipped, so
      // the cache holds nothing for it yet.
      {
        inputs: {
          isResolvingArea: false,
          data: undefined,
          error: null,
          noLocationSelected: false,
        },
      },
      // Store B answers; its image has not decoded yet.
      {
        inputs: {
          isResolvingArea: false,
          data: storeWith(BANNER_B),
          error: null,
          noLocationSelected: false,
        },
      },
      // Painted.
      {
        inputs: {
          isResolvingArea: false,
          data: storeWith(BANNER_B),
          error: null,
          noLocationSelected: false,
        },
        bannerPainted: true,
      },
    ];

    const header = frames.map(headerFor);

    expect(header.map(f => f.phase)).toEqual([
      HEADER_PHASE.banner,
      HEADER_PHASE.shimmer,
      HEADER_PHASE.shimmer,
      HEADER_PHASE.banner,
    ]);
    expect(header.map(f => f.bannerUrl)).toEqual([
      'https://cdn/store-a.jpg',
      undefined,
      'https://cdn/store-b.jpg',
      'https://cdn/store-b.jpg',
    ]);
    // The bare brand slab is what read as "stuck orange" mid-switch.
    expect(header.some(f => f.phase === HEADER_PHASE.plain)).toBe(false);
  });

  it('lands on a neutral header, not the orange slab, when the new store is closed', () => {
    const frames = [
      {
        inputs: {
          isResolvingArea: false,
          data: storeWith(BANNER_A),
          error: null,
          noLocationSelected: false,
        },
        bannerPainted: true,
      },
      {
        inputs: {
          isResolvingArea: false,
          data: undefined,
          error: null,
          noLocationSelected: false,
        },
      },
      {
        inputs: {
          isResolvingArea: false,
          data: unavailableStore,
          error: null,
          noLocationSelected: false,
        },
        storeUnavailable: true,
      },
    ];

    const header = frames.map(headerFor);

    expect(header.map(f => f.phase)).toEqual([
      HEADER_PHASE.banner,
      HEADER_PHASE.shimmer,
      HEADER_PHASE.plain,
    ]);
    expect(header[2].tone).toBe(HEADER_TONE.surface);
  });

  it('drops the banner an unavailable store was still holding from the last area', () => {
    const { bannerUrl, phase, tone } = headerFor({
      inputs: {
        isResolvingArea: false,
        data: storeWith(BANNER_A),
        error: new Error('store closed'),
        noLocationSelected: false,
      },
      bannerPainted: true,
      storeUnavailable: true,
    });
    expect(bannerUrl).toBeUndefined();
    expect(phase).toBe(HEADER_PHASE.plain);
    expect(tone).toBe(HEADER_TONE.surface);
  });

  it('keeps the brand header for a serving store that simply has no banner', () => {
    const { phase, tone } = headerFor({
      inputs: {
        isResolvingArea: false,
        data: storeWith([]),
        error: null,
        noLocationSelected: false,
      },
      storeUnavailable: false,
    });
    expect(phase).toBe(HEADER_PHASE.plain);
    expect(tone).toBe(HEADER_TONE.brand);
  });
});
