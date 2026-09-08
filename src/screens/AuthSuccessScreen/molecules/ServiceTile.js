import React, { useCallback, useEffect, useState } from 'react';

import { TileArtwork, TileSurface } from '../atoms';
import { TILE_RATIO } from '../theme';

const ServiceTile = ({ span = 'wide', label, caption, source, art, onPress }) => {
  const isSplit = span === 'half';
  const slotRatio = art?.ratio || TILE_RATIO[span] || TILE_RATIO.wide;
  const [ratio, setRatio] = useState(slotRatio);
  const uri = source?.uri;

  useEffect(() => {
    setRatio(slotRatio);
  }, [slotRatio, uri]);

  const handleNaturalSize = useCallback(
    (naturalWidth, naturalHeight) => {
      if (isSplit || art) return;
      if (naturalWidth > 0 && naturalHeight > 0)
        setRatio(naturalWidth / naturalHeight);
    },
    [art, isSplit],
  );

  return (
    <TileSurface
      ratio={ratio}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={caption ? `${label}. ${caption}` : label}
    >
      <TileArtwork
        source={source}
        label={label}
        caption={caption}
        frame={art?.frame}
        onNaturalSize={handleNaturalSize}
      />
    </TileSurface>
  );
};

export default React.memo(ServiceTile);
