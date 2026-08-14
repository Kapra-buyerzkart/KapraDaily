import { StyleSheet } from 'react-native';

import { COLORS, WINDOW_HEIGHT, WINDOW_WIDTH } from './theme';

export const sheetStyles = StyleSheet.create({
  blur: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: null,
    overflow: 'hidden',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
