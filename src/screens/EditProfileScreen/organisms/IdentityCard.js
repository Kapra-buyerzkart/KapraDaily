import React from 'react';
import Animated from 'react-native-reanimated';
import { Surface } from '../atoms';
import IdentityRow from '../molecules/IdentityRow';

const IdentityCard = ({ name, phone, isPrivileged, onMeasure, entering }) => {
  const handleLayout = React.useCallback(
    event => {
      const { y, height } = event.nativeEvent.layout;
      onMeasure?.(y + height);
    },
    [onMeasure],
  );

  return (
    <Animated.View onLayout={handleLayout} entering={entering}>
      <Surface>
        <IdentityRow name={name} phone={phone} isPrivileged={isPrivileged} />
      </Surface>
    </Animated.View>
  );
};

export default React.memo(IdentityCard);
