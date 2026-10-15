import React from 'react';
import renderer, { act } from 'react-test-renderer';

jest.mock('react-native-reanimated', () => {
  const React2 = require('react');
  const { View } = require('react-native');
  const passthrough = Component =>
    React2.forwardRef((props, ref) =>
      React2.createElement(Component, { ...props, ref }, props.children),
    );
  return {
    __esModule: true,
    default: {
      View: passthrough(View),
      createAnimatedComponent: Component => passthrough(Component),
    },
    useSharedValue: value => ({ value }),
    useAnimatedStyle: fn => fn(),
    withRepeat: v => v,
    withSequence: (...v) => v[0],
    withTiming: v => v,
    withSpring: v => v,
    Easing: {
      linear: () => {},
      ease: () => {},
      bezier: () => {},
      inOut: () => {},
    },
  };
});

jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-svg', () => {
  const React2 = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ children, ...props }) => React2.createElement(View, props, children),
    Svg: ({ children, ...props }) => React2.createElement(View, props, children),
    Circle: props => React2.createElement(View, props),
    Path: props => React2.createElement(View, props),
    Polygon: props => React2.createElement(View, props),
    G: ({ children, ...props }) => React2.createElement(View, props, children),
    Defs: ({ children }) => React2.createElement(View, null, children),
    LinearGradient: ({ children }) => React2.createElement(View, null, children),
    Stop: props => React2.createElement(View, props),
  };
});
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'MaterialCommunityIcons');
jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');
jest.mock('@/utils/haptics', () => ({
  impactTick: jest.fn(),
  successTick: jest.fn(),
}));

import SpinWheelBanner from '../src/kshope/screens/Profile/redesign/sections/SpinWheelBanner';
import { impactTick } from '@/utils/haptics';

describe('48hr Deals Profile SpinWheelBanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders 48hr deals banner title, exclusive badge and spin count', () => {
    const onPressMock = jest.fn();
    let tree;
    act(() => {
      tree = renderer.create(
        <SpinWheelBanner onPress={onPressMock} spinsCount={3} />
      );
    });

    const str = JSON.stringify(tree.toJSON());
    expect(str).toContain('Lucky Deal Spin & Win');
    expect(str).toContain('48HR DEAL GIFT');
    expect(str).toContain('3 SPINS LEFT');
    expect(str).toContain('Win Extra Discounts, UD Coins & Free Delivery');
    expect(str).toContain('SPIN');
  });

  it('triggers haptic feedback and onPress handler when pressed', () => {
    const onPressMock = jest.fn();
    let tree;
    act(() => {
      tree = renderer.create(
        <SpinWheelBanner onPress={onPressMock} spinsCount={2} />
      );
    });

    const root = tree.root;
    // Find Pressable component by accessibilityRole="button"
    const pressable = root.findByProps({ accessibilityRole: 'button' });
    expect(pressable).toBeTruthy();

    act(() => {
      pressable.props.onPress();
    });

    expect(impactTick).toHaveBeenCalledTimes(1);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
