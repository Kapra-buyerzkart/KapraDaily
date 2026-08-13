import React from 'react';
import { View, StyleSheet } from 'react-native';
import CachedImage from '@/components/CachedImage';
import { TILE_STAGE } from '../tokens';

const ProductStage = ({ source, style }) => (
  <View style={[styles.stage, style]}>
    <CachedImage
      source={source}
      style={styles.image}
      resizeMode="contain"
      accessible={false}
    />
  </View>
);

const styles = StyleSheet.create({
  stage: {
    height: TILE_STAGE,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default React.memo(ProductStage);
