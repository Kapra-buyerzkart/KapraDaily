import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import SplashScreen from '../src/screens/SplashScreen';
import AppLoader from '../src/components/AppLoader';

describe('SplashScreen & AppLoader', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders SplashScreen with brand elements', () => {
    let tree: ReactTestRenderer.ReactTestRenderer | undefined;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<SplashScreen isReady={false} />);
    });
    const root = tree!.root;
    expect(root).toBeDefined();

    // Check presence of hallmark / tagline text
    const textNodes = root.findAllByType(Text);
    const texts = textNodes.map((node: any) => node.props.children);
    expect(texts).toContain('PURVEYORS OF FINE JEWELLERY');
    expect(texts).toContain('CERTIFIED GOLD & DIAMONDS');
  });

  it('triggers onFinish after minDuration when isReady is true', () => {
    const onFinish = jest.fn();
    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <SplashScreen isReady={true} minDuration={1000} onFinish={onFinish} />,
      );
    });

    expect(onFinish).not.toHaveBeenCalled();

    // Fast-forward timers for minDuration + exit fade
    ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(1000);
      jest.advanceTimersByTime(500);
    });

    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('does not trigger onFinish before isReady becomes true', () => {
    const onFinish = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <SplashScreen isReady={false} minDuration={1000} onFinish={onFinish} />,
      );
    });

    ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(1500);
    });
    expect(onFinish).not.toHaveBeenCalled();

    // Now update isReady to true
    ReactTestRenderer.act(() => {
      renderer!.update(
        <SplashScreen isReady={true} minDuration={1000} onFinish={onFinish} />,
      );
    });

    ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('renders AppLoader without crashing with new logo', () => {
    let tree;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<AppLoader />);
    });
    expect(tree).toBeDefined();
  });
});
