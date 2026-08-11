import { useCallback, useLayoutEffect, useState } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const REVEAL_MS = 220;

const seenBanners = new Set();

const useBannerPaint = bannerUrl => {
  const reveal = useSharedValue(0);
  const [paintedUrl, setPaintedUrl] = useState(null);

  const painted = !!bannerUrl && paintedUrl === bannerUrl;

  useLayoutEffect(() => {
    reveal.value = painted ? 1 : 0;
  }, [bannerUrl, painted, reveal]);

  const onLoad = useCallback(() => {
    if (!bannerUrl) return;
    const seenBefore = seenBanners.has(bannerUrl);
    seenBanners.add(bannerUrl);

    if (seenBefore) {
      reveal.value = 1;
      setPaintedUrl(bannerUrl);
      return;
    }
    reveal.value = withTiming(1, { duration: REVEAL_MS }, finished => {
      if (finished) runOnJS(setPaintedUrl)(bannerUrl);
    });
  }, [bannerUrl, reveal]);

  const onError = useCallback(() => {
    if (!bannerUrl) return;
    reveal.value = 1;
    setPaintedUrl(bannerUrl);
  }, [bannerUrl, reveal]);

  const revealStyle = useAnimatedStyle(() => ({ opacity: reveal.value }));
  const skeletonStyle = useAnimatedStyle(() => ({ opacity: 1 - reveal.value }));

  return { painted, revealStyle, skeletonStyle, onLoad, onError };
};

export default useBannerPaint;
