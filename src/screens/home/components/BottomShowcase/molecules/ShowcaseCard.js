import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedPressable from '../../../../../components/AnimatedPressable';
import CachedImage from '../../../../../components/CachedImage';
import { SPACE, HAIRLINE, ELEVATION, categoryTint } from '@/styles/homeTheme';
import AddChip from '../atoms/AddChip';
import TileCaption from '../atoms/TileCaption';
import {
  CARD_RADIUS,
  CARD_WIDTH,
  HALO_SIZE,
  STAGE_HEIGHT,
  STAGE_TINT,
} from '../tokens';

const ShowcaseCard = ({ item, index, onPress }) => {
  const caption = item?.title || item?.Title;

  return (
    <AnimatedPressable
      onPress={onPress}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={caption || 'Featured product'}
    >
      <View style={styles.stage}>
        <LinearGradient
          colors={[categoryTint(index), '#FFFFFF']}
          start={STAGE_TINT.start}
          end={STAGE_TINT.end}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.halo} pointerEvents="none" />
        <CachedImage
          source={item?.uri}
          style={styles.image}
          resizeMode="contain"
          accessible={false}
        />
      </View>

      <View style={styles.body}>
        {!!caption && <TileCaption label={caption} style={styles.caption} />}
        <AddChip />
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: CARD_RADIUS,
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIRLINE,
    overflow: 'hidden',
    ...ELEVATION.md,
  },
  stage: {
    height: STAGE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  halo: {
    position: 'absolute',
    width: HALO_SIZE,
    height: HALO_SIZE,
    borderRadius: HALO_SIZE / 2,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  image: {
    width: '78%',
    height: '78%',
  },
  body: {
    paddingHorizontal: SPACE.md,
    paddingTop: SPACE.sm,
    paddingBottom: SPACE.md,
  },
  caption: {
    minHeight: 36,
    marginBottom: SPACE.sm,
  },
});

export default React.memo(ShowcaseCard);
