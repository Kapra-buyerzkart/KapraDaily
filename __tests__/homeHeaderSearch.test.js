import React from 'react';
import renderer, { act } from 'react-test-renderer';
import HomeHeaderGreen from '../src/screens/home/components/modern/HomeHeaderGreen';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
  useRoute: () => ({ name: 'HomeScreen' }),
  useFocusEffect: fn => fn(),
  useIsFocused: () => true,
}));

jest.mock('react-native-reanimated', () => {
  const React2 = require('react');
  const { View, ScrollView, Text: RNText, Image: RNImage } = require('react-native');
  const passthrough = Component =>
    React2.forwardRef((props, ref) =>
      React2.createElement(Component, { ...props, ref }, props.children),
    );
  return {
    __esModule: true,
    default: new Proxy(
      {
        View: passthrough(View),
        ScrollView: passthrough(ScrollView),
        Text: passthrough(RNText),
        Image: passthrough(RNImage),
        createAnimatedComponent: Component => passthrough(Component),
      },
      {
        get: (target, prop) =>
          prop in target ? target[prop] : passthrough(View),
      },
    ),
    View: passthrough(View),
    Text: passthrough(RNText),
    ScrollView: passthrough(ScrollView),
    makeMutable: value => ({ value }),
    useSharedValue: value => ({ value }),
    useAnimatedScrollHandler: () => () => {},
    useAnimatedStyle: () => ({}),
    useAnimatedProps: () => ({}),
    useAnimatedReaction: () => {},
    cancelAnimation: () => {},
    withRepeat: value => value,
    withTiming: value => value,
    interpolate: () => 0,
    Extrapolation: { CLAMP: 'clamp' },
    runOnJS: fn => fn,
    Easing: { linear: () => 0 },
  };
});

jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-vector-icons/Feather', () => 'Feather');
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'MaterialCommunityIcons');

describe('HomeHeaderGreen Search Side Redesign', () => {
  const mockNavigation = { navigate: jest.fn() };
  const mockOnSearchPress = jest.fn();
  const mockOnMicPress = jest.fn();
  const mockOnCartPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search bar, rotating placeholder, microphone icon, and cart action button', () => {
    let tree;
    act(() => {
      tree = renderer.create(
        <HomeHeaderGreen
          navigation={mockNavigation}
          cartCount={3}
        />
      );
    });

    const root = tree.root;
    const searchButton = root.findByProps({ accessibilityRole: 'search' });
    expect(searchButton).toBeDefined();

    const voiceButton = root.findByProps({ accessibilityLabel: 'Voice search' });
    expect(voiceButton).toBeDefined();

    const cartButton = root.findByProps({ accessibilityLabel: 'Shopping cart, 3 items' });
    expect(cartButton).toBeDefined();
  });

  it('displays correct badge count when items exist in cart', () => {
    let tree;
    act(() => {
      tree = renderer.create(
        <HomeHeaderGreen
          navigation={mockNavigation}
          cartCount={5}
        />
      );
    });

    const root = tree.root;
    const badgeText = root.findAllByProps({ children: 5 });
    expect(badgeText.length).toBeGreaterThan(0);
  });

  it('navigates to SearchScreen on search press', () => {
    let tree;
    act(() => {
      tree = renderer.create(
        <HomeHeaderGreen
          navigation={mockNavigation}
          onSearchPress={mockOnSearchPress}
        />
      );
    });

    const searchButton = tree.root.findByProps({ accessibilityRole: 'search' });
    act(() => {
      searchButton.props.onPress();
    });
    expect(mockOnSearchPress).toHaveBeenCalledTimes(1);
  });

  it('navigates to voice search on mic press', () => {
    let tree;
    act(() => {
      tree = renderer.create(
        <HomeHeaderGreen
          navigation={mockNavigation}
          onMicPress={mockOnMicPress}
        />
      );
    });

    const micButton = tree.root.findByProps({ accessibilityLabel: 'Voice search' });
    act(() => {
      micButton.props.onPress();
    });
    expect(mockOnMicPress).toHaveBeenCalledTimes(1);
  });

  it('navigates to CartScreen on cart button press', () => {
    let tree;
    act(() => {
      tree = renderer.create(
        <HomeHeaderGreen
          navigation={mockNavigation}
          onCartPress={mockOnCartPress}
        />
      );
    });

    const cartButton = tree.root.findByProps({ accessibilityRole: 'button', accessibilityLabel: 'Shopping cart' });
    act(() => {
      cartButton.props.onPress();
    });
    expect(mockOnCartPress).toHaveBeenCalledTimes(1);
  });
});
