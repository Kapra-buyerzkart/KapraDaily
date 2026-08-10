import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import ImageColors from 'react-native-image-colors';
import { hasOpaqueBackground } from '@/utils/imageUrl';

const SAMPLE_CONFIG = {
  fallback: '#000000',
  cache: true,
  quality: 'lowest',
  pixelSpacing: 8,
};

const IOS_MIN_CHANNEL = 232;
const IOS_MAX_CHROMA = 12;
const ANDROID_MIN_LUMINANCE = 0.72;

const backgroundOf = result => {
  if (!result) return null;
  if (result.platform === 'ios') return result.background;
  return result.average || null;
};

const toRgb = hex => {
  const match = /^#?([a-f\d]{6})$/i.exec(String(hex ?? ''));
  if (!match) return null;
  const digits = match[1];
  return [0, 2, 4].map(at => parseInt(digits.slice(at, at + 2), 16));
};

const readsAsWhite = hex => {
  const rgb = toRgb(hex);
  if (!rgb) return false;

  const [r, g, b] = rgb;
  if (Platform.OS === 'ios') {
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    return Math.min(r, g, b) >= IOS_MIN_CHANNEL && chroma <= IOS_MAX_CHROMA;
  }
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 >= ANDROID_MIN_LUMINANCE;
};

const cachedVerdict = uri => {
  if (!uri) return false;
  return readsAsWhite(backgroundOf(ImageColors.cache.getItem(uri)));
};

const useOpaqueImageWell = uri => {
  const isKnownOpaque = hasOpaqueBackground(uri);

  const [isOpaque, setIsOpaque] = useState(
    () => isKnownOpaque || cachedVerdict(uri),
  );

  useEffect(() => {
    if (isKnownOpaque || !uri) {
      setIsOpaque(isKnownOpaque);
      return undefined;
    }

    const cached = ImageColors.cache.getItem(uri);
    if (cached) {
      setIsOpaque(readsAsWhite(backgroundOf(cached)));
      return undefined;
    }

    let active = true;
    setIsOpaque(false);
    ImageColors.getColors(uri, { ...SAMPLE_CONFIG, key: uri })
      .then(result => {
        if (active) setIsOpaque(readsAsWhite(backgroundOf(result)));
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [uri, isKnownOpaque]);

  return isOpaque;
};

export default useOpaqueImageWell;
