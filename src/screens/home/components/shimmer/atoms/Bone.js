import React, { useCallback, useState } from 'react';
import ShimmerPlaceholder from '@/components/ShimmerPlaceholder';
import { BONE, BONE_RADIUS, SHIMMER_DURATION, SWEEP } from '../tokens';

const Bone = ({
  width,
  height,
  radius = BONE_RADIUS.bar,
  tone = BONE.base,
  style,
}) => {
  const [sweep, setSweep] = useState(0);

  const handleLayout = useCallback(event => {
    const measured = Math.round(event.nativeEvent.layout.width);
    setSweep(prev => (prev === measured ? prev : measured));
  }, []);

  return (
    <ShimmerPlaceholder
      onLayout={handleLayout}
      width={sweep}
      duration={SHIMMER_DURATION}
      baseColor={tone}
      colors={SWEEP}
      style={[
        width === undefined ? null : { width },
        height === undefined ? null : { height },
        { borderRadius: radius },
        style,
      ]}
    />
  );
};

export default React.memo(Bone);
