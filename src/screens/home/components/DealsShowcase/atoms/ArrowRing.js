import React from 'react';
import { View, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { PEACH, RING_SIZE } from '../tokens';

const ArrowRing = ({ size = RING_SIZE, color = PEACH.ink, style }) => (
  <View
    style={[
      styles.ring,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        borderColor: color,
      },
      style,
    ]}
  >
    <Feather name="arrow-right" size={size * 0.52} color={color} />
  </View>
);

const styles = StyleSheet.create({
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
});

export default React.memo(ArrowRing);
