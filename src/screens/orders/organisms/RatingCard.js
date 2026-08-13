import React from 'react';
import { StyleSheet } from 'react-native';
import OrderText from '../atoms/OrderText';
import Surface from '../atoms/Surface';
import StarRow from '../atoms/StarRow';
import { SPACING, wp } from '../theme';

const RatingCard = ({
  title,
  caption,
  value,
  onRate,
  starSize = wp('7.4%'),
}) => (
  <Surface style={styles.card}>
    <OrderText variant="heading">{title}</OrderText>
    {!!caption && (
      <OrderText
        variant="caption"
        tone="muted"
        numberOfLines={1}
        style={styles.caption}
      >
        {caption}
      </OrderText>
    )}
    <StarRow
      value={value}
      onRate={onRate}
      size={starSize}
      style={styles.stars}
    />
  </Surface>
);

export default React.memo(RatingCard);

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.md,
  },
  caption: {
    marginTop: SPACING.xs,
  },
  stars: {
    marginTop: SPACING.md,
  },
});
