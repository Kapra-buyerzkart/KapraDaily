import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppIcons } from '../../assets/icons';
import { colors } from '../../assets/theme/colours';

interface RatingStarsProps {
  value?: number;
  count?: number;
  size?: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  value = 0,
  count = 5,
  size = 16,
}) => (
  <View style={styles.row}>
    {Array.from({ length: count }).map((_, index) =>
      index < Math.round(value) ? (
        <AppIcons.Star key={index} size={size} color={colors.starYellow} />
      ) : (
        <AppIcons.StarOutline key={index} size={size} color={colors.lightGrey} />
      ),
    )}
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});

export default RatingStars;
