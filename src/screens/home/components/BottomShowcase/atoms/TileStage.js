import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CachedImage from '@/components/CachedImage';
import { CART_COLORS } from '@/styles/cartTheme';
import { STAGE_DIRECTION, stageTint } from '../tokens';

const TileStage = ({ source, index = 0, style }) => (
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
    flex: 1,
    backgroundColor: CART_COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  halo: {
    position: 'absolute',
    width: '78%',
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  image: {
    width: '85%',
    height: '85%',
  },
});

export default React.memo(TileStage);
