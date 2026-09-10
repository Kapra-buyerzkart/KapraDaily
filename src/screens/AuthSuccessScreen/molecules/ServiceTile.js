import React, { useCallback, useEffect, useState } from 'react';

import { TileArtwork, TileSurface } from '../atoms';
import { TILE_RATIO } from '../theme';

const ServiceTile = ({
  id,
  span,
  label,
  caption,
  source,
  trim,
  onSelect,
  style,
}) => {
  const slotRatio = TILE_RATIO[span] || TILE_RATIO.wide;
  const isFixedRatio = span === 'half';
  const [ratio, setRatio] = useState(slotRatio);
  const uri = source?.uri;

  useEffect(() => {
    setRatio(slotRatio);
  }, [slotRatio, uri]);

  const handlePress = useCallback(() => onSelect?.(id), [id, onSelect]);

  const handleNaturalSize = useCallback(
    (width, height) => {
      if (isFixedRatio) return;
      if (width > 0 && height > 0) setRatio(width / height);
    },
    [isFixedRatio],
  );

  return (
    <TileSurface
      ratio={ratio}
      style={style}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={caption ? `${label}. ${caption}` : label}
    >
      <TileArtwork
        source={source}
        label={label}
        caption={caption}
        trim={trim}
        onNaturalSize={handleNaturalSize}
      />
    </TileSurface>
  );
};

export default React.memo(ServiceTile);
