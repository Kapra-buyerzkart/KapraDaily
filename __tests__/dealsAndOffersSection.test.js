import React from 'react';
import renderer from 'react-test-renderer';
import DealsAndOffersSection, {
  resolveBannerImageSource,
  DUMMY_OFFERS,
} from '../src/screens/home/components/modern/DealsAndOffersSection';

jest.mock('react-native-reanimated', () => {
  const React2 = require('react');
  const { View, FlatList } = require('react-native');
  const passthrough = Component =>
    React2.forwardRef((props, ref) =>
      React2.createElement(Component, { ...props, ref }, props.children),
    );
  return {
    __esModule: true,
    default: {
      View: passthrough(View),
      FlatList: passthrough(FlatList),
    },
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedScrollHandler: jest.fn(() => jest.fn()),
    useAnimatedStyle: jest.fn(() => ({})),
    interpolate: jest.fn(() => 0),
    Extrapolation: { CLAMP: 'clamp' },
  };
});

jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('@/components/AnimatedPressable', () => 'AnimatedPressable');
jest.mock('@/components/CachedImage', () => 'CachedImage');

describe('DealsAndOffersSection', () => {
  it('resolves image URLs correctly', () => {
    expect(resolveBannerImageSource({ uri: 'https://example.com/banner.jpg' })).toEqual({
      uri: 'https://example.com/banner.jpg',
    });
    expect(resolveBannerImageSource({ imageUrl: 'media/card1.jpg' })).toEqual({
      uri: expect.stringContaining('/media/card1.jpg'),
    });
  });

  it('renders dummy offers with isDummy true', () => {
    expect(DUMMY_OFFERS[0].isDummy).toBe(true);
  });

  it('renders correctly when banners are provided and puts background image', () => {
    const banners = [
      {
        bannerId: 101,
        title: 'Fresh Fruits',
        imageUrl: 'https://example.com/fruit_banner.png',
        placementKey: 'app_home_cardslider_section',
      },
      {
        bannerId: 102,
        title: 'Electronics',
        imageUrl: 'https://example.com/elec_banner.png',
        placementKey: 'other_key',
      },
    ];

    let tree;
    renderer.act(() => {
      tree = renderer.create(<DealsAndOffersSection banners={banners} />);
    });

    const stringified = JSON.stringify(tree.toJSON());
    // Card background image should be rendered with absolute fill and cover resizeMode
    expect(stringified).toContain('"resizeMode":"cover"');
    expect(stringified).toContain('"position":"absolute"');
    expect(stringified).toContain('https://example.com/elec_banner.png');
  });
});
