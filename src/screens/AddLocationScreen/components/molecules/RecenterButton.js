import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { AddrText } from '../atoms';
import { MAP_HEIGHT, SHEET_TOP } from '../../constants';
import {
  COLORS,
  GUTTER,
  HAIRLINE,
  RADIUS,
  SHADOW,
  SPACING,
  hitSlopTo,
  wp,
} from '../../theme';

const RecenterButton = ({ onPress, isHidden }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    accessibilityRole="button"
    accessibilityLabel="Use my current location"
    hitSlop={hitSlopTo(44)}
    style={[styles.button, isHidden && styles.hidden]}
    onPress={onPress}
  >
    <Ionicons name="locate" size={wp('4.2%')} color={COLORS.textPrimary} />
    <AddrText variant="captionStrong" style={styles.label}>
      Use current location
    </AddrText>
  </TouchableOpacity>
);

export default React.memo(RecenterButton);

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: MAP_HEIGHT - SHEET_TOP + SPACING.lg,
    right: GUTTER,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.button,
    borderWidth: HAIRLINE,
    borderColor: COLORS.line,
    backgroundColor: COLORS.surface,
    ...SHADOW.float,
  },
  label: {
    marginLeft: SPACING.xs,
  },
  hidden: {
    display: 'none',
  },
});
