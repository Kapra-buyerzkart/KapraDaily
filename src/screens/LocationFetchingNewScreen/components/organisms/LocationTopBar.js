import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import AuthButton from '@/components/AuthButton';

import { SEARCH_ICON } from '../../constants';
import { COLORS, WINDOW_HEIGHT, WINDOW_WIDTH } from '../../theme';
import { IconButton } from '../atoms';

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
    <AuthButton
      FirstColor={COLORS.danger}
      SecondColor={COLORS.brandSoft}
      OnPress={onSkip}
      FSize={14}
      ButtonText={'Skip'}
      ButtonWidth={20}
      ButtonHeight={3}
    />
    <IconButton source={SEARCH_ICON} onPress={onSearchPress} />
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
});
