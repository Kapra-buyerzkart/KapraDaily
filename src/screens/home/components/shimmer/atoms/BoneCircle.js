import React from 'react';
import Bone from './Bone';

const BoneCircle = ({ size, tone, style }) => (
  <Bone
    width={size}
    height={size}
    radius={size / 2}
    tone={tone}
    style={style}
  />
);

export default React.memo(BoneCircle);
