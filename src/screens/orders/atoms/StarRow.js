import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SPACE, hitSlopTo } from '@/styles/homeTheme';
import AnimatedPressable from '@/components/AnimatedPressable';
import { STAR_TONE } from '../tokens/tracking';

const STARS = [1, 2, 3, 4, 5];

const StarRow = ({ value = 0, size = wp('7.4%'), onRate, style }) => (
  <View style={[styles.row, style]}>
    {STARS.map(star => (
      <AnimatedPressable
        key={star}
        onPress={onRate ? () => onRate(star) : undefined}
        disabled={!onRate}
        hitSlop={hitSlopTo(size)}
        style={styles.slot}
        accessibilityRole="button"
        accessibilityLabel={`Rate ${star} out of 5`}
        accessibilityState={{ selected: star <= value }}
      >
        <Ionicons
          name={star <= value ? 'star' : 'star-outline'}
          size={size}
          color={star <= value ? STAR_TONE.on : STAR_TONE.off}
        />
      </AnimatedPressable>
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slot: {
    paddingHorizontal: SPACE.sm,
  },
});

export default React.memo(StarRow);
