import {
  resolveHeaderPhase,
  HEADER_PHASE,
} from '../src/screens/home/components/headerPhase';

describe('home header during a location switch', () => {
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

  it('never leaves a bare orange frame on the full login to location sequence', () => {
    const sequence = [
      { bannerUrl: undefined, bannerPending: false, bannerPainted: false },
      { bannerUrl: undefined, bannerPending: true, bannerPainted: false },
      { bannerUrl: 'https://cdn/b.jpg', bannerPending: false, bannerPainted: false },
      { bannerUrl: 'https://cdn/b.jpg', bannerPending: false, bannerPainted: true },
    ];
    const phases = sequence.map(resolveHeaderPhase);
    expect(phases).toEqual([
      HEADER_PHASE.plain,
      HEADER_PHASE.shimmer,
      HEADER_PHASE.shimmer,
      HEADER_PHASE.banner,
    ]);
  });
});
