import React, { useCallback, useState } from 'react';
import { Image, StyleSheet } from 'react-native';

import TileFallback from './TileFallback';
import TileSkeleton from './TileSkeleton';

const TileArtwork = ({ source, label, caption, frame, onNaturalSize }) => {
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

  const showArtwork = !!source && !hasFailed;

  return (
    <>
      {showArtwork ? (
        <Image
          source={source}
          style={frame ? [styles.framed, frame] : styles.artwork}
          resizeMode="contain"
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
  framed: {
    position: 'absolute',
  },
});
