import React, { Suspense, useRef, useState } from 'react';
import TestRenderer, { act } from 'react-test-renderer';

jest.mock('react-native-reanimated', () => {
  const RealReact = require('react');
  return {
    // Shared values keep their identity across renders, as the real ones do.
    useSharedValue: initial => RealReact.useRef({ value: initial }).current,
    // Real animated styles track their shared value; these follow it too, so
    // assertions see what is on screen after the commit, not mid-render.
    useAnimatedStyle: factory => ({
      get opacity() {
        return factory().opacity;
      },
    }),
    withTiming: (toValue, config, callback) => {
      if (callback) callback(true);
      return toValue;
    },
    runOnJS: fn => fn,
  };
});

import useBannerPaint from '../src/screens/home/hooks/useBannerPaint';

const mountPaint = initialUrl => {
  const frames = [];
  let setUrl;

  const Probe = () => {
    const [url, set] = useState(initialUrl);
    setUrl = set;
    frames.push(useBannerPaint(url));
    return null;
  };

  let tree;
  act(() => {
    tree = TestRenderer.create(<Probe />);
  });

  return {
    frames,
    latest: () => frames[frames.length - 1],
    setUrl: next => act(() => setUrl(next)),
    load: () => act(() => frames[frames.length - 1].onLoad()),
    fail: () => act(() => frames[frames.length - 1].onError()),
    unmount: () => act(() => tree.unmount()),
  };
};

// react-freeze, as react-native-screens applies it for freezeOnBlur.
const Suspender = ({ freeze }) => {
  const cache = useRef({});
  if (freeze) {
    if (!cache.current.promise) {
      cache.current.promise = new Promise(resolve => {
        cache.current.resolve = resolve;
      });
    }
    throw cache.current.promise;
  }
  if (cache.current.promise) {
    cache.current.resolve();
    cache.current = {};
  }
  return null;
};

describe('useBannerPaint', () => {
  it('is unpainted and fully transparent until the image reports back', () => {
    const paint = mountPaint('https://cdn/store-a-a1.jpg');

    expect(paint.latest().painted).toBe(false);
    expect(paint.latest().revealStyle).toEqual({ opacity: 0 });
    expect(paint.latest().skeletonStyle).toEqual({ opacity: 1 });
  });

  it('paints once the image loads', () => {
    const paint = mountPaint('https://cdn/store-a-a2.jpg');

    paint.load();

    expect(paint.latest().painted).toBe(true);
    expect(paint.latest().revealStyle).toEqual({ opacity: 1 });
  });

  it('goes back to unpainted the instant the banner url changes', () => {
    const paint = mountPaint('https://cdn/store-a-a3.jpg');
    paint.load();

    paint.setUrl('https://cdn/store-b-a3.jpg');

    expect(paint.latest().painted).toBe(false);
    expect(paint.latest().revealStyle).toEqual({ opacity: 0 });
  });

  it('still covers a banner it has shown before, so a decode never bares the frame', () => {
    const paint = mountPaint('https://cdn/store-a-a4.jpg');
    paint.load();
    paint.setUrl('https://cdn/store-b-a4.jpg');
    paint.load();

    paint.setUrl('https://cdn/store-a-a4.jpg');

    expect(paint.latest().painted).toBe(false);
    expect(paint.latest().skeletonStyle).toEqual({ opacity: 1 });

    paint.load();

    expect(paint.latest().painted).toBe(true);
  });

  it('reveals rather than shimmering forever when the image fails', () => {
    const paint = mountPaint('https://cdn/store-a-a5.jpg');

    paint.fail();

    expect(paint.latest().painted).toBe(true);
    expect(paint.latest().revealStyle).toEqual({ opacity: 1 });
  });

  it('starts cold for a store with no banner at all', () => {
    const paint = mountPaint(undefined);

    expect(paint.latest().painted).toBe(false);
  });

  // freezeOnBlur suspends the home screen instead of unmounting it, so state
  // survives the tab switch but layout effects are torn down and re-run.
  it('keeps a painted banner covered when the frozen screen thaws', async () => {
    const frames = [];
    let setFrozen;

    const Probe = () => {
      frames.push(useBannerPaint('https://cdn/store-a-a8.jpg'));
      return null;
    };

    const Host = () => {
      const [frozen, set] = useState(false);
      setFrozen = set;
      return (
        <Suspense fallback={null}>
          <Suspender freeze={frozen} />
          <Probe />
        </Suspense>
      );
    };

    act(() => {
      TestRenderer.create(<Host />);
    });
    act(() => frames[frames.length - 1].onLoad());
    expect(frames[frames.length - 1].revealStyle).toEqual({ opacity: 1 });

    await act(async () => setFrozen(true));
    await act(async () => setFrozen(false));

    expect(frames[frames.length - 1].painted).toBe(true);
    expect(frames[frames.length - 1].revealStyle).toEqual({ opacity: 1 });
    expect(frames[frames.length - 1].skeletonStyle).toEqual({ opacity: 0 });
  });

  it('switching away and back never reports painted for the incoming url', () => {
    const paint = mountPaint('https://cdn/store-a-a7.jpg');
    paint.load();
    const framesBefore = paint.frames.length;

    paint.setUrl('https://cdn/store-b-a7.jpg');

    const afterSwitch = paint.frames.slice(framesBefore);
    expect(afterSwitch.every(frame => frame.painted === false)).toBe(true);
  });
});
