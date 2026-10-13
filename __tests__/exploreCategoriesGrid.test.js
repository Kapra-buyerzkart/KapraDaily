import React from 'react';
import renderer from 'react-test-renderer';
import ExploreCategoriesGrid from '../src/screens/home/components/modern/ExploreCategoriesGrid';

jest.mock('react-native-responsive-screen', () => ({
  widthPercentageToDP: jest.fn(val => parseFloat(val)),
  heightPercentageToDP: jest.fn(val => parseFloat(val)),
}));

jest.mock('react-native-vector-icons/Feather', () => 'Feather');
jest.mock('@/components/AnimatedPressable', () => 'AnimatedPressable');
jest.mock('@/components/CachedImage', () => 'CachedImage');
jest.mock('../src/screens/home/components/getCategoryPlaceholder', () => () => ({ uri: 'placeholder' }));

const { Image } = require('react-native');
Image.getSize = jest.fn((uri, success) => success(440, 100));
Image.resolveAssetSource = jest.fn(() => ({ width: 440, height: 100 }));

describe('ExploreCategoriesGrid', () => {
  const dummyCategories = [
    { catId: '1', catName: 'Fruits' },
    { catId: '2', catName: 'Veggies' },
  ];

  it('renders bottomGifBanner with resizeMode="contain"', () => {
    const bottomGifBanner = {
      placementKey: 'app_home_bottom_gif_banner_section',
      imageUrl: 'https://example.com/banner.gif',
    };

    let tree;
    renderer.act(() => {
      tree = renderer.create(
        <ExploreCategoriesGrid
          categories={dummyCategories}
          navigation={{ navigate: jest.fn() }}
          bottomGifBanner={bottomGifBanner}
        />,
      );
    });

    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('"resizeMode":"contain"');
    expect(json).not.toContain('"resizeMode":"cover"');
  });

  it('updates aspect ratio when image onLoad fires', () => {
    const bottomGifBanner = {
      placementKey: 'app_home_bottom_gif_banner_section',
      imageUrl: 'https://example.com/banner.gif',
    };

    let component;
    renderer.act(() => {
      component = renderer.create(
        <ExploreCategoriesGrid
          categories={dummyCategories}
          navigation={{ navigate: jest.fn() }}
          bottomGifBanner={bottomGifBanner}
        />,
      );
    });

    const images = component.root.findAllByType('Image');
    expect(images.length).toBeGreaterThan(0);

    const bannerImage = images[0];
    expect(bannerImage.props.resizeMode).toBe('contain');

    // Simulate native onLoad with 440x200 dimensions
    renderer.act(() => {
      bannerImage.props.onLoad({
        nativeEvent: {
          source: { width: 440, height: 200 },
        },
      });
    });

    // Check style has dynamic aspectRatio 2.2
    const updatedImages = component.root.findAllByType('Image');
    const updatedBannerImage = updatedImages[0];
    const flattenedStyle = Array.isArray(updatedBannerImage.props.style)
      ? Object.assign({}, ...updatedBannerImage.props.style.filter(Boolean))
      : updatedBannerImage.props.style;

    expect(flattenedStyle.aspectRatio).toBe(2.2);
    expect(updatedBannerImage.props.resizeMode).toBe('contain');
  });
});
