import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ICON_BUTTON_SIZE, SEARCH_ICON } from '../../constants';
import {
  COLORS,
  RADIUS,
  SPACING,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  hitSlopTo,
} from '../../theme';
import { IconButton, LocText } from '../atoms';

const LocationTopBar = ({ onSkip, onSearchPress }) => (
  <View style={styles.bar} pointerEvents="box-none">
    <TouchableOpacity
      style={styles.skipButton}
      onPress={onSkip}
      activeOpacity={0.85}
      hitSlop={hitSlopTo(12)}
    >
      <LocText variant="cta" tone="brand">
        Skip
      </LocText>
    </TouchableOpacity>

    <IconButton
      source={SEARCH_ICON}
      onPress={onSearchPress}
      tintColor={COLORS.brand}
      style={styles.searchButton}
    />
  </View>
);

export default React.memo(LocationTopBar);

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: Platform.OS === 'ios' ? WINDOW_HEIGHT * 0.01 : WINDOW_HEIGHT * 0.03,
    height: ICON_BUTTON_SIZE + SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: WINDOW_WIDTH * 0.05,
    zIndex: 100,
    elevation: 10,
  },
  skipButton: {
    height: ICON_BUTTON_SIZE,
    minWidth: WINDOW_WIDTH * 0.22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.brandWash,
  },
  searchButton: {
    marginLeft: SPACING.md,
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.brandWash,
  },
});
