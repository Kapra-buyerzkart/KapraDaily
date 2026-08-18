import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { COLORS, HAIRLINE, RADIUS, SHADOW, hitSlopTo, wp } from '../../theme';

const FloatingIconButton = ({ icon, accessibilityLabel, onPress, style }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    hitSlop={hitSlopTo(44)}
    onPress={onPress}
    style={[styles.button, style]}
  >
    <Ionicons name={icon} size={wp('5.2%')} color={COLORS.textPrimary} />
  </TouchableOpacity>
);

export default React.memo(FloatingIconButton);

const styles = StyleSheet.create({
  button: {
    width: wp('11%'),
    height: wp('11%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.button,
    borderWidth: HAIRLINE,
    borderColor: COLORS.line,
    backgroundColor: COLORS.surface,
    ...SHADOW.float,
  },
});
