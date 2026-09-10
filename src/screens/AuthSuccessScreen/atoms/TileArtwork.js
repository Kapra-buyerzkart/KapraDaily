import React, { useCallback, useState } from 'react';
import { Image, StyleSheet } from 'react-native';

import TileFallback from './TileFallback';
import TileSkeleton from './TileSkeleton';

const getTrimStyle = trim => {
  if (!trim) return null;

  const { left = 0, top = 0, right = 0, bottom = 0 } = trim;
  const width = 1 - left - right;
  const height = 1 - top - bottom;

  if (width <= 0 || height <= 0) return null;

  return {
    position: 'absolute',
    width: `${(100 / width).toFixed(4)}%`,
    height: `${(100 / height).toFixed(4)}%`,
    left: `${((-left / width) * 100).toFixed(4)}%`,
    top: `${((-top / height) * 100).toFixed(4)}%`,
  };
};

const TileArtwork = ({
  source,
  label,
  caption,
  trim,
  resizeMode = 'cover',
  onNaturalSize,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  const handleLoad = useCallback(
    event => {
      const { width, height } = event?.nativeEvent?.source || {};
      onNaturalSize?.(width, height);
      setIsLoaded(true);
    },
    [onNaturalSize],
  );

  const handleError = useCallback(() => setHasFailed(true), []);

  const trimStyle = getTrimStyle(trim);

  const showArtwork = !!source && !hasFailed;

  return (
    <>
      {showArtwork ? (
        <Image
          source={source}
          style={trimStyle || styles.artwork}
          resizeMode={trimStyle ? 'stretch' : resizeMode}
          fadeDuration={0}
          progressiveRenderingEnabled
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : null}

      {showArtwork ? (
        isLoaded ? null : (
          <TileSkeleton label={label} caption={caption} />
        )
      ) : (
        <TileFallback label={label} caption={caption} />
      )}
    </>
  );
};

export default React.memo(TileArtwork);

const styles = StyleSheet.create({
  artwork: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
});
