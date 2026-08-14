import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ARROW_PILL_HEIGHT } from '../../constants';
import { COLORS } from '../../theme';
import { ArrowButton } from '../atoms';

const ArrowPill = ({ onPrev, onNext }) => (
  <View style={styles.arrowContainer}>
    <View style={styles.arrowPill}>
      <ArrowButton iconName="keyboard-arrow-left" onPress={onPrev} />
      <View style={styles.arrowDivider} />
      <ArrowButton iconName="keyboard-arrow-right" onPress={onNext} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  arrowContainer: {
    alignItems: 'center',
  },
  // Height is pinned rather than derived from the icon glyphs: the vector icon
  // font reports different line heights on iOS and Android, which would make
  // the pill straddle the arc by a different amount on each platform.
  arrowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ARROW_PILL_HEIGHT,
    backgroundColor: COLORS.pill,
    borderRadius: ARROW_PILL_HEIGHT / 2,
    paddingHorizontal: 6,
  },
  arrowDivider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.divider,
  },
});

export default React.memo(ArrowPill);
