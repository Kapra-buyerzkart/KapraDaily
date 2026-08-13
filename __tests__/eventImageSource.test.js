import {
  getEventBannerSource,
  getEventImageSource,
} from '../src/components/events/imageUtils';

describe('getEventBannerSource', () => {
  it('keeps bannerImage first for event list items', () => {
    expect(getEventBannerSource({ bannerImage: 'uploads/a.png' })).toEqual({
      uri: 'https://backend.kapradaily.com/uploads/a.png',
    });
  });

  it('falls through to voucher keys instead of building an undefined url', () => {
    const source = getEventBannerSource({ imageUrl: 'uploads/v.png' });
    expect(source).toEqual({ uri: 'https://backend.kapradaily.com/uploads/v.png' });
    expect(JSON.stringify(source)).not.toContain('undefined');
  });

  it('passes absolute urls through untouched', () => {
    expect(getEventBannerSource({ bannerImage: 'https://cdn/x.png' })).toEqual({
      uri: 'https://cdn/x.png',
    });
  });

  it('falls back to the placeholder when there is no image at all', () => {
    expect(getEventBannerSource({})).toBe(getEventImageSource({}));
  });
});
