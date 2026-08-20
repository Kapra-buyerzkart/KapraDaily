import React from 'react';
import { Image, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { PressableScale } from '../atoms';
import { CART_COLORS, CART_RADIUS } from '@/styles/cartTheme';
import { getImageSource } from '../useKshopeScreen';

interface MediaTileProps {
  source: any;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  resizeMode?: 'cover' | 'contain';
  a11y?: string;
}

const MediaTile: React.FC<MediaTileProps> = ({
  source,
  onPress,
  style,
  resizeMode = 'cover',
  a11y,
}) => (
  <PressableScale
    to={0.98}
    onPress={onPress}
    style={[styles.card, style]}
    contentStyle={styles.content}
    accessibilityRole="imagebutton"
    accessibilityLabel={a11y}
  >
    <Image
      source={getImageSource(source)}
      style={styles.image}
      resizeMode={resizeMode}
    />
  </PressableScale>
);

export default React.memo(MediaTile);

const styles = StyleSheet.create({
  card: {
    borderRadius: CART_RADIUS.card,
    overflow: 'hidden',
    backgroundColor: CART_COLORS.card,
  },
  content: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
