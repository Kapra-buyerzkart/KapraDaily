import React from 'react';
import Surface from './atoms/Surface';

const DeliveryGroupCard = ({ position = 'single', children }) => (
  <Surface position={position} elevated={false}>
    {children}
  </Surface>
);

export default React.memo(DeliveryGroupCard);
