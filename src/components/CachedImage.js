import React, { useCallback, useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import {
  FasterImageView,
  prefetch,
  clearCache,
} from '@candlefinance/faster-image';

/**
 * Memory + disk cached image, backed by Nuke (iOS) / Glide (Android).
 *
 * Drop-in for <Image> at remote-URL call sites. Local require()d assets are
 * already bundled, so they fall through to the RN <Image> — the native view
 * only accepts URLs.
 */

const DEFAULT_CACHE_POLICY = 'discWithCacheControl';
// Seconds, not ms — the native layer takes a TimeInterval.
const DEFAULT_TRANSITION = 0.15;

// Only these reach the native view; everything else stays a layout style.
const RESIZE_MODES = new Set(['fill', 'contain', 'cover', 'center']);

const toUrl = source => {
  if (typeof source === 'string') return source;
  const uri = source?.uri;
  if (typeof uri !== 'string' || uri.length === 0) return null;
  return uri.startsWith('http') || uri.startsWith('data:') ? uri : null;
};

const CachedImage = ({
  source,
  style,
  resizeMode,
  cachePolicy = DEFAULT_CACHE_POLICY,
  priority,
  transitionDuration = DEFAULT_TRANSITION,
  headers,
  onLoad,
  onError,
  accessible,
  accessibilityLabel,
  ...rest
}) => {
  const url = toUrl(source);

  const flat = useMemo(() => StyleSheet.flatten(style) || {}, [style]);

  const handleSuccess = useCallback(
    event => {
      if (!onLoad) return;
      const { width, height } = event.nativeEvent;
      onLoad({ nativeEvent: { source: { width, height } } });
    },
    [onLoad],
  );

  const nativeSource = useMemo(() => {
    if (!url) return null;

    // `resizeMode` may arrive as a prop or baked into the stylesheet entry.
    const mode = resizeMode || flat.resizeMode;

    return {
      url,
      cachePolicy,
      transitionDuration,
      resizeMode: RESIZE_MODES.has(mode) ? mode : 'cover',
      borderRadius: flat.borderRadius,
      borderTopLeftRadius: flat.borderTopLeftRadius,
      borderTopRightRadius: flat.borderTopRightRadius,
      borderBottomLeftRadius: flat.borderBottomLeftRadius,
      borderBottomRightRadius: flat.borderBottomRightRadius,
      ...(priority ? { priority } : null),
      ...(headers ? { headers } : null),
      accessible: accessible !== false,
      ...(accessibilityLabel ? { accessibilityLabel } : null),
    };
  }, [
    url,
    resizeMode,
    flat,
    cachePolicy,
    transitionDuration,
    priority,
    headers,
    accessible,
    accessibilityLabel,
  ]);

  if (!nativeSource) {
    return (
      <Image
        source={source}
        style={style}
        resizeMode={resizeMode}
        onLoad={onLoad}
        onError={onError}
        accessible={accessible}
        accessibilityLabel={accessibilityLabel}
        {...rest}
      />
    );
  }

  return (
    <FasterImageView
      source={nativeSource}
      style={style}
      onSuccess={handleSuccess}
      onError={onError}
      {...rest}
    />
  );
};

/**
 * <ImageBackground> equivalent. The native image view cannot host children,
 * so the image is laid out underneath them instead of wrapping them.
 */
export const CachedImageBackground = ({
  source,
  style,
  imageStyle,
  children,
  resizeMode,
  ...rest
}) => (
  <View style={style}>
    <CachedImage
      source={source}
      style={[StyleSheet.absoluteFill, imageStyle]}
      resizeMode={resizeMode}
      {...rest}
    />
    {children}
  </View>
);

export { prefetch, clearCache };

export default React.memo(CachedImage);
