import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { FONTS } from '@/styles/typography';
import { INK, SPACE, TYPE, MAX_FONT_SCALE } from '@/styles/homeTheme';
import SurfaceCard from '../atoms/SurfaceCard';
import StarRow from '../atoms/StarRow';

const RatingCard = ({
  title,
  caption,
  value,
  onRate,
  starSize = wp('7.4%'),
}) => (
  <SurfaceCard style={styles.card}>
    <Text style={styles.title} maxFontSizeMultiplier={MAX_FONT_SCALE}>
      {title}
    </Text>
    {!!caption && (
      <Text
        style={styles.caption}
        numberOfLines={1}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        {caption}
      </Text>
    )}
    <StarRow
      value={value}
      onRate={onRate}
      size={starSize}
      style={styles.stars}
    />
  </SurfaceCard>
);

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingVertical: SPACE.lg,
  },
  title: {
    ...TYPE.heading,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    letterSpacing: -0.3,
  },
  caption: {
    ...TYPE.caption,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.medium,
    color: INK.muted,
    marginTop: SPACE.xs,
  },
  stars: {
    marginTop: SPACE.md,
  },
});

export default React.memo(RatingCard);
