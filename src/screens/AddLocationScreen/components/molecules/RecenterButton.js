import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { MAP_HEIGHT, SHEET_TOP } from '../../constants';
import { COLORS, GUTTER, RADIUS, SHADOW, SPACING, wp } from '../../theme';

const RecenterButton = ({ onPress }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    accessibilityRole="button"
    accessibilityLabel="Use my current location"
    style={styles.button}
    onPress={onPress}
  >
    <Ionicons name="locate" size={wp('5%')} color={COLORS.textPrimary} />
  </TouchableOpacity>
);

export default React.memo(RecenterButton);

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: MAP_HEIGHT - SHEET_TOP + SPACING.md,
    right: GUTTER,
    width: wp('11%'),
    height: wp('11%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    ...SHADOW.raised,
  },
});
