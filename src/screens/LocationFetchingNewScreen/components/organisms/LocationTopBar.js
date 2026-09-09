import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ICON_BUTTON_SIZE, SEARCH_ICON } from '../../constants';
import {
  COLORS,
  RADIUS,
  SPACING,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from '../../theme';
import { IconButton, LocText } from '../atoms';

const LocationTopBar = ({ onSkip, onSearchPress }) => (
  <View
    style={[
      styles.bar,
      {
        top:
          Platform.OS === 'ios' ? WINDOW_HEIGHT * 0.01 : WINDOW_HEIGHT * 0.03,
      },
    ]}
  >
    <TouchableOpacity
      style={styles.skipButton}
      onPress={onSkip}
      activeOpacity={0.85}
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
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT * 0.07,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: WINDOW_WIDTH * 0.05,
    top: Platform.OS === 'ios' ? WINDOW_HEIGHT * 0.65 : WINDOW_HEIGHT * 0.69,
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
